import ArcadeButton from "@/lib/components/ArcadeButton";
import ArcadeCard from "@/lib/components/ArcadeCard";
import GameSubHeader from "@/lib/components/GameSubHeader";

// Temporary placeholder. Replace with the Create Quiz screen.
export default function CreateQuiz() {
  return (
    <main className="flex min-h-screen flex-col bg-base-200 px-4 py-6">
      <GameSubHeader backHref="/host" backLabel="← Back to Quizzes" />

      <div className="flex flex-1 items-center justify-center py-8">
        <ArcadeCard
          accentColor="bg-secondary"
          className="w-full max-w-lg"
          bodyClassName="items-center gap-4 p-8 text-center"
        >
          <h1 className="text-3xl font-black">Create Quiz</h1>
          <p className="text-base opacity-75">
            The quiz builder is coming soon. Head back to pick one of the ready-to-play quizzes.
          </p>
          <div className="card-actions mt-2 w-full">
            <ArcadeButton href="/host" variant="primary" block>
              Browse Quizzes
            </ArcadeButton>
          </div>
        </ArcadeCard>
      </div>
    </main>
  );
}
