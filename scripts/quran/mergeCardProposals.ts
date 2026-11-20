/**
 * Merges the judging agents' verdict lines into src/lib/quran/curation/cardProposals.json, the agents' version the owner's card
 * review page shows beside each card. Nothing in the app reads it: the cards change only when the owner's review is applied.
 *
 * Usage: tsx scripts/quran/mergeCardProposals.ts <dir>
 *   <dir>/shards/*.jsonl    the cards each judging agent was given (key and card id)
 *   <dir>/out/*.jsonl       one verdict line per card from each judging agent, named like its shard
 *   <dir>/check/*.jsonl     the second agent's view, by key: { key, agree, why }
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { type CardProposal, type CardProposals, type CardReviewEntry, type CardReviewIndex } from '../../src/lib/quran/curation/cardReviewIndex';

const dir = process.argv[2];
if (!dir) throw new Error('Usage: tsx scripts/quran/mergeCardProposals.ts <dir>');
const OUT = 'src/lib/quran/curation/cardProposals.json';

const jsonl = (path: string) => readFileSync(path, 'utf8').split('\n').filter(Boolean).map(line => JSON.parse(line));
const files = (folder: string) => {
  try {
    return readdirSync(join(dir, folder)).filter(file => file.endsWith('.jsonl')).sort();
  } catch {
    return [];
  }
};

const index = JSON.parse(readFileSync('src/lib/quran/curation/cardReview.json', 'utf8')) as CardReviewIndex;
const known = new Map(index.cards.map(entry => [entry.id, entry]));
const proposals: CardProposals = {};

// The settled rules, worked out here for every card not yet checked by the owner: 20 or more places are search only,
// and our card that holds the same places as a book's card gives way to it.
const places = (entry: CardReviewEntry) => [...new Set(entry.rows.map(row => row[0]))].sort().join(',');
const bookCards = new Map(index.cards.filter(entry => entry.kind === 'book').map(entry => [places(entry), entry.id]));
for (const entry of index.cards) {
  if (entry.kind === 'compare' || entry.verdict?.checked) continue;
  if (entry.rows.length >= 20) proposals[entry.id] = { keep: false, search: true, why: `Holds ${entry.rows.length} places. By the rule, a group of 20 or more is not a card; it is found by search only.` };
  else if (entry.kind !== 'book' && bookCards.has(places(entry))) proposals[entry.id] = { keep: false, same: bookCards.get(places(entry)), why: "The same places as a book card. By the rule, only the book's card stays." };
}

// Each agent's line names its card by the key it was given (cards sharing a compare pair share a key): the n-th line for a key
// is the n-th card of that key in the agent's shard. A card judged again (an agent resumed over its own batch) keeps its last line.
// A later file re-judges cards of an earlier one (Z1: reshaped word trees judged again under the brief's clarifications). Where the
// verdict or the rows change, the second agent's view was of the earlier verdict, so it is left off.
const superseded = new Set<string>();
const shape = (proposal?: CardProposal) => proposal && JSON.stringify([proposal.keep, proposal.cards ?? null]);
for (const file of files('out')) {
  const ids = new Map<string, string[]>();
  for (const { key, id } of jsonl(join(dir, 'shards', file))) ids.set(key, [...ids.get(key) ?? [], id]);
  const seen = new Map<string, number>();
  for (const { key, keep, why, cards, changes, relation, flags, unsure } of jsonl(join(dir, 'out', file))) {
    const candidates = ids.get(key);
    if (!candidates) throw new Error(`${file}: an agent judged a card not in its shard: ${key}`);
    const n = seen.get(key) ?? 0;
    seen.set(key, n + 1);
    const id = candidates[Math.min(n, candidates.length - 1)];
    const before = shape(proposals[id]);
    proposals[id] = { keep, why, ...(cards ? { cards } : {}), ...(changes ? { changes } : {}), ...(relation ? { relation } : {}), ...(flags?.length ? { flags } : {}), ...(unsure ? { unsure } : {}) };
    if (before && before !== shape(proposals[id])) superseded.add(id);
  }
}

// The second agent's view, by the same key: it applies to every card of that key.
const byKey = new Map<string, string[]>();
for (const file of files('out')) for (const { key, id } of jsonl(join(dir, 'shards', file))) byKey.set(key, [...new Set([...byKey.get(key) ?? [], id])]);
for (const file of files('check')) for (const { key, agree, why } of jsonl(join(dir, 'check', file))) for (const id of byKey.get(key) ?? []) if (proposals[id] && !superseded.has(id)) proposals[id].check = { agree, why };

// The compare card of one pair shares its tree twin's verdict, so it shows the twin's proposal (the agents judged it there).
const twinOf = new Map(index.cards.filter(entry => entry.twin && proposals[entry.id]).map(entry => [entry.twin!, entry.id]));
for (const entry of index.cards) {
  const pair = entry.kind === 'compare' && entry.pairs?.length === 1 ? entry.pairs[0] : undefined;
  if (pair && !entry.link && !proposals[entry.id] && twinOf.has(pair)) {
    const verdict = { ...proposals[twinOf.get(pair)!] };
    delete verdict.cards;
    delete verdict.changes;
    proposals[entry.id] = verdict;
  }
}

// The open rule on reading on: a card of ours whose rows read on into the next ayah is flagged, whatever the agents said.
for (const [id, proposal] of Object.entries(proposals)) {
  const entry = known.get(id);
  if (entry && entry.kind !== 'book' && entry.kind !== 'compare' && entry.rows.some(row => row.length > 1) && !proposal.flags?.includes('runOn')) proposal.flags = [...proposal.flags ?? [], 'runOn'];
}

// A surah-order book's compare card is the book's and is never judged; a card no longer in the index (ours, given way to a
// book card) has nothing to show.
for (const id of Object.keys(proposals)) if (!known.has(id) || known.get(id)!.link) delete proposals[id];

writeFileSync(OUT, `${JSON.stringify({ built: 'scripts/quran/mergeCardProposals.ts', cards: proposals })}\n`);
console.log(`${Object.keys(proposals).length} proposals → ${OUT}`);
