const demoScreens = [
  {
    title: 'Host Screen',
    src: '/project-files/demo_host_screen.pdf',
  },
  {
    title: 'Student Phone Screen',
    src: '/project-files/demo_student_phone.pdf',
  },
];

export default function Game() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Play Now</h1>
        <p className="mt-3 text-base-content/70">
          Take a look at the host and student demo screens.
        </p>
      </div>
      <div className="mt-8 grid gap-6">
        {demoScreens.map((screen) => (
          <section key={screen.src} className="card border border-base-300 bg-base-200">
            <div className="card-body">
              <h2 className="card-title">{screen.title}</h2>
              <a className="link link-primary" href={screen.src}>
                Open {screen.title} PDF
              </a>
              <iframe
                title={`${screen.title} PDF`}
                src={screen.src}
                className="h-[70vh] min-h-96 w-full rounded-lg border border-base-300"
              />
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
