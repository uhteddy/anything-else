import ArcadePageHeader from "@/lib/components/ArcadePageHeader";
import ArcadePdfCard from "@/lib/components/ArcadePdfCard";

export default function Docs() {
  return (
    <div className="flex flex-col gap-8">
      <ArcadePageHeader
        title="Requirements"
        description="Functional and non-functional requirements for Anything Else."
      />

      <ArcadePdfCard
        title="Project Requirements Document"
        description="Full requirements specification PDF."
        pdfUrl="/project-files/project_requirements.pdf"
        iframeTitle="Project requirements PDF"
        accentColor="bg-primary"
      />
    </div>
  );
}
