"use client";

import { useActionState, useId, useState } from "react";
import {
  createLobbyAction,
  type CreateLobbyActionState,
} from "@/app/host/start/actions";
import {
  describeQuestionCount,
  describeTimeLimit,
  type HostQuizOption,
} from "@/app/host/quiz-format";
import {
  ArrowRightIcon,
  BookIcon,
  BurstIcon,
  CrownIcon,
  LayersIcon,
  PlusIcon,
  TimerIcon,
} from "@/lib/components/game/icons";

type CreateLobbyFormProps = {
  quizzes: HostQuizOption[];
  /** Quiz to preselect, e.g. from /host/start?quizId=… */
  initialQuizId?: string;
};

/**
 * The "Host Game" card. Submits the selected quiz's id as `quizId` to the
 * existing createLobbyAction, which validates it again on the server, opens
 * the lobby, and redirects to /host/game/[gameId].
 */
export function CreateLobbyForm({ quizzes, initialQuizId }: CreateLobbyFormProps) {
  const initialState: CreateLobbyActionState = {};
  const [state, formAction, isPending] = useActionState(
    createLobbyAction,
    initialState,
  );
  const [selectedId, setSelectedId] = useState(
    () =>
      quizzes.find((quiz) => quiz.id === initialQuizId)?.id ??
      quizzes.find((quiz) => quiz.questionCount > 0)?.id ??
      quizzes[0]?.id ??
      "",
  );
  const [hideServerError, setHideServerError] = useState(false);
  const ids = useId();

  const selected = quizzes.find((quiz) => quiz.id === selectedId);
  const hasNoQuestions = !selected || selected.questionCount === 0;

  return (
    <form
      action={formAction}
      onSubmit={() => setHideServerError(false)}
      aria-labelledby={`${ids}-title`}
      className="card w-full border border-base-300 bg-base-100 shadow-soft"
    >
      <div className="card-body gap-6 px-5 py-8 sm:px-10">
        <header className="flex flex-col items-center gap-2 text-center">
          <span className="flex size-18 items-center justify-center rounded-full bg-secondary text-accent">
            <CrownIcon className="size-10" />
          </span>
          <h1
            id={`${ids}-title`}
            className="relative mt-1 text-3xl font-black tracking-tight sm:text-4xl"
          >
            <BurstIcon className="absolute top-0 -left-10 hidden size-7 -rotate-30 text-accent sm:block" />
            Host Game
            <BurstIcon className="absolute top-0 -right-10 hidden size-7 rotate-30 text-accent sm:block" />
          </h1>
          <p className="text-base-content/70">
            Set up a new quiz game and invite others to join.
          </p>
        </header>

        <div className="flex flex-col gap-4">
          <SettingRow icon={<BookIcon />} label="Quiz" htmlFor={`${ids}-quiz`}>
            <select
              id={`${ids}-quiz`}
              name="quizId"
              className="select w-full rounded-field border-2 border-base-300 font-semibold focus:border-primary"
              value={selectedId}
              disabled={isPending}
              onChange={(event) => {
                setSelectedId(event.target.value);
                setHideServerError(true);
              }}
              aria-describedby={hasNoQuestions ? `${ids}-empty` : undefined}
            >
              {quizzes.map((quiz) => (
                <option key={quiz.id} value={quiz.id}>
                  {quiz.title}
                </option>
              ))}
            </select>
          </SettingRow>

          <SettingRow icon={<LayersIcon />} label="Number of Questions">
            <ReadOnlyValue>{describeQuestionCount(selected?.questionCount ?? 0)}</ReadOnlyValue>
          </SettingRow>

          <SettingRow icon={<TimerIcon />} label="Time per Question">
            <ReadOnlyValue>
              {selected ? describeTimeLimit(selected) : "No questions yet"}
              {selected &&
                selected.minTimeSeconds !== selected.maxTimeSeconds && (
                  <span className="ml-1 font-normal text-base-content/60">(set per question)</span>
                )}
            </ReadOnlyValue>
          </SettingRow>
        </div>

        <p className="text-center text-sm text-base-content/60">
          Every question in the quiz is used, with the time limits set in the quiz builder.
        </p>

        {hasNoQuestions && (
          <p id={`${ids}-empty`} className="alert alert-warning alert-soft font-semibold" role="status">
            This quiz has no questions yet. Add a question before opening a lobby.
          </p>
        )}

        {!hideServerError && !isPending && state.error && (
          <p className="alert alert-error alert-soft font-semibold" role="alert">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          className="btn btn-game btn-lg btn-block rounded-full text-lg"
          disabled={isPending || hasNoQuestions}
        >
          {isPending ? (
            <>
              <span className="loading loading-spinner loading-sm" aria-hidden="true" />
              Creating game...
            </>
          ) : (
            <>
              <PlusIcon className="size-6" />
              Create Game
              <ArrowRightIcon />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function SettingRow({
  icon,
  label,
  htmlFor,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  const labelClass = "flex items-center gap-3 font-bold";
  return (
    <div className="grid items-center gap-2 sm:grid-cols-[13rem_1fr] sm:gap-4">
      {htmlFor ? (
        <label htmlFor={htmlFor} className={labelClass}>
          <span className="text-primary">{icon}</span>
          {label}
        </label>
      ) : (
        <span className={labelClass}>
          <span className="text-primary">{icon}</span>
          {label}
        </span>
      )}
      {children}
    </div>
  );
}

function ReadOnlyValue({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex min-h-10 items-center rounded-field border-2 border-dashed border-base-300 bg-base-200/60 px-4 py-2 font-semibold">
      {children}
    </p>
  );
}
