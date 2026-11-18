export const LOBBY_COOKIES = {
  gameSessionId: "ae-lobby-game",
  playerId: "ae-lobby-player",
  channelToken: "ae-lobby-channel",
} as const;

export const LOBBY_PLAYER_COLORS = [
  "#7c3aed",
  "#2563eb",
  "#059669",
  "#ea580c",
  "#db2777",
  "#0891b2",
] as const;

export type LobbyPlayer = {
  id: string;
  nickname: string;
  color: string;
};

export function isUuid(value: string | undefined): value is string {
  return Boolean(
    value &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        value,
      ),
  );
}

export function getLobbyTopic(channelToken: string) {
  return `game-lobby:${channelToken}`;
}
