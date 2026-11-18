import { sql, relations } from 'drizzle-orm';
import { check, integer, pgEnum, pgPolicy, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { authenticatedRole, authUid, authUsers } from 'drizzle-orm/supabase';

/**
 * Database Schema (Single Source of Truth)
 *
 * Define all  Postgres tables here.
 *
 * Workflow when you edit this file:
 *   1. `npm run db:generate` -> Generates a SQL migration file in `supabase/migrations/`
 *   2. `npm run db:migrate`  -> Applies pending Supabase migrations locally
 *      (or `npm run db:push` as an alias)
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
  instructor_id: uuid('instructor_id')
    .notNull()
    .references(() => instructors.id, { onDelete: 'cascade' }),
  title: text().notNull()
}, (table) => [
  check("question_set_title_nonempty", sql`length(trim(${table.title})) > 0`),
  pgPolicy("question_set_instructor_access", {
    as: "permissive",
    for: "all",
    to: authenticatedRole,
    using: sql`${table.instructor_id} = ${authUid}`,
    withCheck: sql`${table.instructor_id} = ${authUid}`,
  }),
])

export const questions = pgTable('questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  question_set_id: uuid('question_set_id')
    .notNull()
    .references(() => questionSet.id, { onDelete: 'cascade' }),
  question: text(),
  correct_answer: text().notNull(),
  position: integer().notNull(),
  image_path: text('image_path'),
  time_limit_seconds: integer('time_limit_seconds').default(30).notNull(),
}, (table) => [
  unique("question_set_position_unique").on(
    table.question_set_id,
    table.position
  ),
  check("question_position_nonnegative", sql`${table.position} >= 0`),
  check(
    "question_prompt_present",
    sql`length(trim(coalesce(${table.question}, ''))) > 0 OR ${table.image_path} IS NOT NULL`,
  ),
  check(
    "question_reference_answer_nonempty",
    sql`length(trim(${table.correct_answer})) > 0`,
  ),
  check(
    "question_time_limit_range",
    sql`${table.time_limit_seconds} >= 30 AND ${table.time_limit_seconds} <= 300`,
  ),
  pgPolicy("questions_instructor_access", {
    as: "permissive",
    for: "all",
    to: authenticatedRole,
    using: sql`EXISTS (
      SELECT 1
      FROM public.question_set AS owner_set
      WHERE owner_set.id = ${table.question_set_id}
        AND owner_set.instructor_id = ${authUid}
    )`,
    withCheck: sql`EXISTS (
      SELECT 1
      FROM public.question_set AS owner_set
      WHERE owner_set.id = ${table.question_set_id}
        AND owner_set.instructor_id = ${authUid}
    )`,
  }),
])

export const gameStateEnum = pgEnum('gameState', ['LOBBY', 'QUESTION_ACTIVE', 'QUESTION_ENDED', 'LEADERBOARD', 'FINISHED']);

export const instructorRelations = relations(instructors, ({ many }) => ({
  questionSets: many(questionSet)
}))

export const questionSetRelations = relations(questionSet, ({ one, many }) => ({
  instructor: one(instructors, {
    fields: [questionSet.instructor_id],
    references: [instructors.id],
  }),
  questions: many(questions),
}));

export const questionRelations = relations(questions, ({ one }) => ({
  questionSet: one(questionSet, {
    fields: [questions.question_set_id],
    references: [questionSet.id],
  }),
}));
