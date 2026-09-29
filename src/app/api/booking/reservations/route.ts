import { publicBookingConfig } from '@/lib/booking/config';
import { errorResponse, handleProviderError } from '@/lib/booking/http';
import { getBookingProvider } from '@/lib/booking';
import { parseReservationRequest } from '@/lib/booking/validation';

// POST /api/booking/reservations — body: ReservationRequest (src/lib/booking/types.ts)
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse('invalid_request', 'Malformed request.', 400);
  }

  const { minPartySize, maxPartySize } = publicBookingConfig();
  const parsed = parseReservationRequest(body, { min: minPartySize, max: maxPartySize });
  if (!parsed.ok) return errorResponse('invalid_request', 'Check the highlighted fields.', 422, parsed.fields);

  try {
    const result = await getBookingProvider().reserve(parsed.value);
    return Response.json(result, { status: 201, headers: { 'cache-control': 'no-store' } });
  } catch (err) {
    return handleProviderError(err);
  }
}
