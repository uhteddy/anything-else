import Link from "next/link";
import QuestionResultsTable from "@/lib/components/game/QuestionResultsTable";
import {
  getQuestionResults,
  MOCK_CURRENT_QUESTION,
  MOCK_TOTAL_QUESTIONS,
} from "@/lib/game/mockGame";

type Params = Promise<{ gameId: string }>;

export const instant = false;

export default async function HostQuestionResults({ params }: { params: Params }) {
  const { gameId } = await params;
  const question = MOCK_CURRENT_QUESTION;
  const results = getQuestionResults(question);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:py-12">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Question {question.number} of {MOCK_TOTAL_QUESTIONS} · Closed
        </p>
        <h1 className="text-3xl font-bold">{question.prompt}</h1>
      </header>

      <section className="alert alert-info alert-soft flex-col items-start">
        <p className="text-sm font-semibold uppercase tracking-wide">Reference answer</p>
        <p>{question.referenceAnswer}</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Group answers</h2>
        <QuestionResultsTable results={results} showOverride />
      </section>

      <div className="flex justify-end">
        <Link href={`/host/game/${gameId}/leaderboard`} className="btn btn-primary">
          Continue to leaderboard →
        </Link>
      </div>
    </main>
  );
}
