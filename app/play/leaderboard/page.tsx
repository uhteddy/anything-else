import Link from "next/link";
import StudentGroupHeader from "@/lib/components/game/StudentGroupHeader";
import { getGroup, getLeaderboard, MOCK_GROUPS, MOCK_PLAYER } from "@/lib/game/mockGame";

export default function StudentLeaderboard() {
  const group = getGroup(MOCK_PLAYER.groupName);
  const row = getLeaderboard().find((entry) => entry.group === group);

  return (
    <div className="flex min-h-dvh flex-col">
      <StudentGroupHeader group={group} />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center gap-4 px-4 py-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-base-content/70">
          Your group is in
        </p>
        <p className="text-7xl font-black">
          #{row?.rank}
          <span className="text-2xl font-semibold text-base-content/60"> of {MOCK_GROUPS.length}</span>
        </p>
        <p className="text-2xl font-bold">{row?.totalPoints.toLocaleString()} points</p>
        <p className="text-base-content/70">Look at the main screen for the full leaderboard.</p>
        <Link href="/play/final" className="btn btn-primary mt-auto w-full">
          Skip to final results →
        </Link>
      </main>
    </div>
  );
}
