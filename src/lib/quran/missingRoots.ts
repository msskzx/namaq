import type { BranchAyah } from '@shared/quran/branches';
import { compareAnchor } from '@shared/compareBookmarks';
import type { CardAyah, PairCard } from '@shared/quran/compareCards';
import { normalizeWord } from '@shared/quran/normalize';
import { fromBuckwalter } from './lemmas';

/** One word of a card: where it sits and what it is. */
export type GapWord = { key: string; index: number; word: string };
/**
 * Two unmarked words on the two sides of one card that share a root. `same` says how close they are beyond the root.
 * `where` says why no link was drawn: the ayat sit in different rows of a story part, they are not a pair of their range card, or they are.
 */
export type RootGap = { root: string; href: string; a: GapWord; b: GapWord; same: 'letters' | 'lemma' | 'root'; where: 'same pair' | 'unpaired ayat' | 'other rows' | 'same row' };

type Side = { surah: number; ayat: CardAyah[]; rows?: number[][] };

const numberOf = (key: string) => Number(key.split(':')[1]);

function whereOf(card: PairCard, a: Side, b: Side, keyA: string, keyB: string): RootGap['where'] {
  if (a.rows && b.rows) return a.rows.findIndex(row => row.includes(numberOf(keyA))) === b.rows.findIndex(row => row.includes(numberOf(keyB))) ? 'same row' : 'other rows';
  return card.pairs && !card.many && !card.pairs.some(pair => pair.id === `${keyA}|${keyB}`) ? 'unpaired ayat' : 'same pair';
}

const unmarked = (side: Side, info: Map<string, BranchAyah>) => side.ayat.flatMap(ayah => {
  const key = `${side.surah}:${ayah.number}`;
  const roots = info.get(key)?.roots ?? [];
  return ayah.words.flatMap((word, index) => (ayah.marks?.[index] || !roots[index] ? [] : [{ key, index, word, root: roots[index]! }]));
});

/** The two sides of a card as shown: a one-to-many card is one shared ayah against each partner in turn. */
function sidePairs(card: PairCard): [Side, Side][] {
  if (!card.many) return [[card.sides[0], card.sides[1]]];
  const { side, options } = card.many;
  const own = card.sides[side].surah;
  const other = card.sides[side === 0 ? 1 : 0].surah;
  return options.map(option => {
    const pair: [Side, Side] = [{ surah: own, ayat: [option.ayah] }, { surah: other, ayat: [option.shared] }];
    return side === 0 ? pair : [pair[1], pair[0]];
  });
}

/**
 * Words that share a root across a card's two sides while neither carries a mark: links the alignment did not make. Each root
 * counts once per card (once per option of a one-to-many card): a pairing the card lines up (same pair or row) when there is one,
 * since that missing link is the alignment's and not the layout's, else the root's first unmarked word on each side.
 */
export function rootGaps(card: PairCard, info: Map<string, BranchAyah>, page: [number, number]): RootGap[] {
  const href = `/quran/compare?a=${page[0]}&b=${page[1]}#${compareAnchor(card.sides[0], card.sides[1])}`;
  const lemma = (w: GapWord) => info.get(w.key)?.lemmas?.[w.index];
  return sidePairs(card).flatMap(([a, b]) => {
    const later = unmarked(b, info);
    const byRoot = new Map<string, RootGap[]>();
    for (const { root, ...word } of unmarked(a, info)) for (const { key, index, word: text } of later.filter(other => other.root === root)) {
      const partner = { key, index, word: text };
      const same = normalizeWord(word.word) === normalizeWord(partner.word) ? 'letters' : lemma(word) && lemma(word) === lemma(partner) ? 'lemma' : 'root';
      byRoot.set(root, [...(byRoot.get(root) ?? []), { root, href, a: word, b: partner, same, where: whereOf(card, a, b, word.key, partner.key) }]);
    }
    return [...byRoot.values()].map(gaps => gaps.find(gap => gap.where === 'same pair' || gap.where === 'same row') ?? gaps[0]);
  });
}

export type RootRow = { root: string; weight: number; gaps: RootGap[] };

/** The gaps grouped by root, rarest root first (rare roots are likelier to be a real parallel than «قال» or «كان»). */
export function rootTable(gaps: RootGap[], weights: Map<string, number>): RootRow[] {
  const byRoot = new Map<string, RootGap[]>();
  for (const gap of gaps) byRoot.set(gap.root, [...(byRoot.get(gap.root) ?? []), gap]);
  return [...byRoot].map(([root, list]) => ({ root, weight: weights.get(root) ?? 0, gaps: list }))
    .sort((p, q) => q.weight - p.weight || q.gaps.length - p.gaps.length || p.root.localeCompare(q.root));
}

const SAME = { letters: 'same word', lemma: 'same lemma', root: 'root only' };

/** The table as Markdown, each gap with a link to its card on the local dev server. */
export function rootTableMarkdown(rows: RootRow[], origin = 'http://localhost:3000') {
  const count = rows.reduce((sum, row) => sum + row.gaps.length, 0);
  const lines = [
    '# Missing-root table',
    '',
    `Words in compare cards that share a root across the card's two sides, where neither word is marked. ${count} gaps under ${rows.length} roots, rarest root first. Built by \`npm run quran:missing-roots\`.`,
    '',
    '| Root | Rarity | Gaps | Word A | Word B | Kind | Where | Card |',
    '|---|---|---|---|---|---|---|---|',
  ];
  for (const row of rows) {
    row.gaps.forEach((gap, i) => {
      const head = i === 0 ? [fromBuckwalter(row.root), row.weight.toFixed(1), String(row.gaps.length)] : ['', '', ''];
      lines.push(`| ${[...head, `${gap.a.word} (${gap.a.key})`, `${gap.b.word} (${gap.b.key})`, SAME[gap.same], gap.where, `[open](${origin}${gap.href})`].join(' | ')} |`);
    });
  }
  return `${lines.join('\n')}\n`;
}
