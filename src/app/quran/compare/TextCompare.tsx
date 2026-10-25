import { prisma } from '@/lib/prisma';
import { alignSurahs, clampRange, wordTokens } from '@/lib/quran/compare';
import { ayahWords } from '@/lib/quran/normalize';
import CompareView from './CompareView';
import CompareControls, { DifferentSelection } from './CompareControls';
import SimilarAyat from './SimilarAyat';
import wordKeys from './wordKeys.json';

const plainName = (name: string) => name.replace(/[ً-ٟـٰۖ-ۭ]/g, '').replace(/ٱ/g, 'ا');
const pick = (value: string | string[] | undefined, fallback: number) => {
  const n = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(n) && n >= 1 && n <= 114 ? n : fallback;
};

async function load(number: number) {
  const rows = await prisma.ayah.findMany({ where: { surah: { number } }, orderBy: { number: 'asc' }, select: { text: true } });
  return rows.map((r, i) => {
    const words = ayahWords(r.text, i === 0 && number !== 1 && number !== 9);
    return { ...words, tokens: wordTokens(words.norm, wordKeys.surahs[number - 1]?.[i]) };
  });
}

export default async function TextCompare({ query }: { query: Record<string, string | string[] | undefined> }) {
  const [a, b] = [pick(query.a, 56), pick(query.b, 69)];
  const surahs = await prisma.surah.findMany({ select: { number: true, name: true }, orderBy: { number: 'asc' } });
  const [wordsA, wordsB] = await Promise.all([load(a), load(b)]);
  const ra = clampRange(query.af, query.at, wordsA.length);
  const rb = clampRange(query.bf, query.bt, wordsB.length);
  const whole = [ra.from === 1 && ra.to === wordsA.length, rb.from === 1 && rb.to === wordsB.length].every(Boolean);
  const slice = (w: typeof wordsA, r: typeof ra) => w.slice(r.from - 1, r.to);
  const nameOf = (n: number) => plainName(surahs.find(s => s.number === n)?.name ?? '');
  const rawName = (n: number) => surahs.find(s => s.number === n)?.name ?? '';

  const ayat = query.view === 'ayat';

  return (
    <div className="flex flex-col gap-4">
      <CompareControls surahs={surahs.map(s => ({ number: s.number, name: plainName(s.name) }))} a={{ number: a, range: ra, count: wordsA.length }} b={{ number: b, range: rb, count: wordsB.length }} query={query} />
      {!ayat ? <SimilarAyat surah={a} other={b} ranges={whole ? undefined : { a: ra, b: rb }} /> : a === b && ra.from === rb.from && ra.to === rb.to ? <DifferentSelection /> : <CompareView
        a={{ number: a, name: rawName(a), plain: nameOf(a), words: wordsA.map(w => w.display.join(' ')), range: whole ? undefined : ra }}
        b={{ number: b, name: rawName(b), plain: nameOf(b), words: wordsB.map(w => w.display.join(' ')), range: whole ? undefined : rb }}
        rows={alignSurahs(slice(wordsA, ra).map(w => w.tokens), slice(wordsB, rb).map(w => w.tokens), { a: ra.from, b: rb.from }, whole, [ra.from > 1 || ra.to < wordsA.length, rb.from > 1 || rb.to < wordsB.length].every(Boolean),
          { a: slice(wordsA, ra).map(w => w.norm), b: slice(wordsB, rb).map(w => w.norm) })}
      />}
    </div>
  );
}
