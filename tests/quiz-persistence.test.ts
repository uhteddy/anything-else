import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { sql } from 'drizzle-orm';
import { afterAll, describe, expect, it } from 'vitest';
import { db } from '@/db';
import { questionSet, questions } from '@/db/schema';
import { QUIZ_IMAGE_BUCKET } from '@/lib/quiz-constants';

describe('quiz persistence access controls', () => {
  const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const password = 'StrongPassword123!';
  const userIds: string[] = [];
  let uploadedPath: string | null = null;

  const admin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PRIVATE_SUPABASE_SECRET_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  afterAll(async () => {
    if (uploadedPath) {
      await admin.storage.from(QUIZ_IMAGE_BUCKET).remove([uploadedPath]);
    }
    await Promise.all(userIds.map((id) => admin.auth.admin.deleteUser(id)));
  });

  it('scopes quizzes and private prompt images to their instructor', async () => {
    const users = await Promise.all(
      ['ada', 'grace'].map(async (name) => {
        const { data, error } = await admin.auth.admin.createUser({
          email: `${name}-${runId}@example.com`,
          password,
          email_confirm: true,
        });
        expect(error).toBeNull();
        if (!data.user) throw new Error('Supabase did not return the test user.');
        userIds.push(data.user.id);
        return data.user.id;
      }),
    );
    const [instructorA, instructorB] = users;

    const [setA] = await db
      .insert(questionSet)
      .values({ instructor_id: instructorA, title: `Quiz A ${runId}` })
      .returning({ id: questionSet.id });
    const [setB] = await db
      .insert(questionSet)
      .values({ instructor_id: instructorB, title: `Quiz B ${runId}` })
      .returning({ id: questionSet.id });

    await db.insert(questions).values([
      {
        question_set_id: setA.id,
        question: 'Question A',
        correct_answer: 'Answer A',
        position: 0,
      },
      {
        question_set_id: setB.id,
        question: 'Question B',
        correct_answer: 'Answer B',
        position: 0,
      },
    ]);

    const visibleToA = await db.transaction(async (transaction) => {
      await transaction.execute(sql`SET LOCAL ROLE authenticated`);
      await transaction.execute(
        sql`SELECT set_config('request.jwt.claim.sub', ${instructorA}, true)`,
      );
      const sets = await transaction.select({ id: questionSet.id }).from(questionSet);
      const questionRows = await transaction
        .select({ questionSetId: questions.question_set_id })
        .from(questions);
      return { sets, questionRows };
    });

    expect(visibleToA.sets.map((set) => set.id)).toEqual([setA.id]);
    expect(visibleToA.questionRows.map((row) => row.questionSetId)).toEqual([setA.id]);

    await expect(
      db.transaction(async (transaction) => {
        await transaction.execute(sql`SET LOCAL ROLE authenticated`);
        await transaction.execute(
          sql`SELECT set_config('request.jwt.claim.sub', ${instructorA}, true)`,
        );
        await transaction.insert(questionSet).values({
          instructor_id: instructorB,
          title: `Not owned by A ${runId}`,
        });
      }),
    ).rejects.toThrow();

    const clientA = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );
    const clientB = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );
    const [{ error: signInErrorA }, { error: signInErrorB }] = await Promise.all([
      clientA.auth.signInWithPassword({
        email: `ada-${runId}@example.com`,
        password,
      }),
      clientB.auth.signInWithPassword({
        email: `grace-${runId}@example.com`,
        password,
      }),
    ]);
    expect(signInErrorA).toBeNull();
    expect(signInErrorB).toBeNull();

    uploadedPath = `${instructorA}/quiz-prompt-${runId}.png`;
    const imageBytes = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
    const { error: uploadError } = await clientA.storage
      .from(QUIZ_IMAGE_BUCKET)
      .upload(uploadedPath, imageBytes, { contentType: 'image/png' });
    expect(uploadError).toBeNull();

    const { error: otherUploadError } = await clientA.storage
      .from(QUIZ_IMAGE_BUCKET)
      .upload(`${instructorB}/quiz-prompt-${runId}.png`, imageBytes, {
        contentType: 'image/png',
      });
    const { data: ownImage, error: ownImageError } = await clientA.storage
      .from(QUIZ_IMAGE_BUCKET)
      .download(uploadedPath);
    const { data: otherImage, error: otherImageError } = await clientB.storage
      .from(QUIZ_IMAGE_BUCKET)
      .download(uploadedPath);

    expect(otherUploadError).not.toBeNull();
    expect(ownImageError).toBeNull();
    expect(ownImage).not.toBeNull();
    expect(otherImage).toBeNull();
    expect(otherImageError).not.toBeNull();
  });
});
