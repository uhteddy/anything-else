"use client";

import Link from "next/link";
import { useState } from "react";
import StudentGroupHeader from "@/lib/components/game/StudentGroupHeader";
import TimerBadge from "@/lib/components/game/TimerBadge";
import {
  getGroup,
  MOCK_CURRENT_QUESTION,
  MOCK_PLAYER,
  MOCK_TIME_LEFT_SECONDS,
  MOCK_TOTAL_QUESTIONS,
} from "@/lib/game/mockGame";

export default function StudentQuestion() {
  const group = getGroup(MOCK_PLAYER.groupName);
  const question = MOCK_CURRENT_QUESTION;
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!answer.trim()) {
      setError("Type your group's answer before submitting.");
      return;
    }
    setError("");
    setSubmitted(true);
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <StudentGroupHeader group={group} />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-5 px-4 py-6">
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold text-base-content/70">
            Question {question.number} of {MOCK_TOTAL_QUESTIONS}
          </p>
          <TimerBadge secondsLeft={MOCK_TIME_LEFT_SECONDS} />
        </div>

        <h1 className="text-3xl font-bold">{question.prompt}</h1>

        {submitted ? (
          <section className="flex flex-1 flex-col gap-4">
            <div className="alert alert-success alert-soft flex-col items-start">
              <p className="font-semibold">Answer submitted for {group.color.name}</p>
              <p className="whitespace-pre-wrap">{answer}</p>
            </div>
            <p className="text-center text-base-content/70">
              Waiting for the question to close…
            </p>
            <Link href="/play/result" className="btn btn-primary mt-auto">
              See result →
            </Link>
          </section>
        ) : (
          <form onSubmit={submit} noValidate className="flex flex-1 flex-col gap-3">
            <fieldset className="fieldset">
              <label htmlFor="group-answer" className="fieldset-legend">
                Your group&apos;s answer
              </label>
              <textarea
                id="group-answer"
                className={`textarea textarea-bordered min-h-40 w-full ${error ? "textarea-error" : ""}`}
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Work it out together, then one person types it here."
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "group-answer-error" : undefined}
              />
              {error && (
                <p id="group-answer-error" className="label text-error" role="alert">
                  {error}
                </p>
              )}
            </fieldset>
            <button type="submit" className="btn btn-warning btn-lg mt-auto">
              Submit for {group.color.name}
            </button>
            <p className="text-center text-sm text-base-content/70">
              Only the first answer from your group counts.
            </p>
          </form>
        )}
      </main>
    </div>
  );
}
