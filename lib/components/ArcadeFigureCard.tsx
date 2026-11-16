import Image from "next/image";
import ArcadeButton from "@/lib/components/ArcadeButton";
import ArcadeCard from "@/lib/components/ArcadeCard";

type ArcadeFigureCardProps = {
  title: string;
  description?: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  accentColor?: "bg-primary" | "bg-secondary" | "bg-accent" | "bg-info";
};

export default function ArcadeFigureCard({
  title,
  description,
  src,
  alt,
  width,
  height,
  accentColor = "bg-primary",
}: ArcadeFigureCardProps) {
  return (
    <ArcadeCard accentColor={accentColor} bodyClassName="gap-5 p-6 sm:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1">
          <h2 className="card-title text-2xl font-black">{title}</h2>
          {description && (
            <p className="text-base opacity-75">{description}</p>
          )}
        </div>

        <ArcadeButton href={src} external variant="neutral">
          View Full Size ↗
        </ArcadeButton>
      </div>

      <figure className="overflow-hidden rounded-box border-2 border-base-300 bg-white p-4">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-auto w-full"
        />
      </figure>
    </ArcadeCard>
  );
}
