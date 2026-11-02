import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Client (Auth, Realtime, Storage)
 *
 * While Drizzle (`db/index.ts`) handles our SQL queries and schema on the server,
 * this client handles Supabase features like Authentication, Realtime subscriptions,
 * and Storage buckets.
 *
 * Uses the local Supabase URL and Publishable Key (`sb_publishable_...`) from `.env.local`.
 */
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';

const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
