import ArcadeButton from "@/lib/components/ArcadeButton";
import ArcadeCard from "@/lib/components/ArcadeCard";
import ArcadePageHeader from "@/lib/components/ArcadePageHeader";

const DOC_SECTIONS = [
  {
    title: "Background & Description",
    description:
      "Project overview, motivation, gameplay flow, stakeholders, scope, and risk analysis.",
    href: "/project/docs/background_and_description",
    accentColor: "bg-primary" as const,
  },
  {
    title: "Assignments & Artifacts",
    description:
      "Requirements specification, UML use case, class, and sequence diagrams, plus SRS v1.",
    href: "/project/docs/assignments",
    accentColor: "bg-secondary" as const,
  },
  {
    title: "Presentation",
    description:
      "Class presentation slides and speaker notes for project milestones.",
    href: "/project/docs/presentation",
    accentColor: "bg-accent" as const,
  },
  {
    title: "Bibliography",
    description:
      "Frameworks, databases, and developer tooling references used to build Anything Else.",
    href: "/project/docs/bibliography",
    accentColor: "bg-info" as const,
  },
];

export default function Docs() {
  return (
    <div className="flex flex-col gap-8">
      <ArcadePageHeader
        title="Documentation Overview"
        description="Browse architecture diagrams, requirements, and engineering deliverables for Anything Else."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {DOC_SECTIONS.map((section) => (
          <ArcadeCard
            key={section.href}
            accentColor={section.accentColor}
            accentSize="sm"
            hoverLift
            bodyClassName="justify-between gap-6 p-6"
          >
            <div className="flex flex-col gap-2">
              <h2 className="card-title text-2xl font-black">
                {section.title}
              </h2>
              <p className="text-base opacity-75">{section.description}</p>
            </div>
            <div className="card-actions justify-end">
              <ArcadeButton href={section.href} variant="primary" block>
                Open Section
              </ArcadeButton>
            </div>
          </ArcadeCard>
        ))}
      </div>
    </div>
  );
}
