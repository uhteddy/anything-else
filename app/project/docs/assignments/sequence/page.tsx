import Image from "next/image";

export default function Docs() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 px-4 py-8">
      <h1 className="text-2xl font-bold">Sequence Diagrams</h1>

      <section className="flex w-full flex-col items-center gap-4">
        <h2 className="text-xl font-semibold">Host Game</h2>
        <figure className="w-full max-w-6xl">
          <Image
            src="/project-files/sequence_host_game.png"
            alt="Sequence diagram showing an instructor hosting a game and students joining"
            width={2840}
            height={3140}
            className="h-auto w-full"
          />
        </figure>
      </section>

      <section className="flex w-full flex-col items-center gap-4">
        <h2 className="text-xl font-semibold">Submit Answer</h2>
        <figure className="w-full max-w-6xl">
          <Image
            src="/project-files/sequence_submit_answer.png"
            alt="Sequence diagram showing a student submitting an answer, grading, and scoring"
            width={3660}
            height={2728}
            className="h-auto w-full"
          />
        </figure>
      </section>
    </div>
  );
}
