import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

/**
 * Database Connection (Server-Side Only)
 *
 * Connects Drizzle ORM directly to our Postgres database (local Supabase in dev,
 * or remote Supabase in production via DATABASE_URL).
 *
 * Note: `{ prepare: false }` is recommended when using Supabase's connection pooler.
 */
const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
