/**
 * Writes the owner's card review presses (.card-review-log.jsonl, left as it is) into the compare and branch verdicts, then
 * rebuilds the compare cards and the review index. The older compare review log's unapplied presses, all made before the card
 * review, are folded in first, so each pair keeps its latest press. Neither log is edited. Usage: npm run quran:card-apply
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, renameSync, writeFileSync } from 'node:fs';
import { applyCardPresses } from '../../src/lib/quran/curation/cardApply';
import { readCardPresses } from '../../src/lib/quran/curation/cardReviewLog';
import { applyReviewLog } from '../../src/lib/quran/curation/reviewLog';
import type { CardReviewIndex } from '../../src/lib/quran/curation/cardReviewIndex';

const PAIRS = 'src/lib/quran/curation/comparePairs.json';
const TREES = 'shared/data/quran/branchVerdicts.json';
const readJson = (path: string) => JSON.parse(readFileSync(path, 'utf8'));
const writeJson = (path: string, data: object) => {
  writeFileSync(`${path}.tmp`, `${JSON.stringify(data, null, 1)}\n`);
  renameSync(`${path}.tmp`, path);
};
const run = (script: string) => execFileSync('npx', ['tsx', script], { stdio: 'inherit' });

const folded = applyReviewLog(() => {});
console.log(`older compare review log: ${folded.length} presses folded in`);

const index = readJson('src/lib/quran/curation/cardReview.json') as CardReviewIndex;
const proposals = readJson('src/lib/quran/curation/cardProposals.json').cards;
const pairs = readJson(PAIRS);
const trees = readJson(TREES);
const result = applyCardPresses(index.cards, proposals, readCardPresses(), pairs.pairs, trees.trees);
writeJson(PAIRS, { ...pairs, pairs: result.pairs });
writeJson(TREES, { ...trees, trees: result.trees });

const counts = new Map<string, number>();
for (const { kind, action } of result.applied) counts.set(`${kind} ${action}`, (counts.get(`${kind} ${action}`) ?? 0) + 1);
for (const [key, n] of [...counts].sort()) console.log(`applied ${key}: ${n}`);
for (const { id, action, why } of result.skipped) console.log(`skipped ${id} ${action}: ${why}`);

run('scripts/quran/buildCompareCards.ts');
run('scripts/quran/buildCardReview.ts');
