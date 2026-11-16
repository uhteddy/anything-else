import { Suspense } from "react";
import ArcadeCard from "@/lib/components/ArcadeCard";
import ArcadeLobbyBackdrop from "@/lib/components/ArcadeLobbyBackdrop";
import GameSubHeader from "@/lib/components/GameSubHeader";
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
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-base-200 px-4 py-6">
      <ArcadeLobbyBackdrop />

      <div className="relative z-10 flex flex-1 flex-col">
        <GameSubHeader backHref="/join" backLabel="← Leave Game" />

        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center gap-8 py-8">
          {/* searchParams are request-time data, so they must render inside Suspense (cacheComponents). */}
          <Suspense
            fallback={
              <div className="flex flex-1 items-center justify-center">
                <span className="loading loading-lg loading-spinner" aria-label="Loading lobby" />
              </div>
            }
          >
            <LobbyDetails searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
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
      {/* Top PIN + Player Identity Banner */}
      <ArcadeCard
        accentColor="bg-primary"
        accentSize="sm"
        className="w-full"
        bodyClassName="items-center gap-6 p-6 text-center sm:flex-row sm:justify-between sm:p-8 sm:text-left"
      >
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest opacity-60">
            Game PIN
          </p>
          <p className="font-mono text-4xl font-black tracking-widest sm:text-5xl">
            {pin.slice(0, 3)} {pin.slice(3)}
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-box border-2 border-primary bg-primary/10 px-5 py-3">
          <span className="animate-bounce text-3xl" aria-hidden="true">
            {MOCK_YOUR_AVATAR}
          </span>
          <div className="text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              You&apos;re in as
            </p>
            <p className="text-2xl font-black">{nickname}</p>
          </div>
        </div>
      </ArcadeCard>

      {/* Waiting Status Pill */}
      <div className="flex items-center gap-3 rounded-box border-2 border-base-300 border-b-4 bg-base-100 px-6 py-3 text-center">
        <span className="loading loading-md loading-dots text-primary" />
        <p className="text-lg font-extrabold sm:text-xl">
          Waiting for host to start the game…
        </p>
      </div>

      {/* Players Grid */}
      <section className="w-full">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black">Players in Lobby</h2>
          <span className="badge badge-lg badge-neutral font-extrabold">
            {playerCount}
          </span>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          <li className="flex items-center gap-3 rounded-box border-2 border-primary border-b-4 bg-base-100 p-4 transition-transform duration-150 hover:-translate-y-1">
            <span className="text-2xl" aria-hidden="true">
              {MOCK_YOUR_AVATAR}
            </span>
            <span className="truncate text-lg font-extrabold">{nickname}</span>
            <span className="ml-auto badge badge-sm badge-primary font-bold">
              You
            </span>
          </li>
          {MOCK_LOBBY_PLAYERS.map((player) => (
            <li
              key={player.id}
              className="flex items-center gap-3 rounded-box border-2 border-base-300 border-b-4 bg-base-100 p-4 transition-transform duration-150 hover:-translate-y-1"
            >
              <span className="text-2xl" aria-hidden="true">
                {player.avatar}
              </span>
              <span className="truncate text-lg font-bold">
                {player.nickname}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
