"use server";

import { and, asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { gamePlayers, gameSessions } from "@/db/schema";
import type { LobbyPlayer } from "@/lib/game/lobby";
import { isUuid } from "@/lib/game/lobby";
import { getClaims } from "@/lib/auth";

type HostLobbyPlayersResult = {
  players?: LobbyPlayer[];
  error?: string;
};

export async function getHostLobbyPlayers(
  gameId: string,
): Promise<HostLobbyPlayersResult> {
  if (!isUuid(gameId)) {
    return { error: "This lobby is no longer available." };
  }

  const { data: claimsData, error: claimsError } = await getClaims();
  const instructorId = claimsData?.claims?.sub;
  if (claimsError || typeof instructorId !== "string") {
    return { error: "Your session has expired. Sign in again." };
  }

  const [game] = await db
    .select({ id: gameSessions.id })
    .from(gameSessions)
    .where(
      and(
        eq(gameSessions.id, gameId),
        eq(gameSessions.instructor_id, instructorId),
        eq(gameSessions.state, "LOBBY"),
      ),
    )
    .limit(1);

  if (!game) {
    return { error: "This lobby has been closed." };
  }

  const players = await db
    .select({
      id: gamePlayers.id,
      nickname: gamePlayers.nickname,
      color: gamePlayers.color,
    })
    .from(gamePlayers)
    .where(eq(gamePlayers.game_session_id, game.id))
    .orderBy(asc(gamePlayers.nickname), asc(gamePlayers.created_at));

  return { players };
}

export async function closeLobbyAction(
  gameId: string,
): Promise<{ error?: string }> {
  if (!isUuid(gameId)) {
    return { error: "This lobby is no longer available." };
  }

  const { data: claimsData, error: claimsError } = await getClaims();
  const instructorId = claimsData?.claims?.sub;
  if (claimsError || typeof instructorId !== "string") {
    return { error: "Your session has expired. Sign in again." };
  }

  const [closedGame] = await db
    .delete(gameSessions)
    .where(
      and(
        eq(gameSessions.id, gameId),
        eq(gameSessions.instructor_id, instructorId),
        eq(gameSessions.state, "LOBBY"),
      ),
    )
    .returning({ id: gameSessions.id });

  if (!closedGame) {
    return { error: "This lobby has already been closed." };
  }

  revalidatePath("/host");
  return {};
}
