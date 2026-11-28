import type { BookId } from '@shared/books';

export const BOOK_DATA: Partial<Record<BookId, () => Promise<unknown>>> = {
  ukbari: async () => (await import('../../shared/data/quran/irabUkbari')).default,
  kashshaf: async () => (await import('../../shared/data/quran/kashshaf')).default,
  kirmani: async () => (await import('../../shared/data/quran/mutashabihKirmani')).default,
  iskafi: async () => (await import('../../shared/data/quran/mutashabihIskafi')).default,
  zubayr: async () => (await import('../../shared/data/quran/mutashabihZubayr')).default,
};
