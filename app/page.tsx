import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center gap-8 px-4 py-8">
      <Link href={'/project'}>View Project Information</Link>
    </main>
  );
}
