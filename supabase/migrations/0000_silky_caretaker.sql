CREATE TYPE "public"."gameState" AS ENUM('LOBBY', 'QUESTION_ACTIVE', 'QUESTION_ENDED', 'LEADERBOARD', 'FINISHED');--> statement-breakpoint
CREATE TABLE "instructors" (
	"id" uuid PRIMARY KEY NOT NULL,
	"display_name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "instructors" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "question_set" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" uuid,
	"question" text NOT NULL,
	"correct_answer" text NOT NULL,
	"position" integer NOT NULL,
	CONSTRAINT "question_set_position_unique" UNIQUE("id","position"),
	CONSTRAINT "question_position_nonnegative" CHECK ("questions"."position" >= 0)
);
--> statement-breakpoint
ALTER TABLE "instructors" ADD CONSTRAINT "instructors_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_set" ADD CONSTRAINT "question_set_id_instructors_id_fk" FOREIGN KEY ("id") REFERENCES "public"."instructors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_id_question_set_id_fk" FOREIGN KEY ("id") REFERENCES "public"."question_set"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "instructors_can_view_self" ON "instructors" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("instructors"."id" = (select auth.uid()));