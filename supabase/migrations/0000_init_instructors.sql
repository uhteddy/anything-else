CREATE TABLE "instructors" (
	"id" uuid PRIMARY KEY NOT NULL,
	"display_name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "instructors" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "instructors" ADD CONSTRAINT "instructors_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "instructors_can_view_self" ON "instructors" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("instructors"."id" = (select auth.uid()));