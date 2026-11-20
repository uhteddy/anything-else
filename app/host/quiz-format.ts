// Shared by server pages (app/host/page.tsx) and the client Host Game form.
// Keep this file free of "use client" so server components can call these helpers.

/** One of the instructor's quizzes, as loaded by /host and /host/start. */
export type HostQuizOption = {
  id: string;
  title: string;
  questionCount: number;
  /** Shortest and longest question time limit; null when the quiz has no questions. */
  minTimeSeconds: number | null;
  maxTimeSeconds: number | null;
};

function formatSeconds(seconds: number) {
  if (seconds < 60) return `${seconds} seconds`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  if (rest === 0) return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  return `${minutes} min ${rest} s`;
}

/** Read-only summary of a quiz's per-question time limits. */
export function describeTimeLimit(quiz: HostQuizOption) {
  if (quiz.questionCount === 0 || quiz.minTimeSeconds === null || quiz.maxTimeSeconds === null) {
    return "No questions yet";
  }
  if (quiz.minTimeSeconds === quiz.maxTimeSeconds) {
    return formatSeconds(quiz.minTimeSeconds);
  }
  return `${formatSeconds(quiz.minTimeSeconds)} – ${formatSeconds(quiz.maxTimeSeconds)}`;
}

export function describeQuestionCount(count: number) {
  return `${count} ${count === 1 ? "question" : "questions"}`;
}
