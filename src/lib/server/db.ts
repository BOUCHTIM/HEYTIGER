import 'server-only';
import postgres from 'postgres';
import { randomUUID } from 'node:crypto';
import { isProd, requireEnv } from './env';

declare global {
  var __htSql: ReturnType<typeof postgres> | undefined;
  var __htSchemaReady: Promise<void> | undefined;
}

export const sql =
  globalThis.__htSql ??
  postgres(requireEnv('DATABASE_URL'), {
    ssl: isProd ? 'require' : undefined,
    max: 5,
  });

if (!globalThis.__htSql) globalThis.__htSql = sql;

export function newId() {
  return randomUUID();
}

export async function ensureSchema() {
  if (globalThis.__htSchemaReady) return globalThis.__htSchemaReady;
  globalThis.__htSchemaReady = (async () => {
    await sql`
      create table if not exists admin_users (
        id text primary key,
        email text not null,
        email_norm text not null,
        password_hash text not null,
        role text not null default 'admin',
        created_at timestamptz not null default now(),
        last_login_at timestamptz
      );
    `;
    await sql`create unique index if not exists admin_users_email_norm_uq on admin_users(email_norm);`;

    await sql`
      create table if not exists guests (
        id text primary key,
        name text not null,
        email text,
        email_norm text,
        phone text,
        phone_norm text,
        marketing_opt_in boolean not null default false,
        created_at timestamptz not null default now()
      );
    `;
    await sql`create index if not exists guests_email_norm_idx on guests(email_norm);`;
    await sql`create index if not exists guests_phone_norm_idx on guests(phone_norm);`;

    await sql`
      create table if not exists reservations (
        id text primary key,
        confirmation_code text not null,
        guest_id text not null references guests(id) on delete restrict,
        space_id text not null,
        starts_at timestamptz not null,
        party_size int not null,
        status text not null default 'confirmed',
        dietary text[] not null default array[]::text[],
        occasion text not null default '',
        sms_opt boolean not null default false,
        notes text not null default '',
        cancelled_at timestamptz,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );
    `;
    await sql`create unique index if not exists reservations_confirmation_code_uq on reservations(confirmation_code);`;
    await sql`create index if not exists reservations_space_starts_at_idx on reservations(space_id, starts_at);`;
    await sql`create index if not exists reservations_guest_starts_at_idx on reservations(guest_id, starts_at desc);`;

    await sql`
      create table if not exists audit_logs (
        id text primary key,
        actor_admin_id text references admin_users(id) on delete set null,
        action text not null,
        entity_type text not null,
        entity_id text not null,
        ip text,
        user_agent text,
        created_at timestamptz not null default now()
      );
    `;
    await sql`create index if not exists audit_logs_created_at_idx on audit_logs(created_at desc);`;
  })();

  return globalThis.__htSchemaReady;
}
