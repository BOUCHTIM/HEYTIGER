import 'server-only';
import { BookingError, type BookingProvider } from '../provider';
import type { Slot } from '../types';

/* Stand-in until SevenRooms credentials are set. Mirrors the venue hours from /availability
   (Mon closed · Tue–Fri 18:00–02:00 · Sat 11:00–02:00 · Sun 11:00–00:00), 15-minute slots,
   last seating an hour before close. Nothing is sent anywhere; references are prefixed MOCK-. */

// [open, close] in hours from midnight of the booked day, indexed by getUTCDay() (0 = Sunday).
const HOURS: Array<[number, number] | null> = [[11, 24], null, [18, 26], [18, 26], [18, 26], [18, 26], [11, 26]];

// Per-process memory so the same guest can't grab the same slot twice while testing.
const booked = new Set<string>();

const pad = (n: number) => String(n).padStart(2, '0');

function slotsFor(date: string, partySize: number): Slot[] {
  const hours = HOURS[new Date(`${date}T00:00:00Z`).getUTCDay()];
  if (!hours) return [];
  const [open, close] = hours;
  const slots: Slot[] = [];
  for (let m = open * 60; m <= (close - 1) * 60; m += 15) {
    // Thin out the grid a little so the "unavailable" state gets exercised.
    if (partySize >= 6 && m % 30 !== 0) continue;
    const time = `${pad(Math.floor(m / 60) % 24)}:${pad(m % 60)}`;
    slots.push({ time, slotId: `mock:${date}:${time}`, area: m >= 21 * 60 ? 'Rooftop' : undefined });
  }
  return slots;
}

export const mockProvider: BookingProvider = {
  async availability({ date, partySize }) {
    return { date, partySize, slots: slotsFor(date, partySize) };
  },

  async reserve(r) {
    if (!slotsFor(r.date, r.partySize).some(s => s.slotId === r.slotId)) {
      throw new BookingError('slot_unavailable', 'That time just went. Pick another slot.', 409);
    }
    const key = `${r.email.toLowerCase()}|${r.date}|${r.time}`;
    if (booked.has(key)) {
      throw new BookingError('duplicate', 'You already hold a table at this time.', 409);
    }
    booked.add(key);
    return {
      reference: `MOCK-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      status: 'confirmed',
      date: r.date,
      time: r.time,
      partySize: r.partySize,
    };
  },
};
