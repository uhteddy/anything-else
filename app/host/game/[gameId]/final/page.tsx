import Link from "next/link";
import LeaderboardTable from "@/lib/components/game/LeaderboardTable";
import QuestionResultsTable from "@/lib/components/game/QuestionResultsTable";
import { getLeaderboard, getQuestionResults, MOCK_QUESTIONS } from "@/lib/game/mockGame";

export default function HostFinalResults() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:py-12">
      <header className="flex flex-col gap-2 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Game over</p>
        <h1 className="text-4xl font-bold">Final results</h1>
      </header>

      <section className="mx-auto w-full max-w-3xl">
        <LeaderboardTable rows={getLeaderboard()} markTopThree />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold">Results by question</h2>
        {MOCK_QUESTIONS.map((question) => (
          <details
            key={question.number}
            className="collapse collapse-arrow border border-base-300 bg-base-100"
          >
            <summary className="collapse-title font-semibold">
              Question {question.number}: {question.prompt}
            </summary>
            <div className="collapse-content flex flex-col gap-3">
              <p className="text-sm">
                <span className="font-semibold">Reference answer:</span> {question.referenceAnswer}
              </p>
              <QuestionResultsTable results={getQuestionResults(question)} />
            </div>
          </details>
        ))}
      </section>

      <div className="flex justify-center">
        <Link href="/host" className="btn btn-primary">
          Back to Host a Game
        </Link>
      </div>
    </main>
  );
}
