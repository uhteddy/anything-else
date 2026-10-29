import { sql } from 'drizzle-orm';
import { check, integer, pgEnum, pgPolicy, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { authenticatedRole, authUid, authUsers } from 'drizzle-orm/supabase';

/**
 * Database Schema (Single Source of Truth)
 *
 * Define all  Postgres tables here.
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

// Question Sets

export const questionSet = pgTable('question_set', {
  id: uuid('id').primaryKey().defaultRandom(),
  instructor_id: uuid('id').primaryKey().references(() => instructors.id, { onDelete: 'cascade' }),
  title: text().notNull()
})

export const questions = pgTable('questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  question_set_id: uuid('question_set_id').references(() => questionSet.id, { onDelete: 'cascade' }),
  question: text().notNull(),
  correct_answer: text().notNull(),
  position: integer().notNull()
}, (table) => [
  unique("question_set_position_unique").on(
    table.question_set_id,
    table.position
  ),
  check("question_position_nonnegative", sql`${table.position} >= 0`),
])

export const gameStateEnum = pgEnum('gameState', ['LOBBY', 'QUESTION_ACTIVE', 'QUESTION_ENDED', 'LEADERBOARD', 'FINISHED']);
