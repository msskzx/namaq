import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { BatchFiles, HistoryBatch, SourceManifests, StorePages } from './batchSchema';
import { storePageKey } from './batchSchema';
import { loadSourceManifest, loadStorePage } from './sourceStore';

export const batchDefinitionFile = 'batch.json';

/**
 * Reads a batch directory (its definition and `summary.md`), plus every
 * source manifest and store page the batch's accounts name — see AGENTS.md,
 * "Do not read a whole account to answer a question."
 */
export function loadBatch(
  dir: string,
  root = '.',
): { batch: HistoryBatch; files: BatchFiles; manifests: SourceManifests; pages: StorePages } {
  const batch = JSON.parse(readFileSync(join(dir, batchDefinitionFile), 'utf8')) as HistoryBatch;

  const files: BatchFiles = {};
  files[batch.summaryFile] = readFileSync(join(dir, batch.summaryFile), 'utf8');

  const manifests: SourceManifests = new Map();
  const pages: StorePages = new Map();

  for (const account of batch.accounts) {
    if (!manifests.has(account.sourceSlug)) {
      try {
        manifests.set(account.sourceSlug, loadSourceManifest(root, account.sourceSlug));
      } catch {
        // Left unresolved; validateBatch reports the unknown source.
      }
    }
    for (const page of account.pages) {
      const volumeNumber = page.volumeNumber ?? account.volumeNumber;
      if (volumeNumber === undefined) continue;
      const key = storePageKey(account.sourceSlug, volumeNumber, page.printedPage);
      if (pages.has(key)) continue;
      const store = loadStorePage(root, account.sourceSlug, volumeNumber, page.printedPage);
      if (store) pages.set(key, store);
    }
  }

  return { batch, files, manifests, pages };
}
