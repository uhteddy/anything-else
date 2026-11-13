import Image from 'next/image';

export default function RequirementsAndUseCases() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-center text-4xl font-bold">
        Requirements and Use Cases
      </h1>
      <div className="mt-8 grid gap-6">
        <section className="card border border-base-300 bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Project Requirements</h2>
            <a className="link link-primary" href="/project-files/project_requirements.pdf">
              Open project requirements PDF
            </a>
            <iframe
              title="Project requirements PDF"
              src="/project-files/project_requirements.pdf"
              className="h-[70vh] min-h-96 w-full rounded-lg border border-base-300"
            />
          </div>
        </section>
        <section className="card border border-base-300 bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Use Case Diagram</h2>
            <a className="link link-primary" href="/project-files/usecase_diagram.png">
              Open use case diagram in full size
            </a>
            <Image
              src="/project-files/usecase_diagram.png"
              alt="Use case diagram for the live quiz game system"
              width={1751}
              height={1161}
              sizes="(max-width: 1152px) 100vw, 1152px"
              className="h-auto w-full rounded-lg bg-white"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
