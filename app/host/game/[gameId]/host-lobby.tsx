"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  closeLobbyAction,
  getHostLobbyPlayers,
} from "@/app/host/game/actions";
import type { LobbyPlayer } from "@/lib/game/lobby";
import {
  announceLobbyChange,
  createLobbyChannel,
} from "@/lib/game/lobby-realtime";

type Props = {
  gameId: string;
  pin: string;
  channelToken: string;
  quizTitle: string;
  initialPlayers: LobbyPlayer[];
};

export function HostLobby({
  gameId,
  pin,
  channelToken,
  quizTitle,
  initialPlayers,
}: Props) {
  const router = useRouter();
  const channelRef = useRef<ReturnType<typeof createLobbyChannel> | null>(null);
  const [players, setPlayers] = useState(initialPlayers);
  const [connectionStatus, setConnectionStatus] = useState("Connecting…");
  const [error, setError] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [groupSize, setGroupSize] = useState(3);

  const refreshPlayers = useCallback(async () => {
    const result = await getHostLobbyPlayers(gameId);
    if (result.error) {
      setError(result.error);
      return;
    }

    setPlayers(result.players ?? []);
    setError("");
  }, [gameId]);

  useEffect(() => {
    let active = true;
    const channel = createLobbyChannel(channelToken);
    channelRef.current = channel;

    const refresh = () => {
      void refreshPlayers().catch((refreshError: unknown) => {
        if (active) {
          setError(
            refreshError instanceof Error
              ? refreshError.message
              : "Could not refresh the lobby.",
          );
        }
      });
    };

    channel
      .on("broadcast", { event: "players_changed" }, refresh)
      .subscribe((status) => {
        if (!active) return;
        if (status === "SUBSCRIBED") {
          setConnectionStatus("Live updates connected");
          refresh();
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          setConnectionStatus("Live updates reconnecting…");
        }
      });

    const fallbackRefresh = window.setInterval(refresh, 5_000);
    return () => {
      active = false;
      window.clearInterval(fallbackRefresh);
      channelRef.current = null;
      void channel.unsubscribe();
    };
  }, [channelToken, refreshPlayers]);

  async function closeLobby() {
    setIsClosing(true);
    try {
      const result = await closeLobbyAction(gameId);
      if (result.error) {
        setError(result.error);
        setIsClosing(false);
        return;
      }
    } catch (closeError) {
      setError(
        closeError instanceof Error
          ? closeError.message
          : "Could not close the lobby.",
      );
      setIsClosing(false);
      return;
    }

    if (channelRef.current) {
      try {
        await announceLobbyChange(channelRef.current);
      } catch (broadcastError) {
        console.error("Could not notify students that the lobby closed.", broadcastError);
      }
    }

    router.push("/host");
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:py-12">
      <header className="flex flex-col gap-3 text-center">
        <Link href="/host" className="link link-hover mx-auto w-fit text-sm">
          ← Back to Host a Game
        </Link>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Waiting room
        </p>
        <h1 className="text-4xl font-bold">{quizTitle}</h1>
        <p className="text-base-content/70">{connectionStatus}</p>
      </header>

      <section className="card border border-primary/30 bg-base-100 shadow-md">
        <div className="card-body items-center gap-2 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest opacity-60">
            Students join at /join with this PIN
          </p>
          <p className="font-mono text-5xl font-black tracking-[0.2em] sm:text-6xl">
            {pin.slice(0, 3)} {pin.slice(3)}
          </p>
          <p className="text-base-content/70">
            Keep this page open while students join.
          </p>
        </div>
      </section>

      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">
            Players <span className="badge badge-primary">{players.length}</span>
          </h2>
          {players.length === 0 ? (
            <p className="py-4 text-base-content/70">
              Waiting for students to join…
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {players.map((player) => (
                <li
                  key={player.id}
                  className="flex items-center gap-3 rounded-box border border-base-300 bg-base-200 p-3"
                >
                  <span
                    className="size-4 shrink-0 rounded-full"
                    style={{ backgroundColor: player.color }}
                    aria-hidden="true"
                  />
                  <span className="truncate font-semibold">{player.nickname}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {error && (
        <p className="alert alert-error" role="alert">
          {error}
        </p>
      )}

      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-4 sm:flex-row sm:items-end sm:justify-between">
          <fieldset className="fieldset">
            <label htmlFor="group-size" className="fieldset-legend">
              Students per group
            </label>
            <select
              id="group-size"
              className="select select-bordered w-40"
              value={groupSize}
              onChange={(event) => setGroupSize(Number(event.target.value))}
            >
              {[2, 3, 4, 5, 6].map((size) => (
                <option key={size} value={size}>
                  {size} students
                </option>
              ))}
            </select>
            <p className="label">
              {players.length > 0
                ? `About ${Math.ceil(players.length / groupSize)} groups for ${players.length} students.`
                : "Groups are formed once students have joined."}
            </p>
          </fieldset>
          <Link href={`/host/game/${gameId}/groups`} className="btn btn-primary">
            Assign groups →
          </Link>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          className="btn btn-outline btn-error"
          disabled={isClosing}
          onClick={closeLobby}
        >
          {isClosing ? "Closing lobby…" : "Close lobby"}
        </button>
      </div>
    </main>
  );
}
