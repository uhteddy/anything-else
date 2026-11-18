import { asc, count, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { db } from "@/db";
import { questionSet, questions } from "@/db/schema";
import { signOutAction } from "@/app/auth/actions";
import { DeleteQuizButton } from "@/app/host/delete-quiz-button";
import { getClaims } from "@/lib/auth";

export const instant = false;

export default async function HostGame() {
  await connection();
  const { data: claimsData, error } = await getClaims();
  const instructorId = claimsData?.claims?.sub;

  if (error || typeof instructorId !== "string") {
    redirect("/login?next=%2Fhost");
  }

  const quizzes = await db
    .select({
      id: questionSet.id,
      title: questionSet.title,
      questionCount: count(questions.id),
    })
    .from(questionSet)
    .leftJoin(questions, eq(questions.question_set_id, questionSet.id))
    .where(eq(questionSet.instructor_id, instructorId))
    .groupBy(questionSet.id, questionSet.title)
    .orderBy(asc(questionSet.title));

  return (
    <main className="flex flex-col items-center gap-8 px-4 py-12">
      <section className="flex max-w-2xl flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-bold">Host a Game</h1>
        <p className="text-lg opacity-70">Pick a quiz to start a game, or create a new one.</p>
      </section>

      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/host/create" className="btn btn-secondary">
          + Create Quiz
        </Link>
        <Link href="/" className="btn btn-ghost">
          ← Back to Play Now
        </Link>
        <form action={signOutAction}>
          <button type="submit" className="btn btn-ghost">
            Sign out
          </button>
        </form>
      </div>

      {quizzes.length === 0 ? (
        <section className="rounded-box border border-base-300 bg-base-100 p-8 text-center">
          <h2 className="text-xl font-semibold">No saved quizzes yet</h2>
          <p className="mt-2 text-base-content/70">
            Create a quiz to see it here and use it to start a game.
          </p>
        </section>
      ) : (
        <section className="grid w-full max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="card border border-base-300 bg-base-100 shadow-md">
              <div className="card-body">
                <span className="badge badge-soft badge-primary">
                  {quiz.questionCount}{" "}
                  {quiz.questionCount === 1 ? "question" : "questions"}
                </span>
                <h2 className="card-title">{quiz.title}</h2>
                <div className="card-actions mt-2 justify-end">
                  <DeleteQuizButton quizTitle={quiz.title} />
                  <Link href={`/host/edit/${quiz.id}`} className="btn btn-outline">
                    Edit
                  </Link>
                  <Link href={`/host/start?quizId=${quiz.id}`} className="btn btn-primary">
                    Start Game
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
