import type { ReactNode } from "react";
import ArcadeButton from "@/lib/components/ArcadeButton";

type GameSubHeaderProps = {
  backHref: string;
  backLabel?: string;
  rightSlot?: ReactNode;
};

export default function GameSubHeader({
  backHref,
  backLabel = "← Back",
  rightSlot,
}: GameSubHeaderProps) {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4">
      <ArcadeButton href={backHref} variant="neutral">
        {backLabel}
      </ArcadeButton>
      {rightSlot}
    </header>
  );
}
