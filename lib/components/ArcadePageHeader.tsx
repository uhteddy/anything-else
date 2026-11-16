import type { ReactNode } from "react";

type ArcadePageHeaderProps = {
  title: string;
  description?: string;
  align?: "left" | "center";
  actions?: ReactNode;
};

export default function ArcadePageHeader({
  title,
  description,
  align = "left",
  actions,
}: ArcadePageHeaderProps) {
  if (align === "center") {
    return (
      <header className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-lg font-medium opacity-75">
            {description}
          </p>
        )}
        {actions && <div className="mt-2 flex flex-wrap justify-center gap-3">{actions}</div>}
      </header>
    );
  }

  return (
    <header className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-lg font-medium opacity-75">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </header>
  );
}
