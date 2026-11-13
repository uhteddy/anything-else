import AboutUsCard from "@/lib/components/AboutUsCard";
import Image from "next/image";

export default function AboutUs() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <h1 className="text-4xl font-bold">About Us</h1>
      <p className="text-lg">Fall 2026 - Team 3 - COMP.4110 201 Software Engineering</p>
      <hr className="w-1/2 border-t" />

      <div className="flex flex-row justify-center gap-8 flex-wrap">
          <AboutUsCard 
          img="/file.svg"
          name="Teddy Hartling" 
          role="Tech Lead" 
          email="Theodore_Hartling@student.uml.edu"
          extraInfo={
            <a href="https://github.com/uhteddy" className="">
              <Image
                src="/svg/GitHub_Invertocat_Black.svg"
                alt="GitHub"
                width="32"
                height="32"
                className="dark:invert"
                />
            </a>
          }
          />

          <AboutUsCard 
          img="/webp/IMG_2228.webp"
          name="Cassie Manning" 
          role="Tester (QA)"
          email="Cassandra_Manning@student.uml.edu" 
          extraInfo={
            <a href="https://github.com/CassMannUML" className="">
              <Image
                src="/svg/GitHub_Invertocat_Black.svg"
                alt="GitHub"
                width="32"
                height="32"
                className="dark:invert"
                />
            </a>
          }
          />

          <AboutUsCard 
          img="/file.svg"
          name="Samuel Pimentel" 
          role="Docs & UI Lead" 
          email="Samuel_Pimentel@student.uml.edu"
          extraInfo={
            <a href="https://github.com/mericot" className="">
              <Image
                src="/svg/GitHub_Invertocat_Black.svg"
                alt="GitHub"
                width="32"
                height="32"
                className="dark:invert"
                />
            </a>
          }
        />

          <AboutUsCard 
          img="/file.svg"
          name="Senghak Heng" 
          role="Code Reviewer" 
          email="Senghak_Heng@student.uml.edu"
          extraInfo={
            <a href="https://github.com/howlikeyl" className="">
              <Image
                src="/svg/GitHub_Invertocat_Black.svg"
                alt="GitHub"
                width="32"
                height="32"
                className="dark:invert"
                />
            </a>
          }
          />

          <AboutUsCard 
          img="/file.svg"
          name="David Suy" 
          role="Project Manager" 
          email="David_Suy@student.uml.edu" />
      </div>
    </div>
  );
}
