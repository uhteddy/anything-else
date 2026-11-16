"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    <main className="flex flex-col items-center gap-8 px-4 py-12">
      <section className="flex max-w-md flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-bold">Join Game</h1>
        <p className="text-lg opacity-70">Enter your game PIN and nickname to join a quiz.</p>
      </section>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="card w-full max-w-md border border-base-300 bg-base-100 shadow-md"
      >
        <div className="card-body gap-4">
          <fieldset className="fieldset">
            <label htmlFor="pin" className="fieldset-legend">
              Game PIN
            </label>
            <input
              id="pin"
              className={`input input-lg w-full text-center font-mono text-2xl tracking-widest ${errors.pin ? "input-error" : ""}`}
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
              <p id="pin-error" className="label text-error">
                {errors.pin}
              </p>
            )}
          </fieldset>

          <fieldset className="fieldset">
            <label htmlFor="nickname" className="fieldset-legend">
              Nickname
            </label>
            <input
              id="nickname"
              className={`input input-lg w-full ${errors.nickname ? "input-error" : ""}`}
              placeholder="e.g. CodeNinja"
              maxLength={16}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              aria-invalid={Boolean(errors.nickname)}
              aria-describedby={errors.nickname ? "nickname-error" : undefined}
            />
            {errors.nickname && (
              <p id="nickname-error" className="label text-error">
                {errors.nickname}
              </p>
            )}
          </fieldset>

          <button type="submit" className="btn btn-lg btn-primary">
            Join Game
          </button>
          <Link href="/" className="btn btn-ghost">
            ← Back to Play Now
          </Link>
        </div>
      </form>
    </main>
  );
}
