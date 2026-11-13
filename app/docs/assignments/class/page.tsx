import Image from "next/image";

export default function Docs() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 px-4 py-8">
      <h1 className="text-2xl font-bold">Class Diagram</h1>
      <figure className="w-full max-w-6xl">
        <Image
          src="/project-files/class_diagram.png"
          alt="Class diagram for the game system"
          width={2560}
          height={1910}
          className="h-auto w-full"
        />
      </figure>
    </div>
  );
}
