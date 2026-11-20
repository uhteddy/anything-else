import { and, asc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { db } from "@/db";
import { gamePlayers, gameSessions, questionSet } from "@/db/schema";
import { isUuid, type LobbyPlayer } from "@/lib/game/lobby";
import { getClaims } from "@/lib/auth";
import { HostLobby } from "@/app/host/game/[gameId]/host-lobby";
import GameShell from "@/lib/components/game/GameShell";

type Params = Promise<{ gameId: string }>;

export const instant = false;

export default async function HostGameLobby({ params }: { params: Params }) {
  await connection();
  const { data: claimsData, error } = await getClaims();
  const instructorId = claimsData?.claims?.sub;

  if (error || typeof instructorId !== "string") {
    redirect("/login?next=%2Fhost");
  }

  const { gameId } = await params;
  if (!isUuid(gameId)) {
    redirect("/host");
  }

  const [game] = await db
    .select({
      id: gameSessions.id,
      pin: gameSessions.pin,
      channelToken: gameSessions.channel_token,
      title: questionSet.title,
    })
    .from(gameSessions)
    .innerJoin(
      questionSet,
      eq(questionSet.id, gameSessions.question_set_id),
    )
    .where(
      and(
        eq(gameSessions.id, gameId),
        eq(gameSessions.instructor_id, instructorId),
        eq(gameSessions.state, "LOBBY"),
      ),
    )
    .limit(1);

  if (!game) {
    redirect("/host");
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
      <HostLobby
        gameId={game.id}
        pin={game.pin}
        channelToken={game.channelToken}
        quizTitle={game.title}
        initialPlayers={players}
      />
    </GameShell>
  );
}
