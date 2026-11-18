ALTER TABLE "question_set" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "questions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "question_set" ALTER COLUMN "instructor_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "question_set_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "question" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "image_path" text;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "time_limit_seconds" integer DEFAULT 30 NOT NULL;--> statement-breakpoint
ALTER TABLE "question_set" ADD CONSTRAINT "question_set_title_nonempty" CHECK (length(trim("question_set"."title")) > 0);--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "question_prompt_present" CHECK (length(trim(coalesce("questions"."question", ''))) > 0 OR "questions"."image_path" IS NOT NULL);--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "question_time_limit_range" CHECK ("questions"."time_limit_seconds" >= 30 AND "questions"."time_limit_seconds" <= 300);--> statement-breakpoint
CREATE POLICY "question_set_instructor_access" ON "question_set" AS PERMISSIVE FOR ALL TO "authenticated" USING ("question_set"."instructor_id" = (select auth.uid())) WITH CHECK ("question_set"."instructor_id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "questions_instructor_access" ON "questions" AS PERMISSIVE FOR ALL TO "authenticated" USING (EXISTS (
      SELECT 1
      FROM public.question_set AS owner_set
      WHERE owner_set.id = "questions"."question_set_id"
        AND owner_set.instructor_id = (select auth.uid())
    )) WITH CHECK (EXISTS (
      SELECT 1
      FROM public.question_set AS owner_set
      WHERE owner_set.id = "questions"."question_set_id"
        AND owner_set.instructor_id = (select auth.uid())
    ));--> statement-breakpoint
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'question-images',
  'question-images',
  false,
  26214400,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;--> statement-breakpoint
CREATE POLICY "question_images_select_own"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'question-images'
  AND (storage.foldername(name))[1] = (select auth.uid())::text
);--> statement-breakpoint
CREATE POLICY "question_images_insert_own"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'question-images'
  AND (storage.foldername(name))[1] = (select auth.uid())::text
);--> statement-breakpoint
CREATE POLICY "question_images_update_own"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'question-images'
  AND (storage.foldername(name))[1] = (select auth.uid())::text
)
WITH CHECK (
  bucket_id = 'question-images'
  AND (storage.foldername(name))[1] = (select auth.uid())::text
);--> statement-breakpoint
CREATE POLICY "question_images_delete_own"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'question-images'
  AND (storage.foldername(name))[1] = (select auth.uid())::text
);