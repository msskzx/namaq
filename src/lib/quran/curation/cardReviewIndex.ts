/**
 * The owner's review of every card (owner 2026-11-20): tree cards of each kind and compare cards, the agents' proposed version of
 * each beside the original, and the owner's presses, which only ever append to a log.
 */

export type CardKind = 'book' | 'ours' | 'word' | 'compare';
export const CARD_KINDS: { id: CardKind; ar: string; en: string }[] = [
  { id: 'book', ar: 'في كتب المتشابهات', en: 'In a book' },
  { id: 'ours', ar: 'متشابهاتنا', en: 'Our cards' },
  { id: 'word', ar: 'أشجار الكلمات', en: 'Word trees' },
  { id: 'compare', ar: 'المقارنة', en: 'Compare' },
];

type Verdict = { keep: boolean; why: string; checked?: boolean; ask?: boolean };

/** One card as it is today. `rows`: each matrix row's ayat, in order. `twin`: the compare pair this tree card shares its verdict with. */
export type CardReviewEntry = {
  id: string;
  kind: CardKind;
  title: string;
  rows: string[][];
  books?: string[];
  matrix?: boolean;
  verdict?: Verdict;
  twin?: string;
  /** Compare only: the surah page ("2/3") and the ayah pairs the card holds. */
  page?: string;
  pairs?: string[];
};
export type CardReviewIndex = { built: string; cards: CardReviewEntry[] };

/** Rules the owner has not settled; a card they touch is flagged, never changed for them. */
export const OPEN_RULES = {
  runOn: 'Reads on into the next ayah because the rows end the same (open: trees only, or drop?)',
  rootLink: 'Links different words of one root (open)',
  shortOpening: 'Short ayat grouped by a shared opening of 3+ words (open)',
} as const;
export type OpenRule = keyof typeof OPEN_RULES;

/**
 * The agents' proposal for a card. `cards`: the card after their changes, as rows of ayat; one entry when ayat were added, removed
 * or merged, two or more when the card is split; absent when the rows stay as they are. `changes` says in English what was done
 * and why, `relation` what calls for pondering, `check` the second agent's view when it re-judged the card.
 */
export type CardProposal = {
  keep: boolean;
  why: string;
  cards?: string[][][];
  changes?: string;
  relation?: string;
  search?: boolean;
  same?: string;
  flags?: OpenRule[];
  unsure?: boolean;
  check?: { agree: boolean; why: string };
};
export type CardProposals = Record<string, CardProposal>;

export type ReviewVersion = 'original' | 'agents';
export type CardPress = { t: number; id: string; action: 'keep' | 'drop' | 'discuss' | 'undo'; version: ReviewVersion };

export const compareCardId = (pairs: string[]) => `cmp-card:${pairs.join(',')}`;

export const cardReviewKind = (piece: { group?: { citations: unknown[] } }): Exclude<CardKind, 'compare'> =>
  piece.group?.citations.length ? 'book' : piece.group ? 'ours' : 'word';

/**
 * The key a card's verdict and presses live under. A tree card that is one compare pair shares that pair's verdict (owner
 * 2026-11-18, 2026-11-20), and so does a compare card of that one pair: both answer to the pair.
 */
export const reviewKey = (entry: Pick<CardReviewEntry, 'id' | 'twin' | 'pairs'>) => entry.twin ?? (entry.pairs?.length === 1 ? entry.pairs[0] : entry.id);

const rowsKey = (rows: string[][]) => rows.map(row => row.join('+')).join(',');

/** Whether the agents changed the card's ayat: added, removed or merged rows, or split it. */
export const rowsChanged = (entry: Pick<CardReviewEntry, 'rows'>, proposal: CardProposal | undefined): boolean =>
  !!proposal?.cards && (proposal.cards.length !== 1 || rowsKey(proposal.cards[0]) !== rowsKey(entry.rows));

/** Whether the agents' version differs from the card as it is: another verdict, other rows, or a split. */
export function agentsChanged(entry: CardReviewEntry, proposal: CardProposal | undefined): boolean {
  if (!proposal) return false;
  return !entry.verdict || proposal.keep !== entry.verdict.keep || rowsChanged(entry, proposal);
}

/** The owner's last word on each card from the log, in order: a later press replaces an earlier one, undo clears it. */
export function pressesByCard(presses: CardPress[]): Map<string, CardPress> {
  const last = new Map<string, CardPress>();
  for (const press of presses) {
    if (press.action === 'undo') last.delete(press.id);
    else last.set(press.id, press);
  }
  return last;
}

export type CardQuery = { kind: CardKind; changed?: boolean; todo?: boolean; pair?: string };

/** The cards of one kind the owner asked to see, in the index's order; compare can be narrowed to one surah pair. */
export function selectCards(cards: CardReviewEntry[], proposals: CardProposals, pressed: Map<string, CardPress>, query: CardQuery): CardReviewEntry[] {
  return cards.filter(entry => entry.kind === query.kind
    && (!query.pair || entry.page === query.pair)
    && (!query.changed || agentsChanged(entry, proposals[reviewKey(entry)]))
    && (!query.todo || !pressed.has(reviewKey(entry))));
}

/** One page of a list: the page number is kept inside the list, and `pages` is at least 1. */
export function pageOf<T>(list: T[], size: number, page: number): { items: T[]; page: number; pages: number } {
  const pages = Math.max(1, Math.ceil(list.length / size));
  const at = Math.min(Math.max(1, page), pages);
  return { items: list.slice((at - 1) * size, at * size), page: at, pages };
}

/** Compare's surah pairs, in mushaf order, each with how many cards it holds (owner reviews compare one pair at a time). */
export function comparePages(cards: CardReviewEntry[]): { page: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const entry of cards) if (entry.kind === 'compare' && entry.page) counts.set(entry.page, (counts.get(entry.page) ?? 0) + 1);
  const order = (page: string) => page.split('/').map(Number);
  return [...counts].map(([page, count]) => ({ page, count })).sort((x, y) => order(x.page)[0] - order(y.page)[0] || order(x.page)[1] - order(y.page)[1]);
}
