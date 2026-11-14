export default function Docs() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8 text-left">
      <h1 className="text-center text-2xl font-bold">Bibliography</h1>
      <p>
        These are the main frameworks, libraries, and development tools used
        to build and test Anything Else.
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Application and UI</h2>
        <ul className="list-disc space-y-2 ps-6">
          <li>
            <a href="https://nextjs.org/docs" target="_blank" rel="noreferrer">
              Next.js documentation
            </a>{" "}
            — web framework and application routing.
          </li>
          <li>
            <a href="https://react.dev/learn" target="_blank" rel="noreferrer">
              React documentation
            </a>{" "}
            — library used to build the user interface.
          </li>
          <li>
            <a
              href="https://www.typescriptlang.org/docs/"
              target="_blank"
              rel="noreferrer"
            >
              TypeScript documentation
            </a>{" "}
            — typed language used throughout the application.
          </li>
          <li>
            <a
              href="https://tailwindcss.com/docs"
              target="_blank"
              rel="noreferrer"
            >
              Tailwind CSS documentation
            </a>{" "}
            — utility-first styling.
          </li>
          <li>
            <a
              href="https://daisyui.com/docs/"
              target="_blank"
              rel="noreferrer"
            >
              daisyUI documentation
            </a>{" "}
            — component and theme classes used with Tailwind CSS.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Backend and Data</h2>
        <ul className="list-disc space-y-2 ps-6">
          <li>
            <a
              href="https://supabase.com/docs"
              target="_blank"
              rel="noreferrer"
            >
              Supabase documentation
            </a>{" "}
            — backend platform and authentication client.
          </li>
          <li>
            <a
              href="https://supabase.com/docs/guides/local-development/cli/getting-started"
              target="_blank"
              rel="noreferrer"
            >
              Supabase CLI documentation
            </a>{" "}
            — local services and database migration workflow.
          </li>
          <li>
            <a
              href="https://www.postgresql.org/docs/"
              target="_blank"
              rel="noreferrer"
            >
              PostgreSQL documentation
            </a>{" "}
            — relational database used by the project.
          </li>
          <li>
            <a
              href="https://orm.drizzle.team/docs/overview"
              target="_blank"
              rel="noreferrer"
            >
              Drizzle ORM documentation
            </a>{" "}
            — TypeScript database schema and query toolkit.
          </li>
          <li>
            <a
              href="https://github.com/porsager/postgres"
              target="_blank"
              rel="noreferrer"
            >
              Postgres.js project
            </a>{" "}
            — PostgreSQL client used by Drizzle.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Development and Testing</h2>
        <ul className="list-disc space-y-2 ps-6">
          <li>
            <a
              href="https://nodejs.org/docs/latest/api/"
              target="_blank"
              rel="noreferrer"
            >
              Node.js documentation
            </a>{" "}
            — JavaScript runtime for development and build scripts.
          </li>
          <li>
            <a
              href="https://docs.npmjs.com/"
              target="_blank"
              rel="noreferrer"
            >
              npm documentation
            </a>{" "}
            — package management and project scripts.
          </li>
          <li>
            <a href="https://docs.docker.com/" target="_blank" rel="noreferrer">
              Docker documentation
            </a>{" "}
            — runs the local Supabase services.
          </li>
          <li>
            <a href="https://vitest.dev/guide/" target="_blank" rel="noreferrer">
              Vitest documentation
            </a>{" "}
            — test runner used by the project.
          </li>
          <li>
            <a
              href="https://eslint.org/docs/latest/"
              target="_blank"
              rel="noreferrer"
            >
              ESLint documentation
            </a>{" "}
            — code linting.
          </li>
          <li>
            <a href="https://git-scm.com/doc" target="_blank" rel="noreferrer">
              Git documentation
            </a>{" "}
            and{" "}
            <a
              href="https://docs.github.com/"
              target="_blank"
              rel="noreferrer"
            >
              GitHub documentation
            </a>{" "}
            — source control and repository collaboration.
          </li>
        </ul>
      </section>
    </main>
  );
}
