"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getStudentLobbyPlayers,
  leaveLobbyAction,
} from "@/app/join/lobby/actions";
import type { LobbyPlayer } from "@/lib/game/lobby";
import {
  announceLobbyChange,
  createLobbyChannel,
} from "@/lib/game/lobby-realtime";

type Props = {
  playerId: string;
  channelToken: string;
  pin: string;
  nickname: string;
  initialPlayers: LobbyPlayer[];
};

export function StudentLobby({
  playerId,
  channelToken,
  pin,
  nickname,
  initialPlayers,
}: Props) {
  const router = useRouter();
  const channelRef = useRef<ReturnType<typeof createLobbyChannel> | null>(null);
  const [players, setPlayers] = useState(initialPlayers);
  const [connectionStatus, setConnectionStatus] = useState("Connecting…");
  const [error, setError] = useState("");
  const [isClosed, setIsClosed] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const refreshPlayers = useCallback(async () => {
    const result = await getStudentLobbyPlayers();
    if (result.closed) {
      setIsClosed(true);
      return;
    }
    if (result.error) {
      setError(result.error);
      return;
    }

    setPlayers(result.players ?? []);
    setError("");
  }, []);

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
          void announceLobbyChange(channel).catch((broadcastError: unknown) => {
            if (active) {
              setConnectionStatus("Live updates reconnecting…");
              console.error("Could not announce this lobby connection.", broadcastError);
            }
          });
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

  async function leaveLobby() {
    setIsLeaving(true);
    try {
      const result = await leaveLobbyAction();
      if (result.error) {
        setError(result.error);
        setIsLeaving(false);
        return;
      }
    } catch (leaveError) {
      setError(
        leaveError instanceof Error
          ? leaveError.message
          : "Could not leave the lobby.",
      );
      setIsLeaving(false);
      return;
    }

    if (channelRef.current) {
      try {
        await announceLobbyChange(channelRef.current);
      } catch (broadcastError) {
        console.error("Could not notify the host that a player left.", broadcastError);
      }
    }

    router.push("/join");
  }

  if (isClosed) {
    return (
      <main className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 px-4 py-12 text-center">
        <span className="badge badge-outline">Lobby closed</span>
        <h1 className="text-3xl font-bold">This lobby is no longer open</h1>
        <Link href="/join" className="btn btn-primary">
          Join another game
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:py-12">
      <header className="flex flex-col items-center gap-2 text-center">
        <span className="badge badge-soft badge-success">You&apos;re in</span>
        <h1 className="text-4xl font-bold">Waiting for the host</h1>
        <p className="text-base-content/70">{connectionStatus}</p>
      </header>

      <section className="card border border-primary/30 bg-base-100 shadow-md">
        <div className="card-body items-center gap-2 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest opacity-60">
            Game PIN
          </p>
          <p className="font-mono text-5xl font-black tracking-[0.2em]">
            {pin.slice(0, 3)} {pin.slice(3)}
          </p>
          <div className="mt-2 flex items-center gap-3 text-xl font-bold">
            <span
              className="size-4 rounded-full"
              style={{
                backgroundColor:
                  players.find((player) => player.id === playerId)?.color ??
                  "#7c3aed",
              }}
              aria-hidden="true"
            />
            {nickname}
          </div>
        </div>
      </section>

      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">
            Players <span className="badge badge-primary">{players.length}</span>
          </h2>
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
                {player.id === playerId && (
                  <span className="ml-auto badge badge-sm badge-primary">You</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {error && (
        <p className="alert alert-error" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-col items-center gap-2">
        <Link href="/play/group" className="btn btn-outline btn-primary">
          Preview game screens (prototype)
        </Link>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={isLeaving}
          onClick={leaveLobby}
        >
          {isLeaving ? "Leaving lobby…" : "Leave lobby"}
        </button>
      </div>
    </main>
  );
}
