import { faCodeCompare, faExpand, faListOl, faWaveSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@/components/common/Button';
import { prisma } from '@/lib/prisma';
import { alignSurahs, clampRange, compareHref, wordTokens } from '@/lib/quran/compare';
import { ayahWords } from '@/lib/quran/normalize';
import CompareView from './CompareView';
import CompareModeToggle from './CompareModeToggle';
import SimilarAyat from './SimilarAyat';
import { viewHref } from './modeHref';
import wordKeys from './wordKeys.json';
import { num } from '@/lib/quran/arabicNumber';
import { FIELD, NOTE, PANEL } from '../panel';

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

  const ayahInput = (name: string, value: number, max: number, label: string, text: string) => (
    <label className={`${NOTE} flex items-center gap-1`}>
      {text}
      <input type="number" name={name} aria-label={label} defaultValue={value} min={1} max={max} className={`${FIELD} w-16 text-gray-900 dark:text-gray-200`} />
    </label>
  );
  const side = (key: 'a' | 'b', value: number, r: typeof ra, max: number, title: string, all: string) => (
    <fieldset className="flex flex-wrap items-center gap-2">
      <legend className="sr-only">{title}</legend>
      <select name={key} aria-label={title} defaultValue={value} className={`${FIELD} min-w-48 flex-1`}>
        {surahs.map(s => (
          <option key={s.number} value={s.number}>{`${num(s.number)}. ${plainName(s.name)}`}</option>
        ))}
      </select>
      <div className="flex items-center gap-2">
        {ayahInput(`${key}f`, r.from, max, `من آية (${key === 'a' ? 'الأولى' : 'الثانية'})`, 'من')}
        {ayahInput(`${key}t`, r.to, max, `إلى آية (${key === 'a' ? 'الأولى' : 'الثانية'})`, 'إلى')}
        <Button size="sm" href={all} aria-label={`الكل: آيات ${title}`} className="shrink-0">
          <FontAwesomeIcon icon={faExpand} />
          الكل
        </Button>
      </div>
    </fieldset>
  );

  const ayat = query.view === 'ayat';

  return (
    <div className="flex flex-col gap-4">
      <form key={[a, ra.from, ra.to, b, rb.from, rb.to].join()} method="get" className={`${PANEL} flex flex-col gap-3`}>
        <CompareModeToggle on={ayat} offHref={viewHref(false, query)} onHref={viewHref(true, query)} offLabel="المتشابه" onLabel="آية بآية" label="المقارنة آية بآية"
          offIcon={<FontAwesomeIcon icon={faWaveSquare} className="size-3" />} onIcon={<FontAwesomeIcon icon={faListOl} className="size-3" />} />
        {ayat && <input type="hidden" name="view" value="ayat" />}
        {side('a', a, ra, wordsA.length, 'السورة الأولى', compareHref(a, { from: 1, to: wordsA.length }, b, rb))}
        {side('b', b, rb, wordsB.length, 'السورة الثانية', compareHref(a, ra, b, { from: 1, to: wordsB.length }))}
        <Button type="submit" variant="primary" className="w-fit">
          <FontAwesomeIcon icon={faCodeCompare} />
          قارن
        </Button>
      </form>
      {!ayat ? <SimilarAyat surah={a} other={b} ranges={whole ? undefined : { a: ra, b: rb }} /> : a === b && ra.from === rb.from && ra.to === rb.to ? <p className={NOTE}>اختر مقطعين مختلفين.</p> : <CompareView
        a={{ number: a, name: rawName(a), plain: nameOf(a), words: wordsA.map(w => w.display.join(' ')), range: whole ? undefined : ra }}
        b={{ number: b, name: rawName(b), plain: nameOf(b), words: wordsB.map(w => w.display.join(' ')), range: whole ? undefined : rb }}
        rows={alignSurahs(slice(wordsA, ra).map(w => w.tokens), slice(wordsB, rb).map(w => w.tokens), { a: ra.from, b: rb.from }, whole, [ra.from > 1 || ra.to < wordsA.length, rb.from > 1 || rb.to < wordsB.length].every(Boolean),
          { a: slice(wordsA, ra).map(w => w.norm), b: slice(wordsB, rb).map(w => w.norm) })}
      />}
    </div>
  );
}
