import Link from "next/link";
import StudentGroupHeader from "@/lib/components/game/StudentGroupHeader";
import {
  getGroup,
  getQuestionResults,
  MOCK_CURRENT_QUESTION,
  MOCK_PLAYER,
  MOCK_TOTAL_QUESTIONS,
} from "@/lib/game/mockGame";

export default function StudentResult() {
  const group = getGroup(MOCK_PLAYER.groupName);
  const question = MOCK_CURRENT_QUESTION;
  const result = getQuestionResults(question).find((entry) => entry.group === group);

  return (
    <div className="flex min-h-dvh flex-col">
      <StudentGroupHeader group={group} />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center gap-5 px-4 py-8 text-center">
        <p className="font-semibold text-base-content/70">
          Question {question.number} of {MOCK_TOTAL_QUESTIONS} · Closed
        </p>
        <span
          className={`badge badge-lg ${result?.correct ? "badge-success" : "badge-error"} px-6 py-4 text-2xl font-bold`}
        >
          {result?.correct ? "✓ Correct" : "✗ Incorrect"}
        </span>
        <p className="text-6xl font-black">+{result?.points ?? 0}</p>
        <p className="text-base-content/70">points for {group.color.name}</p>
        {result?.answer && (
          <div className="w-full rounded-box border border-base-300 bg-base-100 p-4 text-left">
            <p className="text-sm font-semibold text-base-content/70">Your group&apos;s answer</p>
            <p>{result.answer}</p>
          </div>
        )}
        <Link href="/play/leaderboard" className="btn btn-primary mt-auto w-full">
          See standings →
        </Link>
      </main>
    </div>
  );
}
