import Link from "next/link";

// Entry points into the game. Teammates build the screens behind these routes.
const GAME_ROUTES = {
  join: "/join",
  host: "/host",
};

export default function Game() {
  return (
    <main className="flex flex-col items-center gap-8 px-4 py-12">
      <section className="flex max-w-2xl flex-col items-center gap-3 text-center">
        <h1 className="text-4xl font-bold">Play Now</h1>
        <p className="text-lg opacity-70">
          A live classroom quiz. Join a game from your device, or host one for your class.
        </p>
      </section>

      <section className="grid w-full max-w-3xl gap-6 sm:grid-cols-2">
        <div className="card border border-base-300 bg-base-100 shadow-md">
          <div className="card-body items-center text-center">
            <h2 className="card-title text-2xl">Join Game</h2>
            <p className="opacity-70">Have a game PIN? Enter it and pick a nickname to play.</p>
            <div className="card-actions mt-2">
              <Link href={GAME_ROUTES.join} className="btn btn-primary">
                Join Game
              </Link>
            </div>
          </div>
        </div>

        <div className="card border border-base-300 bg-base-100 shadow-md">
          <div className="card-body items-center text-center">
            <h2 className="card-title text-2xl">Host Game</h2>
            <p className="opacity-70">Choose a quiz, open a lobby, and run the game for your class.</p>
            <div className="card-actions mt-2">
              <Link href={GAME_ROUTES.host} className="btn btn-secondary">
                Host Game
              </Link>
            </div>
          </div>
        </div>

      </section>
        <div className="flex flex-col text-center">
          <a href="/project/">Click here to learn more about the project!</a>
        </div>
    </main>
  );
}
