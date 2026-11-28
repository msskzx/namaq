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

const places = (entry: CardReviewEntry) => [...new Set(entry.rows.map(row => row[0]))].sort().join(',');
const bookCards = new Map(index.cards.filter(entry => entry.kind === 'book').map(entry => [places(entry), entry.id]));
for (const entry of index.cards) {
  if (entry.kind === 'compare' || entry.verdict?.checked) continue;
  if (entry.rows.length >= 20) proposals[entry.id] = { keep: false, search: true, why: `Holds ${entry.rows.length} places. By the rule, a group of 20 or more is not a card; it is found by search only.` };
  else if (entry.kind !== 'book' && bookCards.has(places(entry))) proposals[entry.id] = { keep: false, same: bookCards.get(places(entry)), why: "The same places as a book card. By the rule, only the book's card stays." };
}

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

const byKey = new Map<string, string[]>();
for (const file of files('out')) for (const { key, id } of jsonl(join(dir, 'shards', file))) byKey.set(key, [...new Set([...byKey.get(key) ?? [], id])]);
for (const file of files('check')) for (const { key, agree, why } of jsonl(join(dir, 'check', file))) for (const id of byKey.get(key) ?? []) if (proposals[id] && !superseded.has(id)) proposals[id].check = { agree, why };

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

for (const [id, proposal] of Object.entries(proposals)) {
  const entry = known.get(id);
  if (entry && entry.kind !== 'book' && entry.kind !== 'compare' && entry.rows.some(row => row.length > 1) && !proposal.flags?.includes('runOn')) proposal.flags = [...proposal.flags ?? [], 'runOn'];
}

for (const id of Object.keys(proposals)) if (!known.has(id) || known.get(id)!.link) delete proposals[id];

writeFileSync(OUT, `${JSON.stringify({ built: 'scripts/quran/mergeCardProposals.ts', cards: proposals })}\n`);
console.log(`${Object.keys(proposals).length} proposals → ${OUT}`);
