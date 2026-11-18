import { formatTime } from "@/lib/game/mockGame";

type TimerBadgeProps = {
  secondsLeft: number;
  large?: boolean;
};

export default function TimerBadge({ secondsLeft, large = false }: TimerBadgeProps) {
  return (
    <div
      className={`flex items-center gap-2 rounded-full border-2 border-warning font-mono font-bold text-warning ${
        large ? "px-5 py-2 text-4xl" : "px-3 py-1 text-xl"
      }`}
      role="timer"
      aria-label={`${secondsLeft} seconds left`}
    >
      {formatTime(secondsLeft)}
    </div>
  );
}
