import ArcadeButton from "@/lib/components/ArcadeButton";
import ArcadeCard from "@/lib/components/ArcadeCard";
import ArcadePageHeader from "@/lib/components/ArcadePageHeader";

export default function Docs() {
  return (
    <div className="flex flex-col gap-8">
      <ArcadePageHeader
        title="SRS v1"
        description="Software Requirements Specification (Version 1)."
      />

      <ArcadeCard accentColor="bg-primary" accentSize="sm" bodyClassName="gap-4 p-6 sm:p-8">
        <h2 className="card-title text-2xl font-black">
          Specification Document
        </h2>
        <p className="text-base opacity-75">
          The compiled SRS v1 document is being finalized. In the meantime, you can review the live system requirements, background description, and UML models.
        </p>
        <div className="card-actions flex-wrap gap-3">
          <ArcadeButton href="/project/docs/assignments/requirements" variant="primary">
            View Requirements PDF
          </ArcadeButton>
          <ArcadeButton href="/project/docs/background_and_description" variant="neutral">
            Background & Description
          </ArcadeButton>
        </div>
      </ArcadeCard>
    </div>
  );
}
