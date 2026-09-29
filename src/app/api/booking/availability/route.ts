import type { NextRequest } from 'next/server';
import { publicBookingConfig } from '@/lib/booking/config';
import { errorResponse, handleProviderError } from '@/lib/booking/http';
import { getBookingProvider } from '@/lib/booking';
import { isValidDate } from '@/lib/booking/validation';

export const dynamic = 'force-dynamic';

// GET /api/booking/availability?date=YYYY-MM-DD&party=2
export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date') ?? '';
  const partySize = Number(request.nextUrl.searchParams.get('party'));
  const { minPartySize, maxPartySize } = publicBookingConfig();

  if (!isValidDate(date)) return errorResponse('invalid_request', 'Pick a date.', 400);
  if (!Number.isInteger(partySize) || partySize < minPartySize || partySize > maxPartySize) {
    return errorResponse('invalid_request', `Online bookings are for ${minPartySize}–${maxPartySize} guests.`, 400);
  }

  try {
    const result = await getBookingProvider().availability({ date, partySize });
    return Response.json(result, { headers: { 'cache-control': 'no-store' } });
  } catch (err) {
    return handleProviderError(err);
  }
}
