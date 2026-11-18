import Link from "next/link";
import LeaderboardTable from "@/lib/components/game/LeaderboardTable";
import { getLeaderboard, MOCK_PLAYER } from "@/lib/game/mockGame";

export default function StudentFinal() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-6 px-4 py-10">
      <header className="flex flex-col gap-2 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Game over</p>
        <h1 className="text-4xl font-bold">Final results</h1>
      </header>

      <LeaderboardTable rows={getLeaderboard()} markTopThree highlightGroup={MOCK_PLAYER.groupName} />

      <Link href="/join" className="btn btn-primary">
        Join another game
      </Link>
    </main>
  );
}
