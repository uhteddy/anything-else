"use server";

import { and, asc, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "@/db";
import { gamePlayers, gameSessions } from "@/db/schema";
import {
  LOBBY_COOKIES,
  isUuid,
  type LobbyPlayer,
} from "@/lib/game/lobby";

type StudentLobbyResult = {
  players?: LobbyPlayer[];
  closed?: boolean;
  error?: string;
};

export async function getStudentLobbyPlayers(): Promise<StudentLobbyResult> {
  const cookieStore = await cookies();
  const gameId = cookieStore.get(LOBBY_COOKIES.gameSessionId)?.value;
  const playerId = cookieStore.get(LOBBY_COOKIES.playerId)?.value;
  const channelToken = cookieStore.get(LOBBY_COOKIES.channelToken)?.value;

  if (!isUuid(gameId) || !isUuid(playerId) || !isUuid(channelToken)) {
    return { error: "Your lobby session has expired. Join the game again." };
  }

  const [game] = await db
    .select({ id: gameSessions.id })
    .from(gameSessions)
    .where(
      and(
        eq(gameSessions.id, gameId),
        eq(gameSessions.channel_token, channelToken),
        eq(gameSessions.state, "LOBBY"),
      ),
    )
    .limit(1);

  if (!game) {
    return { closed: true };
  }

  const [player] = await db
    .select({ id: gamePlayers.id })
    .from(gamePlayers)
    .where(
      and(
        eq(gamePlayers.id, playerId),
        eq(gamePlayers.game_session_id, gameId),
      ),
    )
    .limit(1);

  if (!player) {
    return { error: "You are no longer in this lobby. Join the game again." };
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

export async function leaveLobbyAction(): Promise<{ error?: string }> {
  const cookieStore = await cookies();
  const gameId = cookieStore.get(LOBBY_COOKIES.gameSessionId)?.value;
  const playerId = cookieStore.get(LOBBY_COOKIES.playerId)?.value;
  const channelToken = cookieStore.get(LOBBY_COOKIES.channelToken)?.value;

  // Whatever state the lobby is in, a student who asks to leave should end up
  // with no lobby cookies so the client can navigate away.
  const clearLobbyCookies = () => {
    cookieStore.delete(LOBBY_COOKIES.gameSessionId);
    cookieStore.delete(LOBBY_COOKIES.playerId);
    cookieStore.delete(LOBBY_COOKIES.channelToken);
  };

  if (!isUuid(gameId) || !isUuid(playerId) || !isUuid(channelToken)) {
    clearLobbyCookies();
    return {};
  }

  const [game] = await db
    .select({ id: gameSessions.id })
    .from(gameSessions)
    .where(
      and(
        eq(gameSessions.id, gameId),
        eq(gameSessions.channel_token, channelToken),
        eq(gameSessions.state, "LOBBY"),
      ),
    )
    .limit(1);

  // Only remove the player row while the game is still in the lobby; once it
  // has closed or started, the row is no longer ours to change.
  if (game) {
    await db
      .delete(gamePlayers)
      .where(
        and(
          eq(gamePlayers.id, playerId),
          eq(gamePlayers.game_session_id, gameId),
        ),
      );
  }

  clearLobbyCookies();
  return {};
}
