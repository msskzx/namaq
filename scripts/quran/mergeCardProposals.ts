/**
 * Merges the judging agents' verdict lines into src/lib/quran/curation/cardProposals.json, the agents' version the owner's card
 * review page shows beside each card. Nothing in the app reads it: the cards change only when the owner's review is applied.
 *
 * Usage: tsx scripts/quran/mergeCardProposals.ts <dir>
 *   <dir>/mechanical.json   verdicts from the settled rules (20+ places: search only; our card the same as a book's)
 *   <dir>/out/*.jsonl       one verdict line per card from each judging agent
 *   <dir>/check/*.jsonl     the second agent's view, by key: { key, agree, why }
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { reviewKey, type CardProposal, type CardProposals, type CardReviewIndex } from '../../src/lib/quran/curation/cardReviewIndex';

const dir = process.argv[2];
if (!dir) throw new Error('Usage: tsx scripts/quran/mergeCardProposals.ts <dir>');
const OUT = 'src/lib/quran/curation/cardProposals.json';

const lines = (folder: string) => {
  let files: string[] = [];
  try {
    files = readdirSync(join(dir, folder)).filter(file => file.endsWith('.jsonl')).sort();
  } catch {
    return [];
  }
  return files.flatMap(file => readFileSync(join(dir, folder, file), 'utf8').split('\n').filter(Boolean).map(line => JSON.parse(line)));
};

const index = JSON.parse(readFileSync('src/lib/quran/curation/cardReview.json', 'utf8')) as CardReviewIndex;
const known = new Map(index.cards.map(entry => [reviewKey(entry), entry]));
const proposals: CardProposals = {};

for (const [key, verdict] of Object.entries(JSON.parse(readFileSync(join(dir, 'mechanical.json'), 'utf8')) as Record<string, CardProposal>)) proposals[key] = verdict;
// A card judged twice (an agent resumed over its own batch) keeps its last line.
for (const { key, keep, why, cards, changes, relation, flags, unsure } of lines('out')) {
  if (!known.has(key)) throw new Error(`An agent judged an unknown card: ${key}`);
  proposals[key] = { keep, why, ...(cards ? { cards } : {}), ...(changes ? { changes } : {}), ...(relation ? { relation } : {}), ...(flags?.length ? { flags } : {}), ...(unsure ? { unsure } : {}) };
}
for (const { key, agree, why } of lines('check')) if (proposals[key]) proposals[key].check = { agree, why };

// The open rule on reading on: a card of ours whose rows read on into the next ayah is flagged, whatever the agents said.
for (const [key, proposal] of Object.entries(proposals)) {
  const entry = known.get(key)!;
  if (entry.kind !== 'book' && entry.kind !== 'compare' && entry.rows.some(row => row.length > 1) && !proposal.flags?.includes('runOn')) proposal.flags = [...proposal.flags ?? [], 'runOn'];
}

writeFileSync(OUT, `${JSON.stringify({ built: 'scripts/quran/mergeCardProposals.ts', cards: proposals })}\n`);
console.log(`${Object.keys(proposals).length} proposals → ${OUT}`);
