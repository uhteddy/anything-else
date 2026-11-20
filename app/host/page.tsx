import { asc, count, eq, max, min } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { db } from "@/db";
import { questionSet, questions } from "@/db/schema";
import { signOutAction } from "@/app/auth/actions";
import { DeleteQuizButton } from "@/app/host/delete-quiz-button";
import { CreateLobbyForm } from "@/app/host/start/create-lobby-form";
import {
  describeQuestionCount,
  describeTimeLimit,
  type HostQuizOption,
} from "@/app/host/quiz-format";
import { getClaims } from "@/lib/auth";
import GameShell from "@/lib/components/game/GameShell";
import {
  ArrowLeftIcon,
  BookIcon,
  CrownIcon,
  PencilIcon,
  PlusIcon,
} from "@/lib/components/game/icons";

export const instant = false;

export default async function HostGame() {
  await connection();
  const { data: claimsData, error } = await getClaims();
  const instructorId = claimsData?.claims?.sub;

  if (error || typeof instructorId !== "string") {
    redirect("/login?next=%2Fhost");
  }

  // One query feeds both the Host Game dropdown and the quiz grid.
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

  return (
    <GameShell>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-8 sm:py-12">
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 rounded-field font-bold text-base-content/80 transition-colors hover:text-primary focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/40"
          >
            <ArrowLeftIcon />
            Back to Play Now
          </Link>

          <div className="mx-auto w-full max-w-2xl">
            {quizzes.length > 0 ? (
              <CreateLobbyForm quizzes={quizzes} />
            ) : (
              <NoQuizzesCard />
            )}
          </div>
        </div>

        <section aria-labelledby="your-quizzes" className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="your-quizzes" className="text-2xl font-extrabold">
              Your quizzes
            </h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/host/create" className="btn btn-game rounded-full">
                <PlusIcon />
                Create Quiz
              </Link>
              <form action={signOutAction}>
                <button type="submit" className="btn btn-ghost rounded-full">
                  Sign out
                </button>
              </form>
            </div>
          </div>

          {quizzes.length === 0 ? (
            <p className="rounded-box border-2 border-dashed border-base-300 bg-base-100/70 p-8 text-center text-base-content/70">
              Quizzes you create will appear here.
            </p>
          ) : (
            <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {quizzes.map((quiz) => (
                <li
                  key={quiz.id}
                  className="card border border-base-300 bg-base-100 shadow-soft"
                >
                  <div className="card-body gap-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="badge badge-soft badge-primary font-bold">
                        {describeQuestionCount(quiz.questionCount)}
                      </span>
                      <span className="badge badge-ghost font-semibold">
                        {describeTimeLimit(quiz)}
                      </span>
                    </div>
                    <h3 className="flex items-start gap-2 text-lg font-extrabold">
                      <BookIcon className="mt-1 size-5 shrink-0 text-primary" />
                      <span className="wrap-break-word">{quiz.title}</span>
                    </h3>
                    <div className="card-actions mt-auto justify-end pt-2">
                      <DeleteQuizButton quizTitle={quiz.title} />
                      <Link
                        href={`/host/edit/${quiz.id}`}
                        className="btn btn-outline btn-primary btn-sm rounded-full"
                      >
                        <PencilIcon />
                        Edit
                      </Link>
                      <Link
                        href={`/host/start?quizId=${quiz.id}`}
                        className="btn btn-game btn-sm rounded-full"
                      >
                        Start Game
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </GameShell>
  );
}

function NoQuizzesCard() {
  return (
    <section
      aria-labelledby="no-quizzes-title"
      className="card border border-base-300 bg-base-100 shadow-soft"
    >
      <div className="card-body items-center gap-3 px-5 py-10 text-center sm:px-10">
        <span className="flex size-18 items-center justify-center rounded-full bg-secondary text-accent">
          <CrownIcon className="size-10" />
        </span>
        <h1 id="no-quizzes-title" className="text-3xl font-black tracking-tight sm:text-4xl">
          Host Game
        </h1>
        <p className="text-base-content/70">
          You don&apos;t have any quizzes yet. Create your first quiz to host a game.
        </p>
        <Link href="/host/create" className="btn btn-game btn-lg mt-2 rounded-full">
          <PlusIcon className="size-6" />
          Create your first quiz
        </Link>
      </div>
    </section>
  );
}
