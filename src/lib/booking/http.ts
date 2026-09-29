import 'server-only';
import { BookingError } from './provider';
import type { BookingErrorBody, BookingErrorCode } from './types';
import type { FieldErrors } from './validation';

export function errorResponse(code: BookingErrorCode, message: string, status: number, fields?: FieldErrors) {
  const body: BookingErrorBody = { error: { code, message, ...(fields ? { fields } : {}) } };
  return Response.json(body, { status, headers: { 'cache-control': 'no-store' } });
}

/** Maps anything a provider throws to a JSON error. Unknown errors are logged server-side, never echoed. */
export function handleProviderError(err: unknown) {
  if (err instanceof BookingError) return errorResponse(err.code, err.message, err.status);
  console.error('[booking] provider failure', err);
  return errorResponse('provider_error', 'Booking is having a moment. Try again, or reserve by phone.', 502);
}
