"use client";

import { useRef, useState } from "react";

const PIN_LENGTH = 6;

type GamePinInputProps = {
  /** Form field name. A single hidden input with this name holds the full PIN. */
  name: string;
  /** id of the first box, so a <label htmlFor> can point at it. */
  id: string;
  /** id of the visible label for the whole group. */
  labelledBy: string;
  /** Called with the digits typed so far, e.g. "1234" or "123456". */
  onChange: (pin: string) => void;
  invalid?: boolean;
  describedBy?: string;
  disabled?: boolean;
};

/**
 * Six single-digit boxes for a game PIN.
 *
 * The boxes are only the visible part: they have no `name`, so the form
 * submits exactly one field (`name`) containing all the digits. Server actions
 * therefore receive the same `pin` value as a plain text input would send.
 */
export default function GamePinInput({
  name,
  id,
  labelledBy,
  onChange,
  invalid = false,
  describedBy,
  disabled = false,
}: GamePinInputProps) {
  const [digits, setDigits] = useState<string[]>(() => Array(PIN_LENGTH).fill(""));
  const boxes = useRef<Array<HTMLInputElement | null>>([]);

  function focusBox(index: number) {
    const box = boxes.current[Math.max(0, Math.min(PIN_LENGTH - 1, index))];
    box?.focus();
    box?.select();
  }

  function update(next: string[]) {
    setDigits(next);
    onChange(next.join(""));
  }

  /** Write `text`'s digits into the boxes starting at `start`; returns the last box filled. */
  function fillFrom(start: number, text: string) {
    const incoming = text.replace(/\D/g, "").slice(0, PIN_LENGTH - start);
    if (!incoming) return start;
    const next = [...digits];
    for (let offset = 0; offset < incoming.length; offset += 1) {
      next[start + offset] = incoming[offset];
    }
    update(next);
    return start + incoming.length - 1;
  }

  function handleChange(index: number, rawValue: string) {
    const typed = rawValue.replace(/\D/g, "");
    if (!typed) {
      // Non-digit typed, or the box was cleared: keep the box empty.
      const next = [...digits];
      next[index] = "";
      update(next);
      return;
    }
    // Typing into a box that already had a digit (caret not on the digit):
    // keep only the newly typed one instead of spilling into the next box.
    const previous = digits[index];
    const input =
      previous && typed.length === 2 && typed.includes(previous)
        ? typed[0] === previous
          ? typed[1]
          : typed[0]
        : typed;
    // Usually one digit; autofill on some phones can deliver several at once.
    const lastFilled = fillFrom(index, input);
    focusBox(lastFilled + 1);
  }

  function handlePaste(index: number, event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    // A full PIN always fills from the first box, wherever it was pasted.
    const start = pasted.length >= PIN_LENGTH ? 0 : index;
    const lastFilled = fillFrom(start, pasted);
    focusBox(lastFilled + 1);
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case "Backspace": {
        event.preventDefault();
        const next = [...digits];
        if (next[index]) {
          next[index] = "";
          update(next);
        } else if (index > 0) {
          next[index - 1] = "";
          update(next);
          focusBox(index - 1);
        }
        break;
      }
      case "Delete": {
        event.preventDefault();
        const next = [...digits];
        next[index] = "";
        update(next);
        break;
      }
      case "ArrowLeft":
        event.preventDefault();
        focusBox(index - 1);
        break;
      case "ArrowRight":
        event.preventDefault();
        focusBox(index + 1);
        break;
      case "Home":
        event.preventDefault();
        focusBox(0);
        break;
      case "End":
        event.preventDefault();
        focusBox(PIN_LENGTH - 1);
        break;
    }
  }

  return (
    <div role="group" aria-labelledby={labelledBy} aria-describedby={describedBy}>
      <input type="hidden" name={name} value={digits.join("")} />
      <div className="flex w-full justify-between gap-2 sm:gap-3">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              boxes.current[index] = element;
            }}
            id={index === 0 ? id : undefined}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            maxLength={PIN_LENGTH}
            value={digit}
            disabled={disabled}
            aria-label={`Digit ${index + 1} of ${PIN_LENGTH}`}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            onChange={(event) => handleChange(index, event.target.value)}
            onPaste={(event) => handlePaste(index, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onFocus={(event) => event.target.select()}
            className={`aspect-square w-full max-w-16 min-w-0 rounded-field border-2 bg-base-100 text-center text-2xl font-extrabold text-base-content shadow-sm transition-colors outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 disabled:opacity-60 sm:text-3xl ${
              invalid ? "border-error" : digit ? "border-primary/60" : "border-base-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
