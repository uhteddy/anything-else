import type { GroupColor } from "@/lib/game/mockGame";

type GroupChipProps = {
  color: GroupColor;
  size?: "sm" | "md" | "lg";
};

const DOT_SIZES = { sm: "size-3", md: "size-4", lg: "size-6" };
const TEXT_SIZES = { sm: "text-sm", md: "text-base", lg: "text-xl" };

export default function GroupChip({ color, size = "md" }: GroupChipProps) {
  return (
    <span className={`inline-flex items-center gap-2 font-semibold ${TEXT_SIZES[size]}`}>
      <span
        className={`${DOT_SIZES[size]} shrink-0 rounded-full border border-base-content/20`}
        style={{ backgroundColor: color.hex }}
        aria-hidden="true"
      />
      {color.name}
    </span>
  );
}
