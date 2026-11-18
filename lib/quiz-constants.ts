export const MAX_QUESTIONS = 50;
export const MAX_QUIZ_TITLE_LENGTH = 100;
export const MAX_PROMPT_LENGTH = 2_000;
export const MAX_REFERENCE_ANSWER_LENGTH = 5_000;
export const MIN_TIME_LIMIT_SECONDS = 30;
export const MAX_TIME_LIMIT_SECONDS = 300;
export const MAX_IMAGE_SIZE_BYTES = 25 * 1024 * 1024;
export const MAX_TOTAL_IMAGE_SIZE_BYTES = 25 * 1024 * 1024;

export const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
} as const;

export const QUIZ_IMAGE_BUCKET = "question-images";
