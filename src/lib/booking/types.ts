/* Booking contract shared by the reservation form (client) and the /api/booking route handlers (server).
   Provider-neutral: the SevenRooms provider maps its own payloads onto these shapes, so the form never
   changes when the backend does. Safe to import from client components — no secrets live here. */

/** sevenrooms = live · mock = local test double · offline = production without credentials (form shows contact options). */
export type BookingMode = 'sevenrooms' | 'mock' | 'offline';

/** What the form needs to know before it renders. Never carries credentials. */
export interface BookingConfig {
  mode: BookingMode;
  /** Hosted SevenRooms reservation page, used as the escape hatch if the API is down. */
  fallbackUrl: string | null;
  minPartySize: number;
  maxPartySize: number;
  /** Parties above this size are asked to contact the venue instead of booking online. */
  largePartyThreshold: number;
  /** How many days ahead guests can book. */
  bookingWindowDays: number;
}

export interface AvailabilityQuery {
  date: string;       // YYYY-MM-DD, venue local date
  partySize: number;
}

export interface Slot {
  time: string;       // HH:MM (24h), venue local time
  /** Opaque token the provider needs to book this exact slot (SevenRooms access / shift ids). */
  slotId: string;
  /** Optional seating area / experience name, e.g. "Rooftop". */
  area?: string;
}

export interface AvailabilityResult {
  date: string;
  partySize: number;
  slots: Slot[];
}

export interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dietary: string[];
  occasion: string;
  notes: string;
  marketingOptIn: boolean;
}

export interface ReservationRequest extends GuestDetails {
  date: string;
  time: string;
  slotId: string;
  partySize: number;
  agreedToPolicy: boolean;
}

export interface ReservationResult {
  reference: string;
  status: 'confirmed' | 'pending';
  date: string;
  time: string;
  partySize: number;
}

export type BookingErrorCode =
  | 'invalid_request'
  | 'slot_unavailable'
  | 'duplicate'
  | 'not_configured'
  | 'provider_error';

export interface BookingErrorBody {
  error: { code: BookingErrorCode; message: string; fields?: Partial<Record<keyof ReservationRequest, string>> };
}
