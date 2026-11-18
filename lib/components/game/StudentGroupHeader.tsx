import type { MockGroup } from "@/lib/game/mockGame";

export default function StudentGroupHeader({ group }: { group: MockGroup }) {
  return (
    <header
      className="px-4 py-5"
      style={{ backgroundColor: group.color.hex, color: group.color.textHex }}
    >
      <div className="mx-auto w-full max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-widest opacity-80">Your group</p>
        <p className="text-3xl font-bold">{group.color.name}</p>
        <p className="text-sm opacity-90">{group.members.join(", ")}</p>
      </div>
    </header>
  );
}
