import { QuizForm } from "@/app/host/create/quiz-form";
import GameShell from "@/lib/components/game/GameShell";

export default function CreateQuiz() {
  return (
    <GameShell>
      <QuizForm mode="create" />
    </GameShell>
  );
}
