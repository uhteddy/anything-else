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
import GamePinCard from "@/lib/components/game/GamePinCard";
import PlayerList from "@/lib/components/game/PlayerList";
import {
  ArrowRightIcon,
  BurstIcon,
  TimerIcon,
  UsersIcon,
} from "@/lib/components/game/icons";

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
    return <LobbyClosed />;
  }

  const isLive = connectionStatus === "Live updates connected";

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:py-12">
      <section
        aria-labelledby="lobby-title"
        className="card border border-base-300 bg-base-100 shadow-soft"
      >
        <div className="card-body gap-6 px-5 py-8 sm:px-10">
          <header className="flex flex-col items-center gap-2 text-center">
            <span className="flex size-18 items-center justify-center rounded-full bg-secondary text-primary">
              <UsersIcon className="size-10" />
            </span>
            <span className="badge badge-soft badge-success mt-1 font-bold">You&apos;re in</span>
            <h1
              id="lobby-title"
              className="relative text-3xl font-black tracking-tight sm:text-4xl"
            >
              <BurstIcon className="absolute top-0 -left-10 hidden size-7 -rotate-30 text-accent sm:block" />
              Waiting for Players
              <BurstIcon className="absolute top-0 -right-10 hidden size-7 rotate-30 text-accent sm:block" />
            </h1>
            <p className="text-base-content/70">
              Share the game PIN with your friends and wait for everyone to join!
            </p>
            <p className="text-base-content/70">
              Playing as <strong className="text-base-content">{nickname}</strong>
            </p>
          </header>

          <div className="mx-auto w-full max-w-md">
            <GamePinCard pin={pin} label="Game PIN" />
          </div>

          <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr]">
            <PlayerList players={players} currentPlayerId={playerId} />
            <div className="hidden w-px bg-base-300 md:block" aria-hidden="true" />
            <aside
              aria-labelledby="waiting-title"
              className="flex flex-col items-center justify-center gap-3 rounded-box bg-base-200/70 p-6 text-center md:bg-transparent"
            >
              <span className="flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
                <TimerIcon className="size-9" />
              </span>
              <h2 id="waiting-title" className="text-xl font-extrabold">
                Waiting to Start
              </h2>
              <p className="text-base-content/70">
                The host will start the quiz when everyone is ready.
              </p>
              <p
                className="inline-flex items-center gap-2 text-sm font-semibold text-base-content/70"
                aria-live="polite"
              >
                <span
                  className={`size-2.5 rounded-full ${isLive ? "bg-success" : "animate-pulse bg-warning"}`}
                  aria-hidden="true"
                />
                {connectionStatus}
              </p>
            </aside>
          </div>
        </div>
      </section>

      {error && (
        <p className="alert alert-error alert-soft font-semibold" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
        <Link href="/play/group" className="btn btn-outline btn-primary rounded-full">
          Preview game screens (prototype)
        </Link>
        <button
          type="button"
          className="btn btn-ghost rounded-full"
          disabled={isLeaving}
          onClick={leaveLobby}
        >
          {isLeaving && (
            <span className="loading loading-spinner loading-sm" aria-hidden="true" />
          )}
          {isLeaving ? "Leaving lobby…" : "Leave lobby"}
        </button>
      </div>
    </div>
  );
}

/** Shown when the host closes the lobby (here and by the server page). */
export function LobbyClosed() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col px-4 py-12">
      <section className="card border border-base-300 bg-base-100 shadow-soft">
        <div className="card-body items-center gap-3 px-5 py-10 text-center sm:px-10">
          <span className="badge badge-outline font-bold">Lobby closed</span>
          <h1 className="text-3xl font-black tracking-tight">This lobby is no longer open</h1>
          <p className="text-base-content/70">
            Ask your host for a new game PIN to keep playing.
          </p>
          <Link href="/join" className="btn btn-game btn-lg mt-2 rounded-full">
            Join another game
            <ArrowRightIcon />
          </Link>
        </div>
      </section>
    </div>
  );
}
