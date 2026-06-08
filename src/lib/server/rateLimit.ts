import 'server-only';

declare global {
  var __htRate: Map<string, { count: number; resetAt: number }> | undefined;
}

const store = globalThis.__htRate ?? new Map<string, { count: number; resetAt: number }>();
if (!globalThis.__htRate) globalThis.__htRate = store;

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const cur = store.get(key);
  if (!cur || cur.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true as const, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (cur.count >= limit) {
    return { ok: false as const, remaining: 0, resetAt: cur.resetAt };
  }

  cur.count += 1;
  store.set(key, cur);
  return { ok: true as const, remaining: Math.max(0, limit - cur.count), resetAt: cur.resetAt };
}

