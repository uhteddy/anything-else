"use client";

import { useState } from "react";
import Link from "next/link";
import { useActionState } from "react";
import { joinGameAction } from "@/app/join/actions";

export default function JoinGame() {
  const [joinState, formAction, isPending] = useActionState(joinGameAction, {});
  const [pin, setPin] = useState("");
  const [nickname, setNickname] = useState("");
  const [errors, setErrors] = useState<{ pin?: string; nickname?: string }>({});
  const [hideServerError, setHideServerError] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const name = nickname.trim();
    const next: { pin?: string; nickname?: string } = {};
    if (!pin) next.pin = "Please enter a game PIN.";
    else if (pin.length !== 6) next.pin = "The game PIN must be 6 digits.";
    if (!name) next.nickname = "Please enter a nickname.";
    setErrors(next);
    if (next.pin || next.nickname) {
      e.preventDefault();
      return;
    }
    setHideServerError(false);
  }

  return (
    <main className="flex flex-col items-center gap-8 px-4 py-12">
      <section className="flex max-w-md flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-bold">Join Game</h1>
        <p className="text-lg opacity-70">Enter your game PIN and nickname to join a quiz.</p>
      </section>

      <form
        action={formAction}
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
              name="pin"
              className={`input input-lg w-full text-center font-mono text-2xl tracking-widest ${errors.pin ? "input-error" : ""}`}
              inputMode="numeric"
              autoComplete="off"
              placeholder="000000"
              maxLength={6}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, ""));
                setErrors((current) => ({ ...current, pin: undefined }));
                setHideServerError(true);
              }}
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
              name="nickname"
              className={`input input-lg w-full ${errors.nickname ? "input-error" : ""}`}
              placeholder="e.g. CodeNinja"
              maxLength={16}
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setErrors((current) => ({ ...current, nickname: undefined }));
                setHideServerError(true);
              }}
              aria-invalid={Boolean(errors.nickname)}
              aria-describedby={errors.nickname ? "nickname-error" : undefined}
            />
            {errors.nickname && (
              <p id="nickname-error" className="label text-error">
                {errors.nickname}
              </p>
            )}
          </fieldset>

          {!hideServerError && !isPending && joinState.error && (
            <p className="alert alert-error" role="alert">
              {joinState.error}
            </p>
          )}

          <button type="submit" className="btn btn-lg btn-primary" disabled={isPending}>
            {isPending ? "Joining..." : "Join Game"}
          </button>
          <Link href="/" className="btn btn-ghost">
            ← Back to Play Now
          </Link>
        </div>
      </form>
    </main>
  );
}
