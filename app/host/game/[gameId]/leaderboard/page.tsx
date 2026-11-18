import Link from "next/link";
import LeaderboardTable from "@/lib/components/game/LeaderboardTable";
import { getLeaderboard, MOCK_CURRENT_QUESTION, MOCK_TOTAL_QUESTIONS } from "@/lib/game/mockGame";

type Params = Promise<{ gameId: string }>;

export const instant = false;

export default async function HostLeaderboard({ params }: { params: Params }) {
  const { gameId } = await params;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:py-12">
      <header className="flex flex-col gap-2 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          After question {MOCK_CURRENT_QUESTION.number} of {MOCK_TOTAL_QUESTIONS}
        </p>
        <h1 className="text-4xl font-bold">Leaderboard</h1>
      </header>

      <LeaderboardTable rows={getLeaderboard()} />

      <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row">
        <Link href={`/host/game/${gameId}/final`} className="btn btn-outline btn-error">
          End game
        </Link>
        <Link href={`/host/game/${gameId}/question`} className="btn btn-primary">
          Next question →
        </Link>
      </div>
    </main>
  );
}
