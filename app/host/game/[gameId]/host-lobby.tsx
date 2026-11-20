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
import GamePinCard from "@/lib/components/game/GamePinCard";
import PlayerList from "@/lib/components/game/PlayerList";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CrownIcon,
  UsersIcon,
} from "@/lib/components/game/icons";

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

  const isLive = connectionStatus === "Live updates connected";

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:py-12">
      <Link
        href="/host"
        className="inline-flex w-fit items-center gap-2 rounded-field font-bold text-base-content/80 transition-colors hover:text-primary focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/40"
      >
        <ArrowLeftIcon />
        Back to Host a Game
      </Link>

      <section
        aria-labelledby="host-lobby-title"
        className="card border border-base-300 bg-base-100 shadow-soft"
      >
        <div className="card-body gap-6 px-5 py-8 sm:px-10">
          <header className="flex flex-col items-center gap-2 text-center">
            <span className="flex size-18 items-center justify-center rounded-full bg-secondary text-accent">
              <CrownIcon className="size-10" />
            </span>
            <p className="mt-1 text-sm font-bold tracking-wide text-primary uppercase">
              Waiting room
            </p>
            <h1
              id="host-lobby-title"
              className="text-3xl font-black tracking-tight wrap-break-word sm:text-4xl"
            >
              {quizTitle}
            </h1>
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
          </header>

          <div className="mx-auto flex w-full max-w-xl flex-col gap-1">
            <GamePinCard pin={pin} label="Students join at /join with this PIN" size="lg" />
            <p className="text-center text-base-content/70">
              Keep this page open while students join.
            </p>
          </div>

          <PlayerList players={players} emptyMessage="Waiting for students to join…" />
        </div>
      </section>

      {error && (
        <p className="alert alert-error alert-soft font-semibold" role="alert">
          {error}
        </p>
      )}

      <section
        aria-labelledby="groups-title"
        className="card border border-base-300 bg-base-100 shadow-soft"
      >
        <div className="card-body gap-4 px-5 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-10">
          <div className="flex flex-col gap-1">
            <h2 id="groups-title" className="text-lg font-extrabold">
              Groups
            </h2>
            <fieldset className="fieldset">
              <label
                htmlFor="group-size"
                className="fieldset-legend flex items-center gap-2 text-base font-bold"
              >
                <UsersIcon className="size-5 text-primary" />
                Students per group
              </label>
              <select
                id="group-size"
                className="select w-44 rounded-field border-2 border-base-300 font-semibold focus:border-primary"
                value={groupSize}
                onChange={(event) => setGroupSize(Number(event.target.value))}
              >
                {[2, 3, 4, 5, 6].map((size) => (
                  <option key={size} value={size}>
                    {size} students
                  </option>
                ))}
              </select>
              <p className="text-sm text-base-content/60">
                {players.length > 0
                  ? `About ${Math.ceil(players.length / groupSize)} groups for ${players.length} students.`
                  : "Groups are formed once students have joined."}
              </p>
            </fieldset>
          </div>
          <Link href={`/host/game/${gameId}/groups`} className="btn btn-game btn-lg rounded-full">
            Assign groups
            <ArrowRightIcon />
          </Link>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          className="btn btn-outline btn-error rounded-full"
          disabled={isClosing}
          onClick={closeLobby}
        >
          {isClosing && (
            <span className="loading loading-spinner loading-sm" aria-hidden="true" />
          )}
          {isClosing ? "Closing lobby…" : "Close lobby"}
        </button>
      </div>
    </div>
  );
}
