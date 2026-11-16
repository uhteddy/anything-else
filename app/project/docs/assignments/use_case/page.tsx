import ArcadeFigureCard from "@/lib/components/ArcadeFigureCard";
import ArcadePageHeader from "@/lib/components/ArcadePageHeader";

export default function Docs() {
  return (
    <div className="flex flex-col gap-8">
      <ArcadePageHeader
        title="Use Case Diagram"
        description="High-level actor interactions between instructors, students, and the AI grading service."
      />

      <ArcadeFigureCard
        title="System Use Cases"
        src="/project-files/usecase_diagram.png"
        alt="Use case diagram for the live quiz game system"
        width={1751}
        height={1161}
        accentColor="bg-secondary"
      />
    </div>
  );
}
