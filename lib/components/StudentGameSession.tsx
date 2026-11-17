"use client";

import { useState } from "react";
import ArcadeButton from "@/lib/components/ArcadeButton";
import ArcadeCard from "@/lib/components/ArcadeCard";
import ArcadeCritterAvatar from "@/lib/components/ArcadeCritterAvatar";
import ArcadeDemoControlBar from "@/lib/components/ArcadeDemoControlBar";
import ArcadeLeaderboard from "@/lib/components/ArcadeLeaderboard";
import ArcadeLobbyBackdrop from "@/lib/components/ArcadeLobbyBackdrop";
import GameSubHeader from "@/lib/components/GameSubHeader";
import {
  getGroupLeaderboard,
  MOCK_COLOR_GROUPS,
  MOCK_LOBBY_PLAYERS,
  MOCK_QUESTION_ROUNDS,
} from "@/lib/game/mockData";

type StudentStep =
  | { type: "lobby"; label: string }
  | { type: "group"; label: string }
  | { type: "splash"; qIndex: number; label: string }
  | { type: "answer"; qIndex: number; label: string }
  | { type: "leaderboard"; qIndex: number; label: string }
  | { type: "podium"; label: string };

const STUDENT_STEPS: StudentStep[] = [
  { type: "lobby", label: "Waiting Lobby" },
  { type: "group", label: "Assigned Group" },
  ...MOCK_QUESTION_ROUNDS.flatMap((q, idx): StudentStep[] => [
    { type: "splash", qIndex: idx, label: `Q${q.number}: Question` },
    { type: "answer", qIndex: idx, label: `Q${q.number}: Answer` },
    { type: "leaderboard", qIndex: idx, label: `Q${q.number}: Standings` },
  ]),
  { type: "podium", label: "Final Podium" },
];

type StudentGameSessionProps = {
  pin: string;
  nickname: string;
};

