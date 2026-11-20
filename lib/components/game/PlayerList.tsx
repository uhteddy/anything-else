import type { LobbyPlayer } from "@/lib/game/lobby";

type PlayerListProps = {
  players: LobbyPlayer[];
  /** Marks this player's row with a "You" badge. */
  currentPlayerId?: string;
  emptyMessage?: string;
  headingId?: string;
};

function initialOf(nickname: string) {
  return (Array.from(nickname.trim())[0] ?? "?").toUpperCase();
}

/** "Players (N)" heading and a list of players shown as coloured initial avatars. */
export default function PlayerList({
  players,
  currentPlayerId,
  emptyMessage = "Waiting for players to join…",
  headingId = "players-heading",
}: PlayerListProps) {
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3">
      <h2 id={headingId} className="text-lg font-extrabold">
        Players{" "}
        <span className="text-base-content/60" aria-live="polite">
          ({players.length})
        </span>
      </h2>

      {players.length === 0 ? (
        <p className="rounded-box border-2 border-dashed border-base-300 px-4 py-6 text-center text-base-content/70">
          {emptyMessage}
        </p>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2">
          {players.map((player) => {
            const isYou = player.id === currentPlayerId;
            return (
              <li
                key={player.id}
                className={`flex min-w-0 items-center gap-3 rounded-box border px-3 py-2 ${
                  isYou ? "border-primary/40 bg-secondary/70" : "border-base-300 bg-base-100"
                }`}
              >
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-full text-lg font-black text-white ring-2 ring-base-100"
                  style={{ backgroundColor: player.color }}
                  aria-hidden="true"
                >
                  {initialOf(player.nickname)}
                </span>
                <span className="truncate font-bold">{player.nickname}</span>
                {isYou && (
                  <span className="ml-auto badge badge-sm badge-primary font-bold">You</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
