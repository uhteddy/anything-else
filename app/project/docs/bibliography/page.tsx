import ArcadeCard from "@/lib/components/ArcadeCard";
import ArcadePageHeader from "@/lib/components/ArcadePageHeader";

const BIBLIOGRAPHY_GROUPS = [
  {
    title: "Application and UI",
    accentColor: "bg-primary" as const,
    items: [
      {
        label: "Next.js Docs",
        href: "https://nextjs.org/docs",
        note: "web framework and application routing.",
      },
      {
        label: "React Quick Start",
        href: "https://react.dev/learn",
        note: "library used to build the user interface.",
      },
      {
        label: "TypeScript Documentation",
        href: "https://www.typescriptlang.org/docs/",
        note: "typed language used throughout the application.",
      },
      {
        label: "Get Started with Tailwind CSS",
        href: "https://tailwindcss.com/docs",
        note: "utility-first styling.",
      },
      {
        label: "Using daisyUI",
        href: "https://daisyui.com/docs/use",
        note: "component and theme classes used with Tailwind CSS.",
      },
    ],
  },
  {
    title: "Backend and Data",
    accentColor: "bg-secondary" as const,
    items: [
      {
        label: "Supabase Documentation",
        href: "https://supabase.com/docs",
        note: "backend platform and authentication client.",
      },
      {
        label: "Supabase CLI Quickstart",
        href: "https://supabase.com/docs/guides/local-development/cli/getting-started",
        note: "local services and database migration workflow.",
      },
      {
        label: "PostgreSQL Documentation",
        href: "https://www.postgresql.org/docs/",
        note: "relational database used by the project.",
      },
      {
        label: "Get Started with Drizzle",
        href: "https://orm.drizzle.team/docs/get-started",
        note: "TypeScript database schema and query toolkit.",
      },
      {
        label: "Postgres.js GitHub Repository",
        href: "https://github.com/porsager/postgres",
        note: "PostgreSQL client used by Drizzle.",
      },
    ],
  },
  {
    title: "Development and Testing",
    accentColor: "bg-accent" as const,
    items: [
      {
        label: "Node.js Documentation",
        href: "https://nodejs.org/docs/latest/api/",
        note: "JavaScript runtime for development and build scripts.",
      },
      {
        label: "npm Docs",
        href: "https://docs.npmjs.com/",
        note: "package management and project scripts.",
      },
      {
        label: "Docker Docs",
        href: "https://docs.docker.com/",
        note: "runs the local Supabase services.",
      },
      {
        label: "Vitest Getting Started",
        href: "https://vitest.dev/guide/",
        note: "test runner used by the project.",
      },
      {
        label: "ESLint Documentation",
        href: "https://eslint.org/docs/latest/",
        note: "code linting.",
      },
      {
        label: "Git & GitHub Docs",
        href: "https://docs.github.com/",
        note: "source control and repository collaboration.",
      },
    ],
  },
];

export default function Docs() {
  return (
    <div className="flex flex-col gap-8">
      <ArcadePageHeader
        title="Bibliography"
        description="Main frameworks, libraries, and development tools used to build and test Anything Else."
      />

      <div className="flex flex-col gap-6">
        {BIBLIOGRAPHY_GROUPS.map((group) => (
          <ArcadeCard
            key={group.title}
            accentColor={group.accentColor}
            accentSize="sm"
            bodyClassName="gap-4 p-6 sm:p-8"
          >
            <h2 className="card-title text-2xl font-black">{group.title}</h2>
            <ul className="list-disc space-y-2 ps-6 text-base">
              {group.items.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="link font-bold link-primary"
                  >
                    {item.label} ↗
                  </a>{" "}
                  — {item.note}
                </li>
              ))}
            </ul>
          </ArcadeCard>
        ))}
      </div>
    </div>
  );
}
