import ArcadeButton from "@/lib/components/ArcadeButton";
import ArcadeCard from "@/lib/components/ArcadeCard";
import GameSubHeader from "@/lib/components/GameSubHeader";
import { MOCK_QUIZZES } from "@/lib/game/mockData";

const QUIZ_ACCENT_BARS = [
  "bg-primary",
  "bg-secondary",
  "bg-accent",
  "bg-info",
] as const;

// Host Game dashboard (Prototype V1). Create Quiz and Start Game lead to
// placeholder screens that teammates will replace.
export default function HostGame() {
  return (
    <main className="flex min-h-screen flex-col bg-base-200 px-4 py-6">
      <GameSubHeader
        backHref="/"
        rightSlot={
          <ArcadeButton href="/host/create" variant="secondary">
            + Create Quiz
          </ArcadeButton>
        }
      />

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 py-8">
        <section className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Host a Game
          </h1>
          <p className="text-lg font-medium opacity-75">
            Select a quiz below to open a lobby for your class.
          </p>
        </section>

        <section className="grid w-full gap-6 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_QUIZZES.map((quiz, index) => {
            const barColor = QUIZ_ACCENT_BARS[index % QUIZ_ACCENT_BARS.length];
            return (
              <ArcadeCard
                key={quiz.id}
                accentColor={barColor}
                accentSize="sm"
                hoverLift
                bodyClassName="justify-between gap-6 p-6"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="card-title text-2xl font-black">
                      {quiz.title}
                    </h2>
                    <span className="badge badge-neutral font-bold">
                      {quiz.questionCount} Qs
                    </span>
                  </div>
                  <p className="text-base opacity-75">{quiz.description}</p>
                </div>

                <div className="card-actions justify-end">
                  <ArcadeButton href="/host/start" variant="primary" block>
                    Start Game
                  </ArcadeButton>
                </div>
              </ArcadeCard>
            );
          })}
        </section>
      </div>
    </main>
  );
}
