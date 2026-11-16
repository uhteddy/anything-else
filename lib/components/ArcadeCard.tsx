import type { ReactNode } from "react";

type ArcadeCardProps = {
  children: ReactNode;
  accentColor?: "bg-primary" | "bg-secondary" | "bg-accent" | "bg-info";
  accentSize?: "sm" | "md";
  hoverLift?: boolean;
  className?: string;
  bodyClassName?: string;
};

export default function ArcadeCard({
  children,
  accentColor,
  accentSize = "md",
  hoverLift = false,
  className = "",
  bodyClassName = "gap-6 p-6 sm:p-8",
}: ArcadeCardProps) {
  const barHeight = accentSize === "sm" ? "h-3" : "h-4";
  const liftClass = hoverLift
    ? "transition-transform duration-150 hover:-translate-y-1"
    : "";

  return (
    <div
      className={`card overflow-hidden border-2 border-base-300 border-b-8 bg-base-100 ${liftClass} ${className}`.trim()}
    >
      {accentColor && <div className={`${barHeight} ${accentColor}`} />}
      <div className={`card-body ${bodyClassName}`.trim()}>{children}</div>
    </div>
  );
}
