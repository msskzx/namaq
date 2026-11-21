/**
 * Builds the index the owner's card review page reads (src/lib/quran/curation/cardReview.json): every tree card of the review
 * pool and every compare card, each with the rows its matrix draws today and its verdict. The page reads only this file and the
 * agents' proposals, so a page of cards opens without building trees (owner 2026-11-20: performance matters).
 *
 * With `--agents <dir>`, it also writes the agents' input: one JSON line per card with every row's ayah text.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import corpus from '../../shared/quran/quranText/corpus';
import { reviewPool, type BranchPiece } from '../../shared/quran/branchInventory';
import { ayahEnds, ownEnds, twoEnds, uncoveredRows } from '../../shared/quran/branches';
import { phrasePresentation } from '../../shared/quran/phraseTrees';
import { groupPresentation } from '../../shared/quran/mutashabih/presentation';
import { branchVerdictFor, matrixOnly, ownAyatOnly, twinOf, twoAyat } from '../../shared/quran/branchVerdicts';
import { tanasubLink, tanasubSource } from '../../shared/quran/tanasubCards';
import { cardReviewKind, compareCardId, oneTwinPerPair, type CardReviewEntry, type CardReviewIndex } from '../../src/lib/quran/curation/cardReviewIndex';

const OUT = 'src/lib/quran/curation/cardReview.json';
const ayat = corpus.ayat;
const byKey = new Map(ayat.map(ayah => [ayah.key, ayah]));
const positions = new Map(ayat.map((ayah, i) => [ayah.key, i]));
const textOf = (key: string) => byKey.get(key)!.words.join(' ');

/** The rows the website's matrix draws for a card: each ayah run on to its end, rows inside another row left out (as matrixOf). */
function rowsOf(piece: BranchPiece): string[][] {
  const presentation = piece.group ? groupPresentation(piece.group, byKey, null, {}) : phrasePresentation(piece.phrase, ayat, true, true);
  const ends = ownAyatOnly(piece) ? ownEnds(presentation.tree) : twoAyat(piece) ? twoEnds(presentation.tree, key => positions.has(key)) : ayahEnds(presentation.tree);
  const passages = presentation.ayat.map(ayah => ayat.slice(positions.get(ayah.key)!, positions.get(ends[ayah.key] ?? ayah.key)! + 1).map(item => item.key));
  return uncoveredRows(passages).map(i => passages[i]);
}

type Verdict = { keep: boolean; why: string; checked?: boolean; ask?: string };
type CompareCard = { p: string[]; k?: number; a?: number[][] };

function compareCards() {
  const source = readFileSync('shared/data/quran/compareCards.js', 'utf8');
  const data = JSON.parse(JSON.parse(source.slice(source.indexOf('JSON.parse(') + 11, source.lastIndexOf(')')))) as { cards: Record<string, CompareCard[]>; stories: Record<string, CompareCard[]> };
  // A story card is listed in `cards` too: each card once.
  const seen = new Set<string>();
  return [...Object.entries(data.cards), ...Object.entries(data.stories)].flatMap(([page, cards]) => cards.flatMap(card => {
    const id = compareCardId(card.p);
    if (seen.has(id)) return [];
    seen.add(id);
    return [{ page, card }];
  }));
}

const runs = (numbers: number[]) => numbers.reduce<number[][]>((all, n) => {
  const last = all[all.length - 1];
  if (last && n === last[last.length - 1] + 1) last.push(n);
  else all.push([n]);
  return all;
}, []);

function compareRows(page: string, card: CompareCard): string[][] {
  const [a, b] = page.split(':');
  // A passage card: each side's ayat, a row for each run of consecutive ayat.
  if (card.a) return card.a.flatMap((side, i) => runs(side).map(run => run.map(n => `${i ? b : a}:${n}`)));
  const sides = [new Set<string>(), new Set<string>()];
  for (const pair of card.p) pair.split('|').forEach((key, side) => sides[side].add(key));
  return [...sides[0], ...[...sides[1]].filter(key => !sides[0].has(key))].map(key => [key]);
}

const cardVerdict = (verdicts: Verdict[]): CardReviewEntry['verdict'] => {
  if (!verdicts.length) return undefined;
  const keep = verdicts.some(verdict => verdict.keep);
  const why = [...new Set(verdicts.map(verdict => verdict.why))].join('\n');
  return { keep, why, ...(verdicts.every(verdict => verdict.checked) ? { checked: true } : {}), ...(verdicts.some(verdict => verdict.ask) ? { ask: true } : {}) };
};

const entries: CardReviewEntry[] = [];
for (const piece of reviewPool()) {
  const verdict = branchVerdictFor(piece);
  const twin = twinOf(piece);
  entries.push({
    id: piece.id,
    kind: cardReviewKind(piece),
    rows: rowsOf(piece),
    ...(piece.group?.citations.length ? { books: [...new Set(piece.group.citations.map(citation => citation.book))] } : {}),
    ...(matrixOnly(piece) ? { matrix: true } : {}),
    ...(verdict ? { verdict: { keep: verdict.keep, why: verdict.why, ...(verdict.checked ? { checked: true } : {}), ...(verdict.ask ? { ask: true } : {}) } } : {}),
    ...(twin ? { twin: twin.pair } : {}),
  });
}
const pairs = (JSON.parse(readFileSync('src/lib/quran/curation/comparePairs.json', 'utf8')) as { pairs: Record<string, Verdict> }).pairs;
for (const { page, card } of compareCards()) {
  entries.push({
    id: compareCardId(card.p),
    kind: 'compare',
    page: page.replace(':', '/'),
    rows: compareRows(page, card),
    pairs: card.p,
    // A surah-order book's card: exactly the ayat the book names, never dropped (owner 2026-11-20).
    ...(card.k ? { link: card.k, books: [tanasubSource(tanasubLink(card.k)!).book] } : {}),
    verdict: cardVerdict(card.p.flatMap(pair => pairs[pair] ? [pairs[pair]] : [])),
  });
}

// A compare card whose every pair a mutashabih book names is the book's card too: it carries the books, and like the book's card it
// is kept by rule (owner 2026-11-21: "since this is in books why do i get it to review it?").
const bookPairs = new Map<string, string[]>();
for (const entry of entries) if (entry.kind === 'book' && entry.twin) bookPairs.set(entry.twin, [...new Set([...bookPairs.get(entry.twin) ?? [], ...entry.books ?? []])]);
for (const entry of entries) {
  if (entry.kind !== 'compare' || entry.link || !entry.pairs?.every(pair => bookPairs.has(pair))) continue;
  entry.books = [...new Set(entry.pairs.flatMap(pair => bookPairs.get(pair)!))];
}

const index: CardReviewIndex = { built: 'npm run quran:card-review', cards: oneTwinPerPair(entries) };
writeFileSync(OUT, `${JSON.stringify(index)}\n`);
console.log(`${index.cards.length} cards → ${OUT}`);

const at = process.argv.indexOf('--agents');
if (at > 0) {
  const dir = process.argv[at + 1];
  mkdirSync(dir, { recursive: true });
  const lines = index.cards.map(entry => JSON.stringify({ ...entry, text: Object.fromEntries(entry.rows.flat().map(key => [key, textOf(key)])) }));
  writeFileSync(join(dir, 'cards.jsonl'), `${lines.join('\n')}\n`);
  writeFileSync(join(dir, 'ayat.json'), JSON.stringify(Object.fromEntries(ayat.map(ayah => [ayah.key, textOf(ayah.key)]))));
  console.log(`agents' input → ${dir}`);
}
