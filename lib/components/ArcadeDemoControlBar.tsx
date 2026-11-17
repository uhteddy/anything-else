"use client";

import ArcadeButton from "@/lib/components/ArcadeButton";

type ArcadeDemoControlBarProps = {
  roleLabel: string;
  stageLabel: string;
  stepIndex: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onReset?: () => void;
};

export default function ArcadeDemoControlBar({
  roleLabel,
  stageLabel,
  stepIndex,
  totalSteps,
  onPrev,
  onNext,
  onReset,
}: ArcadeDemoControlBarProps) {
  const isFirst = stepIndex <= 0;
  const isLast = stepIndex >= totalSteps - 1;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-box border-2 border-base-300 border-b-8 bg-base-100 px-4 py-3 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="badge badge-neutral font-black uppercase">
            {roleLabel}
          </span>
          <span className="text-sm font-black sm:text-base">
            {stageLabel}
          </span>
          <span className="text-xs font-bold opacity-60">
            ({stepIndex + 1}/{totalSteps})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ArcadeButton
            type="button"
            variant="neutral"
            onClick={onPrev}
            disabled={isFirst}
          >
            ← Prev
          </ArcadeButton>

          {isLast && onReset ? (
            <ArcadeButton
              type="button"
              variant="secondary"
              onClick={onReset}
            >
              Restart Demo ↺
            </ArcadeButton>
          ) : (
            <ArcadeButton
              type="button"
              variant="primary"
              onClick={onNext}
              disabled={isLast}
            >
              Next Stage →
            </ArcadeButton>
          )}
        </div>
      </div>
    </div>
  );
}
