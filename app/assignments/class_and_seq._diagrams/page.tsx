import Image from 'next/image';

const diagrams = [
  {
    title: 'Class Diagram',
    src: '/project-files/class_diagram.png',
    alt: 'Class diagram showing the entities and relationships in the quiz game',
    width: 2560,
    height: 1910,
  },
  {
    title: 'Sequence Diagram: Host Game',
    src: '/project-files/sequence_host_game.png',
    alt: 'Sequence diagram for hosting and starting a game',
    width: 2840,
    height: 3140,
  },
  {
    title: 'Sequence Diagram: Submit Answer',
    src: '/project-files/sequence_submit_answer.png',
    alt: 'Sequence diagram for submitting and evaluating an answer',
    width: 3660,
    height: 2728,
  },
];

export default function ClassAndSequenceDiagrams() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-center text-4xl font-bold">
        Class and Sequence Diagrams
      </h1>
      <div className="mt-8 grid gap-6">
        {diagrams.map((diagram) => (
          <section key={diagram.src} className="card border border-base-300 bg-base-200">
            <div className="card-body">
              <h2 className="card-title">{diagram.title}</h2>
              <a className="link link-primary" href={diagram.src}>
                Open diagram in full size
              </a>
              <Image
                src={diagram.src}
                alt={diagram.alt}
                width={diagram.width}
                height={diagram.height}
                sizes="(max-width: 1152px) 100vw, 1152px"
                className="h-auto w-full rounded-lg bg-white"
              />
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
