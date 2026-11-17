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
  MOCK_GAME_PIN,
  MOCK_LOBBY_PLAYERS,
  MOCK_NICKNAME,
  MOCK_QUESTION_ROUNDS,
} from "@/lib/game/mockData";

type HostStep =
  | { type: "lobby"; label: string }
  | { type: "groups"; label: string }
  | { type: "question"; qIndex: number; label: string }
  | { type: "leaderboard"; qIndex: number; label: string }
  | { type: "podium"; label: string };

const HOST_STEPS: HostStep[] = [
  { type: "lobby", label: "Lobby" },
  { type: "groups", label: "Groups" },
  ...MOCK_QUESTION_ROUNDS.flatMap((q, idx): HostStep[] => [
    { type: "question", qIndex: idx, label: `Q${q.number}: Question` },
    { type: "leaderboard", qIndex: idx, label: `Q${q.number}: Standings` },
  ]),
  { type: "podium", label: "Final Standings" },
];

export default function StartGame() {
  const [stepIndex, setStepIndex] = useState(0);
  const step = HOST_STEPS[stepIndex] ?? HOST_STEPS[0];
  const pin = MOCK_GAME_PIN;
  const allPlayers = [MOCK_NICKNAME, ...MOCK_LOBBY_PLAYERS.map((p) => p.nickname)];

  function goPrev() {
    setStepIndex((i) => Math.max(0, i - 1));
  }

  function goNext() {
    setStepIndex((i) => Math.min(HOST_STEPS.length - 1, i + 1));
  }

  function resetDemo() {
    setStepIndex(0);
  }

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-base-200 px-4 py-6">
      {(step.type === "lobby" || step.type === "podium") && (
        <ArcadeLobbyBackdrop />
      )}

      <div className="relative z-10 flex flex-1 flex-col">
        <GameSubHeader
          backHref="/host"
          backLabel="← End Game"
          rightSlot={
            <div className="rounded-box border-2 border-base-300 border-b-4 bg-base-100 px-4 py-2 font-mono text-lg font-black tracking-widest">
              PIN: {pin.slice(0, 3)} {pin.slice(3)}
            </div>
          }
        />

        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-8 pt-6 pb-28">
          {/* HOST STAGE 1: LOBBY */}
          {step.type === "lobby" && (
            <>
              <ArcadeCard
                accentColor="bg-primary"
                className="w-full text-center"
                bodyClassName="items-center gap-4 p-8 sm:p-10"
              >
                <p className="text-base font-bold opacity-75">
                  Enter this Game PIN to join:
                </p>
                <h1 className="font-mono text-5xl font-black tracking-widest sm:text-7xl">
                  {pin.slice(0, 3)} {pin.slice(3)}
                </h1>
                <div className="mt-2 flex flex-wrap justify-center gap-3">
                  <ArcadeButton
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={goNext}
                  >
                    Assign Groups & Start →
                  </ArcadeButton>
                </div>
              </ArcadeCard>

              <section className="w-full">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-xl font-black">
                    Players ({allPlayers.length})
                  </h2>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                  {allPlayers.map((name) => (
                    <li
                      key={name}
                      className="flex items-center gap-3 rounded-box border-2 border-base-300 border-b-4 bg-base-100 p-3"
                    >
                      <ArcadeCritterAvatar
                        name={name}
                        gameCode={pin}
                        sizeClassName="size-11"
                      />
                      <span className="truncate text-base font-bold">
                        {name}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}

          {/* HOST STAGE 2: ASSIGNED GROUPS — SOLID COLOR GROUP CARDS */}
          {step.type === "groups" && (
            <div className="flex w-full flex-col gap-6">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <h1 className="text-4xl font-black">Groups</h1>
                  <p className="text-base font-medium opacity-75">
                    Find your team before Question 1 starts!
                  </p>
                </div>
                <ArcadeButton type="button" variant="primary" onClick={goNext}>
                  Start Question 1 →
                </ArcadeButton>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {MOCK_COLOR_GROUPS.map((group) => {
                  const members =
                    group.id === "blue"
                      ? [MOCK_NICKNAME, ...group.members]
                      : group.members;
                  return (
                    <div
                      key={group.id}
                      className={`flex flex-col gap-4 rounded-box border-2 border-slate-900/20 border-b-8 p-6 ${group.solidBgClass}`}
                    >
                      <h2 className="text-3xl font-black">{group.name}</h2>

                      <ul className="flex flex-wrap gap-3">
                        {members.map((member) => (
                          <li
                            key={member}
                            className="flex items-center gap-2 rounded-box border-2 border-slate-900/20 border-b-4 bg-white px-3 py-2 text-slate-900"
                          >
                            <ArcadeCritterAvatar
                              name={member}
                              gameCode={pin}
                              sizeClassName="size-10"
                            />
                            <span className="text-base font-black">{member}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* HOST STAGE 3: ACTIVE QUESTION */}
          {step.type === "question" && (() => {
            const round = MOCK_QUESTION_ROUNDS[step.qIndex];
            return (
              <div className="flex w-full flex-col gap-6">
                <div className="flex flex-col items-center gap-6 rounded-box border-2 border-base-300 border-b-8 bg-base-100 p-8 text-center sm:p-12">
                  <div className="flex w-full items-center justify-between">
                    <span className="flex size-12 items-center justify-center rounded-full bg-primary text-xl font-black text-primary-content">
                      {round.number}
                    </span>
                    <span className="rounded-box border-2 border-base-300 bg-base-200 px-4 py-1.5 font-mono text-xl font-black">
                      {round.timeLimitSeconds}s
                    </span>
                  </div>

                  <h1 className="max-w-3xl text-3xl font-black leading-tight sm:text-5xl">
                    {round.prompt}
                  </h1>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                  {MOCK_COLOR_GROUPS.map((group) => (
                    <div
                      key={group.id}
                      className={`flex items-center justify-between rounded-box border-2 border-slate-900/20 border-b-8 p-4 ${group.solidBgClass}`}
                    >
                      <span className="text-lg font-black">{group.name}</span>
                      <span className="rounded-box bg-black/20 px-2.5 py-1 text-xs font-black">
                        Answered
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* HOST STAGE 4: CLASS RESPONSES & GROUP LEADERBOARD */}
          {step.type === "leaderboard" && (() => {
            const round = MOCK_QUESTION_ROUNDS[step.qIndex];
            const leaderboardRows = getGroupLeaderboard(
              step.qIndex,
              MOCK_NICKNAME,
            );

            return (
              <div className="flex w-full flex-col gap-6">
                <ArcadeCard className="w-full" bodyClassName="gap-5 p-6 sm:p-8">
                  <div className="border-b-2 border-base-300 pb-4">
                    <h1 className="text-2xl font-black">
                      Question {round.number}: {round.prompt}
                    </h1>
                    <p className="mt-1 text-base font-medium opacity-80">
                      <span className="font-bold opacity-100">Answer: </span>
                      {round.referenceAnswer}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {MOCK_COLOR_GROUPS.map((group) => {
                      const sub = round.submissions.find(
                        (s) => s.groupId === group.id,
                      )!;
                      return (
                        <div
                          key={group.id}
                          className="overflow-hidden rounded-box border-2 border-base-300 border-b-4 bg-base-200/50"
                        >
                          <div className={`flex items-center justify-between px-4 py-2 ${group.solidBgClass}`}>
                            <span className="font-black">{group.name}</span>
                            <span className="font-mono text-sm font-black">
                              +{sub.pointsEarned} pts
                            </span>
                          </div>
                          <p className="p-4 text-base font-medium">
                            &ldquo;{sub.answer}&rdquo;
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </ArcadeCard>

                <ArcadeLeaderboard
                  rows={leaderboardRows}
                  gameCode={pin}
                  title="Leaderboard"
                />
              </div>
            );
          })()}

          {/* HOST STAGE 5: FINAL PODIUM */}
          {step.type === "podium" && (() => {
            const finalRows = getGroupLeaderboard(
              MOCK_QUESTION_ROUNDS.length - 1,
              MOCK_NICKNAME,
            );
            const winner = finalRows[0];

            return (
              <div className="flex w-full flex-col gap-6">
                <div className={`rounded-box border-2 border-slate-900/20 border-b-8 p-8 text-center sm:p-10 ${winner.group.solidBgClass}`}>
                  <h1 className="text-4xl font-black sm:text-6xl">
                    1st Place: {winner.group.name}!
                  </h1>
                  <p className="mt-2 font-mono text-3xl font-black">
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
                  title="Final Leaderboard"
                />
              </div>
            );
          })()}
        </div>

        <ArcadeDemoControlBar
          roleLabel="Instructor"
          stageLabel={step.label}
          stepIndex={stepIndex}
          totalSteps={HOST_STEPS.length}
          onPrev={goPrev}
          onNext={goNext}
          onReset={resetDemo}
        />
      </div>
    </main>
  );
}
