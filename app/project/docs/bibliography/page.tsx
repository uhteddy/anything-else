export default function Docs() {
  return (
    <main className="flex flex-col gap-4 py-8 text-left">
      <h1 className="text-center text-2xl font-bold">Bibliography</h1>
      <p className="text-center">
        These are the main frameworks, libraries, and development tools used
        to build and test Anything Else.
      </p>

        <h2 className="text-xl font-semibold">Application and UI</h2>
        <ul className="list-disc space-y-2 ps-6">
          <li>
            <a href="https://nextjs.org/docs" target="_blank" rel="noreferrer" className="text-blue-500 underline">
              Next.js Docs
            </a>{" "}
            — web framework and application routing.
          </li>
          <li>
            <a href="https://react.dev/learn" target="_blank" rel="noreferrer" className="text-blue-500 underline">
              React Quick Start
            </a>{" "}
            — library used to build the user interface.
          </li>
          <li>
            <a
              href="https://www.typescriptlang.org/docs/"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 underline"
            >
              TypeScript Documentation
            </a>{" "}
            — typed language used throughout the application.
          </li>
          <li>
            <a
              href="https://tailwindcss.com/docs"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 underline"
            >
              Get Started with Tailwind CSS
            </a>{" "}
            — utility-first styling.
          </li>
          <li>
            <a
              href="https://daisyui.com/docs/use"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 underline"
            >
              Using daisyUI
            </a>{" "}
            — component and theme classes used with Tailwind CSS.
          </li>
        </ul>
        <h2 className="text-xl font-semibold">Backend and Data</h2>
        <ul className="list-disc space-y-2 ps-6">
          <li>
            <a
              href="https://supabase.com/docs"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 underline"
            >
              Supabase Documentation
            </a>{" "}
            — backend platform and authentication client.
          </li>
          <li>
            <a
              href="https://supabase.com/docs/guides/local-development/cli/getting-started"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 underline"
            >
              Supabase CLI Quickstart
            </a>{" "}
            — local services and database migration workflow.
          </li>
          <li>
            <a
              href="https://www.postgresql.org/docs/"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 underline"
            >
              PostgreSQL Documentation
            </a>{" "}
            — relational database used by the project.
          </li>
          <li>
            <a
              href="https://orm.drizzle.team/docs/get-started"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 underline"
            >
              Get Started with Drizzle
            </a>{" "}
            — TypeScript database schema and query toolkit.
          </li>
          <li>
            <a
              href="https://github.com/porsager/postgres"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 underline"
            >
              Postgres.js GitHub Repository
            </a>{" "}
            — PostgreSQL client used by Drizzle.
          </li>
        </ul>
        <h2 className="text-xl font-semibold">Development and Testing</h2>
        <ul className="list-disc space-y-2 ps-6">
          <li>
            <a
              href="https://nodejs.org/docs/latest/api/"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 underline"
            >
              Node.js Documentation
            </a>{" "}
            — JavaScript runtime for development and build scripts.
          </li>
          <li>
            <a
              href="https://docs.npmjs.com/"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 underline"
            >
              npm Docs
            </a>{" "}
            — package management and project scripts.
          </li>
          <li>
            <a href="https://docs.docker.com/" target="_blank" rel="noreferrer" className="text-blue-500 underline">
              Docker Docs
            </a>{" "}
            — runs the local Supabase services.
          </li>
          <li>
            <a href="https://vitest.dev/guide/" target="_blank" rel="noreferrer" className="text-blue-500 underline">
              Vitest Getting Started
            </a>{" "}
            — test runner used by the project.
          </li>
          <li>
            <a
              href="https://eslint.org/docs/latest/"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 underline"
            >
              ESLint Documentation
            </a>{" "}
            — code linting.
          </li>
          <li>
            <a href="https://git-scm.com/doc" target="_blank" rel="noreferrer" className="text-blue-500 underline">
              Git Reference Page
            </a>{" "}
            and{" "}
            <a
              href="https://docs.github.com/"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 underline"
            >
              GitHub Docs
            </a>{" "}
            — source control and repository collaboration.
          </li>
        </ul>
    </main>
  );
}
