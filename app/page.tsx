import ArcadeButton from "@/lib/components/ArcadeButton";
import ArcadeCard from "@/lib/components/ArcadeCard";

// Entry points into the game. Teammates build the screens behind these routes.
const GAME_ROUTES = {
  join: "/join",
  host: "/host",
};

export default function Game() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-base-200 px-4 py-12">
      <div className="flex w-full max-w-4xl flex-col items-center gap-10">
        <header className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-5xl font-black tracking-tight sm:text-6xl">
            Anything Else?!
          </h1>
          <p className="max-w-lg text-lg font-medium opacity-75">
            Enter a game PIN to play live with your class, or host a quiz on the big screen.
          </p>
        </header>

        <section className="grid w-full gap-6 sm:grid-cols-2">
          {/* Player Card */}
          <ArcadeCard
            accentColor="bg-primary"
            hoverLift
            bodyClassName="justify-between gap-6 p-8"
          >
            <div className="flex flex-col gap-2">
              <h2 className="card-title text-3xl font-black">Join a Game</h2>
              <p className="text-base opacity-80">
                Got a 6-digit PIN from your teacher? Type it in, pick a nickname, and jump into the lobby.
              </p>
            </div>
            <div className="card-actions">
              <ArcadeButton href={GAME_ROUTES.join} variant="primary" size="lg" block>
                Enter Game PIN
              </ArcadeButton>
            </div>
          </ArcadeCard>

          {/* Host Card */}
          <ArcadeCard
            accentColor="bg-secondary"
            hoverLift
            bodyClassName="justify-between gap-6 p-8"
          >
            <div className="flex flex-col gap-2">
              <h2 className="card-title text-3xl font-black">Host a Game</h2>
              <p className="text-base opacity-80">
                Pick a ready-to-play quiz or build your own to display on the classroom screen.
              </p>
            </div>
            <div className="card-actions">
              <ArcadeButton href={GAME_ROUTES.host} variant="secondary" size="lg" block>
                Choose a Quiz
              </ArcadeButton>
            </div>
          </ArcadeCard>
        </section>
      </div>
    </main>
  );
}
