import { Nunito } from "next/font/google";
import GameNavbar from "@/lib/components/game/GameNavbar";

// Rounded, friendly font for the game screens only. next/font self-hosts it,
// so no request goes to Google from the browser.
const nunito = Nunito({ subsets: ["latin"], display: "swap" });

type GameShellProps = {
  children: React.ReactNode;
};

/**
 * Page frame for every game screen: purple-and-lavender theme, Nunito font,
 * soft background shapes, and the game navbar. Pages rendered inside it
 * should not add their own <main>; GameShell already provides one.
 */
export default function GameShell({ children }: GameShellProps) {
  return (
    <div
      data-theme="anythingelse"
      className={`${nunito.className} relative isolate flex min-h-dvh flex-col overflow-x-hidden bg-base-200 text-base-content`}
    >
      <a
        href="#game-content"
        className="sr-only z-60 rounded-field bg-primary px-4 py-2 font-bold text-primary-content focus:not-sr-only focus:absolute focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      <BackgroundShapes />
      <GameNavbar />

      <main id="game-content" className="flex flex-1 flex-col">
        {children}
      </main>
    </div>
  );
}

function BackgroundShapes() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-32 -left-24 size-96 rounded-full bg-violet-300/40 blur-3xl" />
      <div className="absolute top-40 -right-32 size-104 rounded-full bg-fuchsia-200/50 blur-3xl" />
      <div className="absolute -bottom-40 left-1/3 size-96 rounded-full bg-indigo-200/50 blur-3xl" />
    </div>
  );
}
