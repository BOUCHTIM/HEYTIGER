/* Validation shared by the form (instant feedback) and the route handlers (the authority). */
import type { ReservationRequest } from './types';

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export const isValidEmail = (v: string) => {
  const e = v.trim();
  return EMAIL_RE.test(e) && !e.includes('..') && !/^\.|\.$/.test(e.split('@')[0]);
};

// Optional + then 7–15 digits once spaces, dashes, dots and parens are stripped.
export const isValidPhone = (v: string) => /^\+?\d{7,15}$/.test(v.replace(/[\s\-().]/g, ''));

export const isValidDate = (v: string) => DATE_RE.test(v) && !Number.isNaN(Date.parse(`${v}T00:00:00Z`));
export const isValidTime = (v: string) => TIME_RE.test(v);

export type FieldErrors = Partial<Record<keyof ReservationRequest, string>>;

export function validateGuest(r: Pick<ReservationRequest, 'firstName' | 'lastName' | 'email' | 'phone' | 'agreedToPolicy'>): FieldErrors {
  const errs: FieldErrors = {};
  if (!r.firstName.trim()) errs.firstName = 'First name, please.';
  if (!r.lastName.trim()) errs.lastName = 'Last name, please.';
  if (!isValidEmail(r.email)) errs.email = 'That email doesn’t look right.';
  if (!isValidPhone(r.phone)) errs.phone = 'Try the format +971 50 000 0000.';
  if (!r.agreedToPolicy) errs.agreedToPolicy = 'Accept the table policy to hold your seat.';
  return errs;
}

const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/** Coerces an untrusted JSON body into a ReservationRequest and validates it. */
export function parseReservationRequest(body: unknown, limits: { min: number; max: number }):
  { ok: true; value: ReservationRequest } | { ok: false; fields: FieldErrors } {
  const b = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  const value: ReservationRequest = {
    date: str(b.date, 10),
    time: str(b.time, 5),
    slotId: str(b.slotId, 500),
    partySize: Number(b.partySize),
    firstName: str(b.firstName, 80),
    lastName: str(b.lastName, 80),
    email: str(b.email, 254),
    phone: str(b.phone, 32),
    dietary: Array.isArray(b.dietary) ? b.dietary.map(d => str(d, 40)).filter(Boolean).slice(0, 10) : [],
    occasion: str(b.occasion, 60),
    notes: str(b.notes, 500),
    marketingOptIn: b.marketingOptIn === true,
    agreedToPolicy: b.agreedToPolicy === true,
  };
  const fields = validateGuest(value);
  if (!isValidDate(value.date)) fields.date = 'Pick a date.';
  if (!isValidTime(value.time) || !value.slotId) fields.time = 'Pick a time.';
  if (!Number.isInteger(value.partySize) || value.partySize < limits.min || value.partySize > limits.max) {
    fields.partySize = `Online bookings are for ${limits.min}–${limits.max} guests.`;
  }
  return Object.keys(fields).length ? { ok: false, fields } : { ok: true, value };
}
