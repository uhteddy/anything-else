"use client";

import Link from "next/link";
import { useRef, useState } from "react";

const MAX_QUESTIONS = 50;
const MAX_IMAGE_SIZE = 25 * 1024 * 1024;

type QuizQuestion = {
  id: string;
  prompt: string;
  referenceAnswer: string;
  timeLimitSeconds: string;
  image: File | null;
  imageError: string;
};

type QuestionErrors = {
  prompt?: string;
  image?: string;
  referenceAnswer?: string;
  timeLimitSeconds?: string;
};

type FormErrors = {
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
  };
}

export default function CreateQuiz() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([createQuestion("question-1")]);
  const [errors, setErrors] = useState<FormErrors>({ questions: {} });
  const [draftReady, setDraftReady] = useState(false);
  const nextQuestionNumber = useRef(2);

  function clearFeedback() {
    setErrors({ questions: {} });
    setDraftReady(false);
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

    if (!file.type.startsWith("image/")) {
      updateQuestion(id, {
        image: null,
        imageError: "Choose an image file.",
      });
      return;
    }

    if (file.size >= MAX_IMAGE_SIZE) {
      updateQuestion(id, {
        image: null,
        imageError: "The image must be smaller than 25 MB.",
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

  function removeQuestion(id: string) {
    clearFeedback();
    setQuestions((currentQuestions) =>
      currentQuestions.filter((question) => question.id !== id),
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = { questions: {} };
    if (!title.trim()) {
      nextErrors.title = "Enter a quiz title.";
    }

    for (const question of questions) {
      const questionErrors: QuestionErrors = {};
      if (!question.prompt.trim() && !question.image) {
        questionErrors.prompt = "Add question text or an image.";
      }
      if (question.imageError) {
        questionErrors.image = question.imageError;
      }
      if (!question.referenceAnswer.trim()) {
        questionErrors.referenceAnswer = "Enter a reference answer.";
      }
      const timeLimit = Number(question.timeLimitSeconds);
      if (!Number.isInteger(timeLimit) || timeLimit < 30 || timeLimit > 300) {
        questionErrors.timeLimitSeconds = "Choose a time from 30 to 300 seconds.";
      }
      if (Object.keys(questionErrors).length > 0) {
        nextErrors.questions[question.id] = questionErrors;
      }
    }

    setErrors(nextErrors);
    setDraftReady(!nextErrors.title && Object.keys(nextErrors.questions).length === 0);
  }

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
          <h1 className="mt-1 text-4xl font-bold">Create a quiz</h1>
          <p className="mt-2 max-w-2xl text-base-content/70">
            Write open-response questions for students to answer together.
            Each question needs a reference answer for grading.
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
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
                className={`input input-bordered w-full ${errors.title ? "input-error" : ""}`}
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  clearFeedback();
                }}
                placeholder="e.g. Introduction to Biology"
                maxLength={100}
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

                  <fieldset className="fieldset">
                    <label htmlFor={`${question.id}-prompt`} className="fieldset-legend">
                      Question prompt
                    </label>
                    <textarea
                      id={`${question.id}-prompt`}
                      className={`textarea textarea-bordered min-h-28 w-full ${questionErrors.prompt ? "textarea-error" : ""}`}
                      value={question.prompt}
                      onChange={(event) =>
                        updateQuestion(question.id, { prompt: event.target.value })
                      }
                      placeholder="Ask a question students can explain in their own words."
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
                      accept="image/*"
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
                        Images must be smaller than 25 MB.
                      </p>
                    )}
                    {question.image && (
                      <p className="text-sm text-base-content/70">
                        Selected: {question.image.name}
                      </p>
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
                      className={`textarea textarea-bordered min-h-24 w-full ${questionErrors.referenceAnswer ? "textarea-error" : ""}`}
                      value={question.referenceAnswer}
                      onChange={(event) =>
                        updateQuestion(question.id, {
                          referenceAnswer: event.target.value,
                        })
                      }
                      placeholder="What should a correct, complete answer include?"
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
                        type="number"
                        min={30}
                        max={300}
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
                        Choose between 30 seconds and 5 minutes.
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

        <section className="rounded-box border border-info/30 bg-info/10 p-4 text-sm">
          <p className="font-semibold">Draft preview only</p>
          <p className="mt-1 text-base-content/70">
            Quiz saving is not connected yet. Your draft will not be stored when you leave this page.
          </p>
        </section>

        {draftReady && (
          <p className="alert alert-success" role="status">
            This quiz draft is valid: “{title.trim()}” with {questions.length}{" "}
            {questions.length === 1 ? "question" : "questions"}.
          </p>
        )}

        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <Link href="/host" className="btn btn-ghost">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            Review quiz draft
          </button>
        </div>
      </form>
    </main>
  );
}
