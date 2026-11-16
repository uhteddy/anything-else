import ArcadeButton from "@/lib/components/ArcadeButton";
import ArcadeCard from "@/lib/components/ArcadeCard";
import GameSubHeader from "@/lib/components/GameSubHeader";

// Temporary placeholder. Replace with the host's game lobby / start screen.
export default function StartGame() {
  return (
    <main className="flex min-h-screen flex-col bg-base-200 px-4 py-6">
      <GameSubHeader backHref="/host" backLabel="← Back to Quizzes" />

      <div className="flex flex-1 items-center justify-center py-8">
        <ArcadeCard
          accentColor="bg-primary"
          className="w-full max-w-lg"
          bodyClassName="items-center gap-4 p-8 text-center"
        >
          <h1 className="text-3xl font-black">Host Lobby</h1>
          <p className="text-base opacity-75">
            Live host lobby and question controls are coming soon.
          </p>
          <div className="card-actions mt-2 w-full">
            <ArcadeButton href="/host" variant="primary" block>
              Choose Another Quiz
            </ArcadeButton>
          </div>
        </ArcadeCard>
      </div>
    </main>
  );
}
