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
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
