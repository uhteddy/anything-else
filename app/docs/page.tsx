const resources = [
  {
    title: 'Prototype',
    description: 'Explore the interactive prototype of Anything Else.',
  },
  {
    title: 'Software Requirements Specification (SRS)',
    description: 'Read the project requirements and system specifications.',
  },
  {
    title: 'Presentation Notes',
    description: 'Review notes and materials from the project presentation.',
  },
  {
    title: 'Demo Video',
    description: 'Watch a walkthrough of the application.',
  },
];

export default function Docs() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Project Resources</h1>
        <p className="mt-3 text-base-content/70">
          Find the prototype, project documentation, presentation notes, and demo.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {resources.map((resource) => (
          <article
            key={resource.title}
            className="card border border-base-300 bg-base-200 shadow-sm"
          >
            <div className="card-body">
              <div className="flex items-start justify-between gap-4">
                <h2 className="card-title">{resource.title}</h2>
                <span className="badge badge-outline shrink-0">Coming soon</span>
              </div>
              <p className="text-base-content/70">{resource.description}</p>
              <div className="card-actions mt-2 justify-end">
                <button className="btn btn-primary" disabled>
                  View resource
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
