import ArcadeFigureCard from "@/lib/components/ArcadeFigureCard";
import ArcadePageHeader from "@/lib/components/ArcadePageHeader";

export default function Docs() {
  return (
    <div className="flex flex-col gap-8">
      <ArcadePageHeader
        title="Sequence Diagrams"
        description="Runtime interaction flows for hosting a live session and grading submitted answers."
      />

      <ArcadeFigureCard
        title="Host Game Flow"
        description="Instructor opens a game lobby and students join via PIN."
        src="/project-files/sequence_host_game.png"
        alt="Sequence diagram showing an instructor hosting a game and students joining"
        width={2840}
        height={3140}
        accentColor="bg-primary"
      />

      <ArcadeFigureCard
        title="Submit Answer Flow"
        description="Student group submits an open-ended response, graded by Jev and scored on the leaderboard."
        src="/project-files/sequence_submit_answer.png"
        alt="Sequence diagram showing a student submitting an answer, grading, and scoring"
        width={3660}
        height={2728}
        accentColor="bg-secondary"
      />
    </div>
  );
}
