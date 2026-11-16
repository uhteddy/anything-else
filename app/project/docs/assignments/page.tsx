import ArcadeButton from "@/lib/components/ArcadeButton";
import ArcadeCard from "@/lib/components/ArcadeCard";
import ArcadePageHeader from "@/lib/components/ArcadePageHeader";

const ASSIGNMENT_ITEMS = [
  {
    title: "Requirements",
    description:
      "Functional and non-functional system requirements specification PDF.",
    href: "/project/docs/assignments/requirements",
    accentColor: "bg-primary" as const,
  },
  {
    title: "Use Case Diagrams",
    description:
      "Actor interactions for instructors, students, and the Jev AI grading service.",
    href: "/project/docs/assignments/use_case",
    accentColor: "bg-secondary" as const,
  },
  {
    title: "Class Diagrams",
    description:
      "Domain entities, relationships, and methods for the live quiz system.",
    href: "/project/docs/assignments/class",
    accentColor: "bg-accent" as const,
  },
  {
    title: "Sequence Diagrams",
    description:
      "End-to-end message flows for hosting a game and grading submitted answers.",
    href: "/project/docs/assignments/sequence",
    accentColor: "bg-info" as const,
  },
  {
    title: "SRS v1",
    description:
      "Software Requirements Specification version 1 deliverable.",
    href: "/project/docs/assignments/srs_v1",
    accentColor: "bg-primary" as const,
  },
];

export default function Docs() {
  return (
    <div className="flex flex-col gap-8">
      <ArcadePageHeader
        title="Assignments"
        description="Course deliverables, UML diagrams, and requirements documentation."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {ASSIGNMENT_ITEMS.map((item) => (
          <ArcadeCard
            key={item.href}
            accentColor={item.accentColor}
            accentSize="sm"
            hoverLift
            bodyClassName="justify-between gap-6 p-6"
          >
            <div className="flex flex-col gap-2">
              <h2 className="card-title text-2xl font-black">{item.title}</h2>
              <p className="text-base opacity-75">{item.description}</p>
            </div>
            <div className="card-actions justify-end">
              <ArcadeButton href={item.href} variant="primary" block>
                View Deliverable
              </ArcadeButton>
            </div>
          </ArcadeCard>
        ))}
      </div>
    </div>
  );
}
