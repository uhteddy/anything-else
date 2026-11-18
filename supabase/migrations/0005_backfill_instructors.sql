INSERT INTO public.instructors (id, display_name)
SELECT
  users.id,
  COALESCE(users.raw_user_meta_data ->> 'display_name', users.email, 'Instructor')
FROM auth.users AS users
ON CONFLICT (id) DO NOTHING;
