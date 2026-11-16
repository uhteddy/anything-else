import Image from "next/image";
import AboutUsCard from "@/lib/components/AboutUsCard";
import ArcadeButton from "@/lib/components/ArcadeButton";
import ArcadePageHeader from "@/lib/components/ArcadePageHeader";

const TEAM_MEMBERS = [
  {
    img: "/file.svg",
    name: "Teddy Hartling",
    role: "Tech Lead",
    email: "Theodore_Hartling@student.uml.edu",
    github: "https://github.com/uhteddy",
    accentColor: "bg-primary" as const,
  },
  {
    img: "/webp/IMG_2228.webp",
    name: "Cassie Manning",
    role: "Tester (QA)",
    email: "Cassandra_Manning@student.uml.edu",
    github: "https://github.com/CassMannUML",
    accentColor: "bg-secondary" as const,
  },
  {
    img: "/webp/Samuel.webp",
    name: "Samuel Pimentel",
    role: "Docs & UI Lead",
    email: "Samuel_Pimentel@student.uml.edu",
    github: "https://github.com/mericot",
    accentColor: "bg-accent" as const,
  },
  {
    img: "/webp/seheng.webp",
    name: "Senghak Heng",
    role: "Code Reviewer",
    email: "Senghak_Heng@student.uml.edu",
    github: "https://github.com/howlikeyl",
    accentColor: "bg-info" as const,
  },
  {
    img: "/project-files/david_profile_pic.jpg",
    name: "David Suy",
    role: "Project Manager",
    email: "David_Suy@student.uml.edu",
    github: "https://github.com/DavidSuy",
    accentColor: "bg-primary" as const,
  },
];

export default function AboutUs() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-base-200 px-4 py-10">
      <div className="flex w-full max-w-6xl flex-col items-center gap-10">
        <ArcadePageHeader
          title="About Us"
          description="Fall 2026 · Team 3 · COMP.4110 201 Software Engineering"
          align="center"
        />

        <div className="flex flex-wrap justify-center gap-6">
          {TEAM_MEMBERS.map((member) => (
            <AboutUsCard
              key={member.email}
              img={member.img}
              name={member.name}
              role={member.role}
              email={member.email}
              accentColor={member.accentColor}
              extraInfo={
                <ArcadeButton href={member.github} external variant="neutral">
                  <Image
                    src="/svg/GitHub_Invertocat_Black.svg"
                    alt={`${member.name} GitHub`}
                    width="20"
                    height="20"
                    className="dark:invert"
                  />
                  GitHub ↗
                </ArcadeButton>
              }
            />
          ))}
        </div>
      </div>
    </main>
  );
}
