// The balagha terms page on the website (the app's «مصطلحات البلاغة», mobile/src/screens/balaghaTerms.tsx), worked out on
// the server: al-Suyuti's book stays here, and each example's ayat come with their mushaf words.
import terms from '@shared/data/quran/balaghaTerms';
import itqan from '@shared/data/quran/itqanBalagha';
import { chapterTitle, examplesOf, exampleWords, plainName, termNamed, termsByChapter, type BalaghaTerm, type TermExample } from '@shared/quran/balaghaTerms';
import { ayahMushafWords } from '@/app/quran/read/irab';

export type ExampleAyah = { key: string; words: string[]; lit: [number, number][]; number: number };
export type ExampleView = TermExample & { inDefinition: boolean; lines: ExampleAyah[] };
export type TermListItem = { name: string; plain: string; line: string; count: number };

export const TERMS = terms;
export const termOf = (name: string): BalaghaTerm | undefined => termNamed(terms, name);
/** The address of a term's page: its plain name. */
export const termHref = (term: Pick<BalaghaTerm, 'name'>) => `/quran/terms/${encodeURIComponent(plainName(term.name))}`;

/** Every term under al-Suyuti's chapters, each with the first line of its definition and how many examples he gives. */
export const termChapters = (): { title: string; items: TermListItem[] }[] => termsByChapter(terms).map(([kind, list]) => ({
  title: chapterTitle(itqan, kind),
  items: list.map(term => ({ name: term.name, plain: plainName(term.name), line: plainName(term.quotes[0].text), count: examplesOf(itqan, term).length })),
}));

/** An example with its ayat as mushaf words, the words he quotes lit. */
export async function exampleView(example: TermExample & { inDefinition: boolean }): Promise<ExampleView> {
  const lines = await Promise.all(example.ayat.map(async key => ({ key, words: (await ayahMushafWords(key)).words, lit: exampleWords(itqan, example, key), number: Number(key.split(':')[1]) })));
  return { ...example, lines };
}

/** A term's page: the term, its chapter, and every example of his under it. */
export async function termView(term: BalaghaTerm) {
  return { term, chapter: chapterTitle(itqan, term.kind), examples: await Promise.all(examplesOf(itqan, term).map(exampleView)) };
}

/** The feed's term card (the app's TermPost): a term in the day's turn, and one of its examples. */
export async function termCard(day: number, slot: number) {
  const term = terms.terms[(((day * 37 + slot) % terms.terms.length) + terms.terms.length) % terms.terms.length];
  const examples = examplesOf(itqan, term);
  const example = examples.length ? await exampleView(examples[day % examples.length]) : null;
  return { slot, term, example };
}
export type TermCard = Awaited<ReturnType<typeof termCard>>;
