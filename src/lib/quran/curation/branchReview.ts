import { readFileSync, renameSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { OWNER_ASK, type BranchVerdict, type BranchVerdicts, type TwinVerdicts } from '@shared/quran/branchVerdicts';
import { compareVerdicts } from './comparePairs';
import { appendReview, withUnappliedReviews } from './reviewLog';

const FILE = 'shared/data/quran/branchVerdicts.json';
const TWINS = 'shared/data/quran/twinVerdicts.json';
export type BranchReviewAction = 'keep' | 'drop' | 'discuss' | 'undo';

/** The verdict after the owner's press. Pressing a choice again (undo) clears it, so the card is unreviewed. */
export function nextBranchVerdict(verdict: BranchVerdict | undefined, action: BranchReviewAction): BranchVerdict | undefined {
  if (action === 'undo') return undefined;
  if (action === 'discuss') return { keep: verdict?.keep ?? true, why: verdict?.why ?? 'Not judged yet', ask: OWNER_ASK };
  return { keep: action === 'keep', why: action === 'keep' ? '(owner kept)' : '(owner removed)', checked: true };
}

const readJson = <T>(path: string) => JSON.parse(readFileSync(path, 'utf8')) as T;
function writeJson(path: string, data: object) {
  writeFileSync(`${path}.tmp`, `${JSON.stringify(data, null, 1)}\n`);
  renameSync(`${path}.tmp`, path);
}

/**
 * Writes the owner's press at once (atomically); the dev server picks it up on the next render. A twin (a card compare also holds)
 * has one verdict, the compare pair's: the press goes into the compare review log, as if made on the compare page, and the twin's
 * copy is brought up to date so both pages show it now.
 */
export function recordBranchReview(id: string, action: BranchReviewAction) {
  const twinsPath = join(process.cwd(), TWINS);
  const twins = readJson<{ twins: TwinVerdicts }>(twinsPath);
  const twin = twins.twins[id];
  if (twin) {
    const surahs = twin.pair.split('|').map(key => Number(key.split(':')[0]));
    appendReview({ t: Date.now(), page: surahs.join('/'), card: [twin.pair], action });
    const verdict = withUnappliedReviews(compareVerdicts)[twin.pair];
    twins.twins[id] = { pair: twin.pair, keep: verdict?.keep ?? twin.keep, why: verdict?.why ?? twin.why, ...(verdict?.checked ? { checked: true } : {}), ...(verdict?.ask ? { ask: verdict.ask } : {}), ...(twin.view ? { view: twin.view } : {}) };
    writeJson(twinsPath, twins);
    return;
  }
  const path = join(process.cwd(), FILE);
  const data = readJson<{ trees: BranchVerdicts }>(path);
  const next = nextBranchVerdict(data.trees[id], action);
  if (next) data.trees[id] = next;
  else delete data.trees[id];
  writeJson(path, data);
}
