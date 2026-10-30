import { defineConfig } from 'drizzle-kit';

/**
 * Drizzle Kit Configuration
 *
 * This tells Drizzle where our TypeScript schema lives (`./db/schema.ts`)
 * and outputs generated SQL migrations directly into `./supabase/migrations`.
 *
 * Drizzle Kit is used only to generate SQL. Supabase is the sole migration
 * runner for local and hosted databases, using the files in this directory.
 */
export default defineConfig({
  schema: './db/schema.ts',
  out: './supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    // Default local Supabase Postgres URL if DATABASE_URL isn't set in .env
    url:
      process.env.DATABASE_URL ||
      'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
  },
});
