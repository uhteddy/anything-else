// Mock data for the game lobby and host dashboard.

export type LobbyPlayer = {
  id: string;
  nickname: string;
  avatar: string;
};

export type QuizSummary = {
  id: string;
  title: string;
  description: string;
  questionCount: number;
};

/** Shown in the lobby if it is opened without a PIN in the URL. */
export const MOCK_GAME_PIN = "482913";

/** Shown in the lobby if it is opened without a nickname in the URL. */
export const MOCK_NICKNAME = "Player";

/** Avatar for the player viewing the lobby. */
export const MOCK_YOUR_AVATAR = "⭐";

/** Other players already waiting in the lobby. */
export const MOCK_LOBBY_PLAYERS: LobbyPlayer[] = [
  { id: "p1", nickname: "ByteRider", avatar: "🦊" },
  { id: "p2", nickname: "NullPointer", avatar: "🐙" },
  { id: "p3", nickname: "Quizzard", avatar: "🦉" },
  { id: "p4", nickname: "StackSmash", avatar: "🐢" },
  { id: "p5", nickname: "LambdaLlama", avatar: "🦙" },
  { id: "p6", nickname: "GitGud", avatar: "🐧" },
];

/** Quizzes shown on the host dashboard. */
export const MOCK_QUIZZES: QuizSummary[] = [
  {
    id: "se-basics",
    title: "Animal",
    description: "Guess the animal by its picture.",
    questionCount: 10,
  },
  {
    id: "agile-scrum",
    title: "History",
    description: "World History from the 20th century to present day.",
    questionCount: 8,
  },
  {
    id: "testing",
    title: "Country Flags",
    description: "Identify countries by their flags.",
    questionCount: 6,
  },
];
