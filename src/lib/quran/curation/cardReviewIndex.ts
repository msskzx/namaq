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

/** One card as it is today (no Quran words: the page draws them through the Quran text pipeline). `rows`: each matrix row's ayat, in order. `twin`: the compare pair this tree card shares its verdict with. */
export type CardReviewEntry = {
  id: string;
  kind: CardKind;
  rows: string[][];
  books?: string[];
  matrix?: boolean;
  verdict?: Verdict;
  twin?: string;
  /** Compare only: the surah page ("2/3") and the ayah pairs the card holds. */
  page?: string;
  pairs?: string[];
  /** Compare only: a surah-order book's card, the key of its link in ORDER_LINKS (shared/quran/tanasubCards.ts). Never judged by the agents. */
  link?: number;
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
/** `shared`: the compare pair a card shares its verdict with, so a press on either card is the press of both. */
export type CardPress = { t: number; id: string; shared?: string; action: 'keep' | 'drop' | 'discuss' | 'undo'; version: ReviewVersion };

export const compareCardId = (pairs: string[]) => `cmp-card:${pairs.join(',')}`;

export const cardReviewKind = (piece: { group?: { citations: unknown[] } }): Exclude<CardKind, 'compare'> =>
  piece.group?.citations.length ? 'book' : piece.group ? 'ours' : 'word';

/**
 * The compare pair whose one verdict a card shares (owner 2026-11-18, 2026-11-20): a tree card that is one compare pair, and the
 * compare card of that one pair. Each card keeps its own id for the agents' proposal; a press is the press of every card sharing the pair.
 */
export const sharedKey = (entry: Pick<CardReviewEntry, 'twin' | 'pairs'>): string | undefined => entry.twin ?? (entry.pairs?.length === 1 ? entry.pairs[0] : undefined);

const TWIN_RANK: Record<CardKind, number> = { book: 0, ours: 1, word: 2, compare: 3 };

/**
 * Several tree cards can hold one compare pair (a book's card and word trees of the same two ayat). Only one of them shares the
 * pair's verdict: the book's card, else ours, else the first word tree. The others keep their own press, so dropping a duplicate
 * never drops the book's card or the compare card.
 */
export function oneTwinPerPair(entries: CardReviewEntry[]): CardReviewEntry[] {
  const primary = new Map<string, CardReviewEntry>();
  for (const entry of entries) {
    const held = entry.twin ? primary.get(entry.twin) : undefined;
    if (entry.twin && (!held || TWIN_RANK[entry.kind] < TWIN_RANK[held.kind])) primary.set(entry.twin, entry);
  }
  return entries.map(entry => {
    if (!entry.twin || primary.get(entry.twin) === entry) return entry;
    const own = { ...entry };
    delete own.twin;
    return own;
  });
}

const rowsKey = (rows: string[][]) => rows.map(row => row.join('+')).join(',');

/** Whether the agents changed the card's ayat: added, removed or merged rows, or split it. */
export const rowsChanged = (entry: Pick<CardReviewEntry, 'rows'>, proposal: CardProposal | undefined): boolean =>
  !!proposal?.cards && (proposal.cards.length !== 1 || rowsKey(proposal.cards[0]) !== rowsKey(entry.rows));

/** Whether the agents' version differs from the card as it is: another verdict, other rows, or a split. */
export function agentsChanged(entry: CardReviewEntry, proposal: CardProposal | undefined): boolean {
  if (!proposal) return false;
  return !entry.verdict || proposal.keep !== entry.verdict.keep || rowsChanged(entry, proposal);
}

/**
 * The owner's last word from the log, in order, by card id and by shared compare pair: a later press replaces an earlier one, undo
 * clears it. Read a card's with `pressOf`.
 */
export function pressesByCard(presses: CardPress[]): Map<string, CardPress> {
  const last = new Map<string, CardPress>();
  for (const press of presses) {
    for (const key of press.shared ? [press.id, press.shared] : [press.id]) {
      if (press.action === 'undo') last.delete(key);
      else last.set(key, press);
    }
  }
  return last;
}

/** A card's last press: its own, or a later one on a card sharing its compare pair. */
export function pressOf(entry: Pick<CardReviewEntry, 'id' | 'twin' | 'pairs'>, pressed: Map<string, CardPress>): CardPress | undefined {
  const own = pressed.get(entry.id);
  const shared = sharedKey(entry);
  const other = shared ? pressed.get(shared) : undefined;
  return !own || other && other.t > own.t ? other : own;
}

/**
 * Whether the owner already reviewed a card: a press on this page, or a verdict they checked in an earlier review, either the
 * card's own or, live, every compare pair it holds (`checkedPairs`, with the compare review log's unapplied presses).
 */
export function reviewed(entry: CardReviewEntry, pressed: Map<string, CardPress>, checkedPairs: Set<string> = new Set()): boolean {
  if (pressOf(entry, pressed) || entry.verdict?.checked) return true;
  const pairs = entry.pairs ?? (entry.twin ? [entry.twin] : []);
  return pairs.length > 0 && pairs.every(pair => checkedPairs.has(pair));
}

export type CardQuery = { kind: CardKind; changed?: boolean; todo?: boolean; pair?: string };

/** The cards of one kind the owner asked to see, in the index's order; compare can be narrowed to one surah pair. */
export function selectCards(cards: CardReviewEntry[], proposals: CardProposals, pressed: Map<string, CardPress>, query: CardQuery, checkedPairs?: Set<string>): CardReviewEntry[] {
  return cards.filter(entry => entry.kind === query.kind
    && (!query.pair || entry.page === query.pair)
    && (!query.changed || agentsChanged(entry, proposals[entry.id]))
    && (!query.todo || !reviewed(entry, pressed, checkedPairs)));
}

/** One page of a list: the page number is kept inside the list, and `pages` is at least 1. */
export function pageOf<T>(list: T[], size: number, page: number): { items: T[]; page: number; pages: number } {
  const pages = Math.max(1, Math.ceil(list.length / size));
  const at = Math.min(Math.max(1, page), pages);
  return { items: list.slice((at - 1) * size, at * size), page: at, pages };
}

/**
 * Compare's surah pairs for the pair list, counted under the page's filters (owner 2026-11-21): a pair with nothing left to show
 * drops out, except the open one (`open`), which stays with its count of 0 so the list and the arrows still find it.
 */
export function filteredPairs(cards: CardReviewEntry[], proposals: CardProposals, pressed: Map<string, CardPress>, filters: Omit<CardQuery, 'kind' | 'pair'>, checkedPairs?: Set<string>, open?: string): { page: string; count: number }[] {
  const shown = selectCards(cards, proposals, pressed, { ...filters, kind: 'compare' }, checkedPairs);
  const kept = open && !shown.some(entry => entry.page === open) ? [...shown, { id: '', kind: 'compare' as const, rows: [], page: open }] : shown;
  return comparePages(kept).map(pair => (pair.page === open && !shown.some(entry => entry.page === open) ? { ...pair, count: 0 } : pair));
}

/** Compare's surah pairs, in mushaf order, each with how many cards it holds (owner reviews compare one pair at a time). */
export function comparePages(cards: CardReviewEntry[]): { page: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const entry of cards) if (entry.kind === 'compare' && entry.page) counts.set(entry.page, (counts.get(entry.page) ?? 0) + 1);
  const order = (page: string) => page.split('/').map(Number);
  return [...counts].map(([page, count]) => ({ page, count })).sort((x, y) => order(x.page)[0] - order(y.page)[0] || order(x.page)[1] - order(y.page)[1]);
}
