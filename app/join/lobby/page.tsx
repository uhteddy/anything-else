import { Suspense } from "react";
import StudentGameSession from "@/lib/components/StudentGameSession";
import { MOCK_GAME_PIN, MOCK_NICKNAME } from "@/lib/game/mockData";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// Player Waiting Lobby & Simulated Student Game Loop (Prototype V1).
export default function WaitingLobby({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className="min-h-screen bg-base-200">
      {/* searchParams are request-time data, so they must render inside Suspense (cacheComponents). */}
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <span className="loading loading-lg loading-spinner" aria-label="Loading lobby" />
          </div>
        }
      >
        <LobbyLoader searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function LobbyLoader({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const pinParam = typeof params.pin === "string" ? params.pin : "";
  const nameParam = typeof params.nickname === "string" ? params.nickname.trim() : "";
  const pin = /^\d{6}$/.test(pinParam) ? pinParam : MOCK_GAME_PIN;
  const nickname = nameParam.slice(0, 16) || MOCK_NICKNAME;

  return <StudentGameSession pin={pin} nickname={nickname} />;
}
