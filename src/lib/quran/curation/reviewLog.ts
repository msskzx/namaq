// docs/plans/curated-passage-comparisons.md
import { closeSync, fsyncSync, openSync, readFileSync, renameSync, writeFileSync, writeSync } from 'node:fs';
import { join } from 'node:path';
import type { Verdict } from './comparePairs';
import { cardVerdicts, restoredVerdicts, reviewedVerdicts, type CardAction, type ReviewAction } from './reviewPage';

type Verdicts = Record<string, Verdict>;
/** With `card`, the press covers those pairs; without it, every pair of the page that no card press has decided. */
export type ReviewPress = { t: number; page: string; card?: string[]; action: ReviewAction | CardAction | 'undo' };

const LOG = '.review-log.jsonl';
const OFFSET = '.review-log.offset';
const VERDICTS = 'src/lib/quran/curation/comparePairs.json';

const inRoot = (path: string) => join(process.cwd(), path);
const readJson = (path: string) => JSON.parse(readFileSync(inRoot(path), 'utf8'));

function bytesOf(path: string): Buffer {
  try {
    return readFileSync(inRoot(path));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return Buffer.alloc(0);
    throw error;
  }
}

/** One write per press, flushed to disk before the request answers. */
export function appendReview(press: ReviewPress) {
  const log = bytesOf(LOG);
  const file = openSync(inRoot(LOG), 'a');
  try {
    writeSync(file, `${log.length && log[log.length - 1] !== 0x0a ? '\n' : ''}${JSON.stringify(press)}\n`);
    fsyncSync(file);
  } finally {
    closeSync(file);
  }
}

function parsed(line: string): ReviewPress[] {
  try {
    return [JSON.parse(line)];
  } catch {
    console.error('compare-review: skipped a broken log line', line);
    return [];
  }
}

function unapplied() {
  const log = bytesOf(LOG);
  const end = log.lastIndexOf(0x0a) + 1;
  const presses = log.subarray(Number(bytesOf(OFFSET).toString()) || 0, end).toString().split('\n').filter(Boolean).flatMap(parsed);
  return { presses, end };
}

function pagesOfPairs(): Map<string, string[]> {
  const pairs: { a: string; b: string }[] = [...readJson('src/app/quran/compare/pairs.json').pairs, ...readJson('src/app/quran/compare/passagePairs.json').pairs];
  const curated = (readJson('src/lib/quran/curation/compareLinks.json').links as { pair: string }[]).map(link => link.pair);
  const pages = new Map<string, string[]>();
  for (const key of new Set([...pairs.map(pair => `${pair.a}|${pair.b}`), ...curated])) {
    const page = key.split('|').map(part => part.split(':')[0]).join('/');
    pages.set(page, [...(pages.get(page) ?? []), key]);
  }
  return pages;
}

function replayed(verdicts: Verdicts, presses: ReviewPress[]): Verdicts {
  const pages = pagesOfPairs();
  const next = { ...verdicts };
  for (const { page, card, action } of presses) {
    const keys = card ?? (pages.get(page) ?? []).filter(key => !next[key]?.card);
    if (action === 'undo') {
      const restored = restoredVerdicts(next, keys);
      for (const key of keys) {
        if (restored[key]) next[key] = restored[key];
        else delete next[key];
      }
    } else {
      Object.assign(next, card ? cardVerdicts(next, keys, action as CardAction) : reviewedVerdicts(next, keys, action as ReviewAction));
    }
  }
  return next;
}

/** The verdicts as the owner has left them, on their own machine, before the log is applied. */
export function withUnappliedReviews(verdicts: Verdicts): Verdicts {
  if (process.env.NODE_ENV !== 'development') return verdicts;
  const { presses } = unapplied();
  return presses.length ? replayed(verdicts, presses) : verdicts;
}

/** Folds the unapplied presses into the verdict file, in order. The offset moves last: a crash before it replays the same presses, and replaying gives the same verdicts. */
export function applyReviewLog(rebuildCards: () => void): ReviewPress[] {
  const { presses, end } = unapplied();
  if (!presses.length) return [];
  const data = readJson(VERDICTS);
  data.pairs = replayed(data.pairs, presses);
  const path = inRoot(VERDICTS);
  writeFileSync(`${path}.tmp`, `${JSON.stringify(data, null, 1)}\n`);
  renameSync(`${path}.tmp`, path);
  rebuildCards();
  writeFileSync(inRoot(OFFSET), String(end));
  return presses;
}
