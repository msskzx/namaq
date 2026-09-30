import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';
import { bodyMarkdown, extractShamelaPage, notesMarkdown, sliceEntry } from '../../src/lib/history/shamelaEntry';
import type { AccountRecord, HistoryBatch, PageRecord, SubjectKind } from '../../src/lib/history/batchSchema';
import { batchDefinitionFile } from '../../src/lib/history/loadBatch';
import { sourcesRoot } from '../../src/lib/history/sourceStore';

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
  const notesStartMarker = option('notes-start-marker');
  const notesEndMarker = option('notes-end-marker');
  const accessedAt = option('accessed-at') ?? new Date().toISOString().slice(0, 10);
  // An account that crosses a volume sees printed numbering restart.
  // --volume bumps on each restart, matching the source manifest's own volumes.
  const startVolume = Number(required('volume'));

  const pages: PageRecord[] = [];
  let firstUrl = '';
  let volume = startVolume;
  let previousPrinted: number | undefined;

  for (let pageId = from; pageId <= to; pageId += 1) {
    const { url, document } = await fetchPage(bookId, pageId);
    if (pageId === from) firstUrl = url;

    const raw = extractShamelaPage(document);
    const page = sliceEntry(raw, {
      startAnchor: pageId === from ? startAnchor : undefined,
      endAnchor: pageId === to ? endAnchor : undefined,
      notesStartMarker: pageId === from ? notesStartMarker : undefined,
      notesEndMarker: pageId === to ? notesEndMarker : undefined,
    });
    const printed = Number(page.printedPage);
    if (Number.isNaN(printed)) {
      throw new Error(`page ${pageId} has no parseable printed page number; extract it by hand`);
    }
    if (previousPrinted !== undefined && printed < previousPrinted) volume += 1;
    previousPrinted = printed;

    const sequence = pageId - from + 1;
    const printedPage = page.printedPage!;
    const volumeDir = join(sourcesRoot, sourceSlug, `v${volume}`);
    const bodyPath = join(volumeDir, `${printedPage}.md`);
    const notesPath = join(volumeDir, `${printedPage}.notes.md`);

    if (existsSync(bodyPath)) {
      console.log(
        `  vol ${volume} page ${printedPage}: already in the store — leaving it; ` +
          `merge by hand if this entry also belongs on it (docs/plans/source-page-store.md)`,
      );
    } else {
      mkdirSync(volumeDir, { recursive: true });
      writeFileSync(bodyPath, bodyMarkdown(page));
      const notes = notesMarkdown(page);
      if (notes) writeFileSync(notesPath, notes);
    }

    pages.push({ sequence, printedPage, volumeNumber: volume });

    console.log(`  vol ${volume} page ${printedPage}: ${page.body.length} paragraphs, ${raw.notes.length} note block(s)`);
  }

  const account: AccountRecord = {
    sourceSlug,
    subjectKind,
    subjectSlug,
    volumeNumber: startVolume,
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
  console.log(`Wrote ${pages.length} page(s) to the store and updated ${definition}`);
  console.log('  approval must be re-recorded: the batch revision has changed');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
