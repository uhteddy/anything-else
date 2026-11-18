# Anything Else: Live Quiz Game

An instructor builds a question set and hosts a live game. Students join from their own devices with a 6-digit game PIN, get sorted into color groups, and answer each question together in their own words. Each group answer is graded against the instructor's reference answer, and points depend on how accurate the answer is and how quickly the group submitted it.

**Team 3 (COMP 4110, Fall 2026):** Cassie Manning, David Suy, Samuel Pimentel, Senghak Heng, Teddy Hartling

**Built with:** Next.js, local Supabase (Postgres, Auth, Realtime, Storage), and Drizzle ORM. The database, auth, and storage setup are all defined as code, so nothing needs to be configured by hand in the Supabase dashboard.

## Prototype status (v1)

Prototype v1 puts every screen in place so the full game can be clicked through.

- **Working with real data:** instructor sign-up and login, creating a quiz (text or image prompts, reference answers, time limits), opening a lobby with a game PIN, students joining with a PIN and nickname, and the live player list.
- **Placeholder data:** everything after the lobby (groups, questions, results, leaderboards, final results), saving quiz edits, and deleting quizzes. These screens show the same sample game ("Why does ice float on water?") no matter what is entered. Real gameplay and AI grading arrive in prototype v2.

## Prerequisites

- [Node.js](https://nodejs.org/) 20.9 or newer (tested with Node.js 26)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or [OrbStack](https://orbstack.dev/), running
- No separate Supabase install is needed; the Supabase CLI runs through `npx`.

## Quick Start (Local Development)

1. **Make sure Docker is running** (Docker Desktop or OrbStack).
2. **Install the NPM packages:**
   ```bash
   npm install
   ```
3. **Copy the example environment file:**
   ```bash
   cp .env.example .env.local
   ```
4. **Start the local Supabase stack (Database, Auth, Realtime, Storage):**
   ```bash
   npm run db:start
   ```
   *(On first run, this automatically applies all SQL migrations in `supabase/migrations/`).*
5. **Populate your environment variables in `.env.local`:**
    Environment variables are not populated automatically. Copy the values printed in the terminal by `npm run db:start` (or run `npx supabase status` at any time to view them again) into `.env.local`:

   | `.env.local` Variable | Supabase CLI Output Field | Local Default Example |
   | :--- | :--- | :--- |
   | `POSTGRES_URL` | **Database → URL** | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` |
   | `NEXT_PUBLIC_SUPABASE_URL` | **APIs → Project URL** | `http://127.0.0.1:54321` |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | **Authentication Keys → Publishable** | `sb_publishable_...` |
   | `NEXT_PRIVATE_SUPABASE_SECRET_KEY` | **Authentication Keys → Secret** | `sb_secret_...` |

6. **Start the Next.js frontend:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).
7. **Create an instructor account:** go to [http://localhost:3000/signup](http://localhost:3000/signup) and sign up with any email and password. If a confirmation email is sent, open it in Mailpit, the local test inbox, at [http://127.0.0.1:54324](http://127.0.0.1:54324).

> **Already ran the project before?** After pulling new changes, run `npm install` and `npm run db:migrate` to pick up new packages and database migrations.

---

## How to Try the Prototype

Use one browser window as the instructor and a private (incognito) window as a student.

**Instructor**

1. Select **Host Game** on the home page and sign in.
2. Select **+ Create Quiz**, add a title and at least one question, and save it.
3. On your quiz card, try **Edit** (reorder or remove questions) and **Delete** (confirmation dialog).
4. Select **Start Game**, then **Create lobby**. The lobby shows the game PIN and the players who have joined.
5. Choose a group size and select **Assign groups →**. Then click through **Start game → Close question early → Continue to leaderboard → Next question** or **End game** to reach the final results.

**Student**

1. In the private window, open [http://localhost:3000/join](http://localhost:3000/join) and enter the PIN from the instructor's lobby and a nickname.
2. The student appears in the instructor's player list right away.
3. Select **Preview game screens (prototype)** to walk through the student screens: group color, question and answer, result, standings, and final results.

## Screens

| Route | Who sees it | Data |
| :--- | :--- | :--- |
| `/` | Everyone | Home page with Host Game and Join Game |
| `/signup`, `/login` | Instructor | Real |
| `/host` | Instructor | Real quiz list; Delete is a placeholder |
| `/host/create` | Instructor | Real |
| `/host/edit/[quizId]` | Instructor | Loads the real quiz; saving is a placeholder |
| `/host/start` | Instructor | Real |
| `/host/game/[gameId]` | Instructor (lobby) | Real PIN and live player list |
| `/host/game/[gameId]/groups` | Instructor (grouping) | Placeholder |
| `/host/game/[gameId]/question` | Instructor (question open) | Placeholder |
| `/host/game/[gameId]/results` | Instructor (question closed) | Placeholder |
| `/host/game/[gameId]/leaderboard` | Instructor (leaderboard) | Placeholder |
| `/host/game/[gameId]/final` | Instructor (final results) | Placeholder |
| `/join` | Student | Real |
| `/join/lobby` | Student (waiting room) | Real |
| `/play/group` | Student (group color) | Placeholder |
| `/play/question` | Student (answer) | Placeholder |
| `/play/result` | Student (verdict and points) | Placeholder |
| `/play/leaderboard` | Student (rank) | Placeholder |
| `/play/final` | Student (final results) | Placeholder |
| `/project` | Everyone | Project documents, diagrams, and team page |

---

## How the Codebase is Structured

- **[`db/schema.ts`](./db/schema.ts)** — **Single source of truth for your database schema.** Define all tables, columns, and relations here in TypeScript.
- **[`db/index.ts`](./db/index.ts)** — **Drizzle ORM client.** Import `db` in Server Components, Server Actions, or API routes to run type-safe SQL queries.
- **[`lib/supabase.ts`](./lib/supabase.ts)** — **Supabase client.** Use this for Supabase Auth, Realtime subscriptions, and Storage.
- **[`drizzle.config.ts`](./drizzle.config.ts)** — Tells Drizzle to read `db/schema.ts` and generate SQL migration files directly into `supabase/migrations/`. Drizzle does not apply migrations.
- **[`supabase/config.toml`](./supabase/config.toml)** — Local Supabase configuration as code (ports, auth providers, storage settings).

---

## Common Database Commands

| Command | What it does |
| :--- | :--- |
| `npm run db:start` | Starts the local Supabase Docker containers |
| `npm run db:stop` | Stops the local Supabase Docker containers |
| `npm run db:generate` | Generates a new SQL migration in `supabase/migrations/` from changes in `db/schema.ts` |
| `npm run db:migrate` | Applies pending Supabase migrations to the local database |
| `npm run db:push` | Alias for applying pending Supabase migrations locally |
| `npm run db:reset` | Wipes the local database and re-runs all migrations in `supabase/migrations/` from scratch |
| `npm run db:studio` | Opens Drizzle Studio to inspect/edit local database rows |

### Migration workflow

1. Edit `db/schema.ts`.
2. Run `npm run db:generate` to create a SQL migration in
   `supabase/migrations/`.
3. Run `npm run db:migrate` to apply pending migrations through Supabase.
4. Run `npm run db:reset` when you need a clean local database.

Do not run `drizzle-kit migrate` or `drizzle-kit push`. Those commands use
Drizzle's separate migration state and can try to apply SQL that Supabase has
already recorded in its migration history.
