import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { bookOf, findHadith, lastLink, placeOf, searchSahih, splitRoute, type SahihHadith, type SahihHit, type SahihIndex, type SahihSlug, type SahihText } from '@shared/sahih';
import { num } from '@shared/quran/arabicNumber';
import { FORTY } from '@/lib/forty';
import bukhariIndex from '@shared/data/hadith/bukhari.json';
import muslimIndex from '@shared/data/hadith/muslim.json';

/** The Sahihayn's kitabs and babs (scripts/hadith/buildSahihayn.ts), the same index the app ships. */
export const SAHIH: Record<SahihSlug, SahihIndex> = { bukhari: bukhariIndex as SahihIndex, muslim: muslimIndex as SahihIndex };
export const SAHIH_SLUGS: SahihSlug[] = ['bukhari', 'muslim'];
export const isSahihSlug = (value: string): value is SahihSlug => (SAHIH_SLUGS as string[]).includes(value);

const texts = new Map<SahihSlug, Promise<SahihText>>();
/** A book's whole text, read once from disk on the server (data/hadith/sahih/<book>.json, traced in next.config.ts). */
export function sahihText(slug: SahihSlug): Promise<SahihText> {
  if (!texts.has(slug)) texts.set(slug, readFile(path.join(process.cwd(), 'data', 'hadith', 'sahih', `${slug}.json`), 'utf8').then(raw => JSON.parse(raw) as SahihText));
  return texts.get(slug)!;
}

/** The ones of al-Nawawi's Forty whose records hold this hadith, so its page links to them. */
export const fortyOf = (slug: SahihSlug, n: number) => FORTY.entries.filter(entry => entry.records.some(record => record.book === slug && record.number === n))

/** A hadith as a kitab's list shows it: numbers, the narrator, the opening of its words. */
export const hadithItem = (hadith: SahihHadith) => ({
  n: hadith.n, also: hadith.also, from: lastLink(hadith.routes[0]), start: splitRoute(hadith.routes[0]).words.trim().slice(0, 400), routes: hadith.routes.length,
});
export type SahihItem = ReturnType<typeof hadithItem>;

/** A search over both books, each hit with its line (the bab heading, or the hadith's opening): the first `count` hits, and how many there are. */
export async function searchBoth(query: string, count: number) {
  const books = await Promise.all(SAHIH_SLUGS.map(async slug => ({ index: SAHIH[slug], text: await sahihText(slug) })));
  const all = searchSahih(books, query, Infinity);
  const total = all.babs.length + all.hadith.length;
  const babs = all.babs.slice(0, count);
  const hadith = all.hadith.slice(0, Math.max(0, count - babs.length));
  const where = (hit: SahihHit) => `${SAHIH[hit.book].title}${hit.n ? ` ${num(hit.n)}` : ''}، ${SAHIH[hit.book].kitabs.find(kitab => kitab.n === hit.kitab)?.title ?? ''}`;
  return {
    babs: babs.map(hit => ({ ...hit, where: where(hit), line: SAHIH[hit.book].kitabs.find(kitab => kitab.n === hit.kitab)?.babs[hit.bab ?? 0]?.title ?? '' })),
    hadith: hadith.map(hit => {
      const found = findHadith(books.find(book => book.index.slug === hit.book)!.text, hit.n);
      return { ...hit, where: where(hit), line: found ? hadithItem(found.hadith).start : '' };
    }),
    babCount: all.babs.length,
    hadithCount: all.hadith.length,
    total,
  };
}
export type SahihSearch = Awaited<ReturnType<typeof searchBoth>>;

/**
 * The «من صحيح البخاري» and «من صحيح مسلم» cards (the app's SahihPost), taking turns batch by batch, each a hadith of the day's
 * turn with its kitab › bab; the books' texts stay on the server.
 */
export async function sahihCards(day: number, slots: number[]) {
  return (await Promise.all(slots.map(async slot => {
    const slug = SAHIH_SLUGS[slot % SAHIH_SLUGS.length];
    const all = (await sahihText(slug)).kitabs.flatMap(file => file.hadith);
    if (!all.length) return [];
    const turn = Math.floor(slot / SAHIH_SLUGS.length);
    return [sahihCard(slot, slug, all[(((day * 37 + turn) % all.length) + all.length) % all.length])];
  }))).flat();
}
function sahihCard(slot: number, slug: SahihSlug, hadith: SahihHadith) {
  const book = bookOf(SAHIH[slug]);
  const place = placeOf(SAHIH[slug], hadith.n);
  const where = place ? `${place.kitab.title}${place.bab?.title ? ` › ${place.bab.title}` : ''}${book.headingsBy === 'nawawi' && place.bab?.title ? ' (تبويب النووي)' : ''}` : '';
  // The card's lasting id is the hadith's number, as the app's feed saves it.
  return { slot, kind: slug, item: String(hadith.n), book, hadith, where };
}
/** A saved Sahih card by its book and hadith number; null when the book has no such hadith. */
export async function sahihCardOf(slug: SahihSlug, item: string) {
  const hadith = (await sahihText(slug)).kitabs.flatMap(file => file.hadith).find(each => String(each.n) === item);
  return hadith ? sahihCard(0, slug, hadith) : null;
}
export type SahihCard = Awaited<ReturnType<typeof sahihCards>>[number];
