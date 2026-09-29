import 'server-only';
import { bookingMode, sevenRoomsCredentials } from './config';
import { BookingError, type BookingProvider } from './provider';
import { mockProvider } from './providers/mock';
import { createSevenRoomsProvider } from './providers/sevenrooms';

const offlineProvider: BookingProvider = {
  async availability() { throw new BookingError('not_configured', 'Online booking is not live yet.', 503); },
  async reserve() { throw new BookingError('not_configured', 'Online booking is not live yet.', 503); },
};

/** Picks the provider per request, so adding the SevenRooms env vars switches the site over without a code change. */
export function getBookingProvider(): BookingProvider {
  switch (bookingMode()) {
    case 'sevenrooms': return createSevenRoomsProvider(sevenRoomsCredentials()!);
    case 'mock': return mockProvider;
    default: return offlineProvider;
  }
}
