import { and, asc, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { db } from "@/db";
import { gamePlayers, gameSessions } from "@/db/schema";
import { isUuid, LOBBY_COOKIES, type LobbyPlayer } from "@/lib/game/lobby";
import { LobbyClosed, StudentLobby } from "@/app/join/lobby/student-lobby";
import GameShell from "@/lib/components/game/GameShell";

export const instant = false;

export default async function WaitingLobby() {
  await connection();
  const cookieStore = await cookies();
  const gameId = cookieStore.get(LOBBY_COOKIES.gameSessionId)?.value;
  const playerId = cookieStore.get(LOBBY_COOKIES.playerId)?.value;
  const channelToken = cookieStore.get(LOBBY_COOKIES.channelToken)?.value;

  if (!isUuid(gameId) || !isUuid(playerId) || !isUuid(channelToken)) {
    redirect("/join");
  }

  const [game] = await db
    .select({
      id: gameSessions.id,
      pin: gameSessions.pin,
      channelToken: gameSessions.channel_token,
    })
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
    return (
      <GameShell>
        <LobbyClosed />
      </GameShell>
    );
  }

  const [player] = await db
    .select({
      id: gamePlayers.id,
      nickname: gamePlayers.nickname,
    })
    .from(gamePlayers)
    .where(
      and(
        eq(gamePlayers.id, playerId),
        eq(gamePlayers.game_session_id, game.id),
      ),
    )
    .limit(1);

  if (!player) {
    redirect("/join");
  }

  const players: LobbyPlayer[] = await db
    .select({
      id: gamePlayers.id,
      nickname: gamePlayers.nickname,
      color: gamePlayers.color,
    })
    .from(gamePlayers)
    .where(eq(gamePlayers.game_session_id, game.id))
    .orderBy(asc(gamePlayers.nickname), asc(gamePlayers.created_at));

  return (
    <GameShell>
      <StudentLobby
        playerId={player.id}
        channelToken={game.channelToken}
        pin={game.pin}
        nickname={player.nickname}
        initialPlayers={players}
      />
    </GameShell>
  );
}
