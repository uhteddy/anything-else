import ArcadeButton from "@/lib/components/ArcadeButton";
import ArcadeCard from "@/lib/components/ArcadeCard";
import ArcadePageHeader from "@/lib/components/ArcadePageHeader";

export default function Docs() {
  return (
    <div className="flex flex-col gap-8">
      <ArcadePageHeader
        title="Presentation Notes"
        description="Speaker notes and talking points for the team presentation."
      />

      <ArcadeCard accentColor="bg-secondary" accentSize="sm" bodyClassName="gap-4 p-6 sm:p-8">
        <h2 className="card-title text-2xl font-black">Speaker Notes</h2>
        <p className="text-base opacity-75">
          Speaker notes will be posted here alongside the final slide deck. For detailed project context, see Background and Description.
        </p>
        <div className="card-actions flex-wrap gap-3">
          <ArcadeButton href="/project/docs/background_and_description" variant="primary">
            Background & Description
          </ArcadeButton>
          <ArcadeButton href="/project/docs/presentation" variant="neutral">
            ← Back to Presentation
          </ArcadeButton>
        </div>
      </ArcadeCard>
    </div>
  );
}
