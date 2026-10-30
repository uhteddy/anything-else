ALTER TABLE "questions" DROP CONSTRAINT "question_set_position_unique";--> statement-breakpoint
ALTER TABLE "questions" DROP CONSTRAINT "questions_id_question_set_id_fk";
--> statement-breakpoint
ALTER TABLE "questions" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "question_set_id" uuid;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_question_set_id_question_set_id_fk" FOREIGN KEY ("question_set_id") REFERENCES "public"."question_set"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "question_set_position_unique" UNIQUE("question_set_id","position");