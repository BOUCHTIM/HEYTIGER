import { publicBookingConfig } from '@/lib/booking/config';

// Read at request time so switching env vars on Vercel takes effect without a rebuild.
export const dynamic = 'force-dynamic';

export function GET() {
  return Response.json(publicBookingConfig(), { headers: { 'cache-control': 'no-store' } });
}
