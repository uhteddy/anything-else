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
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowUpIcon,
  BookIcon,
  ImageIcon,
  PlusIcon,
  TimerIcon,
  TrashIcon,
} from "@/lib/components/game/icons";

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
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:py-12">
      <Link
        href="/host"
        className="inline-flex w-fit items-center gap-2 rounded-field font-bold text-base-content/80 transition-colors hover:text-primary focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/40"
      >
        <ArrowLeftIcon />
        Back to Host a Game
      </Link>

      <header className={CARD_CLASS}>
        <div className="card-body flex-row flex-wrap items-center gap-4 px-5 py-6 sm:px-8">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
            <BookIcon className="size-7" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold tracking-wide text-primary uppercase">
              Quiz builder
            </p>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              {isEdit ? "Edit quiz" : "Create a quiz"}
            </h1>
            <p className="mt-1 max-w-2xl text-base-content/70">
              Write open-response questions for students to answer together.
              Each question needs a reference answer for grading.
            </p>
          </div>
        </div>
      </header>

      <form
        action={formAction}
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-6"
      >
        <section className={CARD_CLASS}>
          <div className="card-body gap-4 px-5 py-6 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl font-extrabold">Quiz details</h2>
              <span className="badge badge-soft badge-primary font-bold">
                {questions.length} / {MAX_QUESTIONS} questions
              </span>
            </div>

            <fieldset className="fieldset">
              <label htmlFor="quiz-title" className={LEGEND_CLASS}>
                Quiz title
              </label>
              <input
                id="quiz-title"
                name="title"
                className={`input input-lg w-full font-semibold ${fieldClass(Boolean(errors.title))}`}
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
                <p id="quiz-title-error" className={ERROR_TEXT_CLASS} role="alert">
                  {errors.title}
                </p>
              )}
            </fieldset>
          </div>
        </section>

        <div className="flex flex-col gap-5">
          {questions.map((question, index) => {
            const questionErrors = errors.questions[question.id] ?? {};
            const hasErrors = Object.keys(questionErrors).length > 0;

            return (
              <section
                key={question.id}
                aria-labelledby={`${question.id}-heading`}
                className={`card border-2 bg-base-100 shadow-soft ${
                  hasErrors ? "border-error/60" : "border-base-300"
                }`}
              >
                <div className="card-body gap-5 px-5 py-6 sm:px-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className="flex size-9 items-center justify-center rounded-full bg-primary font-black text-primary-content"
                        aria-hidden="true"
                      >
                        {index + 1}
                      </span>
                      <h2 id={`${question.id}-heading`} className="text-xl font-extrabold">
                        Question {index + 1}
                      </h2>
                      {/* Placeholder for the future Written Answer / Multiple Choice choice. */}
                      <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-content">
                        Written answer
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm btn-square rounded-full hover:bg-secondary hover:text-primary"
                        onClick={() => moveQuestion(index, -1)}
                        disabled={index === 0}
                        aria-label={`Move question ${index + 1} up`}
                        title="Move up"
                      >
                        <ArrowUpIcon />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm btn-square rounded-full hover:bg-secondary hover:text-primary"
                        onClick={() => moveQuestion(index, 1)}
                        disabled={index === questions.length - 1}
                        aria-label={`Move question ${index + 1} down`}
                        title="Move down"
                      >
                        <ArrowDownIcon />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm btn-square rounded-full text-error hover:bg-error/10"
                        onClick={() => removeQuestion(question.id)}
                        disabled={questions.length === 1}
                        aria-label={`Remove question ${index + 1}`}
                        title="Remove"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>

                  <fieldset className="fieldset">
                    <label htmlFor={`${question.id}-prompt`} className={LEGEND_CLASS}>
                      Question prompt
                    </label>
                    <textarea
                      id={`${question.id}-prompt`}
                      name="prompt"
                      className={`textarea min-h-28 w-full text-base ${fieldClass(Boolean(questionErrors.prompt))}`}
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
                        className={ERROR_TEXT_CLASS}
                        role="alert"
                      >
                        {questionErrors.prompt}
                      </p>
                    )}
                  </fieldset>

                  <fieldset className="fieldset">
                    <label htmlFor={`${question.id}-image`} className={LEGEND_CLASS}>
                      <ImageIcon className="size-5 text-primary" />
                      Image prompt{" "}
                      <span className="font-normal text-base-content/60">Optional</span>
                    </label>
                    <input
                      id={`${question.id}-image`}
                      type="file"
                      name="image"
                      accept={Object.keys(IMAGE_EXTENSIONS).join(",")}
                      className={`file-input w-full file:bg-secondary file:font-bold file:text-secondary-content ${fieldClass(
                        Boolean(questionErrors.image || question.imageError),
                      )}`}
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
                        className={ERROR_TEXT_CLASS}
                        role="alert"
                      >
                        {questionErrors.image || question.imageError}
                      </p>
                    ) : (
                      <p id={`${question.id}-image-help`} className={HELP_TEXT_CLASS}>
                        JPEG, PNG, WebP, or GIF; no more than 25 MB total across this quiz.
                      </p>
                    )}
                    {question.image ? (
                      <p className={FILE_NAME_CLASS}>
                        <ImageIcon className="size-4 shrink-0" />
                        <span className="truncate">Selected: {question.image.name}</span>
                      </p>
                    ) : (
                      question.existingImageName && (
                        <p className={FILE_NAME_CLASS}>
                          <ImageIcon className="size-4 shrink-0" />
                          <span className="truncate">
                            Current image: {question.existingImageName}
                          </span>
                        </p>
                      )
                    )}
                  </fieldset>

                  <fieldset className="fieldset">
                    <label
                      htmlFor={`${question.id}-answer`}
                      className={LEGEND_CLASS}
                    >
                      Reference answer
                    </label>
                    <textarea
                      id={`${question.id}-answer`}
                      name="referenceAnswer"
                      className={`textarea min-h-24 w-full text-base ${fieldClass(
                        Boolean(questionErrors.referenceAnswer),
                      )}`}
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
                        className={ERROR_TEXT_CLASS}
                        role="alert"
                      >
                        {questionErrors.referenceAnswer}
                      </p>
                    )}
                  </fieldset>

                  <fieldset className="fieldset max-w-xs">
                    <label
                      htmlFor={`${question.id}-time-limit`}
                      className={LEGEND_CLASS}
                    >
                      <TimerIcon className="size-5 text-primary" />
                      Time limit
                    </label>
                    <div className="join w-full">
                      <input
                        id={`${question.id}-time-limit`}
                        name="timeLimitSeconds"
                        type="number"
                        min={MIN_TIME_LIMIT_SECONDS}
                        max={MAX_TIME_LIMIT_SECONDS}
                        step={1}
                        className={`input join-item w-full font-semibold ${fieldClass(
                          Boolean(questionErrors.timeLimitSeconds),
                        )}`}
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
                      <span className="join-item flex items-center rounded-r-field border-2 border-l-0 border-base-300 bg-secondary px-4 font-bold text-secondary-content">
                        seconds
                      </span>
                    </div>
                    {questionErrors.timeLimitSeconds ? (
                      <p
                        id={`${question.id}-time-limit-error`}
                        className={ERROR_TEXT_CLASS}
                        role="alert"
                      >
                        {questionErrors.timeLimitSeconds}
                      </p>
                    ) : (
                      <p id={`${question.id}-time-limit-help`} className={HELP_TEXT_CLASS}>
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
          className="btn btn-block h-14 rounded-box border-2 border-dashed border-primary/40 bg-base-100/70 text-base font-bold text-primary shadow-none hover:border-primary hover:bg-secondary"
          onClick={addQuestion}
          disabled={questions.length >= MAX_QUESTIONS}
        >
          <PlusIcon />
          Add question
        </button>

        <p className="text-sm text-base-content/70" aria-live="polite">
          Selected images: {(selectedImageSize / (1024 * 1024)).toFixed(1)} MB / 25 MB
        </p>

        {errors.form && (
          <p className="alert alert-error alert-soft font-semibold" role="alert">
            {errors.form}
          </p>
        )}

        {showEditNotice && (
          <p className="alert alert-info alert-soft font-semibold" role="status">
            Your changes look good. Saving edits arrives in prototype v2.
          </p>
        )}

        {!isDirty && !isPending && saveState.error && (
          <p className="alert alert-error alert-soft font-semibold" role="alert">
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
          <Link href="/host" className="btn btn-ghost btn-lg rounded-full">
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn-game btn-lg rounded-full px-8"
            disabled={isPending}
          >
            {isPending && (
              <span className="loading loading-spinner loading-sm" aria-hidden="true" />
            )}
            {isPending ? "Saving quiz..." : isEdit ? "Save changes" : "Save quiz"}
          </button>
        </div>
      </form>
    </div>
  );
}

const CARD_CLASS = "card border border-base-300 bg-base-100 shadow-soft";
const LEGEND_CLASS = "fieldset-legend flex items-center gap-2 text-base font-bold";
const ERROR_TEXT_CLASS = "text-sm font-semibold text-error";
const HELP_TEXT_CLASS = "text-sm text-base-content/60";
const FILE_NAME_CLASS =
  "flex items-center gap-2 rounded-field bg-secondary/60 px-3 py-2 text-sm font-semibold text-secondary-content";

/** Thick lavender border that turns purple on focus, or red when the field has an error. */
function fieldClass(hasError: boolean) {
  return `rounded-field border-2 focus:outline-none focus:ring-4 ${
    hasError
      ? "border-error focus:border-error focus:ring-error/15"
      : "border-base-300 focus:border-primary focus:ring-primary/15"
  }`;
}
