"use client";

import { useEffect, useState } from "react";
import { CheckIcon, CopyIcon } from "@/lib/components/game/icons";

type GamePinCardProps = {
  pin: string;
  /** Text above the PIN, e.g. "Game PIN". */
  label: string;
  /** "lg" is for the host screen, which is often projected. */
  size?: "md" | "lg";
};

type CopyStatus = "idle" | "copied" | "failed";

/** Large lavender PIN panel with a Copy PIN button. */
export default function GamePinCard({ pin, label, size = "md" }: GamePinCardProps) {
  const [status, setStatus] = useState<CopyStatus>("idle");

  useEffect(() => {
    if (status !== "copied") return;
    const timer = window.setTimeout(() => setStatus("idle"), 2000);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function copyPin() {
    try {
      await navigator.clipboard.writeText(pin);
      setStatus("copied");
    } catch {
      // Clipboard access can be blocked (permissions, non-secure origins).
      setStatus("failed");
    }
  }

  const isLarge = size === "lg";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex w-full items-center justify-center gap-4 rounded-box border border-base-300 bg-linear-to-br from-secondary to-violet-100 px-5 py-4 sm:gap-6 sm:px-8">
        <div className="min-w-0 text-center">
          <p className="text-sm font-bold text-secondary-content">{label}</p>
          <p
            className={`font-black tracking-wider text-base-content tabular-nums ${
              isLarge ? "text-5xl sm:text-7xl" : "text-5xl sm:text-6xl"
            }`}
            aria-label={`Game PIN ${pin.split("").join(" ")}`}
          >
            {pin.slice(0, 3)}
            <span className="inline-block w-2 sm:w-3" aria-hidden="true" />
            {pin.slice(3)}
          </p>
        </div>
        <button
          type="button"
          onClick={copyPin}
          className={`btn btn-square shrink-0 rounded-field border-base-300 bg-base-100 text-primary shadow-soft hover:border-primary hover:bg-base-100 ${
            isLarge ? "btn-lg" : ""
          }`}
          aria-label="Copy game PIN"
          title="Copy game PIN"
        >
          {status === "copied" ? <CheckIcon className="text-success" /> : <CopyIcon />}
        </button>
      </div>
      <p className="min-h-5 text-sm font-semibold" aria-live="polite">
        {status === "copied" && <span className="text-success">PIN copied!</span>}
        {status === "failed" && (
          <span className="text-error">Couldn&apos;t copy. The PIN is {pin}.</span>
        )}
      </p>
    </div>
  );
}
