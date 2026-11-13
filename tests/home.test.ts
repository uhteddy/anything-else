import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Home from '@/app/page';

describe('Home page', () => {
  it('renders the project background Markdown as formatted content', async () => {
    const html = renderToStaticMarkup(await Home());

    expect(html).toContain('<h1>Anything Else: Background and Motivation</h1>');
    expect(html).toContain('<h2>Overview</h2>');
    expect(html).toContain('<h2>Assumptions and Risks</h2>');
    expect(html).toContain('<strong>Prepare.</strong>');
    expect(html).toContain('<ol>');
    expect(html).toContain('<ul>');
  });
});
