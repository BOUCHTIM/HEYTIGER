import 'server-only';

export const isProd = process.env.NODE_ENV === 'production';

export function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required environment variable: ${name}`);
  return v;
}

export function optionalEnv(name: string): string | undefined {
  const v = process.env[name];
  return v || undefined;
}

