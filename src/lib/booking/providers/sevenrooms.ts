import 'server-only';
import type { SevenRoomsCredentials } from '../config';
import { BookingError, type BookingProvider } from '../provider';
import type { ReservationRequest, Slot } from '../types';

/* SevenRooms Reservation API (partner API; credentials are issued per venue group by SevenRooms).
   The official reference (api-docs.sevenrooms.com) is gated, so the shapes below come from the live endpoints'
   behaviour and open-source clients, not the docs. Everything marked VERIFY must be checked against the gated
   reference once credentials arrive — the parsing is deliberately tolerant so a field rename degrades to
   "no times" rather than a crash.

     POST {base}/auth                         form: client_id, client_secret  → data.token
     GET  {base}/venues/{venue}/availability  ?date&party_size&start_time&end_time → data.availability[].times[]
     PUT  {base}/venues/{venue}/book          form: date, time, party_size, first_name, last_name, email, phone
                                                                              → data.reservation_reference_code
   Auth header is the bare token (no "Bearer"). */

const TIMEOUT_MS = 10_000;
const TOKEN_TTL_MS = 50 * 60_000;   // VERIFY: token lifetime is undocumented publicly; we also re-auth on any 401

let cached: { key: string; token: string; expires: number } | null = null;

type Json = Record<string, unknown>;
const obj = (v: unknown): Json => (v && typeof v === 'object' ? (v as Json) : {});
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const s = (v: unknown) => (typeof v === 'string' ? v : typeof v === 'number' ? String(v) : '');

/** Accepts "19:00", "19:00:00" or "7:00 PM" → "19:00". */
function normaliseTime(raw: string): string | null {
  const m = raw.trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*([AaPp][Mm])?$/);
  if (!m) return null;
  let h = Number(m[1]);
  const ampm = m[3]?.toLowerCase();
  if (ampm === 'pm' && h < 12) h += 12;
  if (ampm === 'am' && h === 12) h = 0;
  return h < 24 ? `${String(h).padStart(2, '0')}:${m[2]}` : null;
}

// slotId carries whatever SevenRooms needs to book that exact slot, opaque to the browser.
interface SlotToken { t: string; shift?: string; access?: string }
const encodeSlot = (t: SlotToken) => `sr:${Buffer.from(JSON.stringify(t)).toString('base64url')}`;
function decodeSlot(id: string): SlotToken | null {
  if (!id.startsWith('sr:')) return null;
  try { return JSON.parse(Buffer.from(id.slice(3), 'base64url').toString()) as SlotToken; } catch { return null; }
}

export function createSevenRoomsProvider(creds: SevenRoomsCredentials): BookingProvider {
  const cacheKey = `${creds.apiBase}|${creds.clientId}`;

  async function authenticate(): Promise<string> {
    if (cached && cached.key === cacheKey && cached.expires > Date.now()) return cached.token;
    const res = await fetch(`${creds.apiBase}/auth`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: creds.clientId, client_secret: creds.clientSecret }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    });
    const body = obj(await res.json().catch(() => null));
    const token = s(obj(body.data).token);
    if (!res.ok || !token) {
      console.error('[booking:sevenrooms] auth failed', res.status, s(body.msg));
      throw new BookingError('provider_error', 'Booking is unavailable right now.', 502);
    }
    cached = { key: cacheKey, token, expires: Date.now() + TOKEN_TTL_MS };
    return token;
  }

  async function call(path: string, init: RequestInit = {}, retried = false): Promise<Json> {
    const token = await authenticate();
    const res = await fetch(`${creds.apiBase}${path}`, {
      ...init,
      headers: { ...init.headers, authorization: token },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    });
    if (res.status === 401 && !retried) {
      cached = null;
      return call(path, init, true);
    }
    const body = obj(await res.json().catch(() => null));
    if (res.ok) return obj(body.data);

    const msg = s(body.msg) || s(body.message);
    console.error('[booking:sevenrooms]', init.method ?? 'GET', path.split('?')[0], res.status, msg);
    if (res.status === 409) throw new BookingError('slot_unavailable', 'That time just went. Pick another slot.', 409);
    if (res.status === 400) throw new BookingError('invalid_request', msg || 'SevenRooms rejected the booking details.', 400);
    throw new BookingError('provider_error', 'Booking is having a moment. Try again shortly.', 502);
  }

  const venue = encodeURIComponent(creds.venueId);

  return {
    async availability({ date, partySize }) {
      // VERIFY: whether start/end are required, and how post-midnight seatings are attributed to a date.
      const q = new URLSearchParams({ date, party_size: String(partySize), start_time: '00:00', end_time: '23:59' });
      const data = await call(`/venues/${venue}/availability?${q}`);

      const slots: Slot[] = [];
      const seen = new Set<string>();
      for (const shiftRaw of arr(data.availability)) {
        const shift = obj(shiftRaw);
        for (const tRaw of arr(shift.times)) {
          const t = obj(tRaw);
          // 'book' = instantly bookable; 'request' slots need venue approval and aren't offered online here.
          if (s(t.type) && s(t.type) !== 'book') continue;
          const time = normaliseTime(s(t.time));
          if (!time || seen.has(time)) continue;
          seen.add(time);
          slots.push({
            time,
            slotId: encodeSlot({
              t: s(t.time),
              shift: s(t.shift_persistent_id) || s(shift.shift_persistent_id) || undefined,   // VERIFY field names
              access: s(t.access_persistent_id) || undefined,
            }),
            area: s(shift.name) || undefined,   // VERIFY: shift display name
          });
        }
      }
      return { date, partySize, slots };
    },

    async reserve(r: ReservationRequest) {
      const slot = decodeSlot(r.slotId);
      if (!slot) throw new BookingError('slot_unavailable', 'Pick your time again.', 409);

      const notes = [
        r.dietary.length ? `Dietary: ${r.dietary.join(', ')}` : '',
        r.occasion ? `Occasion: ${r.occasion}` : '',
        r.notes,
      ].filter(Boolean).join(' · ');

      const form = new URLSearchParams({
        date: r.date,
        time: slot.t,
        party_size: String(r.partySize),
        first_name: r.firstName,
        last_name: r.lastName,
        email: r.email,
        phone: r.phone,
      });
      // VERIFY against the gated reference before go-live: parameter names for these three are not confirmed.
      if (slot.shift) form.set('shift_persistent_id', slot.shift);
      if (slot.access) form.set('access_persistent_id', slot.access);
      if (notes) form.set('notes', notes);
      // TODO(sevenrooms): marketing opt-in (r.marketingOptIn) — send once the field name is confirmed.

      const data = await call(`/venues/${venue}/book`, {
        method: 'PUT',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: form,
      });
      const reference = s(data.reservation_reference_code) || s(data.reference_code) || s(data.reservation_id) || s(data.id);
      if (!reference) {
        console.error('[booking:sevenrooms] book succeeded without a reference', Object.keys(data));
      }
      return {
        reference: reference || 'CONFIRMED',
        status: 'confirmed',
        date: r.date,
        time: normaliseTime(slot.t) ?? r.time,
        partySize: r.partySize,
      };
    },
  };
}
