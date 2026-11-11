import { readFileSync, renameSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { OWNER_ASK, type BranchVerdict, type BranchVerdicts } from '@shared/quran/branchVerdicts';

const FILE = 'shared/data/quran/branchVerdicts.json';
export type BranchReviewAction = 'keep' | 'drop' | 'discuss' | 'undo';

/** The verdict after the owner's press. Pressing a choice again (undo) clears it, so the card is unreviewed. */
export function nextBranchVerdict(verdict: BranchVerdict | undefined, action: BranchReviewAction, text?: string): BranchVerdict | undefined {
  if (action === 'undo') return undefined;
  const base = { ...(text ? { text } : verdict?.text ? { text: verdict.text } : {}) };
  if (action === 'discuss') return { keep: verdict?.keep ?? true, why: verdict?.why ?? 'Not judged yet', ...base, ask: OWNER_ASK };
  return { keep: action === 'keep', why: action === 'keep' ? '(owner kept)' : '(owner removed)', checked: true, ...base };
}

/** Writes the verdict file at once (atomically); the dev server picks it up on the next render. */
export function recordBranchReview(id: string, action: BranchReviewAction, text?: string) {
  const path = join(process.cwd(), FILE);
  const data = JSON.parse(readFileSync(path, 'utf8')) as { trees: BranchVerdicts };
  const next = nextBranchVerdict(data.trees[id], action, text);
  if (next) data.trees[id] = next;
  else delete data.trees[id];
  writeFileSync(`${path}.tmp`, `${JSON.stringify(data, null, 1)}\n`);
  renameSync(`${path}.tmp`, path);
}
