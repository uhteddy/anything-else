"use server";

import { randomInt } from "node:crypto";
import { and, asc, count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { gameSessions, questionSet, questions } from "@/db/schema";
import { isUuid } from "@/lib/game/lobby";
import { getClaims } from "@/lib/auth";

export type CreateLobbyActionState = {
  error?: string;
};

export async function createLobbyAction(
  _previousState: CreateLobbyActionState,
  formData: FormData,
): Promise<CreateLobbyActionState> {
  const quizId = formData.get("quizId");
  if (typeof quizId !== "string" || !isUuid(quizId)) {
    return { error: "Choose a valid quiz to start." };
  }

  const { data: claimsData, error: claimsError } = await getClaims();
  const instructorId = claimsData?.claims?.sub;
  if (claimsError || typeof instructorId !== "string") {
    return { error: "Your session has expired. Sign in again to start a game." };
  }

  const [quiz] = await db
    .select({
      id: questionSet.id,
      title: questionSet.title,
      questionCount: count(questions.id),
    })
    .from(questionSet)
    .leftJoin(questions, eq(questions.question_set_id, questionSet.id))
    .where(and(eq(questionSet.id, quizId), eq(questionSet.instructor_id, instructorId)))
    .groupBy(questionSet.id, questionSet.title)
    .orderBy(asc(questionSet.title))
    .limit(1);

  if (!quiz) {
    return { error: "That quiz could not be found in your account." };
  }
  if (quiz.questionCount === 0) {
    return { error: "Add at least one question before starting this quiz." };
  }

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const pin = randomInt(0, 1_000_000).toString().padStart(6, "0");
    const [game] = await db
      .insert(gameSessions)
      .values({
        instructor_id: instructorId,
        question_set_id: quiz.id,
        pin,
      })
      .onConflictDoNothing({ target: gameSessions.pin })
      .returning({ id: gameSessions.id });

    if (game) {
      revalidatePath("/host");
      redirect(`/host/game/${game.id}`);
    }
  }

  return { error: "Couldn't reserve a game PIN. Please try again." };
}
