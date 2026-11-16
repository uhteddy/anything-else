import ArcadeFigureCard from "@/lib/components/ArcadeFigureCard";
import ArcadePageHeader from "@/lib/components/ArcadePageHeader";

export default function Docs() {
  return (
    <div className="flex flex-col gap-8">
      <ArcadePageHeader
        title="Class Diagram"
        description="Object-oriented domain model and relationships for the quiz system."
      />

      <ArcadeFigureCard
        title="Domain Class Model"
        src="/project-files/class_diagram.png"
        alt="Class diagram for the game system"
        width={2560}
        height={1910}
        accentColor="bg-accent"
      />
    </div>
  );
}
