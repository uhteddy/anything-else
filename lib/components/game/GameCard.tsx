import Link from "next/link";
import { ArrowRightIcon } from "@/lib/components/game/icons";

type GameCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
};

/** White rounded card with an icon, short description, and a purple call to action. */
export default function GameCard({ icon, title, description, href, actionLabel }: GameCardProps) {
  return (
    <article className="card border border-base-300 bg-base-100 shadow-soft transition-transform duration-200 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="card-body items-center gap-3 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
          {icon}
        </span>
        <h2 className="text-2xl font-extrabold">{title}</h2>
        <p className="text-base-content/70">{description}</p>
        <div className="card-actions mt-2 w-full">
          <Link href={href} className="btn btn-game btn-block btn-lg rounded-full">
            {actionLabel}
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </article>
  );
}
