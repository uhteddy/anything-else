import ArcadeButton from "@/lib/components/ArcadeButton";
import ArcadePageHeader from "@/lib/components/ArcadePageHeader";
import ArcadePdfCard from "@/lib/components/ArcadePdfCard";

const DEMOS = [
  {
    title: "Host Screen Demo",
    description:
      "Classroom display view showing the lobby PIN, live questions, timer, and leaderboard.",
    pdfUrl: "/project-files/demo_host_screen.pdf",
    iframeTitle: "Host screen demo PDF",
    accentColor: "bg-primary" as const,
    buttonVariant: "primary" as const,
  },
  {
    title: "Student Phone Demo",
    description:
      "Player device view for entering a PIN, choosing a nickname, and submitting answers.",
    pdfUrl: "/project-files/demo_student_phone.pdf",
    iframeTitle: "Student phone demo PDF",
    accentColor: "bg-secondary" as const,
    buttonVariant: "secondary" as const,
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-base-200 px-4 py-10">
      <div className="flex w-full max-w-6xl flex-col gap-10">
        <ArcadePageHeader
          title="Project Demos"
          description="Interactive UI mockups and screen flows for the classroom host screen and student devices."
          actions={
            <>
              <ArcadeButton href="/" variant="primary">
                Play Live Prototype
              </ArcadeButton>
              <ArcadeButton href="/project/docs" variant="neutral">
                View Docs
              </ArcadeButton>
            </>
          }
        />

        <div className="flex flex-col gap-8">
          {DEMOS.map((demo) => (
            <ArcadePdfCard
              key={demo.pdfUrl}
              title={demo.title}
              description={demo.description}
              pdfUrl={demo.pdfUrl}
              iframeTitle={demo.iframeTitle}
              accentColor={demo.accentColor}
              buttonVariant={demo.buttonVariant}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
