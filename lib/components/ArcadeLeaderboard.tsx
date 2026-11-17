import ArcadeCard from "@/lib/components/ArcadeCard";
import ArcadeCritterAvatar from "@/lib/components/ArcadeCritterAvatar";
import type { getGroupLeaderboard } from "@/lib/game/mockData";

type LeaderboardRow = ReturnType<typeof getGroupLeaderboard>[number];

type ArcadeLeaderboardProps = {
  rows: LeaderboardRow[];
  gameCode: string;
  highlightGroupId?: string;
  title?: string;
};

export default function ArcadeLeaderboard({
  rows,
  gameCode,
  highlightGroupId,
  title = "Group Leaderboard",
}: ArcadeLeaderboardProps) {
  return (
    <ArcadeCard className="w-full" bodyClassName="gap-4 p-6 sm:p-8">
      <h2 className="card-title text-2xl font-black">{title}</h2>

      <ol className="flex flex-col gap-3">
        {rows.map((row, idx) => {
          const isPlayerGroup = row.group.id === highlightGroupId;
          return (
            <li
              key={row.group.id}
              className={`flex flex-col justify-between gap-3 rounded-box border-2 border-b-4 p-4 sm:flex-row sm:items-center ${
                isPlayerGroup
                  ? `${row.group.borderClass} ${row.group.bgClass}`
                  : "border-base-300 bg-base-200/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-box border-2 border-base-300 bg-base-100 font-mono text-lg font-black">
                  #{idx + 1}
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black">{row.group.name}</span>
                    {isPlayerGroup && (
                      <span className="badge badge-sm badge-neutral font-bold">
                        Your Group
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    {row.members.map((member) => (
                      <span
                        key={member}
                        className="inline-flex items-center gap-1 rounded-box border border-base-300 bg-base-100 px-2 py-0.5 text-xs font-bold"
                      >
                        <ArcadeCritterAvatar
                          name={member}
                          gameCode={gameCode}
                          sizeClassName="size-4"
                          className="border-0"
                        />
                        {member}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <span className="badge badge-outline font-mono font-bold">
                  +{row.latestSubmission.pointsEarned} pts
                </span>
                <span className="font-mono text-2xl font-black">
                  {row.totalScore.toLocaleString()} pts
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </ArcadeCard>
  );
}
