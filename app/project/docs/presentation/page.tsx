import ArcadeButton from "@/lib/components/ArcadeButton";
import ArcadeCard from "@/lib/components/ArcadeCard";
import ArcadePageHeader from "@/lib/components/ArcadePageHeader";

const PRESENTATION_ITEMS = [
  {
    title: "Presentation Slides",
    description:
      "Slide deck covering project motivation, architecture, and live prototype demo.",
    href: "/project/docs/presentation/slides",
    accentColor: "bg-primary" as const,
  },
  {
    title: "Presentation Notes",
    description:
      "Speaker notes and walkthrough script for the class presentation.",
    href: "/project/docs/presentation/notes",
    accentColor: "bg-secondary" as const,
  },
];

export default function Docs() {
  return (
    <div className="flex flex-col gap-8">
      <ArcadePageHeader
        title="Presentation"
        description="Slides and speaker notes for our software engineering milestone presentations."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {PRESENTATION_ITEMS.map((item) => (
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
                Open {item.title}
              </ArcadeButton>
            </div>
          </ArcadeCard>
        ))}
      </div>
    </div>
  );
}
