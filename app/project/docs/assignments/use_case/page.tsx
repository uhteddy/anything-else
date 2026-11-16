import Image from "next/image";

export default function Docs() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 px-4 py-8">
      <h1 className="text-2xl font-bold">Use Case Diagram</h1>
      <figure className="w-full max-w-6xl">
        <Image
          src="/project-files/usecase_diagram.png"
          alt="Use case diagram for the live quiz game system"
          width={1751}
          height={1161}
          className="h-auto w-full"
        />
      </figure>
    </div>
  );
}
