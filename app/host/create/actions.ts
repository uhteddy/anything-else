"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { questionSet, questions } from "@/db/schema";
import {
  IMAGE_EXTENSIONS,
  MAX_IMAGE_SIZE_BYTES,
  MAX_PROMPT_LENGTH,
  MAX_QUESTIONS,
  MAX_QUIZ_TITLE_LENGTH,
  MAX_REFERENCE_ANSWER_LENGTH,
  MAX_TIME_LIMIT_SECONDS,
  MAX_TOTAL_IMAGE_SIZE_BYTES,
  MIN_TIME_LIMIT_SECONDS,
  QUIZ_IMAGE_BUCKET,
} from "@/lib/quiz-constants";
import { createClient } from "@/lib/auth";

export type CreateQuizActionState = {
  error?: string;
};

type ValidatedQuestion = {
  prompt: string;
  referenceAnswer: string;
  timeLimitSeconds: number;
  image: File | null;
};

function getStringValues(formData: FormData, name: string): string[] | null {
  const values = formData.getAll(name);
  return values.every((value): value is string => typeof value === "string")
    ? values
    : null;
}

async function removeUploadedImages(
  supabase: Awaited<ReturnType<typeof createClient>>,
  paths: string[],
) {
  if (paths.length === 0) return null;
  const { error } = await supabase.storage.from(QUIZ_IMAGE_BUCKET).remove(paths);
  return error;
}

export async function createQuizAction(
  _previousState: CreateQuizActionState,
  formData: FormData,
): Promise<CreateQuizActionState> {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const instructorId = claimsData?.claims?.sub;

  if (claimsError || typeof instructorId !== "string") {
    return { error: "Your session has expired. Sign in again to save this quiz." };
  }

  const titleValue = formData.get("title");
  const prompts = getStringValues(formData, "prompt");
  const referenceAnswers = getStringValues(formData, "referenceAnswer");
  const timeLimits = getStringValues(formData, "timeLimitSeconds");
  const imageValues = formData.getAll("image");

  if (
    typeof titleValue !== "string" ||
    !prompts ||
    !referenceAnswers ||
    !timeLimits ||
    !imageValues.every((value) => value instanceof File)
  ) {
    return { error: "The submitted quiz data is invalid. Review the form and try again." };
  }

  const title = titleValue.trim();
  if (!title || title.length > MAX_QUIZ_TITLE_LENGTH) {
    return { error: "Enter a quiz title of 1 to 100 characters." };
  }

  if (
    prompts.length < 1 ||
    prompts.length > MAX_QUESTIONS ||
    referenceAnswers.length !== prompts.length ||
    timeLimits.length !== prompts.length ||
    imageValues.length !== prompts.length
  ) {
    return { error: "The quiz must contain 1 to 50 complete questions." };
  }

  let totalImageSize = 0;
  const validatedQuestions: ValidatedQuestion[] = [];

  for (let index = 0; index < prompts.length; index += 1) {
    const prompt = prompts[index].trim();
    const referenceAnswer = referenceAnswers[index].trim();
    const timeLimitValue = timeLimits[index];
    const imageValue = imageValues[index];
    const image = imageValue instanceof File && imageValue.size > 0 ? imageValue : null;

    if (prompt.length > MAX_PROMPT_LENGTH) {
      return { error: `Question ${index + 1} is too long.` };
    }
    if (!referenceAnswer || referenceAnswer.length > MAX_REFERENCE_ANSWER_LENGTH) {
      return {
        error: `Enter a reference answer of 1 to ${MAX_REFERENCE_ANSWER_LENGTH} characters for question ${index + 1}.`,
      };
    }
    if (!/^\d+$/.test(timeLimitValue)) {
      return { error: `Choose a whole-number time limit for question ${index + 1}.` };
    }

    const timeLimitSeconds = Number(timeLimitValue);
    if (
      !Number.isInteger(timeLimitSeconds) ||
      timeLimitSeconds < MIN_TIME_LIMIT_SECONDS ||
      timeLimitSeconds > MAX_TIME_LIMIT_SECONDS
    ) {
      return {
        error: `Choose a time from ${MIN_TIME_LIMIT_SECONDS} to ${MAX_TIME_LIMIT_SECONDS} seconds for question ${index + 1}.`,
      };
    }

    if (!prompt && !image) {
      return { error: `Add question text or an image for question ${index + 1}.` };
    }

    if (image) {
      if (!Object.hasOwn(IMAGE_EXTENSIONS, image.type)) {
        return {
          error: `Question ${index + 1} must use a JPEG, PNG, WebP, or GIF image.`,
        };
      }
      if (image.size > MAX_IMAGE_SIZE_BYTES) {
        return { error: `The image for question ${index + 1} exceeds 25 MB.` };
      }

      totalImageSize += image.size;
      if (totalImageSize > MAX_TOTAL_IMAGE_SIZE_BYTES) {
        return { error: "Quiz images must total no more than 25 MB." };
      }
    }

    validatedQuestions.push({
      prompt,
      referenceAnswer,
      timeLimitSeconds,
      image,
    });
  }

  const uploadedPaths: string[] = [];
  const questionRows: Array<{
    question: string | null;
    correct_answer: string;
    position: number;
    image_path: string | null;
    time_limit_seconds: number;
  }> = [];

  for (const [position, quizQuestion] of validatedQuestions.entries()) {
    let imagePath: string | null = null;

    if (quizQuestion.image) {
      const extension = IMAGE_EXTENSIONS[quizQuestion.image.type];
      imagePath = `${instructorId}/${randomUUID()}.${extension}`;
      const { error } = await supabase.storage
        .from(QUIZ_IMAGE_BUCKET)
        .upload(imagePath, quizQuestion.image, {
          contentType: quizQuestion.image.type,
          upsert: false,
        });

      if (error) {
        const cleanupError = await removeUploadedImages(supabase, uploadedPaths);
        console.error("Quiz image upload failed.", { error, cleanupError });
        return {
          error: cleanupError
            ? "Image upload failed, and some uploaded files could not be cleaned up. Please contact support."
            : "An image could not be uploaded. Check your connection and try again.",
        };
      }

      uploadedPaths.push(imagePath);
    }

    questionRows.push({
      question: quizQuestion.prompt || null,
      correct_answer: quizQuestion.referenceAnswer,
      position,
      image_path: imagePath,
      time_limit_seconds: quizQuestion.timeLimitSeconds,
    });
  }

  try {
    await db.transaction(async (transaction) => {
      const [savedSet] = await transaction
        .insert(questionSet)
        .values({ instructor_id: instructorId, title })
        .returning({ id: questionSet.id });

      await transaction.insert(questions).values(
        questionRows.map((question) => ({
          ...question,
          question_set_id: savedSet.id,
        })),
      );
    });
  } catch (error) {
    const cleanupError = await removeUploadedImages(supabase, uploadedPaths);
    console.error("Quiz database save failed.", { error, cleanupError });
    return {
      error: cleanupError
        ? "The quiz could not be saved, and some uploaded files could not be cleaned up. Please contact support."
        : "The quiz could not be saved. Please try again.",
    };
  }

  revalidatePath("/host");
  redirect("/host");
}
