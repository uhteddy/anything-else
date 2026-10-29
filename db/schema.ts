import { sql } from 'drizzle-orm';
import { pgPolicy, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { authenticatedRole, authUid, authUsers } from 'drizzle-orm/supabase';

/**
 * Database Schema (Single Source of Truth)
 *
 * Define all your Postgres tables here instead of clicking around in the Supabase UI.
 *
 * Workflow when you edit this file:
 *   1. `npm run db:generate` -> Generates a SQL migration file in `supabase/migrations/`
 *   2. `npm run db:migrate`  -> Applies migrations to your local database
 *      (or `npm run db:push` to push changes directly while prototyping)
 */

export const instructors = pgTable(
  'instructors',
  {
    id: uuid('id')
      .primaryKey()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    displayName: text('display_name').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    // RLS policy that only allows authenticated instructors to view their own profile.
    pgPolicy('instructors_can_view_self', {
      as: 'permissive',
      for: 'select',
      to: authenticatedRole,
      using: sql`${table.id} = ${authUid}`,
    }),
  ],
);