export default function StudentGameSession({
  pin,
  nickname,
}: StudentGameSessionProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [draftAnswers, setDraftAnswers] = useState<Record<number, string>>({});
  const [submittedRounds, setSubmittedRounds] = useState<Record<number, boolean>>({});

  const step = STUDENT_STEPS[stepIndex] ?? STUDENT_STEPS[0];
  const playerGroup = MOCK_COLOR_GROUPS[0]; // Blue Group
  const groupMembers = [nickname, ...playerGroup.members];
  const playerCount = MOCK_LOBBY_PLAYERS.length + 1;

  function goPrev() {
    setStepIndex((i) => Math.max(0, i - 1));
  }

  function goNext() {
    setStepIndex((i) => Math.min(STUDENT_STEPS.length - 1, i + 1));
  }

  function resetDemo() {
    setStepIndex(0);
    setDraftAnswers({});
    setSubmittedRounds({});
  }

  // Full-bleed background color based on stage
  const stageBgClass =
    step.type === "group"
      ? playerGroup.solidBgClass
      : step.type === "splash"
        ? "bg-primary text-primary-content"
        : "bg-base-200 text-base-content";

  const showFloatingShapes = step.type === "lobby" || step.type === "podium";

  return (
    <div className={`relative flex min-h-screen flex-col overflow-hidden px-4 py-6 transition-colors duration-200 ${stageBgClass}`}>
      {showFloatingShapes && <ArcadeLobbyBackdrop />}

      <div className="relative z-10 flex flex-1 flex-col">
        <GameSubHeader
          backHref="/join"
          backLabel="← Leave"
          rightSlot={
            <div className="flex items-center gap-2 text-base-content">
              {step.type !== "lobby" && step.type !== "group" && (
                <span className={`badge badge-lg border-2 font-black ${playerGroup.badgeClass}`}>
                  {playerGroup.name}
                </span>
              )}
              <div className="rounded-box border-2 border-base-300 border-b-4 bg-base-100 px-4 py-2 font-mono text-base font-black tracking-widest sm:text-lg">
                PIN: {pin.slice(0, 3)} {pin.slice(3)}
              </div>
            </div>
          }
        />

        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-8 pt-6 pb-28">
          {/* STAGE 1: WAITING LOBBY */}
          {step.type === "lobby" && (
            <>
              <ArcadeCard
                className="w-full max-w-sm"
                bodyClassName="items-center gap-3 p-6 text-center"
              >
                <ArcadeCritterAvatar
                  name={nickname}
                  gameCode={pin}
                  sizeClassName="size-24"
                />
                <h1 className="text-3xl font-black">{nickname}</h1>
                <div className="flex items-center gap-2 text-sm font-bold opacity-70">
                  <span className="loading loading-sm loading-dots" />
                  <span>Waiting for host to start…</span>
                </div>
              </ArcadeCard>

              <section className="w-full">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-black">Players ({playerCount})</h2>
                </div>

                <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  <li className="flex items-center gap-3 rounded-box border-2 border-primary border-b-4 bg-base-100 p-3">
                    <ArcadeCritterAvatar
                      name={nickname}
                      gameCode={pin}
                      sizeClassName="size-11"
                    />
                    <span className="truncate text-base font-extrabold">
                      {nickname}
                    </span>
                  </li>
                  {MOCK_LOBBY_PLAYERS.map((player) => (
                    <li
                      key={player.id}
                      className="flex items-center gap-3 rounded-box border-2 border-base-300 border-b-4 bg-base-100 p-3"
                    >
                      <ArcadeCritterAvatar
                        name={player.nickname}
                        gameCode={pin}
                        sizeClassName="size-11"
                      />
                      <span className="truncate text-base font-bold">
                        {player.nickname}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}

          {/* STAGE 2: ASSIGNED GROUP — FULL SCREEN GROUP COLOR */}
          {step.type === "group" && (
            <div className="flex w-full max-w-2xl flex-col items-center gap-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <h1 className="text-5xl font-black sm:text-7xl">
                  {playerGroup.name}
                </h1>
                <p className="max-w-md text-xl font-bold opacity-95">
                  Find your teammates! Anyone in the group can submit your answer.
                </p>
              </div>

              <div className="grid w-full gap-4 sm:grid-cols-3">
                {groupMembers.map((member) => {
                  const isYou = member === nickname;
                  return (
                    <div
                      key={member}
                      className="flex flex-col items-center gap-3 rounded-box border-2 border-slate-900/20 border-b-8 bg-white p-5 text-slate-900 shadow-lg"
                    >
                      <ArcadeCritterAvatar
                        name={member}
                        gameCode={pin}
                        sizeClassName="size-20"
                      />
                      <span className="truncate text-xl font-black">
                        {member}
                        {isYou ? " (You)" : ""}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STAGE 3: QUESTION SPLASH — KAHOOT FULL-STAGE REVEAL */}
          {step.type === "splash" && (() => {
            const round = MOCK_QUESTION_ROUNDS[step.qIndex];
            return (
              <div
                onClick={goNext}
                className="flex w-full max-w-3xl cursor-pointer flex-col items-center gap-8 py-8 text-center"
              >
                <div className="flex size-24 items-center justify-center rounded-full border-4 border-primary-content/30 bg-base-100 text-5xl font-black text-base-content shadow-lg">
                  {round.number}
                </div>

                <h1 className="text-3xl font-black leading-tight sm:text-5xl">
                  {round.prompt}
                </h1>

                <div className="mt-4 w-full max-w-md overflow-hidden rounded-full bg-primary-content/20 p-1">
                  <div className="h-3 w-2/3 animate-pulse rounded-full bg-primary-content" />
                </div>
              </div>
            );
          })()}

          {/* STAGE 4: OPEN-RESPONSE ENTRY */}
          {step.type === "answer" && (() => {
            const round = MOCK_QUESTION_ROUNDS[step.qIndex];
            const defaultSample =
              round.submissions.find((s) => s.groupId === "blue")?.answer ?? "";
            const value = draftAnswers[step.qIndex] ?? defaultSample;
            const isSubmitted = Boolean(submittedRounds[step.qIndex]);

            return (
              <div className="flex w-full max-w-2xl flex-col gap-5">
                {/* Question Banner */}
                <div className={`rounded-box border-2 border-b-8 p-6 ${playerGroup.solidBgClass} border-slate-900/20`}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-black opacity-90">
                      Question {round.number} of {MOCK_QUESTION_ROUNDS.length}
                    </span>
                    <span className="rounded-box bg-black/20 px-3 py-1 font-mono text-base font-black">
                      {round.timeLimitSeconds}s
                    </span>
                  </div>
                  <h1 className="text-2xl font-black sm:text-3xl">
                    {round.prompt}
                  </h1>
                </div>

                {isSubmitted ? (
                  <ArcadeCard
                    className="w-full"
                    bodyClassName="items-center gap-4 p-8 text-center"
                  >
                    <h2 className="text-2xl font-black">Answer Sent!</h2>
                    <p className="max-w-lg text-lg font-medium opacity-80">
                      &ldquo;{value}&rdquo;
                    </p>
                    <div className="flex items-center gap-2 text-sm font-bold opacity-70">
                      <span className="loading loading-sm loading-dots" />
                      <span>Waiting for other groups to finish…</span>
                    </div>
                  </ArcadeCard>
                ) : (
                  <ArcadeCard className="w-full" bodyClassName="gap-4 p-6">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setSubmittedRounds((prev) => ({
                          ...prev,
                          [step.qIndex]: true,
                        }));
                      }}
                      className="flex flex-col gap-4"
                    >
                      <textarea
                        id="open-response"
                        rows={4}
                        value={value}
                        onChange={(e) =>
                          setDraftAnswers((prev) => ({
                            ...prev,
                            [step.qIndex]: e.target.value,
                          }))
                        }
                        placeholder="Type your group's answer here…"
                        aria-label="Type your group's answer"
                        className="textarea textarea-lg w-full border-2 border-base-300 text-lg font-medium focus:border-primary"
                      />

                      <ArcadeButton
                        type="submit"
                        variant="primary"
                        size="lg"
                        block
                      >
                        Submit Answer
                      </ArcadeButton>
                    </form>
                  </ArcadeCard>
                )}
              </div>
            );
          })()}

          {/* STAGE 5: ROUND RESULTS & GROUP LEADERBOARD */}
          {step.type === "leaderboard" && (() => {
            const round = MOCK_QUESTION_ROUNDS[step.qIndex];
            const leaderboardRows = getGroupLeaderboard(step.qIndex, nickname);
            const yourGroupSub = round.submissions.find(
              (s) => s.groupId === "blue",
            )!;
            const submittedText =
              draftAnswers[step.qIndex]?.trim() || yourGroupSub.answer;

            return (
              <div className="flex w-full flex-col gap-6">
                {/* Score & Answer Banner */}
                <div className="overflow-hidden rounded-box border-2 border-base-300 border-b-8 bg-base-100">
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-emerald-500 px-6 py-4 text-white">
                    <span className="text-xl font-black">
                      {yourGroupSub.verdict}!
                    </span>
                    <span className="font-mono text-2xl font-black">
                      +{yourGroupSub.pointsEarned} pts
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 p-6">
                    <p className="text-lg font-bold">
                      &ldquo;{submittedText}&rdquo;
                    </p>
                    <p className=" border-t border-base-300 pt-3 text-sm font-medium opacity-75">
                      <span className="font-bold opacity-100">Correct answer: </span>
                      {round.referenceAnswer}
                    </p>
                  </div>
                </div>

                <ArcadeLeaderboard
                  rows={leaderboardRows}
                  gameCode={pin}
                  highlightGroupId="blue"
                  title="Leaderboard"
                />
              </div>
            );
          })()}

          {/* STAGE 6: FINAL PODIUM */}
          {step.type === "podium" && (() => {
            const finalRows = getGroupLeaderboard(
              MOCK_QUESTION_ROUNDS.length - 1,
              nickname,
            );
            const winner = finalRows[0];

            return (
              <div className="flex w-full flex-col gap-6">
                <div className={`rounded-box border-2 border-slate-900/20 border-b-8 p-8 text-center ${winner.group.solidBgClass}`}>
                  <h1 className="text-4xl font-black sm:text-5xl">
                    1st Place: {winner.group.name}!
                  </h1>
                  <p className="mt-1 font-mono text-2xl font-black">
                    {winner.totalScore.toLocaleString()} pts
                  </p>

                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    {winner.members.map((member) => (
                      <div
                        key={member}
                        className="flex items-center gap-2 rounded-box border-2 border-slate-900/20 border-b-4 bg-white px-4 py-2 text-slate-900"
                      >
                        <ArcadeCritterAvatar
                          name={member}
                          gameCode={pin}
                          sizeClassName="size-10"
                        />
                        <span className="font-black">{member}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <ArcadeLeaderboard
                  rows={finalRows}
                  gameCode={pin}
                  highlightGroupId="blue"
                  title="Final Standings"
                />
              </div>
            );
          })()}
        </div>

        <ArcadeDemoControlBar
          roleLabel="Student"
          stageLabel={step.label}
          stepIndex={stepIndex}
          totalSteps={STUDENT_STEPS.length}
          onPrev={goPrev}
          onNext={goNext}
          onReset={resetDemo}
        />
      </div>
    </div>
  );
}
