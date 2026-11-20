import Link from "next/link";
import GameCard from "@/lib/components/game/GameCard";
import GameShell from "@/lib/components/game/GameShell";
import { BurstIcon, CrownIcon, GamepadIcon, UsersIcon } from "@/lib/components/game/icons";

// Entry points into the game. Teammates build the screens behind these routes.
const GAME_ROUTES = {
  join: "/join",
  host: "/host",
};

export default function Game() {
  return (
    <GameShell>
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-4 py-10 sm:py-14">
        <section className="flex max-w-2xl flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-4 py-1.5 text-sm font-bold text-primary shadow-soft">
            <GamepadIcon className="size-5" />
            Multiplayer Quiz Game
          </span>

          <h1 className="relative text-5xl leading-tight font-black tracking-tight sm:text-6xl">
            <BurstIcon className="absolute top-0 -left-12 hidden size-10 -rotate-30 text-accent sm:block" />
            <span className="block">Anything Else</span>
            <span className="block text-primary">Quiz Game</span>
            <BurstIcon className="absolute top-0 -right-12 hidden size-10 rotate-30 text-accent sm:block" />
          </h1>

          <p className="max-w-xl text-lg text-base-content/70">
            A live classroom quiz. Join a game from your device or host one for your class,
            test your knowledge, and see who comes out on top!
          </p>
        </section>

        <QuizIllustration />

        <section
          aria-label="Get started"
          className="grid w-full max-w-3xl gap-6 sm:-mt-6 sm:grid-cols-2"
        >
          <GameCard
            icon={<UsersIcon className="size-9" />}
            title="Join Game"
            description="Have a game PIN? Enter it and pick a nickname to play."
            href={GAME_ROUTES.join}
            actionLabel="Join Game"
          />
          <GameCard
            icon={<CrownIcon className="size-9 text-accent" />}
            title="Host Game"
            description="Choose a quiz, open a lobby, and run the game for your class."
            href={GAME_ROUTES.host}
            actionLabel="Host Game"
          />
        </section>

        <Link
          href="/project/"
          className="link font-semibold text-primary link-hover focus-visible:rounded-sm focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/40"
        >
          Learn more about the project
        </Link>
      </div>
    </GameShell>
  );
}

/** Decorative scene: a quiz tablet between a stack of books and a globe. */
function QuizIllustration() {
  return (
    <svg
      viewBox="0 0 360 220"
      className="h-auto w-full max-w-md"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx="180" cy="206" rx="150" ry="10" fill="#ddd6fe" />

      {/* Plant */}
      <path d="M38 150c-14-18-16-38-6-52 6 16 10 32 6 52Z" fill="#34d399" />
      <path d="M44 150c4-22 18-36 34-40-4 18-16 32-34 40Z" fill="#10b981" />
      <path d="M40 152c-16-6-26-18-28-32 14 4 24 14 28 32Z" fill="#6ee7b7" />

      {/* Books */}
      <rect x="22" y="150" width="92" height="18" rx="4" fill="#8b5cf6" />
      <rect x="30" y="168" width="84" height="18" rx="4" fill="#fbbf24" />
      <rect x="18" y="186" width="100" height="18" rx="4" fill="#60a5fa" />
      <path d="M28 156h70M36 174h64M26 192h78" stroke="white" strokeOpacity=".6" strokeWidth="2" />

      {/* Quiz tablet */}
      <rect x="122" y="34" width="122" height="168" rx="20" fill="#6d28d9" />
      <rect x="130" y="44" width="106" height="148" rx="14" fill="white" />
      <circle cx="183" cy="82" r="22" fill="#ede9fe" />
      <text
        x="183"
        y="93"
        textAnchor="middle"
        fontSize="30"
        fontWeight="900"
        fill="#7c3aed"
        fontFamily="inherit"
      >
        ?
      </text>
      <rect x="142" y="116" width="82" height="16" rx="8" fill="#ede9fe" />
      <rect x="142" y="138" width="82" height="16" rx="8" fill="#7c3aed" />
      <rect x="142" y="160" width="82" height="16" rx="8" fill="#ede9fe" />
      <circle cx="151" cy="124" r="4" fill="#a78bfa" />
      <circle cx="151" cy="146" r="4" fill="white" />
      <circle cx="151" cy="168" r="4" fill="#a78bfa" />

      {/* Globe */}
      <path d="M262 118a38 38 0 0 0 64 28" fill="none" stroke="#7c3aed" strokeWidth="5" strokeLinecap="round" />
      <circle cx="296" cy="114" r="30" fill="#a78bfa" />
      <path d="M278 98c8 4 12 12 8 20s4 12 12 10M306 88c-4 8 2 12 8 14" fill="none" stroke="#34d399" strokeWidth="6" strokeLinecap="round" />
      <ellipse cx="296" cy="114" rx="12" ry="30" fill="none" stroke="white" strokeOpacity=".5" strokeWidth="2" />
      <path d="M266 114h60" stroke="white" strokeOpacity=".5" strokeWidth="2" />
      <rect x="292" y="152" width="8" height="30" fill="#7c3aed" />
      <rect x="274" y="182" width="44" height="10" rx="5" fill="#6d28d9" />

      {/* Sparkles */}
      <path d="M100 40l4 10 10 4-10 4-4 10-4-10-10-4 10-4Z" fill="#fbbf24" />
      <path d="M262 30l3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" fill="#c4b5fd" />
      <circle cx="80" cy="96" r="4" fill="#c4b5fd" />
      <circle cx="340" cy="60" r="5" fill="#fbbf24" />
    </svg>
  );
}
