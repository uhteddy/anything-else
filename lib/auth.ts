'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch { /* Cookie writes are unavailable in read-only server contexts. */ }
        },
      },
    }
  );
}

export async function signUp(email: string, password: string, displayName?: string) {
  const supabase = await createClient();
  const name = displayName?.trim();
  return supabase.auth.signUp({
    email,
    password,
    options: name ? { data: { display_name: name } } : undefined,
  });
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  const supabase = await createClient();
  return supabase.auth.signOut();
}

export async function getClaims() {
  const supabase = await createClient();
  return supabase.auth.getClaims();
}
