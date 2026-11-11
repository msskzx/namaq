// docs/plans/quran-prophet-timelines.md
import { closeSync, fsyncSync, openSync, readFileSync, renameSync, writeFileSync, writeSync } from 'node:fs';
import { join } from 'node:path';
import type { PlaceVerdicts } from '@shared/quran/prophets/review';
import { cardVerdicts, restoredVerdicts, type CardAction } from './reviewPage';

/** One press on one dot of a story map. */
export type StoryPress = { t: number; key: string; action: CardAction | 'undo' };

const LOG = '.story-review-log.jsonl';
const OFFSET = '.story-review-log.offset';
const VERDICTS = 'shared/quran/prophets/verdicts.json';

const inRoot = (path: string) => join(process.cwd(), path);

function bytesOf(path: string): Buffer {
  try {
    return readFileSync(inRoot(path));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return Buffer.alloc(0);
    throw error;
  }
}

/** One write per press, flushed to disk before the request answers. */
export function appendStoryReview(press: StoryPress) {
  const log = bytesOf(LOG);
  const file = openSync(inRoot(LOG), 'a');
  try {
    writeSync(file, `${log.length && log[log.length - 1] !== 0x0a ? '\n' : ''}${JSON.stringify(press)}\n`);
    fsyncSync(file);
  } finally {
    closeSync(file);
  }
}

function unapplied() {
  const log = bytesOf(LOG);
  const end = log.lastIndexOf(0x0a) + 1;
  const presses = log.subarray(Number(bytesOf(OFFSET).toString()) || 0, end).toString().split('\n').filter(Boolean).flatMap(line => {
    try {
      return [JSON.parse(line) as StoryPress];
    } catch {
      console.error('story-review: skipped a broken log line', line);
      return [];
    }
  });
  return { presses, end };
}

/** The verdicts after the presses, in order. Pressing a dot's current choice again sends `undo`, which brings back the draft. */
export function replayedStory(verdicts: PlaceVerdicts, presses: StoryPress[]): PlaceVerdicts {
  const next = { ...verdicts };
  for (const { key, action } of presses) {
    if (action === 'undo') {
      const restored = restoredVerdicts(next, [key]);
      if (restored[key]) next[key] = restored[key];
      else delete next[key];
    } else Object.assign(next, cardVerdicts(next, [key], action));
  }
  return next;
}

/** The verdicts as the owner has left them, on their own machine, before the log is applied. */
export function withUnappliedStoryReviews(verdicts: PlaceVerdicts): PlaceVerdicts {
  if (process.env.NODE_ENV !== 'development') return verdicts;
  const { presses } = unapplied();
  return presses.length ? replayedStory(verdicts, presses) : verdicts;
}

/** Folds the unapplied presses into the verdict file. The offset moves last, and replaying the same presses gives the same verdicts. */
export function applyStoryReviewLog(): StoryPress[] {
  const { presses, end } = unapplied();
  if (!presses.length) return [];
  const data = JSON.parse(readFileSync(inRoot(VERDICTS), 'utf8'));
  data.places = Object.fromEntries(Object.entries(replayedStory(data.places, presses)).sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true })));
  const path = inRoot(VERDICTS);
  writeFileSync(`${path}.tmp`, `${JSON.stringify(data, null, 1)}\n`);
  renameSync(`${path}.tmp`, path);
  writeFileSync(inRoot(OFFSET), String(end));
  return presses;
}
