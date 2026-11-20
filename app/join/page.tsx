import Link from "next/link";
import { JoinForm } from "@/app/join/join-form";
import GameShell from "@/lib/components/game/GameShell";
import { ArrowLeftIcon } from "@/lib/components/game/icons";

export default function JoinGame() {
  return (
    <GameShell>
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 py-8 sm:py-12">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 rounded-field font-bold text-base-content/80 transition-colors hover:text-primary focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/40"
        >
          <ArrowLeftIcon />
          Back to Play Now
        </Link>
        <JoinForm />
      </div>
    </GameShell>
  );
}
