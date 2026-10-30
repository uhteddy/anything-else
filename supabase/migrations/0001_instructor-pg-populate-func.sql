-- -- Custom Drizzle Migration: Automatically populate `public.instructors` on signup
--
-- Whenever a user signs up via Supabase Auth (creating a row in `auth.users`),
-- this function + trigger automatically inserts a matching row into `public.instructors`.
--
-- If you pass `{ options: { data: { display_name: 'Jane' } } }` during `supabase.auth.signUp()`,
-- it uses that `display_name`; otherwise it falls back to the user's email address.

CREATE OR REPLACE FUNCTION public.handle_new_instructor()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.instructors (id, display_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'display_name', new.email, 'Instructor')
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_instructor();
