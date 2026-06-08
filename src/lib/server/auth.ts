import 'server-only';
import { jwtVerify, SignJWT } from 'jose';
import { TextEncoder } from 'node:util';
import { requireEnv } from './env';

type TokenKind = 'admin' | 'guest';

const secret = new TextEncoder().encode(requireEnv('HT_AUTH_SECRET'));

export async function signAdminSession(payload: { adminId: string; role: string }, expiresInSeconds = 60 * 60 * 24 * 7) {
  return new SignJWT({ kind: 'admin' satisfies TokenKind, role: payload.role })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(payload.adminId)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresInSeconds)
    .sign(secret);
}

export async function verifyAdminSession(token: string) {
  const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] });
  if (payload.kind !== 'admin') throw new Error('Invalid session');
  if (!payload.sub) throw new Error('Invalid session');
  const role = typeof payload.role === 'string' ? payload.role : 'admin';
  return { adminId: payload.sub, role };
}

export async function signGuestManageToken(payload: { reservationId: string }, expiresInSeconds = 60 * 60 * 24 * 30) {
  return new SignJWT({ kind: 'guest' satisfies TokenKind, rid: payload.reservationId })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresInSeconds)
    .sign(secret);
}

export async function verifyGuestManageToken(token: string) {
  const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] });
  if (payload.kind !== 'guest') throw new Error('Invalid token');
  const rid = typeof payload.rid === 'string' ? payload.rid : '';
  if (!rid) throw new Error('Invalid token');
  return { reservationId: rid };
}

