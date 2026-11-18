export type GroupColor = {
  name: string;
  hex: string;
  textHex: string;
};

export const GROUP_COLORS: GroupColor[] = [
  { name: "Red", hex: "#dc2a3f", textHex: "#ffffff" },
  { name: "Orange", hex: "#f26133", textHex: "#ffffff" },
  { name: "Yellow", hex: "#f5cb11", textHex: "#1f2937" },
  { name: "Green", hex: "#2db14f", textHex: "#ffffff" },
  { name: "Teal", hex: "#1fa3a3", textHex: "#ffffff" },
  { name: "Blue", hex: "#2f5fae", textHex: "#ffffff" },
  { name: "Purple", hex: "#7b3fa0", textHex: "#ffffff" },
  { name: "Pink", hex: "#ec6eae", textHex: "#1f2937" },
  { name: "Brown", hex: "#8b5a2b", textHex: "#ffffff" },
  { name: "Black", hex: "#1f1f1f", textHex: "#ffffff" },
  { name: "White", hex: "#f5f5f5", textHex: "#1f2937" },
  { name: "Gray", hex: "#8a8a8a", textHex: "#ffffff" },
];

export type MockGroup = {
  color: GroupColor;
  members: string[];
};

const MEMBERS = [
  ["Jordan", "Leah", "Sam"],
  ["Mia", "Owen", "Zara"],
  ["Diego", "Hana", "Liam"],
  ["Ava", "Noah", "Ivy"],
  ["Ana", "Marcus", "Priya"],
  ["Eli", "Grace", "Ravi"],
  ["Chloe", "Ben", "Sofia"],
  ["Kai", "Nora", "Theo"],
];

export const MOCK_GROUPS: MockGroup[] = MEMBERS.map((members, index) => ({
  color: GROUP_COLORS[index],
  members,
}));

export const MOCK_PLAYER = { nickname: "Ana", groupName: "Teal" };

export const MOCK_GROUP_SIZE = 3;

type RawAnswer = [answer: string | null, elapsedSeconds: number, confidence: number, accuracy: number];

export type MockQuestion = {
  number: number;
  prompt: string;
  referenceAnswer: string;
  timeLimitSeconds: number;
  answers: Record<string, RawAnswer>;
};

export const MOCK_TOTAL_QUESTIONS = 10;

export const MOCK_QUESTIONS: MockQuestion[] = [
  {
    number: 1,
    prompt: "What gas do plants absorb from the air to make food?",
    referenceAnswer: "Carbon dioxide (CO₂), which plants use in photosynthesis.",
    timeLimitSeconds: 30,
    answers: {
      Red: ["Carbon dioxide", 9, 0.97, 1],
      Orange: ["CO2", 6, 0.95, 1],
      Yellow: ["Oxygen", 12, 0.08, 0.1],
      Green: ["Carbon dioxide for photosynthesis", 14, 0.98, 1],
      Teal: ["CO2 from the air", 8, 0.96, 1],
      Blue: ["Nitrogen", 20, 0.05, 0],
      Purple: ["carbon dioxide", 25, 0.94, 1],
      Pink: [null, 30, 0, 0],
    },
  },
  {
    number: 2,
    prompt: "Why do we have seasons on Earth?",
    referenceAnswer:
      "Earth's axis is tilted, so each hemisphere gets more direct sunlight for part of the year and less for the rest.",
    timeLimitSeconds: 60,
    answers: {
      Red: ["Because Earth gets closer to the sun in summer", 22, 0.12, 0.2],
      Orange: ["The tilt of Earth's axis changes how direct the sunlight is", 18, 0.93, 0.95],
      Yellow: ["Earth is tilted", 10, 0.71, 0.6],
      Green: ["Axis tilt means sunlight hits at different angles during the year", 30, 0.95, 1],
      Teal: ["The tilt of the axis", 15, 0.74, 0.65],
      Blue: ["Earth's tilt makes one half face the sun more", 26, 0.88, 0.85],
      Purple: ["Distance from the sun", 40, 0.1, 0.1],
      Pink: ["Because of the tilt", 51, 0.68, 0.55],
    },
  },
  {
    number: 3,
    prompt: "Why does ice float on water?",
    referenceAnswer:
      "Ice is less dense than liquid water. When water freezes, hydrogen bonds lock the molecules into an open crystal structure that takes up more space.",
    timeLimitSeconds: 60,
    answers: {
      Red: ["Ice is lighter than water", 9, 0.7, 0.55],
      Orange: ["It's less dense because the frozen molecules spread out", 14, 0.9, 0.85],
      Yellow: ["Because it is cold", 33, 0.06, 0.05],
      Green: ["Ice is less dense; hydrogen bonds form an open lattice", 12, 0.97, 1],
      Teal: [
        "Ice is less dense than liquid water. When water freezes its molecules lock into an open crystal shape that takes up more space",
        16,
        0.96,
        0.95,
      ],
      Blue: ["Less dense than water", 11, 0.82, 0.7],
      Purple: ["Air bubbles trapped inside", 41, 0.15, 0.15],
      Pink: ["Frozen water expands so it is less dense", 18, 0.91, 0.85],
    },
  },
];

export const MOCK_CURRENT_QUESTION = MOCK_QUESTIONS[2];

export const MOCK_TIME_LEFT_SECONDS = 42;

export type GroupResult = {
  group: MockGroup;
  answer: string | null;
  elapsedSeconds: number | null;
  accuracy: number;
  correct: boolean;
  points: number;
};

export function scoreAnswer(accuracy: number, elapsedSeconds: number, timeLimitSeconds: number) {
  const fractionRemaining = Math.max(0, (timeLimitSeconds - elapsedSeconds) / timeLimitSeconds);
  return Math.round(1000 * accuracy * (0.5 + 0.5 * fractionRemaining));
}

export function getQuestionResults(question: MockQuestion): GroupResult[] {
  return MOCK_GROUPS.map((group) => {
    const [answer, elapsedSeconds, confidence, accuracy] = question.answers[group.color.name];
    const correct = answer !== null && confidence >= 0.65;
    return {
      group,
      answer,
      elapsedSeconds: answer === null ? null : elapsedSeconds,
      accuracy,
      correct,
      points: correct ? scoreAnswer(accuracy, elapsedSeconds, question.timeLimitSeconds) : 0,
    };
  });
}

export type LeaderboardRow = {
  rank: number;
  group: MockGroup;
  totalPoints: number;
};

export function getLeaderboard(questions: MockQuestion[] = MOCK_QUESTIONS): LeaderboardRow[] {
  const totals = MOCK_GROUPS.map((group) => ({
    group,
    totalPoints: questions.reduce(
      (sum, question) =>
        sum + (getQuestionResults(question).find((result) => result.group === group)?.points ?? 0),
      0,
    ),
  }));

  return totals
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((row, index) => ({ ...row, rank: index + 1 }));
}

export function getGroup(name: string) {
  return MOCK_GROUPS.find((group) => group.color.name === name) ?? MOCK_GROUPS[0];
}

export function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
