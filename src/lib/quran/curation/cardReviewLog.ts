import { closeSync, fsyncSync, openSync, readFileSync, writeSync } from 'node:fs';
import { join } from 'node:path';
import type { CardPress } from './cardReviewIndex';

/** The owner's presses on the card review page: one JSON line each, only ever appended (owner 2026-11-20). Gitignored. */
export const CARD_REVIEW_LOG = '.card-review-log.jsonl';
const path = () => join(process.cwd(), CARD_REVIEW_LOG);

/** One small write per press, on disk before the request answers. Nothing else changes: no verdict file, no rebuild. */
export function appendCardPress(press: CardPress) {
  const file = openSync(path(), 'a');
  try {
    writeSync(file, `${JSON.stringify(press)}\n`);
    fsyncSync(file);
  } finally {
    closeSync(file);
  }
}

/** Every press in order. A line cut short by a crash is skipped, not fatal. */
export function readCardPresses(): CardPress[] {
  let text = '';
  try {
    text = readFileSync(path(), 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
  return text.split('\n').flatMap(line => {
    if (!line) return [];
    try {
      return [JSON.parse(line) as CardPress];
    } catch {
      return [];
    }
  });
}
