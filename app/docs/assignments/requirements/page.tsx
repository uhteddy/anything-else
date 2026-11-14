export default function Docs() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 px-4 py-8">
      <h1 className="text-2xl font-bold">Requirements</h1>
      <a
        href="/project-files/project_requirements.pdf"
        target="_blank"
        rel="noreferrer"
      >
        Open the requirements PDF in a new tab
      </a>
      <iframe
        src="/project-files/project_requirements.pdf"
        title="Project requirements PDF"
        className="h-[80vh] min-h-150 w-full max-w-6xl"
      />
    </div>
  );
}
