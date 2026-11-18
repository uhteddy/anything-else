"use client";

import Link from "next/link";
import { useState } from "react";
import { getGroup, MOCK_PLAYER } from "@/lib/game/mockGame";

export default function StudentGroup() {
  const group = getGroup(MOCK_PLAYER.groupName);
  const [foundGroup, setFoundGroup] = useState(false);

  return (
    <main
      className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 py-10 text-center"
      style={{ backgroundColor: group.color.hex, color: group.color.textHex }}
    >
      <p className="text-sm font-semibold uppercase tracking-widest opacity-80">Your group is</p>
      <h1 className="text-6xl font-black sm:text-8xl">{group.color.name}</h1>
      <p className="text-lg">Find the students whose screens show this color.</p>
      <ul className="flex flex-wrap justify-center gap-2">
        {group.members.map((member) => (
          <li
            key={member}
            className="rounded-full border-2 px-4 py-1 font-semibold"
            style={{ borderColor: group.color.textHex }}
          >
            {member}
            {member === MOCK_PLAYER.nickname && " (you)"}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex w-full max-w-xs flex-col gap-3">
        <button
          type="button"
          className="btn btn-lg"
          disabled={foundGroup}
          onClick={() => setFoundGroup(true)}
        >
          {foundGroup ? "✓ Found my group" : "I found my group"}
        </button>
        <Link href="/play/question" className="btn btn-ghost" style={{ color: group.color.textHex }}>
          Continue to question 3 →
        </Link>
      </div>
    </main>
  );
}
