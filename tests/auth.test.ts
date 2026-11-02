import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { eq, sql } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import {
  getRedirectUrl,
  unstable_doesMiddlewareMatch,
} from 'next/experimental/testing/server';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { db } from '@/db';
import { instructors } from '@/db/schema';
import { getClaims, signIn, signOut, signUp } from '@/lib/auth';
import { createClient as createBrowserSupabase } from '@/lib/supabase';
import { config, proxy } from '@/proxy';

const cookieJar = new Map<string, string>();

vi.mock('next/headers', () => ({
  cookies: async () => ({
    getAll: () =>
      Array.from(cookieJar.entries()).map(([name, value]) => ({ name, value })),
    set: (name: string, value: string) => {
      if (value) cookieJar.set(name, value);
      else cookieJar.delete(name);
    },
  }),
}));

describe('Supabase Auth & Next.js 16 Proxy', () => {
  const createdIds: string[] = [];
  const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  beforeEach(() => cookieJar.clear());

  afterAll(async () => {
    const admin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PRIVATE_SUPABASE_SECRET_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    await Promise.all(createdIds.map((id) => admin.auth.admin.deleteUser(id)));
  });

  it('throws when required Supabase env vars are missing', () => {
    const saved = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    expect(() => createBrowserSupabase()).toThrow(/URL and API key are required/);

    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = saved;
  });

  it('signs up, populates public.instructors via trigger, enforces RLS, verifies proxy & claims, and signs out', async () => {
    const emailA = `ada-${runId}@example.com`;
    const emailB = `grace-${runId}@example.com`;
    const password = 'StrongPassword123!';

    // 1. Sign up with displayName -> trigger inserts into public.instructors
    const { data: upA, error: errA } = await signUp(emailA, password, 'Dr. Ada');
    expect(errA).toBeNull();
    const idA = upA.user!.id;
    createdIds.push(idA);

    // 2. Sign up without displayName -> trigger falls back to email
    cookieJar.clear();
    const { data: upB, error: errB } = await signUp(emailB, password);
    expect(errB).toBeNull();
    const idB = upB.user!.id;
    createdIds.push(idB);

    const [rowA] = await db.select().from(instructors).where(eq(instructors.id, idA));
    const [rowB] = await db.select().from(instructors).where(eq(instructors.id, idB));
    expect(rowA.displayName).toBe('Dr. Ada');
    expect(rowB.displayName).toBe(emailB);

    // 3. Sign out clears session cookies & unauthenticated proxy redirects /dashboard
    await signOut();
    expect((await getClaims()).data?.claims ?? null).toBeNull();

    const unauthRes = await proxy(new NextRequest('http://localhost:3000/dashboard?tab=results'));
    expect(getRedirectUrl(unauthRes)).toBe('http://localhost:3000/login?next=%2Fdashboard%3Ftab%3Dresults');

    // 4. Sign in sets SSR cookies, getClaims() & authenticated proxy succeed
    const { error: signInErr } = await signIn(emailA, password);
    expect(signInErr).toBeNull();

    const { data: claimsData } = await getClaims();
    expect(claimsData?.claims.sub).toBe(idA);

    const cookieHeader = Array.from(cookieJar.entries())
      .map(([k, v]) => `${k}=${v}`)
      .join('; ');
    const authRes = await proxy(
      new NextRequest('http://localhost:3000/dashboard', {
        headers: { cookie: cookieHeader },
      })
    );
    expect(getRedirectUrl(authRes)).toBeNull();
    expect(authRes.status).toBe(200);

    // 5. RLS: Instructor A only sees their own row
    const visible = await db.transaction(async (tx) => {
      await tx.execute(sql`SET LOCAL ROLE authenticated`);
      await tx.execute(
        sql`SELECT set_config('request.jwt.claims', ${JSON.stringify({ sub: idA, role: 'authenticated' })}, true)`
      );
      return tx.select().from(instructors);
    });
    expect(visible).toHaveLength(1);
    expect(visible[0].id).toBe(idA);
  });

  it('matches app routes and skips static assets in proxy config', () => {
    expect(unstable_doesMiddlewareMatch({ config, url: '/dashboard' })).toBe(true);
    expect(unstable_doesMiddlewareMatch({ config, url: '/_next/static/a.js' })).toBe(false);
    expect(unstable_doesMiddlewareMatch({ config, url: '/favicon.ico' })).toBe(false);
  });
});
