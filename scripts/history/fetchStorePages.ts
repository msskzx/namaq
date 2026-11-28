import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';
import { bodyMarkdown, extractShamelaPage, notesMarkdown } from '../../src/lib/history/shamelaEntry';
import { sourcesRoot } from '../../src/lib/history/sourceStore';

const userAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36';

function option(name: string) {
  const index = process.argv.indexOf(`--${name}`);
  if (index === -1) throw new Error(`--${name} is required`);
  return process.argv[index + 1];
}

async function main() {
  const from = Number(option('from'));
  const to = Number(option('to'));
  const volume = Number(option('volume'));
  const volumeDir = join(sourcesRoot, 'siyar-alam-al-nubala-risalah', `v${volume}`);
  mkdirSync(volumeDir, { recursive: true });
  for (let pageId = from; pageId <= to; pageId += 1) {
    const url = `https://shamela.ws/book/10906/${pageId}`;
    let html = '';
    for (let attempt = 0; attempt < 4; attempt += 1) {
      const response = await fetch(url, { headers: { 'User-Agent': userAgent } });
      if (response.ok) { html = await response.text(); break; }
      await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
    }
    if (!html) throw new Error(`${url} failed`);
    const page = extractShamelaPage(new JSDOM(html).window.document);
    if (!page.printedPage) { console.log(`${pageId}: no printed page number, skipped`); continue; }
    const bodyPath = join(volumeDir, `${page.printedPage}.md`);
    if (existsSync(bodyPath)) { console.log(`${pageId}: v${volume}/${page.printedPage} already stored`); continue; }
    writeFileSync(bodyPath, bodyMarkdown(page));
    const notes = notesMarkdown(page);
    if (notes) writeFileSync(join(volumeDir, `${page.printedPage}.notes.md`), notes);
    console.log(`${pageId}: v${volume}/${page.printedPage} ${page.body.length} paragraphs`);
    await new Promise((r) => setTimeout(r, 250));
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
