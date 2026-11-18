import GroupChip from "@/lib/components/game/GroupChip";
import type { LeaderboardRow } from "@/lib/game/mockGame";

type LeaderboardTableProps = {
  rows: LeaderboardRow[];
  markTopThree?: boolean;
  highlightGroup?: string;
};

const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardTable({
  rows,
  markTopThree = false,
  highlightGroup,
}: LeaderboardTableProps) {
  return (
    <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
      <table className="table">
        <thead>
          <tr>
            <th className="w-16">Rank</th>
            <th>Group</th>
            <th className="text-right">Points</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isTopThree = markTopThree && row.rank <= 3;
            const isHighlighted = row.group.color.name === highlightGroup;
            return (
              <tr
                key={row.group.color.name}
                className={isHighlighted ? "bg-primary/10" : isTopThree ? "bg-warning/10" : undefined}
              >
                <td className="font-bold">
                  {isTopThree ? (
                    <span aria-label={`Rank ${row.rank}`}>{MEDALS[row.rank - 1]}</span>
                  ) : (
                    row.rank
                  )}
                </td>
                <td>
                  <GroupChip color={row.group.color} />
                  {isHighlighted && <span className="badge badge-sm badge-primary ml-2">You</span>}
                </td>
                <td className="text-right font-mono font-semibold">
                  {row.totalPoints.toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
