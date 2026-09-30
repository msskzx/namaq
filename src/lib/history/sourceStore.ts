import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const sourcesRoot = 'data/history/sources';

export interface StoreVolumeRecord {
  number: number;
  name?: string;
  firstPrintedPage?: number | null;
  lastPrintedPage?: number | null;
  notes?: string;
}

export interface SourceManifest {
  slug: string;
  title: string;
  language?: string;
  author?: string;
  editor?: string;
  publisher?: string;
  publicationYear?: string;
  edition?: string;
  digitalHost?: string;
  url?: string;
  notes?: string;
  volumes: StoreVolumeRecord[];
}

export interface StorePage {
  body: string;
  notes: string | null;
}

/** Reads `data/history/sources/<slug>/source.json`. */
export function loadSourceManifest(root: string, sourceSlug: string): SourceManifest {
  const path = join(root, sourcesRoot, sourceSlug, 'source.json');
  if (!existsSync(path)) {
    throw new Error(`unknown source "${sourceSlug}": no manifest at ${path}`);
  }
  return JSON.parse(readFileSync(path, 'utf8')) as SourceManifest;
}

/** Reads one page of the store, or null if it has not been transcribed. */
export function loadStorePage(
  root: string,
  sourceSlug: string,
  volumeNumber: number,
  printedPage: string,
): StorePage | null {
  const dir = join(root, sourcesRoot, sourceSlug, `v${volumeNumber}`);
  const bodyPath = join(dir, `${printedPage}.md`);
  if (!existsSync(bodyPath)) return null;
  const notesPath = join(dir, `${printedPage}.notes.md`);
  return {
    body: readFileSync(bodyPath, 'utf8'),
    notes: existsSync(notesPath) ? readFileSync(notesPath, 'utf8') : null,
  };
}

/**
 * The text each paragraph of a page stands for, keyed by its derived anchor
 * `<volume>/<printedPage>-p<n>` -- see docs/adr/0018-a-page-belongs-to-the-edition.md.
 * Anchors are never authored: a citation names one and this is what resolves it.
 */
export function pageAnchors(volumeNumber: number, printedPage: string, body: string): Map<string, string> {
  const paragraphs = body
    .split(/\n{2,}/)
    .map((text) => text.trim())
    .filter(Boolean);
  return new Map(paragraphs.map((text, index) => [`${volumeNumber}/${printedPage}-p${index + 1}`, text]));
}
