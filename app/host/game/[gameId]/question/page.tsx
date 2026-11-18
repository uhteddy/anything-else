import Link from "next/link";
import TimerBadge from "@/lib/components/game/TimerBadge";
import {
  MOCK_CURRENT_QUESTION,
  MOCK_GROUPS,
  MOCK_TIME_LEFT_SECONDS,
  MOCK_TOTAL_QUESTIONS,
} from "@/lib/game/mockGame";

type Params = Promise<{ gameId: string }>;

export const instant = false;

export default async function HostQuestion({ params }: { params: Params }) {
  const { gameId } = await params;
  const question = MOCK_CURRENT_QUESTION;
  const elapsed = question.timeLimitSeconds - MOCK_TIME_LEFT_SECONDS;
  const answered = MOCK_GROUPS.map((group) => ({
    group,
    hasAnswered: question.answers[group.color.name][1] <= elapsed,
  }));
  const answeredCount = answered.filter((entry) => entry.hasAnswered).length;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:py-12">
      <header className="flex items-center justify-between gap-4">
        <p className="text-lg font-semibold text-base-content/70">
          Question {question.number} of {MOCK_TOTAL_QUESTIONS}
        </p>
        <TimerBadge secondsLeft={MOCK_TIME_LEFT_SECONDS} large />
      </header>

      <section className="flex flex-col gap-3">
        <h1 className="text-4xl font-bold sm:text-5xl">{question.prompt}</h1>
        <p className="text-base-content/70">
          Answer in your own words. Explain the reason, not just the fact.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">
            {answeredCount} of {MOCK_GROUPS.length} groups have answered
          </h2>
          <Link href={`/host/game/${gameId}/results`} className="btn btn-outline">
            Close question early
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {answered.map(({ group, hasAnswered }) => (
            <li
              key={group.color.name}
              className={`flex flex-col items-center gap-2 rounded-box border-2 bg-base-100 p-4 ${
                hasAnswered ? "border-base-content/40" : "border-dashed border-base-300"
              }`}
            >
              <span
                className="size-10 rounded-full"
                style={{ backgroundColor: group.color.hex }}
                aria-hidden="true"
              />
              <span className="font-semibold">{group.color.name}</span>
              <span className={hasAnswered ? "text-sm text-success" : "text-sm text-base-content/60"}>
                {hasAnswered ? "✓ Answered" : "Thinking…"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex justify-end">
        <Link href={`/host/game/${gameId}/results`} className="btn btn-primary">
          Show results →
        </Link>
      </div>
    </main>
  );
}
