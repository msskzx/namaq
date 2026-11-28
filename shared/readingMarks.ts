import { keyStore } from './storage';
import type { ReaderBookId, Spot } from './bookReader';

// see docs/plans/book-reader.md
export type QuranFasila = { key: string; page: number };
export type BookFasila = Spot & { part: number; page: number };
export type Fasilas = { quran?: QuranFasila } & Partial<Record<ReaderBookId, BookFasila>>;

const isObject = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const parseObject = <T>(raw: string | null): T => {
  try { const value = raw ? JSON.parse(raw) : {}; return (isObject(value) ? value : {}) as T; } catch { return {} as T; }
};

const isSpot = (value: unknown) => isObject(value) && typeof value.entry === 'number' && typeof value.at === 'number' && typeof value.page === 'number';
const fasilaStore = keyStore<Fasilas>('reading-fasila', raw => Object.fromEntries(Object.entries(parseObject<Record<string, unknown>>(raw))
  .filter(([book, value]) => (book === 'quran' ? isObject(value) && typeof value.key === 'string' && typeof value.page === 'number' && value.page >= 1 && value.page <= 604 : isSpot(value)))) as Fasilas);
export const readFasilas = fasilaStore.read;
export const subscribeFasilas = fasilaStore.subscribe;
const NO_FASILAS: Fasilas = {};
export const serverFasilas = () => NO_FASILAS;

export function setQuranFasila(fasila: QuranFasila | null) {
  const next: Fasilas = { ...readFasilas() };
  if (fasila) next.quran = fasila;
  else delete next.quran;
  fasilaStore.write(JSON.stringify(next));
}

export const continuePage = (fasilas: Fasilas, lastPage: number): { page: number; fasila: boolean } =>
  fasilas.quran ? { page: fasilas.quran.page, fasila: true } : { page: lastPage, fasila: false };

export function setBookFasila(book: ReaderBookId, fasila: BookFasila | null) {
  const next: Fasilas = { ...readFasilas() };
  if (fasila) next[book] = fasila;
  else delete next[book];
  fasilaStore.write(JSON.stringify(next));
}

export type SavedParagraph = Spot & { book: ReaderBookId; part: number; page: number; text: string; savedAt: number };

const savedStore = keyStore<SavedParagraph[]>('book-saved', raw => {
  try {
    const value = raw ? JSON.parse(raw) : [];
    return Array.isArray(value) ? value.filter(item => isObject(item) && typeof item.book === 'string' && typeof item.entry === 'number' && typeof item.at === 'number') : [];
  } catch { return []; }
});
export const readSavedParagraphs = savedStore.read;
export const subscribeSavedParagraphs = savedStore.subscribe;
const NO_SAVED: SavedParagraph[] = [];
export const serverSavedParagraphs = () => NO_SAVED;

const same = (a: Spot & { book: string }, b: Spot & { book: string }) => a.book === b.book && a.entry === b.entry && a.at === b.at;
export const isParagraphSaved = (book: ReaderBookId, spot: Spot) => readSavedParagraphs().some(item => same(item, { book, ...spot }));

export function toggleSavedParagraph(item: Omit<SavedParagraph, 'savedAt'>): boolean {
  const list = readSavedParagraphs();
  if (list.some(saved => same(saved, item))) {
    savedStore.write(JSON.stringify(list.filter(saved => !same(saved, item))));
    return false;
  }
  savedStore.write(JSON.stringify([{ ...item, savedAt: Date.now() }, ...list]));
  return true;
}

const lastStore = keyStore<Partial<Record<ReaderBookId, Spot>>>('book-last', parseObject);
export const lastBookSpot = (book: ReaderBookId): Spot | undefined => {
  const spot = lastStore.read()[book];
  return spot && typeof spot.entry === 'number' && typeof spot.at === 'number' ? spot : undefined;
};
export const setLastBookSpot = (book: ReaderBookId, spot: Spot) => lastStore.write(JSON.stringify({ ...lastStore.read(), [book]: spot }));
