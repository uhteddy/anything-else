"use server";

import { randomInt } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { gamePlayers, gameSessions, questionSet } from "@/db/schema";
import {
  LOBBY_COOKIES,
  LOBBY_PLAYER_COLORS,
} from "@/lib/game/lobby";

export type JoinGameActionState = {
  error?: string;
};

export async function joinGameAction(
  _previousState: JoinGameActionState,
  formData: FormData,
): Promise<JoinGameActionState> {
  const pinValue = formData.get("pin");
  const nicknameValue = formData.get("nickname");

  if (typeof pinValue !== "string" || !/^\d{6}$/.test(pinValue)) {
    return { error: "Enter a valid 6-digit game PIN." };
  }
  if (typeof nicknameValue !== "string") {
    return { error: "Enter a nickname to join the game." };
  }

  const nickname = nicknameValue.trim();
  if (
    !nickname ||
    nickname.length > 16 ||
    /[\u0000-\u001f\u007f]/.test(nickname)
  ) {
    return { error: "Choose a nickname of 1 to 16 characters." };
  }

  const [game] = await db
    .select({
      id: gameSessions.id,
      channelToken: gameSessions.channel_token,
    })
    .from(gameSessions)
    .innerJoin(
      questionSet,
      eq(questionSet.id, gameSessions.question_set_id),
    )
    .where(and(eq(gameSessions.pin, pinValue), eq(gameSessions.state, "LOBBY")))
    .limit(1);

  if (!game) {
    return { error: "No open lobby was found for that PIN." };
  }

  const [player] = await db
    .insert(gamePlayers)
    .values({
      game_session_id: game.id,
      nickname,
      color: LOBBY_PLAYER_COLORS[randomInt(LOBBY_PLAYER_COLORS.length)],
    })
    .onConflictDoNothing({
      target: [gamePlayers.game_session_id, gamePlayers.nickname],
    })
    .returning({
      id: gamePlayers.id,
      nickname: gamePlayers.nickname,
      color: gamePlayers.color,
    });

  if (!player) {
    return { error: "That nickname is already being used in this lobby." };
  }

  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 8,
  };
  cookieStore.set(LOBBY_COOKIES.gameSessionId, game.id, cookieOptions);
  cookieStore.set(LOBBY_COOKIES.playerId, player.id, cookieOptions);
  cookieStore.set(LOBBY_COOKIES.channelToken, game.channelToken, cookieOptions);

  redirect("/join/lobby");
}
