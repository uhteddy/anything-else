import { Suspense } from "react";
import Link from "next/link";
import {
  MOCK_GAME_PIN,
  MOCK_LOBBY_PLAYERS,
  MOCK_NICKNAME,
  MOCK_YOUR_AVATAR,
} from "@/lib/game/mockData";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// Player Waiting Lobby (Prototype V1). Shows the PIN and nickname from the
// Join Game form plus placeholder players. No real multiplayer connection.
export default function WaitingLobby({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className="flex flex-col items-center gap-6 px-4 py-12">
      <section className="flex max-w-md flex-col items-center gap-2 text-center">
        <span className="badge badge-soft badge-success">● Connected</span>
        <h1 className="text-4xl font-bold">You&apos;re in!</h1>
        <p className="text-lg opacity-70">Look for your nickname on the host&apos;s screen.</p>
      </section>

      {/* searchParams are request-time data, so they must render inside Suspense (cacheComponents). */}
      <Suspense fallback={<span className="loading loading-lg loading-spinner" aria-label="Loading lobby" />}>
        <LobbyDetails searchParams={searchParams} />
      </Suspense>

      <Link href="/game/join" className="btn btn-ghost">
        ← Leave lobby
      </Link>
    </main>
  );
}

async function LobbyDetails({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const pinParam = typeof params.pin === "string" ? params.pin : "";
  const nameParam = typeof params.nickname === "string" ? params.nickname.trim() : "";
  const pin = /^\d{6}$/.test(pinParam) ? pinParam : MOCK_GAME_PIN;
  const nickname = nameParam.slice(0, 16) || MOCK_NICKNAME;
  const playerCount = MOCK_LOBBY_PLAYERS.length + 1;

  return (
    <>
      <div className="card w-full max-w-2xl border border-base-300 bg-base-100 shadow-md">
        <div className="card-body items-center gap-4 text-center">
          <div className="flex flex-col items-center">
            <span className="text-xs tracking-widest uppercase opacity-60">Game PIN</span>
            <span className="font-mono text-4xl font-black tracking-widest sm:text-5xl">
              {pin.slice(0, 3)} {pin.slice(3)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="flex size-12 items-center justify-center rounded-full bg-primary/15 text-3xl"
              aria-hidden="true"
            >
              {MOCK_YOUR_AVATAR}
            </span>
            <span className="text-2xl font-bold">{nickname}</span>
          </div>
          <div className="flex items-center gap-2 opacity-80">
            <span className="loading loading-md loading-dots" />
            Waiting for host to start the game…
          </div>
        </div>
      </div>

      <div className="card w-full max-w-2xl border border-base-300 bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title">
            Players <span className="badge badge-primary">{playerCount}</span>
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            <li className="flex items-center gap-3 rounded-box border border-primary bg-primary/10 p-3">
              <span className="text-2xl" aria-hidden="true">
                {MOCK_YOUR_AVATAR}
              </span>
              <span className="truncate font-semibold">{nickname}</span>
              <span className="ml-auto badge badge-sm badge-primary">You</span>
            </li>
            {MOCK_LOBBY_PLAYERS.map((player) => (
              <li
                key={player.id}
                className="flex items-center gap-3 rounded-box border border-base-300 bg-base-200 p-3"
              >
                <span className="text-2xl" aria-hidden="true">
                  {player.avatar}
                </span>
                <span className="truncate font-semibold">{player.nickname}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
