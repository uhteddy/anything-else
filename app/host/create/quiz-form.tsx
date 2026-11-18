"use client";

import Link from "next/link";
import { startTransition, useActionState, useRef, useState } from "react";
import { createQuizAction } from "@/app/host/create/actions";
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
} from "@/lib/quiz-constants";

type QuizQuestion = {
  id: string;
  prompt: string;
  referenceAnswer: string;
  timeLimitSeconds: string;
  image: File | null;
  imageError: string;
  existingImageName: string;
};

export type InitialQuestion = {
  prompt: string;
  referenceAnswer: string;
  timeLimitSeconds: number;
  existingImageName: string;
};

type QuizFormProps = {
  mode: "create" | "edit";
  initialTitle?: string;
  initialQuestions?: InitialQuestion[];
};

type QuestionErrors = {
  prompt?: string;
  image?: string;
  referenceAnswer?: string;
  timeLimitSeconds?: string;
};

type FormErrors = {
  form?: string;
  title?: string;
  questions: Record<string, QuestionErrors>;
};

function createQuestion(id: string): QuizQuestion {
  return {
    id,
    prompt: "",
    referenceAnswer: "",
    timeLimitSeconds: "30",
    image: null,
    imageError: "",
    existingImageName: "",
  };
}

function toQuizQuestions(initialQuestions: InitialQuestion[] | undefined): QuizQuestion[] {
  if (!initialQuestions || initialQuestions.length === 0) {
    return [createQuestion("question-1")];
  }
  return initialQuestions.map((question, index) => ({
    ...createQuestion(`question-${index + 1}`),
    prompt: question.prompt,
    referenceAnswer: question.referenceAnswer,
    timeLimitSeconds: String(question.timeLimitSeconds),
    existingImageName: question.existingImageName,
  }));
}

