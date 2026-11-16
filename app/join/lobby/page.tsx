import { Suspense } from "react";
import ArcadeCard from "@/lib/components/ArcadeCard";
import ArcadeCritterAvatar from "@/lib/components/ArcadeCritterAvatar";
import ArcadeLobbyBackdrop from "@/lib/components/ArcadeLobbyBackdrop";
import GameSubHeader from "@/lib/components/GameSubHeader";
import {
  MOCK_GAME_PIN,
  MOCK_LOBBY_PLAYERS,
  MOCK_NICKNAME,
} from "@/lib/game/mockData";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// Player Waiting Lobby (Prototype V1). Shows the PIN and nickname from the
// Join Game form plus placeholder players. No real multiplayer connection.
export default function WaitingLobby({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-base-200 px-4 py-6">
      <ArcadeLobbyBackdrop />

      <div className="relative z-10 flex flex-1 flex-col">
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
      <GameSubHeader
        backHref="/join"
        backLabel="← Leave"
        rightSlot={
          <div className="rounded-box border-2 border-base-300 border-b-4 bg-base-100 px-4 py-2 font-mono text-lg font-black tracking-widest">
            PIN: {pin.slice(0, 3)} {pin.slice(3)}
          </div>
        }
      />

      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center gap-8 py-8">
        {/* Centered Player Card */}
        <ArcadeCard
          className="w-full max-w-sm"
          bodyClassName="items-center gap-3 p-6 text-center"
        >
          <ArcadeCritterAvatar
            name={nickname}
            gameCode={pin}
            sizeClassName="size-24"
          />
          <h1 className="text-3xl font-black">{nickname}</h1>
          <div className="flex items-center gap-2 text-sm font-bold opacity-70">
            <span className="loading loading-sm loading-dots" />
            <span>Waiting for host to start…</span>
          </div>
        </ArcadeCard>

        {/* Players Grid */}
        <section className="w-full">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-black">Players ({playerCount})</h2>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            <li className="flex items-center gap-3 rounded-box border-2 border-primary border-b-4 bg-base-100 p-3">
              <ArcadeCritterAvatar
                name={nickname}
                gameCode={pin}
                sizeClassName="size-11"
              />
              <span className="truncate text-base font-extrabold">{nickname}</span>
            </li>
            {MOCK_LOBBY_PLAYERS.map((player) => (
              <li
                key={player.id}
                className="flex items-center gap-3 rounded-box border-2 border-base-300 border-b-4 bg-base-100 p-3"
              >
                <ArcadeCritterAvatar
                  name={player.nickname}
                  gameCode={pin}
                  sizeClassName="size-11"
                />
                <span className="truncate text-base font-bold">
                  {player.nickname}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
