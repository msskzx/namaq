import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { JSDOM } from 'jsdom';
import { bodyMarkdown, extractShamelaPage, notesMarkdown, sliceEntry } from '../../src/lib/history/shamelaEntry';
import type { AccountRecord, HistoryBatch, PageRecord, SubjectKind } from '../../src/lib/history/batchSchema';
import { batchDefinitionFile } from '../../src/lib/history/loadBatch';

// Shamela serves the reading pages only to a browser-shaped request.
const userAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36';

function option(name: string) {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

function required(name: string) {
  const value = option(name);
  if (!value) throw new Error(`--${name} is required`);
  return value;
}

async function fetchPage(bookId: string, pageId: number) {
  const url = `https://shamela.ws/book/${bookId}/${pageId}`;
  const response = await fetch(url, { headers: { 'User-Agent': userAgent } });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return { url, document: new JSDOM(await response.text()).window.document };
}

async function main() {
  const bookId = required('book');
  const from = Number(required('from'));
  const to = Number(required('to'));
  const batchDir = required('out');
  const subjectSlug = required('subject-slug');
  const sourceSlug = required('source-slug');
  const subjectKind = (option('subject-kind') ?? 'PERSON') as SubjectKind;
  const startAnchor = option('start-anchor');
  const endAnchor = option('end-anchor');
  const notesEndMarker = option('notes-end-marker');
  const accessedAt = option('accessed-at') ?? new Date().toISOString().slice(0, 10);

  const pages: PageRecord[] = [];
  let firstUrl = '';

  for (let pageId = from; pageId <= to; pageId += 1) {
    const { url, document } = await fetchPage(bookId, pageId);
    if (pageId === from) firstUrl = url;

    const raw = extractShamelaPage(document);
    const page = sliceEntry(raw, {
      startAnchor: pageId === from ? startAnchor : undefined,
      endAnchor: pageId === to ? endAnchor : undefined,
      notesEndMarker: pageId === to ? notesEndMarker : undefined,
    });
    const sequence = pageId - from + 1;
    const bodyFile = `accounts/${subjectSlug}/${String(sequence).padStart(3, '0')}.md`;

    const target = join(batchDir, bodyFile);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, bodyMarkdown(page));

    const notes = notesMarkdown(page);
    const notesFile = notes ? bodyFile.replace(/\.md$/, '.notes.md') : undefined;
    if (notes && notesFile) writeFileSync(join(batchDir, notesFile), notes);

    pages.push({
      sequence,
      printedPage: page.printedPage ?? undefined,
      bodyFile,
      notesFile,
      extractionUrl: url,
      passages: page.body.map((paragraph) => ({
        anchor: `${page.printedPage ?? sequence}-${paragraph.anchor}`,
        excerpt: paragraph.text,
      })),
    });

    console.log(`  page ${page.printedPage ?? sequence}: ${page.body.length} paragraphs, ${raw.notes.length} note block(s)`);
  }

  const account: AccountRecord = {
    sourceSlug,
    subjectKind,
    subjectSlug,
    extractionUrl: firstUrl,
    accessedAt,
    pages,
  };

  const definition = join(batchDir, batchDefinitionFile);
  const batch = JSON.parse(readFileSync(definition, 'utf8')) as HistoryBatch;
  const existing = batch.accounts.findIndex(
    (candidate) => candidate.sourceSlug === sourceSlug && candidate.subjectSlug === subjectSlug,
  );
  const merged = existing === -1 ? account : { ...batch.accounts[existing], ...account };
  if (existing === -1) batch.accounts.push(merged);
  else batch.accounts[existing] = merged;

  writeFileSync(definition, `${JSON.stringify(batch, null, 2)}\n`);
  console.log(`Wrote ${pages.length} page(s) and updated ${definition}`);
  console.log('  approval must be re-recorded: the batch revision has changed');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
