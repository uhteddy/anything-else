"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ArcadeButton from "@/lib/components/ArcadeButton";
import ArcadeCard from "@/lib/components/ArcadeCard";
import GameSubHeader from "@/lib/components/GameSubHeader";

// Join Game UI (Prototype V1). No real game session: a valid-looking
// submission goes to the waiting lobby, carrying the PIN and nickname in the URL.
export default function JoinGame() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [nickname, setNickname] = useState("");
  const [errors, setErrors] = useState<{ pin?: string; nickname?: string }>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = nickname.trim();
    const next: { pin?: string; nickname?: string } = {};
    if (!pin) next.pin = "Please enter a game PIN.";
    else if (pin.length !== 6) next.pin = "The game PIN must be 6 digits.";
    if (!name) next.nickname = "Please enter a nickname.";
    setErrors(next);
    if (next.pin || next.nickname) return;
    router.push(`/join/lobby?${new URLSearchParams({ pin, nickname: name })}`);
  }

  return (
    <main className="flex min-h-screen flex-col bg-base-200 px-4 py-6">
      <GameSubHeader backHref="/" />

      <div className="flex flex-1 flex-col items-center justify-center py-8">
        <div className="flex w-full max-w-md flex-col items-center gap-6">
          <div className="text-center">
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Join Game
            </h1>
            <p className="mt-2 text-base font-medium opacity-75">
              Enter the 6-digit PIN on your teacher&apos;s screen.
            </p>
          </div>

          <ArcadeCard className="w-full" bodyClassName="p-6 sm:p-8">
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              <fieldset className="fieldset">
                <label htmlFor="pin" className="fieldset-legend text-sm font-extrabold uppercase tracking-wider">
                  Game PIN
                </label>
                <input
                  id="pin"
                  className={`input input-lg h-16 w-full border-2 text-center font-mono text-3xl font-black tracking-[0.35em] ${
                    errors.pin ? "input-error" : "border-base-300 focus:border-primary"
                  }`}
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="000000"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  aria-invalid={Boolean(errors.pin)}
                  aria-describedby={errors.pin ? "pin-error" : undefined}
                />
                {errors.pin && (
                  <p id="pin-error" className="label font-semibold text-error">
                    {errors.pin}
                  </p>
                )}
              </fieldset>

              <fieldset className="fieldset">
                <label htmlFor="nickname" className="fieldset-legend text-sm font-extrabold uppercase tracking-wider">
                  Nickname
                </label>
                <input
                  id="nickname"
                  className={`input input-lg h-14 w-full border-2 text-center text-xl font-bold ${
                    errors.nickname ? "input-error" : "border-base-300 focus:border-primary"
                  }`}
                  placeholder="Your nickname"
                  maxLength={16}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  aria-invalid={Boolean(errors.nickname)}
                  aria-describedby={errors.nickname ? "nickname-error" : undefined}
                />
                {errors.nickname && (
                  <p id="nickname-error" className="label font-semibold text-error">
                    {errors.nickname}
                  </p>
                )}
              </fieldset>

              <ArcadeButton type="submit" variant="primary" size="lg" block className="mt-2 text-xl">
                Enter!
              </ArcadeButton>
            </form>
          </ArcadeCard>
        </div>
      </div>
    </main>
  );
}