export function QuizForm({ mode, initialTitle = "", initialQuestions }: QuizFormProps) {
  const isEdit = mode === "edit";
  const [saveState, formAction, isPending] = useActionState(createQuizAction, {});
  const [title, setTitle] = useState(initialTitle);
  const [questions, setQuestions] = useState(() => toQuizQuestions(initialQuestions));
  const [errors, setErrors] = useState<FormErrors>({ questions: {} });
  const [isDirty, setIsDirty] = useState(false);
  const [showEditNotice, setShowEditNotice] = useState(false);
  const nextQuestionNumber = useRef(questions.length + 1);

  function clearFeedback() {
    setErrors({ questions: {} });
    setIsDirty(true);
    setShowEditNotice(false);
  }

  function updateQuestion(id: string, updates: Partial<QuizQuestion>) {
    clearFeedback();
    setQuestions((currentQuestions) =>
      currentQuestions.map((question) =>
        question.id === id ? { ...question, ...updates } : question,
      ),
    );
  }

  function handleImageChange(id: string, file: File | undefined) {
    if (!file) {
      updateQuestion(id, { image: null, imageError: "" });
      return;
    }

    if (!Object.hasOwn(IMAGE_EXTENSIONS, file.type)) {
      updateQuestion(id, {
        image: null,
        imageError: "Choose a JPEG, PNG, WebP, or GIF image.",
      });
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      updateQuestion(id, {
        image: null,
        imageError: "The image must be no larger than 25 MB.",
      });
      return;
    }

    updateQuestion(id, { image: file, imageError: "" });
  }

  function addQuestion() {
    clearFeedback();
    const id = `question-${nextQuestionNumber.current}`;
    nextQuestionNumber.current += 1;
    setQuestions((currentQuestions) => [...currentQuestions, createQuestion(id)]);
  }

  function moveQuestion(index: number, offset: -1 | 1) {
    clearFeedback();
    setQuestions((currentQuestions) => {
      const target = index + offset;
      if (target < 0 || target >= currentQuestions.length) return currentQuestions;
      const reordered = [...currentQuestions];
      [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
      return reordered;
    });
  }

  function removeQuestion(id: string) {
    clearFeedback();
    setQuestions((currentQuestions) =>
      currentQuestions.filter((question) => question.id !== id),
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // Submitting manually stops React from resetting the file inputs after a failed save.
    event.preventDefault();

    const nextErrors: FormErrors = { questions: {} };
    if (!title.trim()) {
      nextErrors.title = "Enter a quiz title.";
    }

    let totalImageSize = 0;
    for (const question of questions) {
      const questionErrors: QuestionErrors = {};
      if (!question.prompt.trim() && !question.image && !question.existingImageName) {
        questionErrors.prompt = "Add question text or an image.";
      }
      if (question.imageError) {
        questionErrors.image = question.imageError;
      }
      if (!question.referenceAnswer.trim()) {
        questionErrors.referenceAnswer = "Enter a reference answer.";
      }
      const timeLimit = Number(question.timeLimitSeconds);
      if (
        !Number.isInteger(timeLimit) ||
        timeLimit < MIN_TIME_LIMIT_SECONDS ||
        timeLimit > MAX_TIME_LIMIT_SECONDS
      ) {
        questionErrors.timeLimitSeconds = "Choose a time from 30 to 300 seconds.";
      }
      if (question.image) totalImageSize += question.image.size;
      if (Object.keys(questionErrors).length > 0) {
        nextErrors.questions[question.id] = questionErrors;
      }
    }

    if (totalImageSize > MAX_TOTAL_IMAGE_SIZE_BYTES) {
      nextErrors.form = "Quiz images must total no more than 25 MB.";
    }

    setErrors(nextErrors);
    if (
      nextErrors.form ||
      nextErrors.title ||
      Object.keys(nextErrors.questions).length > 0
    ) {
      return;
    }

    if (isEdit) {
      setShowEditNotice(true);
      return;
    }

    const formData = new FormData(event.currentTarget);
    formData.delete("image");
    for (const question of questions) {
      formData.append("image", question.image ?? new File([], ""));
    }

    setIsDirty(false);
    startTransition(() => formAction(formData));
  }

  const selectedImageSize = questions.reduce(
    (total, question) => total + (question.image?.size ?? 0),
    0,
  );

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-8 sm:py-12">
      <header className="flex flex-col gap-3">
        <Link href="/host" className="link link-hover w-fit text-sm">
          ← Back to Host a Game
        </Link>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Quiz builder
          </p>
          <h1 className="mt-1 text-4xl font-bold">{isEdit ? "Edit quiz" : "Create a quiz"}</h1>
          <p className="mt-2 max-w-2xl text-base-content/70">
            Write open-response questions for students to answer together.
            Each question needs a reference answer for grading.
          </p>
        </div>
      </header>

      <form
        action={formAction}
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-6"
      >
        <section className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="card-title">Quiz details</h2>
              <span className="badge badge-outline">
                {questions.length} / {MAX_QUESTIONS} questions
              </span>
            </div>

            <fieldset className="fieldset">
              <label htmlFor="quiz-title" className="fieldset-legend">
                Quiz title
              </label>
              <input
                id="quiz-title"
                name="title"
                className={`input input-bordered w-full ${errors.title ? "input-error" : ""}`}
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  clearFeedback();
                }}
                placeholder="e.g. Introduction to Biology"
                maxLength={MAX_QUIZ_TITLE_LENGTH}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? "quiz-title-error" : undefined}
              />
              {errors.title && (
                <p id="quiz-title-error" className="label text-error" role="alert">
                  {errors.title}
                </p>
              )}
            </fieldset>
          </div>
        </section>

        <div className="flex flex-col gap-4">
          {questions.map((question, index) => {
            const questionErrors = errors.questions[question.id] ?? {};

            return (
              <section
                key={question.id}
                className="card border border-base-300 bg-base-100 shadow-sm"
              >
                <div className="card-body gap-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="badge badge-primary badge-lg">{index + 1}</span>
                      <h2 className="card-title text-xl">Question {index + 1}</h2>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => moveQuestion(index, -1)}
                        disabled={index === 0}
                        aria-label={`Move question ${index + 1} up`}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => moveQuestion(index, 1)}
                        disabled={index === questions.length - 1}
                        aria-label={`Move question ${index + 1} down`}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm text-error"
                        onClick={() => removeQuestion(question.id)}
                        disabled={questions.length === 1}
                        aria-label={`Remove question ${index + 1}`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <fieldset className="fieldset">
                    <label htmlFor={`${question.id}-prompt`} className="fieldset-legend">
                      Question prompt
                    </label>
                    <textarea
                      id={`${question.id}-prompt`}
                      name="prompt"
                      className={`textarea textarea-bordered min-h-28 w-full ${questionErrors.prompt ? "textarea-error" : ""}`}
                      value={question.prompt}
                      onChange={(event) =>
                        updateQuestion(question.id, { prompt: event.target.value })
                      }
                      placeholder="Ask a question students can explain in their own words."
                      maxLength={MAX_PROMPT_LENGTH}
                      aria-invalid={Boolean(questionErrors.prompt)}
                      aria-describedby={
                        questionErrors.prompt ? `${question.id}-prompt-error` : undefined
                      }
                    />
                    {questionErrors.prompt && (
                      <p
                        id={`${question.id}-prompt-error`}
                        className="label text-error"
                        role="alert"
                      >
                        {questionErrors.prompt}
                      </p>
                    )}
                  </fieldset>

                  <fieldset className="fieldset">
                    <label htmlFor={`${question.id}-image`} className="fieldset-legend">
                      Image prompt <span className="font-normal opacity-60">Optional</span>
                    </label>
                    <input
                      id={`${question.id}-image`}
                      type="file"
                      name="image"
                      accept={Object.keys(IMAGE_EXTENSIONS).join(",")}
                      className="file-input file-input-bordered w-full"
                      onChange={(event) =>
                        handleImageChange(question.id, event.target.files?.[0])
                      }
                      aria-invalid={Boolean(questionErrors.image || question.imageError)}
                      aria-describedby={
                        questionErrors.image || question.imageError
                          ? `${question.id}-image-error`
                          : `${question.id}-image-help`
                      }
                    />
                    {questionErrors.image || question.imageError ? (
                      <p
                        id={`${question.id}-image-error`}
                        className="label text-error"
                        role="alert"
                      >
                        {questionErrors.image || question.imageError}
                      </p>
                    ) : (
                      <p id={`${question.id}-image-help`} className="label">
                        JPEG, PNG, WebP, or GIF; no more than 25 MB total across this quiz.
                      </p>
                    )}
                    {question.image ? (
                      <p className="text-sm text-base-content/70">
                        Selected: {question.image.name}
                      </p>
                    ) : (
                      question.existingImageName && (
                        <p className="text-sm text-base-content/70">
                          Current image: {question.existingImageName}
                        </p>
                      )
                    )}
                  </fieldset>

                  <fieldset className="fieldset">
                    <label
                      htmlFor={`${question.id}-answer`}
                      className="fieldset-legend"
                    >
                      Reference answer
                    </label>
                    <textarea
                      id={`${question.id}-answer`}
                      name="referenceAnswer"
                      className={`textarea textarea-bordered min-h-24 w-full ${questionErrors.referenceAnswer ? "textarea-error" : ""}`}
                      value={question.referenceAnswer}
                      onChange={(event) =>
                        updateQuestion(question.id, {
                          referenceAnswer: event.target.value,
                        })
                      }
                      placeholder="What should a correct, complete answer include?"
                      maxLength={MAX_REFERENCE_ANSWER_LENGTH}
                      aria-invalid={Boolean(questionErrors.referenceAnswer)}
                      aria-describedby={
                        questionErrors.referenceAnswer
                          ? `${question.id}-answer-error`
                          : undefined
                      }
                    />
                    {questionErrors.referenceAnswer && (
                      <p
                        id={`${question.id}-answer-error`}
                        className="label text-error"
                        role="alert"
                      >
                        {questionErrors.referenceAnswer}
                      </p>
                    )}
                  </fieldset>

                  <fieldset className="fieldset max-w-xs">
                    <label
                      htmlFor={`${question.id}-time-limit`}
                      className="fieldset-legend"
                    >
                      Time limit
                    </label>
                    <div className="join">
                      <input
                        id={`${question.id}-time-limit`}
                        name="timeLimitSeconds"
                        type="number"
                        min={MIN_TIME_LIMIT_SECONDS}
                        max={MAX_TIME_LIMIT_SECONDS}
                        step={1}
                        className={`input input-bordered join-item w-full ${questionErrors.timeLimitSeconds ? "input-error" : ""}`}
                        value={question.timeLimitSeconds}
                        onChange={(event) =>
                          updateQuestion(question.id, {
                            timeLimitSeconds: event.target.value,
                          })
                        }
                        aria-invalid={Boolean(questionErrors.timeLimitSeconds)}
                        aria-describedby={
                          questionErrors.timeLimitSeconds
                            ? `${question.id}-time-limit-error`
                            : `${question.id}-time-limit-help`
                        }
                      />
                      <span className="join-item flex items-center border border-base-300 bg-base-200 px-4">
                        seconds
                      </span>
                    </div>
                    {questionErrors.timeLimitSeconds ? (
                      <p
                        id={`${question.id}-time-limit-error`}
                        className="label text-error"
                        role="alert"
                      >
                        {questionErrors.timeLimitSeconds}
                      </p>
                    ) : (
                      <p id={`${question.id}-time-limit-help`} className="label">
                        Choose between {MIN_TIME_LIMIT_SECONDS} seconds and{" "}
                        {MAX_TIME_LIMIT_SECONDS / 60} minutes.
                      </p>
                    )}
                  </fieldset>
                </div>
              </section>
            );
          })}
        </div>

        <button
          type="button"
          className="btn btn-outline"
          onClick={addQuestion}
          disabled={questions.length >= MAX_QUESTIONS}
        >
          + Add question
        </button>

        <p className="text-sm text-base-content/70" aria-live="polite">
          Selected images: {(selectedImageSize / (1024 * 1024)).toFixed(1)} MB / 25 MB
        </p>

        {errors.form && (
          <p className="alert alert-error" role="alert">
            {errors.form}
          </p>
        )}

        {showEditNotice && (
          <p className="alert alert-info" role="status">
            Your changes look good. Saving edits arrives in prototype v2.
          </p>
        )}

        {!isDirty && !isPending && saveState.error && (
          <p className="alert alert-error" role="alert">
            {saveState.error}
            {saveState.error.startsWith("Your session") && (
              <>
                {" "}
                <Link
                  href="/login?next=%2Fhost%2Fcreate"
                  className="link link-hover font-semibold"
                >
                  Sign in
                </Link>
              </>
            )}
          </p>
        )}

        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <Link href="/host" className="btn btn-ghost">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary" disabled={isPending}>
            {isPending ? "Saving quiz..." : isEdit ? "Save changes" : "Save quiz"}
          </button>
        </div>
      </form>
    </main>
  );
}
