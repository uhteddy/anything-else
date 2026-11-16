import Link from "next/link";

// Temporary placeholder. Replace with the Create Quiz screen.
export default function CreateQuiz() {
  return (
    <main className="flex flex-col items-center gap-4 px-4 py-12 text-center">
      <span className="badge badge-outline">Placeholder</span>
      <h1 className="text-3xl font-bold">Create Quiz</h1>
      <p className="opacity-70">Coming soon.</p>
      <Link href="/host" className="btn btn-ghost">
        ← Back to Host a Game
      </Link>
    </main>
  );
}
