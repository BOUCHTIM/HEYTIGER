import 'server-only';
import type { AvailabilityQuery, AvailabilityResult, BookingErrorCode, ReservationRequest, ReservationResult } from './types';

export interface BookingProvider {
  availability(q: AvailabilityQuery): Promise<AvailabilityResult>;
  reserve(r: ReservationRequest): Promise<ReservationResult>;
}

/** Thrown by providers; the route handlers turn it into a typed JSON error with the matching HTTP status. */
export class BookingError extends Error {
  constructor(public code: BookingErrorCode, message: string, public status = 400) {
    super(message);
    this.name = 'BookingError';
  }
}
