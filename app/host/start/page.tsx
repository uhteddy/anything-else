import { and, count, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { db } from "@/db";
import { questionSet, questions } from "@/db/schema";
import { CreateLobbyForm } from "@/app/host/start/create-lobby-form";
import { isUuid } from "@/lib/game/lobby";
import { getClaims } from "@/lib/auth";

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
    .limit(1);

  if (!quiz) {
    redirect("/host");
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-12">
      <header className="flex flex-col gap-3">
        <Link href="/host" className="link link-hover w-fit text-sm">
          ← Back to Host a Game
        </Link>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Game setup
          </p>
          <h1 className="mt-1 text-4xl font-bold">Open a lobby</h1>
          <p className="mt-2 text-base-content/70">
            Students can join with the game PIN. You can close the lobby when
            you&apos;re ready.
          </p>
        </div>
      </header>

      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">{quiz.title}</h2>
          <p className="text-base-content/70">
            {quiz.questionCount}{" "}
            {quiz.questionCount === 1 ? "question" : "questions"}
          </p>
        </div>
      </section>

      {quiz.questionCount === 0 ? (
        <p className="alert alert-warning">
          This quiz has no questions yet. Add a question before opening a lobby.
        </p>
      ) : (
        <CreateLobbyForm quizId={quiz.id} />
      )}
    </main>
  );
}
