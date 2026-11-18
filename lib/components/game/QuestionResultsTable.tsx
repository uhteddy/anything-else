import GroupChip from "@/lib/components/game/GroupChip";
import type { GroupResult } from "@/lib/game/mockGame";

type QuestionResultsTableProps = {
  results: GroupResult[];
  showOverride?: boolean;
};

export default function QuestionResultsTable({
  results,
  showOverride = false,
}: QuestionResultsTableProps) {
  return (
    <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
      <table className="table">
        <thead>
          <tr>
            <th>Group</th>
            <th>Answer</th>
            <th>Verdict</th>
            <th className="text-right">Accuracy</th>
            <th className="text-right">Points</th>
            {showOverride && <th className="sr-only">Override</th>}
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.group.color.name}>
              <td>
                <GroupChip color={result.group.color} size="sm" />
              </td>
              <td className="min-w-48">
                {result.answer ?? <span className="italic text-base-content/50">No answer</span>}
              </td>
              <td>
                <span className={`badge badge-sm ${result.correct ? "badge-success" : "badge-error"}`}>
                  {result.correct ? "Correct" : "Incorrect"}
                </span>
              </td>
              <td className="text-right font-mono">{Math.round(result.accuracy * 100)}%</td>
              <td className="text-right font-mono font-semibold">{result.points}</td>
              {showOverride && (
                <td>
                  <button type="button" className="btn btn-ghost btn-xs">
                    Mark {result.correct ? "incorrect" : "correct"}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
