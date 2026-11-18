import { and, asc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { db } from "@/db";
import { questionSet, questions } from "@/db/schema";
import { QuizForm } from "@/app/host/create/quiz-form";
import { getClaims } from "@/lib/auth";
import { isUuid } from "@/lib/game/lobby";

type Params = Promise<{ quizId: string }>;

export const instant = false;

export default async function EditQuiz({ params }: { params: Params }) {
  await connection();
  const { data: claimsData, error } = await getClaims();
  const instructorId = claimsData?.claims?.sub;

  if (error || typeof instructorId !== "string") {
    redirect("/login?next=%2Fhost");
  }

  const { quizId } = await params;
  if (!isUuid(quizId)) {
    redirect("/host");
  }

  const [quiz] = await db
    .select({ id: questionSet.id, title: questionSet.title })
    .from(questionSet)
    .where(and(eq(questionSet.id, quizId), eq(questionSet.instructor_id, instructorId)))
    .limit(1);

  if (!quiz) {
    redirect("/host");
  }

  const quizQuestions = await db
    .select({
      prompt: questions.question,
      referenceAnswer: questions.correct_answer,
      timeLimitSeconds: questions.time_limit_seconds,
      imagePath: questions.image_path,
    })
    .from(questions)
    .where(eq(questions.question_set_id, quiz.id))
    .orderBy(asc(questions.position));

  return (
    <QuizForm
      mode="edit"
      initialTitle={quiz.title}
      initialQuestions={quizQuestions.map((question) => ({
        prompt: question.prompt ?? "",
        referenceAnswer: question.referenceAnswer,
        timeLimitSeconds: question.timeLimitSeconds,
        existingImageName: question.imagePath?.split("/").pop() ?? "",
      }))}
    />
  );
}
