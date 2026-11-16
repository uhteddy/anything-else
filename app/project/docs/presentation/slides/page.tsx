import ArcadeButton from "@/lib/components/ArcadeButton";
import ArcadeCard from "@/lib/components/ArcadeCard";
import ArcadePageHeader from "@/lib/components/ArcadePageHeader";

export default function Docs() {
  return (
    <div className="flex flex-col gap-8">
      <ArcadePageHeader
        title="Presentation Slides"
        description="Slide deck for the Anything Else milestone presentation."
      />

      <ArcadeCard accentColor="bg-primary" accentSize="sm" bodyClassName="gap-4 p-6 sm:p-8">
        <h2 className="card-title text-2xl font-black">Slide Deck</h2>
        <p className="text-base opacity-75">
          The presentation slide deck will be embedded here once finalized. You can explore the interactive screen demos or launch the playable prototype right now.
        </p>
        <div className="card-actions flex-wrap gap-3">
          <ArcadeButton href="/project" variant="primary">
            View Screen Demos
          </ArcadeButton>
          <ArcadeButton href="/" variant="secondary">
            Play Prototype
          </ArcadeButton>
        </div>
      </ArcadeCard>
    </div>
  );
}
