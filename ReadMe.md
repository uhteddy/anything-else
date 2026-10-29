# Anything Else

Next.js + Local Supabase + Drizzle ORM.

Everything is defined as code—no clicking around in the Supabase UI required.

## Quick Start (Local Development)

1. **Make sure Docker is running** (Docker Desktop or OrbStack).
2. **Install the valid NPM packages**
    ```bash
    npm ci
    ```
3. **Copy the local environment variables:**
   ```bash
   cp .env.example .env.local
   ```
4. **Start the local Supabase stack (Database, Auth, Realtime, Storage):**
   ```bash
   npm run db:start
   ```
   *(On first run, this automatically applies all SQL migrations in `supabase/migrations/`).*
5. **Start the Next.js frontend:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

---

## How the Codebase is Structured

- **[`db/schema.ts`](./db/schema.ts)** — **Single source of truth for your database schema.** Define all tables, columns, and relations here in TypeScript.
- **[`db/index.ts`](./db/index.ts)** — **Drizzle ORM client.** Import `db` in Server Components, Server Actions, or API routes to run type-safe SQL queries.
- **[`lib/supabase.ts`](./lib/supabase.ts)** — **Supabase client.** Use this for Supabase Auth, Realtime subscriptions, and Storage.
- **[`drizzle.config.ts`](./drizzle.config.ts)** — Tells Drizzle to read `db/schema.ts` and output SQL migration files directly into `supabase/migrations/`.
- **[`supabase/config.toml`](./supabase/config.toml)** — Local Supabase configuration as code (ports, auth providers, storage settings).

---

## Common Database Commands

| Command | What it does |
| :--- | :--- |
| `npm run db:start` | Starts the local Supabase Docker containers |
| `npm run db:stop` | Stops the local Supabase Docker containers |
| `npm run db:generate` | Generates a new SQL migration in `supabase/migrations/` from changes in `db/schema.ts` |
| `npm run db:migrate` | Applies pending Drizzle migrations to the database |
| `npm run db:push` | Pushes `db/schema.ts` changes directly to local Postgres (great for fast prototyping) |
| `npm run db:reset` | Wipes the local database and re-runs all migrations in `supabase/migrations/` from scratch |
| `npm run db:studio` | Opens Drizzle Studio to inspect/edit local database rows |
