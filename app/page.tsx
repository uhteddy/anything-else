import { readFile } from 'node:fs/promises';
import path from 'node:path';
import Markdown from 'react-markdown';

export default async function Home() {
  'use cache';

  const content = await readFile(
    path.join(process.cwd(), 'public/project-files/background_motivation.md'),
    'utf8',
  );

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="mb-4 text-center text-lg font-semibold">Anything Else</p>
      <article className="leading-relaxed [&_h1]:mb-6 [&_h1]:text-4xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_li]:mb-2 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6">
        <Markdown>{content}</Markdown>
      </article>
    </main>
  );
}
