import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === '/@vite/client' || pathname.startsWith('/@react-refresh')) {
    return new Response('', {
      status: 200,
      headers: {
        'content-type': 'application/javascript; charset=utf-8',
        'cache-control': 'no-store',
      },
    });
  }

  return;
}

export const config = {
  matcher: ['/@vite/client', '/@react-refresh/:path*'],
};
