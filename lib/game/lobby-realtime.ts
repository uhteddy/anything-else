"use client";

import { createClient } from "@/lib/supabase";
import { getLobbyTopic } from "@/lib/game/lobby";

export function createLobbyChannel(channelToken: string) {
  return createClient().channel(getLobbyTopic(channelToken), {
    config: {
      broadcast: { ack: true },
      private: false,
    },
  });
}

export async function announceLobbyChange(
  channel: ReturnType<typeof createLobbyChannel>,
) {
  const result = await channel.send({
    type: "broadcast",
    event: "players_changed",
    payload: {},
  });

  if (result !== "ok") {
    throw new Error(`Lobby update broadcast failed: ${result}`);
  }
}
