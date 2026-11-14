export default function Home() {
  return (
    <main className="flex flex-col items-center gap-8 px-4 py-8">
      <h1 className="text-2xl font-bold">Home Page</h1>

      <section className="flex w-full max-w-6xl flex-col items-center gap-4">
        <h2 className="text-xl font-semibold">Host Screen Demo</h2>
        <a
          href="/project-files/demo_host_screen.pdf"
          target="_blank"
          rel="noreferrer"
        >
          Open the host screen demo PDF in a new tab
        </a>
        <iframe
          src="/project-files/demo_host_screen.pdf"
          title="Host screen demo PDF"
          className="h-[80vh] min-h-150 w-full"
        />
      </section>

      <section className="flex w-full max-w-6xl flex-col items-center gap-4">
        <h2 className="text-xl font-semibold">Student Phone Demo</h2>
        <a
          href="/project-files/demo_student_phone.pdf"
          target="_blank"
          rel="noreferrer"
        >
          Open the student phone demo PDF in a new tab
        </a>
        <iframe
          src="/project-files/demo_student_phone.pdf"
          title="Student phone demo PDF"
          className="h-[80vh] min-h-150 w-full"
        />
      </section>
    </main>
  );
}
