"use client";

import { useState } from "react";
import { useActionState } from "react";
import { joinGameAction } from "@/app/join/actions";
import GamePinInput from "@/lib/components/game/GamePinInput";
import {
  ArrowRightIcon,
  BurstIcon,
  GamepadIcon,
  UserIcon,
  UsersIcon,
} from "@/lib/components/game/icons";

// Form logic (state, validation, messages, server action) is unchanged from the
// previous app/join/page.tsx; only the markup and styling are new.
export function JoinForm() {
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
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="join-title"
      className="card w-full max-w-lg border border-base-300 bg-base-100 shadow-soft"
    >
      <div className="card-body gap-6 px-5 py-8 sm:px-10">
        <header className="flex flex-col items-center gap-2 text-center">
          <span className="flex size-18 items-center justify-center rounded-full bg-secondary text-primary">
            <UsersIcon className="size-10" />
          </span>
          <h1
            id="join-title"
            className="relative mt-1 text-3xl font-black tracking-tight sm:text-4xl"
          >
            <BurstIcon className="absolute top-0 -left-10 hidden size-7 -rotate-30 text-accent sm:block" />
            Join Game
            <BurstIcon className="absolute top-0 -right-10 hidden size-7 rotate-30 text-accent sm:block" />
          </h1>
          <p className="text-base-content/70">
            Enter the game PIN and your nickname to join.
          </p>
        </header>

        <div className="flex flex-col gap-2">
          <label id="pin-label" htmlFor="pin" className="font-bold">
            Game PIN
          </label>
          <GamePinInput
            name="pin"
            id="pin"
            labelledBy="pin-label"
            onChange={(value) => {
              setPin(value);
              setErrors((current) => ({ ...current, pin: undefined }));
              setHideServerError(true);
            }}
            invalid={Boolean(errors.pin)}
            describedBy={errors.pin ? "pin-error" : undefined}
            disabled={isPending}
          />
          {errors.pin && (
            <p id="pin-error" className="text-sm font-semibold text-error">
              {errors.pin}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="nickname" className="font-bold">
            Nickname
          </label>
          <div
            className={`input input-lg w-full rounded-field border-2 ${
              errors.nickname ? "input-error" : "border-base-300 focus-within:border-primary"
            }`}
          >
            <UserIcon className="size-5 text-primary" />
            <input
              id="nickname"
              name="nickname"
              className="grow font-semibold"
              placeholder="e.g. CodeNinja"
              maxLength={16}
              autoComplete="nickname"
              value={nickname}
              disabled={isPending}
              onChange={(e) => {
                setNickname(e.target.value);
                setErrors((current) => ({ ...current, nickname: undefined }));
                setHideServerError(true);
              }}
              aria-invalid={Boolean(errors.nickname)}
              aria-describedby={errors.nickname ? "nickname-error" : "nickname-help"}
            />
          </div>
          {errors.nickname ? (
            <p id="nickname-error" className="text-sm font-semibold text-error">
              {errors.nickname}
            </p>
          ) : (
            <p id="nickname-help" className="text-sm text-base-content/60">
              Up to 16 characters. Other players will see this name.
            </p>
          )}
        </div>

        {!hideServerError && !isPending && joinState.error && (
          <p className="alert alert-error alert-soft font-semibold" role="alert">
            {joinState.error}
          </p>
        )}

        <button
          type="submit"
          className="btn btn-game btn-lg btn-block rounded-full text-lg"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <span className="loading loading-spinner loading-sm" aria-hidden="true" />
              Joining...
            </>
          ) : (
            <>
              <GamepadIcon className="size-6" />
              Join Game
              <ArrowRightIcon />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
