import 'server-only';
import type { BookingConfig, BookingMode } from './types';

/* All booking env vars are read here and nowhere else. None are NEXT_PUBLIC_: credentials stay on the server
   and the form learns only what /api/booking/config returns. See .env.example for the full list. */

const env = (k: string) => process.env[k]?.trim() || undefined;
const int = (k: string, fallback: number) => {
  const n = Number(env(k));
  return Number.isInteger(n) && n > 0 ? n : fallback;
};

export interface SevenRoomsCredentials {
  apiBase: string;
  clientId: string;
  clientSecret: string;
  venueId: string;
}

export function sevenRoomsCredentials(): SevenRoomsCredentials | null {
  const clientId = env('SEVENROOMS_CLIENT_ID');
  const clientSecret = env('SEVENROOMS_CLIENT_SECRET');
  const venueId = env('SEVENROOMS_VENUE_ID');
  if (!clientId || !clientSecret || !venueId) return null;
  return {
    apiBase: (env('SEVENROOMS_API_BASE') ?? 'https://api.sevenrooms.com/2_4').replace(/\/+$/, ''),
    clientId,
    clientSecret,
    venueId,
  };
}

/** 'sevenrooms' only when every credential is present. Without credentials the mock runs in development, or
    anywhere BOOKING_PROVIDER=mock is set explicitly (e.g. Vercel previews). A production build without credentials
    is 'offline' — it must never tell a real guest they hold a table the venue has not seen. */
export function bookingMode(): BookingMode {
  if (env('BOOKING_PROVIDER') === 'mock') return 'mock';
  if (sevenRoomsCredentials()) return 'sevenrooms';
  return process.env.NODE_ENV === 'production' ? 'offline' : 'mock';
}

export function venueTimeZone() {
  return env('BOOKING_TIMEZONE') ?? 'Asia/Dubai';
}

export function publicBookingConfig(): BookingConfig {
  const slug = env('SEVENROOMS_VENUE_SLUG');
  return {
    mode: bookingMode(),
    fallbackUrl: slug ? `https://www.sevenrooms.com/reservations/${encodeURIComponent(slug)}` : null,
    minPartySize: 1,
    maxPartySize: int('BOOKING_MAX_PARTY_SIZE', 12),
    largePartyThreshold: int('BOOKING_LARGE_PARTY_THRESHOLD', 8),
    bookingWindowDays: int('BOOKING_WINDOW_DAYS', 60),
  };
}
