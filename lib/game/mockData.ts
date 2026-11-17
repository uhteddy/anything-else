// Mock data for the game lobby, student flow, and host dashboard.

export type LobbyPlayer = {
  id: string;
  nickname: string;
};

export type QuizSummary = {
  id: string;
  title: string;
  description: string;
  questionCount: number;
};

export type GroupColorKey = "blue" | "red" | "green" | "yellow";

export type ColorGroup = {
  id: GroupColorKey;
  name: string;
  solidBgClass: string;
  bgClass: string;
  borderClass: string;
  badgeClass: string;
  accentBar: "bg-primary" | "bg-secondary" | "bg-accent" | "bg-info";
  members: string[];
};

export type GroupSubmission = {
  groupId: GroupColorKey;
  submittedBy: string;
  answer: string;
  verdict: "Full Credit" | "Partial Credit";
  pointsEarned: number;
};

export type MockQuestionRound = {
  number: number;
  prompt: string;
  timeLimitSeconds: number;
  referenceAnswer: string;
  submissions: GroupSubmission[];
};

/** Shown in the lobby if it is opened without a PIN in the URL. */
export const MOCK_GAME_PIN = "482913";

/** Shown in the lobby if it is opened without a nickname in the URL. */
export const MOCK_NICKNAME = "Player";

