import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import type { CardProposals, CardReviewIndex } from './cardReviewIndex';

/**
 * The review page's two files, read from disk (not bundled: the index is several MB) and read again only when a file changes, so
 * a rebuilt index (`npm run quran:card-review`) or newly merged proposals (`npm run quran:card-proposals`) show on the next load.
 */
const cache = new Map<string, { mtime: number; data: unknown }>();
function read<T>(file: string): T {
  const path = join(process.cwd(), 'src/lib/quran/curation', file);
  const mtime = statSync(path).mtimeMs;
  const hit = cache.get(path);
  if (hit?.mtime === mtime) return hit.data as T;
  const data = JSON.parse(readFileSync(path, 'utf8')) as T;
  cache.set(path, { mtime, data });
  return data;
}

export const cardReviewIndex = () => read<CardReviewIndex>('cardReview.json');
export const cardProposals = () => read<{ cards: CardProposals }>('cardProposals.json').cards;
