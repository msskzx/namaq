import { CARD_KINDS, type CardKind } from '@/lib/quran/curation/cardReviewIndex';

export const PAGE_SIZES = [10, 20, 50, 100] as const;
const DEFAULT_SIZE = 20;

export type CardsReviewQuery = { kind: CardKind; size: number; page: number; changed: boolean; todo: boolean; pair?: string };

const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

/** The page's address as a query: unknown values fall back (first kind, 20 a page, page 1); compare always has a surah pair. */
export function parseCardsReview(params: Record<string, string | string[] | undefined>, firstPair?: string): CardsReviewQuery {
  const kind = CARD_KINDS.find(option => option.id === one(params.kind))?.id ?? 'book';
  const size = Number(one(params.size));
  const page = Number(one(params.page));
  const pair = one(params.pair);
  return {
    kind,
    size: (PAGE_SIZES as readonly number[]).includes(size) ? size : DEFAULT_SIZE,
    page: Number.isInteger(page) && page > 0 ? page : 1,
    changed: one(params.changed) === '1',
    todo: one(params.todo) === '1',
    ...(kind === 'compare' ? { pair: pair && /^\d{1,3}\/\d{1,3}$/.test(pair) ? pair : firstPair } : {}),
  };
}

/** The address of a query; defaults are left out. */
export function cardsReviewHref(query: Partial<CardsReviewQuery>): string {
  const params: Record<string, string> = {};
  if (query.kind) params.kind = query.kind;
  if (query.kind === 'compare' && query.pair) params.pair = query.pair;
  if (query.size && query.size !== DEFAULT_SIZE) params.size = String(query.size);
  if (query.changed) params.changed = '1';
  if (query.todo) params.todo = '1';
  if (query.page && query.page > 1) params.page = String(query.page);
  const search = new URLSearchParams(params).toString();
  return `/quran/cards-review${search ? `?${search}` : ''}`;
}
