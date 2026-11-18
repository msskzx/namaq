import { closeSync, fsyncSync, openSync, readFileSync, renameSync, writeFileSync, writeSync } from 'node:fs';
import { join } from 'node:path';
import { branchVerdictFor, branchVerdicts, OWNER_ASK, twinOf, type BranchVerdict, type BranchVerdicts } from '@shared/quran/branchVerdicts';
import { compareVerdicts } from './comparePairs';
import { appendReview, withUnappliedReviews } from './reviewLog';

const FILE = 'shared/data/quran/branchVerdicts.json';
/** The owner's presses, one JSON line each. The pages do not import it, so a press does not make the dev server rebuild them. */
const LOG = '.branch-review-log.jsonl';
const OFFSET = '.branch-review-log.offset';
export type BranchReviewAction = 'keep' | 'drop' | 'discuss' | 'undo';
type Press = { t: number; id: string; action: BranchReviewAction };
type Identified = Parameters<typeof branchVerdictFor>[0];

const inRoot = (path: string) => join(process.cwd(), path);

/** The verdict after the owner's press. Pressing a choice again (undo) clears it, so the card is unreviewed. */
export function nextBranchVerdict(verdict: BranchVerdict | undefined, action: BranchReviewAction): BranchVerdict | undefined {
  if (action === 'undo') return undefined;
  if (action === 'discuss') return { keep: verdict?.keep ?? true, why: verdict?.why ?? 'Not judged yet', ask: OWNER_ASK };
  return { keep: action === 'keep', why: action === 'keep' ? '(owner kept)' : '(owner removed)', checked: true };
}

function bytesOf(path: string): Buffer {
  try {
    return readFileSync(inRoot(path));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return Buffer.alloc(0);
    throw error;
  }
}

function unapplied() {
  const log = bytesOf(LOG);
  const end = log.lastIndexOf(0x0a) + 1;
  const presses = log.subarray(Number(bytesOf(OFFSET).toString()) || 0, end).toString().split('\n').filter(Boolean).flatMap(line => {
    try {
      return [JSON.parse(line) as Press];
    } catch {
      console.error('branch-review: skipped a broken log line', line);
      return [];
    }
  });
  return { presses, end };
}

function replayed(verdicts: BranchVerdicts, presses: Press[]): BranchVerdicts {
  const next = { ...verdicts };
  for (const { id, action } of presses) {
    const verdict = nextBranchVerdict(next[id], action);
    if (verdict) next[id] = verdict;
    else delete next[id];
  }
  return next;
}

/**
 * Records the owner's press, flushed to disk before the request answers. A twin (a card compare also holds) has one verdict, the
 * compare pair's, so its press goes into the compare review log, as if made on the compare page. Neither log is imported by a page.
 */
export function recordBranchReview(id: string, action: BranchReviewAction) {
  const twin = twinOf({ id });
  if (twin) {
    appendReview({ t: Date.now(), page: twin.pair.split('|').map(key => key.split(':')[0]).join('/'), card: [twin.pair], action });
    return;
  }
  const log = bytesOf(LOG);
  const file = openSync(inRoot(LOG), 'a');
  try {
    writeSync(file, `${log.length && log[log.length - 1] !== 0x0a ? '\n' : ''}${JSON.stringify({ t: Date.now(), id, action })}\n`);
    fsyncSync(file);
  } finally {
    closeSync(file);
  }
}

/** A card's verdict as the owner has left it on their own machine, presses not yet applied included. Elsewhere, the shipped verdict. */
export function reviewedVerdictFor(piece: Identified): BranchVerdict | undefined {
  if (process.env.NODE_ENV !== 'development') return branchVerdictFor(piece);
  const twin = twinOf(piece);
  if (twin) {
    const verdict = withUnappliedReviews(compareVerdicts)[twin.pair];
    const own = branchVerdictFor(piece);
    if (own?.same) return own;
    return verdict ? { keep: verdict.keep, why: verdict.why, ...(verdict.checked ? { checked: true } : {}), ...(verdict.ask ? { ask: verdict.ask } : {}), ...(twin.view ? { view: twin.view } : {}), ...(own?.ayat ? { ayat: own.ayat } : {}) } : undefined;
  }
  const { presses } = unapplied();
  return branchVerdictFor(piece, presses.length ? replayed(branchVerdicts, presses) : branchVerdicts);
}

/** Folds the unapplied presses into the verdict file, in order. The offset moves last: a crash before it replays the same presses, and replaying gives the same verdicts. */
export function applyBranchReviewLog(): Press[] {
  const { presses, end } = unapplied();
  if (!presses.length) return [];
  const path = inRoot(FILE);
  const data = JSON.parse(readFileSync(path, 'utf8')) as { trees: BranchVerdicts };
  data.trees = replayed(data.trees, presses);
  writeFileSync(`${path}.tmp`, `${JSON.stringify(data, null, 1)}\n`);
  renameSync(`${path}.tmp`, path);
  writeFileSync(inRoot(OFFSET), String(end));
  return presses;
}
