import { asc, count, eq, max, min } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { db } from "@/db";
import { questionSet, questions } from "@/db/schema";
import { CreateLobbyForm } from "@/app/host/start/create-lobby-form";
import type { HostQuizOption } from "@/app/host/quiz-format";
import { isUuid } from "@/lib/game/lobby";
import { getClaims } from "@/lib/auth";
import GameShell from "@/lib/components/game/GameShell";
import { ArrowLeftIcon } from "@/lib/components/game/icons";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export const instant = false;

export default async function StartGame({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await connection();
  const { data: claimsData, error } = await getClaims();
  const instructorId = claimsData?.claims?.sub;

  if (error || typeof instructorId !== "string") {
    redirect("/login?next=%2Fhost");
  }

  const params = await searchParams;
  const quizId = typeof params.quizId === "string" ? params.quizId : "";
  if (!isUuid(quizId)) {
    redirect("/host");
  }

  // Load all of this instructor's quizzes (for the dropdown) in one query and
  // preselect the requested one. Same ownership filter as before.
  const quizzes: HostQuizOption[] = await db
    .select({
      id: questionSet.id,
      title: questionSet.title,
      questionCount: count(questions.id),
      minTimeSeconds: min(questions.time_limit_seconds),
      maxTimeSeconds: max(questions.time_limit_seconds),
    })
    .from(questionSet)
    .leftJoin(questions, eq(questions.question_set_id, questionSet.id))
    .where(eq(questionSet.instructor_id, instructorId))
    .groupBy(questionSet.id, questionSet.title)
    .orderBy(asc(questionSet.title));

  if (!quizzes.some((quiz) => quiz.id === quizId)) {
    redirect("/host");
  }

  return (
    <GameShell>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-8 sm:py-12">
        <Link
          href="/host"
          className="inline-flex w-fit items-center gap-2 rounded-field font-bold text-base-content/80 transition-colors hover:text-primary focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/40"
        >
          <ArrowLeftIcon />
          Back to Host a Game
        </Link>
        <CreateLobbyForm quizzes={quizzes} initialQuizId={quizId} />
      </div>
    </GameShell>
  );
}
