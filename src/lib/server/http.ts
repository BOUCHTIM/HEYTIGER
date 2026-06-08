import 'server-only';
import { headers } from 'next/headers';

export async function getIp() {
  const h = await headers();
  const fwd = h.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]?.trim() || 'unknown';
  return h.get('x-real-ip') || 'unknown';
}

export async function readJson<T>(req: Request): Promise<T> {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') throw new Error('Invalid JSON body');
  return body as T;
}

export function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, init);
}

export function badRequest(message: string) {
  return json({ error: message }, { status: 400 });
}

export function unauthorized(message = 'Unauthorized') {
  return json({ error: message }, { status: 401 });
}

export function forbidden(message = 'Forbidden') {
  return json({ error: message }, { status: 403 });
}
