CREATE TABLE "game_players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_session_id" uuid NOT NULL,
	"nickname" text NOT NULL,
	"color" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "game_players_session_nickname_unique" UNIQUE("game_session_id","nickname"),
	CONSTRAINT "game_players_nickname_length" CHECK (length(trim("game_players"."nickname")) BETWEEN 1 AND 16),
	CONSTRAINT "game_players_color_nonempty" CHECK (length(trim("game_players"."color")) > 0)
);
--> statement-breakpoint
ALTER TABLE "game_players" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "game_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"instructor_id" uuid NOT NULL,
	"question_set_id" uuid NOT NULL,
	"pin" text NOT NULL,
	"channel_token" uuid DEFAULT gen_random_uuid() NOT NULL,
	"state" "gameState" DEFAULT 'LOBBY' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "game_sessions_pin_unique" UNIQUE("pin"),
	CONSTRAINT "game_sessions_channel_token_unique" UNIQUE("channel_token"),
	CONSTRAINT "game_sessions_pin_format" CHECK ("game_sessions"."pin" ~ '^[0-9]{6}$')
);
--> statement-breakpoint
ALTER TABLE "game_sessions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "game_players" ADD CONSTRAINT "game_players_game_session_id_game_sessions_id_fk" FOREIGN KEY ("game_session_id") REFERENCES "public"."game_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_instructor_id_instructors_id_fk" FOREIGN KEY ("instructor_id") REFERENCES "public"."instructors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_question_set_id_question_set_id_fk" FOREIGN KEY ("question_set_id") REFERENCES "public"."question_set"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "game_players_host_access" ON "game_players" AS PERMISSIVE FOR ALL TO "authenticated" USING (EXISTS (
      SELECT 1
      FROM public.game_sessions AS owner_game
      WHERE owner_game.id = "game_players"."game_session_id"
        AND owner_game.instructor_id = (select auth.uid())
    )) WITH CHECK (EXISTS (
      SELECT 1
      FROM public.game_sessions AS owner_game
      WHERE owner_game.id = "game_players"."game_session_id"
        AND owner_game.instructor_id = (select auth.uid())
    ));--> statement-breakpoint
CREATE POLICY "game_sessions_instructor_access" ON "game_sessions" AS PERMISSIVE FOR ALL TO "authenticated" USING ("game_sessions"."instructor_id" = (select auth.uid())) WITH CHECK ("game_sessions"."instructor_id" = (select auth.uid()));