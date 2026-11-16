import Image from "next/image";
import ArcadeCard from "@/lib/components/ArcadeCard";

type AboutUsCardProps = {
  img: string;
  name: string;
  role: string;
  email: string;
  accentColor?: "bg-primary" | "bg-secondary" | "bg-accent" | "bg-info";
  extraInfo?: React.ReactNode;
};

export default function AboutUsCard({
  img,
  name,
  role,
  email,
  accentColor = "bg-primary",
  extraInfo,
}: AboutUsCardProps) {
  return (
    <ArcadeCard
      accentColor={accentColor}
      accentSize="sm"
      hoverLift
      className="w-72"
      bodyClassName="items-center gap-4 p-6 text-center"
    >
      <div className="avatar">
        <div className="h-56 w-48 overflow-hidden rounded-box border-2 border-base-300 bg-base-200">
          <Image
            src={img}
            alt={name}
            width={512}
            height={512}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <h2 className="text-xl font-black">{name}</h2>
        <span className="badge badge-neutral font-bold">{role}</span>
        <a
          href={`mailto:${email}`}
          className="mt-1 text-xs font-medium opacity-75 hover:underline"
        >
          {email}
        </a>
      </div>

      {extraInfo && <div className="mt-1 flex items-center gap-2">{extraInfo}</div>}
    </ArcadeCard>
  );
}
