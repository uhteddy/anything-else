import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Client (Auth, Realtime, Storage)
 *
 * While Drizzle (`db/index.ts`) handles our SQL queries and schema on the server,
 * this client handles Supabase features like Authentication, Realtime subscriptions,
 * and Storage buckets.
 *
 * Defaults to the standard local Supabase URL and demo anon key so local dev
 * works out of the box even before copying `.env.example`.
 */
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
