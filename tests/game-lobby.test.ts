import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { sql } from 'drizzle-orm';
import { afterAll, describe, expect, it } from 'vitest';
import { db } from '@/db';
import { gamePlayers, gameSessions, questionSet } from '@/db/schema';

describe('game lobby access controls', () => {
  const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const userIds: string[] = [];

  const admin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PRIVATE_SUPABASE_SECRET_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  afterAll(async () => {
    await Promise.all(userIds.map((id) => admin.auth.admin.deleteUser(id)));
  });

  it('limits game sessions and player rows to the owning instructor', async () => {
    const userResults = await Promise.all(
      ['host-a', 'host-b'].map((name) =>
        admin.auth.admin.createUser({
          email: `${name}-${runId}@example.com`,
          password: 'StrongPassword123!',
          email_confirm: true,
        }),
      ),
    );
    const [userA, userB] = userResults.map(({ data, error }) => {
      expect(error).toBeNull();
      if (!data.user) throw new Error('Supabase did not return the test user.');
      userIds.push(data.user.id);
      return data.user.id;
    });

    const [quizA] = await db
      .insert(questionSet)
      .values({ instructor_id: userA, title: `Host A quiz ${runId}` })
      .returning({ id: questionSet.id });
    const [quizB] = await db
      .insert(questionSet)
      .values({ instructor_id: userB, title: `Host B quiz ${runId}` })
      .returning({ id: questionSet.id });

    const [gameA] = await db
      .insert(gameSessions)
      .values({
        instructor_id: userA,
        question_set_id: quizA.id,
        pin: '102938',
      })
      .returning({ id: gameSessions.id });
    const [gameB] = await db
      .insert(gameSessions)
      .values({
        instructor_id: userB,
        question_set_id: quizB.id,
        pin: '564738',
      })
      .returning({ id: gameSessions.id });

    await db.insert(gamePlayers).values([
      {
        game_session_id: gameA.id,
        nickname: 'Ada',
        color: '#7c3aed',
      },
      {
        game_session_id: gameB.id,
        nickname: 'Grace',
        color: '#2563eb',
      },
    ]);

    const visibleToA = await db.transaction(async (transaction) => {
      await transaction.execute(sql`SET LOCAL ROLE authenticated`);
      await transaction.execute(
        sql`SELECT set_config('request.jwt.claim.sub', ${userA}, true)`,
      );
      const sessions = await transaction
        .select({ id: gameSessions.id })
        .from(gameSessions);
      const players = await transaction
        .select({ nickname: gamePlayers.nickname })
        .from(gamePlayers);
      return { sessions, players };
    });

    expect(visibleToA.sessions.map((session) => session.id)).toEqual([gameA.id]);
    expect(visibleToA.players.map((player) => player.nickname)).toEqual(['Ada']);

    await expect(
      db.transaction(async (transaction) => {
        await transaction.execute(sql`SET LOCAL ROLE authenticated`);
        await transaction.execute(
          sql`SELECT set_config('request.jwt.claim.sub', ${userA}, true)`,
        );
        await transaction.insert(gameSessions).values({
          instructor_id: userB,
          question_set_id: quizB.id,
          pin: '918273',
        });
      }),
    ).rejects.toThrow();
  });
});