/** Other players already waiting in the lobby. */
export const MOCK_LOBBY_PLAYERS: LobbyPlayer[] = [
  { id: "p1", nickname: "ByteRider" },
  { id: "p2", nickname: "NullPointer" },
  { id: "p3", nickname: "Quizzard" },
  { id: "p4", nickname: "StackSmash" },
  { id: "p5", nickname: "LambdaLlama" },
  { id: "p6", nickname: "GitGud" },
  { id: "p7", nickname: "PixelPanda" },
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

/** Color-coded student groups (player is placed into Blue Group). */
export const MOCK_COLOR_GROUPS: ColorGroup[] = [
  {
    id: "blue",
    name: "Blue Group",
    solidBgClass: "bg-sky-500 text-white",
    bgClass: "bg-sky-500/15",
    borderClass: "border-sky-500",
    badgeClass: "bg-sky-500 text-white border-sky-600",
    accentBar: "bg-info",
    members: ["ByteRider", "Quizzard"],
  },
  {
    id: "red",
    name: "Red Group",
    solidBgClass: "bg-rose-500 text-white",
    bgClass: "bg-rose-500/15",
    borderClass: "border-rose-500",
    badgeClass: "bg-rose-500 text-white border-rose-600",
    accentBar: "bg-secondary",
    members: ["NullPointer", "StackSmash"],
  },
  {
    id: "green",
    name: "Green Group",
    solidBgClass: "bg-emerald-500 text-white",
    bgClass: "bg-emerald-500/15",
    borderClass: "border-emerald-500",
    badgeClass: "bg-emerald-500 text-white border-emerald-600",
    accentBar: "bg-accent",
    members: ["LambdaLlama", "GitGud"],
  },
  {
    id: "yellow",
    name: "Yellow Group",
    solidBgClass: "bg-amber-400 text-slate-950",
    bgClass: "bg-amber-400/20",
    borderClass: "border-amber-500",
    badgeClass: "bg-amber-400 text-slate-950 border-amber-500",
    accentBar: "bg-primary",
    members: ["PixelPanda"],
  },
];

/** Simulated multi-question open-response rounds. */
export const MOCK_QUESTION_ROUNDS: MockQuestionRound[] = [
  {
    number: 1,
    prompt: "Why do plants need sunlight to survive? Explain what they make with it.",
    timeLimitSeconds: 45,
    referenceAnswer:
      "Plants use sunlight for photosynthesis to convert water and carbon dioxide into glucose (sugar/food) and oxygen.",
    submissions: [
      {
        groupId: "blue",
        submittedBy: "You",
        answer: "They use sunlight for photosynthesis to turn water and CO2 into sugar for energy.",
        verdict: "Full Credit",
        pointsEarned: 950,
      },
      {
        groupId: "red",
        submittedBy: "NullPointer",
        answer: "To make food through photosynthesis and release oxygen.",
        verdict: "Full Credit",
        pointsEarned: 900,
      },
      {
        groupId: "green",
        submittedBy: "LambdaLlama",
        answer: "Sunlight keeps the leaves warm and helps them grow tall.",
        verdict: "Partial Credit",
        pointsEarned: 450,
      },
      {
        groupId: "yellow",
        submittedBy: "PixelPanda",
        answer: "It gives them energy to make their own food in their leaves.",
        verdict: "Partial Credit",
        pointsEarned: 750,
      },
    ],
  },
  {
    number: 2,
    prompt: "What causes the phases of the Moon as seen from Earth?",
    timeLimitSeconds: 45,
    referenceAnswer:
      "As the Moon orbits Earth, we see different fractions of its sunlit half depending on the angles between the Sun, Earth, and Moon.",
    submissions: [
      {
        groupId: "blue",
        submittedBy: "ByteRider",
        answer: "The Moon orbits Earth so we see different angles of the side lit up by the Sun.",
        verdict: "Full Credit",
        pointsEarned: 920,
      },
      {
        groupId: "red",
        submittedBy: "StackSmash",
        answer: "Earth's shadow blocks different parts of the Moon each night.",
        verdict: "Partial Credit",
        pointsEarned: 300,
      },
      {
        groupId: "green",
        submittedBy: "GitGud",
        answer: "Sunlight hits the Moon while it revolves around Earth, changing how much lit side we see.",
        verdict: "Full Credit",
        pointsEarned: 880,
      },
      {
        groupId: "yellow",
        submittedBy: "PixelPanda",
        answer: "The Moon moves around Earth and reflects sunlight at different angles.",
        verdict: "Full Credit",
        pointsEarned: 850,
      },
    ],
  },
  {
    number: 3,
    prompt: "How does a solid change into a liquid when heated at the particle level?",
    timeLimitSeconds: 45,
    referenceAnswer:
      "Adding heat increases particle kinetic energy so particles vibrate faster, overcome their fixed bonds, and slide past one another.",
    submissions: [
      {
        groupId: "blue",
        submittedBy: "You",
        answer: "Heat makes the particles vibrate faster until they break out of their fixed positions and slide around.",
        verdict: "Full Credit",
        pointsEarned: 980,
      },
      {
        groupId: "red",
        submittedBy: "NullPointer",
        answer: "The atoms speed up from the heat and start moving freely instead of staying locked in place.",
        verdict: "Full Credit",
        pointsEarned: 910,
      },
      {
        groupId: "green",
        submittedBy: "LambdaLlama",
        answer: "The ice melts because it gets warmer than 0 degrees.",
        verdict: "Partial Credit",
        pointsEarned: 400,
      },
      {
        groupId: "yellow",
        submittedBy: "PixelPanda",
        answer: "Particles gain energy and move further apart so they can flow.",
        verdict: "Partial Credit",
        pointsEarned: 800,
      },
    ],
  },
];

/** Helper to compute cumulative group standings up through `upToQuestionIndex` (inclusive, 0-based). */
export function getGroupLeaderboard(
  upToQuestionIndex: number,
  playerNickname: string,
) {
  const rounds = MOCK_QUESTION_ROUNDS.slice(0, upToQuestionIndex + 1);
  const latestRound = MOCK_QUESTION_ROUNDS[upToQuestionIndex] ?? MOCK_QUESTION_ROUNDS[0];

  const rows = MOCK_COLOR_GROUPS.map((group) => {
    const members =
      group.id === "blue" ? [playerNickname, ...group.members] : group.members;

    const totalScore = rounds.reduce((sum, r) => {
      const sub = r.submissions.find((s) => s.groupId === group.id);
      return sum + (sub?.pointsEarned ?? 0);
    }, 0);

    const latestSubmission = latestRound.submissions.find(
      (s) => s.groupId === group.id,
    )!;

    return {
      group,
      members,
      totalScore,
      latestSubmission,
    };
  });

  return rows.sort((a, b) => b.totalScore - a.totalScore);
}
