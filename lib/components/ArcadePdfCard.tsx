import ArcadeButton from "@/lib/components/ArcadeButton";
import ArcadeCard from "@/lib/components/ArcadeCard";

type ArcadePdfCardProps = {
  title: string;
  description?: string;
  pdfUrl: string;
  iframeTitle: string;
  accentColor?: "bg-primary" | "bg-secondary" | "bg-accent" | "bg-info";
  buttonVariant?: "primary" | "secondary" | "neutral";
};

export default function ArcadePdfCard({
  title,
  description,
  pdfUrl,
  iframeTitle,
  accentColor = "bg-primary",
  buttonVariant = "primary",
}: ArcadePdfCardProps) {
  return (
    <ArcadeCard accentColor={accentColor} bodyClassName="gap-5 p-6 sm:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1">
          <h2 className="card-title text-2xl font-black sm:text-3xl">
            {title}
          </h2>
          {description && (
            <p className="text-base opacity-75">{description}</p>
          )}
        </div>

        <ArcadeButton href={pdfUrl} external variant={buttonVariant}>
          Open PDF in New Tab ↗
        </ArcadeButton>
      </div>

      <div className="overflow-hidden rounded-box border-2 border-base-300 bg-base-200">
        <iframe
          src={pdfUrl}
          title={iframeTitle}
          className="h-[75vh] min-h-140 w-full"
        />
      </div>
    </ArcadeCard>
  );
}
