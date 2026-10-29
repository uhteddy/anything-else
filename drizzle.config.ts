import { defineConfig } from 'drizzle-kit';

/**
 * Drizzle Kit Configuration
 *
 * This tells Drizzle where our TypeScript schema lives (`./db/schema.ts`)
 * and outputs generated SQL migrations directly into `./supabase/migrations`.
 *
 * Because it outputs to `./supabase/migrations`, whenever someone runs
 * `npm run db:reset` or starts local Supabase, Supabase automatically
 * picks up and runs the SQL migrations Drizzle generated.
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
