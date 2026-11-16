import Link from "next/link";
import { MOCK_QUIZZES } from "@/lib/game/mockData";

// Host Game dashboard (Prototype V1). Create Quiz and Start Game lead to
// placeholder screens that teammates will replace.
export default function HostGame() {
  return (
    <main className="flex flex-col items-center gap-8 px-4 py-12">
      <section className="flex max-w-2xl flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-bold">Host a Game</h1>
        <p className="text-lg opacity-70">Pick a quiz to start a game, or create a new one.</p>
      </section>

      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/game/host/create" className="btn btn-secondary">
          + Create Quiz
        </Link>
        <Link href="/game" className="btn btn-ghost">
          ← Back to Play Now
        </Link>
      </div>

      <section className="grid w-full max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_QUIZZES.map((quiz) => (
          <div key={quiz.id} className="card border border-base-300 bg-base-100 shadow-md">
            <div className="card-body">
              <span className="badge badge-soft badge-primary">{quiz.questionCount} questions</span>
              <h2 className="card-title">{quiz.title}</h2>
              <p className="opacity-70">{quiz.description}</p>
              <div className="card-actions mt-2 justify-end">
                <Link href="/game/host/start" className="btn btn-primary">
                  Start Game
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
