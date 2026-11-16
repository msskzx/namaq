'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { num } from '@shared/quran/arabicNumber';
import { useLanguage } from '@/components/language/LanguageContext';
import { ayahHref } from '@shared/ayahMarks';
import CompareLinks from '@/components/common/CompareLinks';
import PageSpread, { type SpreadAyah } from '@/components/quran/PageSpread';
import type { CompareLink } from '../compare/pairCards';
import { holdTourCard, setTourWords, useGrowth } from './Grow';
import { useOuterPaths } from './Paths';
import { matchTitles, usePassages, useSurrounding } from './AyahCards';
import { MAX_KEYS, sharedMarks } from './AyahContext';
import { useCardAround } from './Surroundings';

const icon = 'rounded p-1 text-[var(--home-muted)] hover:text-[var(--home-ink)]';

/**
 * The ayat a tree's row draws, from its words: a row that runs on past its ayah's end (﴿n﴾) into the next ayah reads that one
 * too. For a tree drawn without the page's own passages (home's cards).
 */
export function passageOf(ayah: { key: string; words: string[]; through?: string }) {
  const [surah, number] = ayah.key.split(':').map(Number);
  // A run-on row names its last ayah, which may open the next surah.
  if (ayah.through) {
    const [endSurah, end] = ayah.through.split(':').map(Number);
    return endSurah !== surah ? [ayah.key, ayah.through] : Array.from({ length: Math.max(1, end - number + 1) }, (_, i) => `${surah}:${number + i}`);
  }
  const ends = ayah.words.filter(word => word.startsWith('﴿')).length;
  const last = ayah.words[ayah.words.length - 1] ?? '';
  const count = Math.max(1, last.startsWith('﴿') ? ends : ends + 1);
  return Array.from({ length: count }, (_, i) => `${surah}:${number + i}`);
}

/**
 * Under the card's buttons: the ayat of the paths a tap lit (not a search), each as the matrix draws it, as in the app
 * (mobile/src/components/PathAyat.tsx): the words every row shares coloured, the whole passage the tree draws, and with the
 * surrounding ayat on, the ayah before and after read with it. The mushaf and compare buttons sit at the head's right edge.
 * With `grows` (the tree the studio grows), the studio shows the growing ayah's card, its words coming with the boxes that draw
 * them, then in the tour each path's card read word by word (owner, 2026-11-15).
 */
export default function PathAyat({ rows, passages, names, compare = {}, card, grows = false }: {
  /** The tree's rows, by their first ayah. */
  rows: string[];
  /** Each row's ayat as the tree draws them (an ayah may run on into the next). */
  passages: string[][];
  names: Record<number, string>; compare?: Record<string, CompareLink[]>;
  /** The card whose own surrounding-ayat switch the card follows; none follows the settings' default. */
  card?: string; grows?: boolean }) {
  const paths = useOuterPaths();
  const growth = useGrowth();
  useEffect(() => (grows ? holdTourCard() : undefined), [grows]);
  const studio = growth.studio && grows;
  const [aroundOn] = useCardAround(card);
  // While an ayah grows, its card counts from the ayah's own start, so the surrounding ayat join only in the tour.
  const around = aroundOn && (!studio || growth.tour);
  const growing = studio && !growth.tour ? growth.words : undefined;
  const reading = studio && growth.tour ? growth.reading : undefined;
  const ar = useLanguage().language === 'ar';
  const lit = studio
    ? new Set(growth.lit ? [growth.lit] : [])
    : new Set([...(paths?.pinned ?? [])].flatMap(([id, ayahKeys]) => id === 'search' ? [] : ayahKeys));
  // Every row is fetched (capped as the matrix caps it, sharing its cache), since the colours mark what all rows share.
  const capped = passages.slice(0, MAX_KEYS);
  const shown = rows.slice(0, MAX_KEYS).flatMap((key, row) => lit.has(key) && capped[row]?.length ? [{ key, row, end: capped[row][capped[row].length - 1] }] : []);
  const { data } = usePassages(shown.length ? capped : []);
  const { data: surround, error } = useSurrounding(around && shown.length > 0, shown.map(item => item.key), shown.map(item => item.end));
  // Without the surrounding ayat (a failed fetch), the path's own ayat still show.
  const waiting = around && !surround && !error;
  const tourKey = studio && growth.lit && shown.length ? growth.lit : null;
  // Counted only once the card shows (its surrounding ayat in), so the tour never reads a card that is not on screen.
  const tourCounts = tourKey && data && !waiting ? (data[shown[0].row] ?? []).map(item => item.ayah.words.length).join(',') : '';
  useEffect(() => {
    if (!tourKey || !tourCounts) return;
    setTourWords(tourKey, tourCounts.split(',').map(Number));
    return () => setTourWords(tourKey, null);
  }, [tourKey, tourCounts]);
  if (!paths || (growth.studio && !grows) || shown.length === 0 || !data || waiting) return null;
  const titles = matchTitles(ar);
  const nameOf = (surah: number) => names[surah] ?? num(surah);
  return (
    <section data-path-ayat aria-live="polite" className="flex flex-col gap-2">
      {shown.map(({ key, row, end }) => {
        const passage = data[row] ?? [];
        if (!passage.length) return null;
        const before = around ? surround?.before[key] : null;
        const after = around ? surround?.after[end] : null;
        const first = before?.key ?? key;
        const last = after?.key ?? end;
        const [surah, number] = first.split(':').map(Number);
        const [lastSurah, lastNumber] = last.split(':').map(Number);
        const range = first === last ? num(number) : `${num(number)}–${lastSurah === surah ? num(lastNumber) : `${nameOf(lastSurah)} ${num(lastNumber)}`}`;
        const title = lastSurah !== surah ? `${nameOf(surah)} ${num(number)} ثم ${nameOf(lastSurah)} ${num(lastNumber)}` : `${nameOf(surah)} ${range}`;
        const [ownSurah, ownNumber] = key.split(':').map(Number);
        const place = `${nameOf(ownSurah)} ${num(ownNumber)}`;
        const line: SpreadAyah[] = [
          ...(before ? [{ number: Number(before.key.split(':')[1]), words: before.words }] : []),
          ...(before && 'basmala' in before && before.basmala ? [{ number: 0, words: before.basmala, bare: true }] : []),
          ...passage.map((item, step) => {
            // Each ayah of the passage counts on from the words of the ayat before it.
            const before = passage.slice(0, step).reduce((sum, earlier) => sum + earlier.ayah.words.length, 0);
            const at = reading === undefined ? undefined : reading - before;
            return { number: Number(item.ayah.key.split(':')[1]), words: item.ayah.words, current: true, marks: sharedMarks(item, titles, step),
              ...(growing === undefined ? {} : { shown: growing - before }),
              ...(at !== undefined && at >= 0 && at < item.ayah.words.length ? { reading: at } : {}) };
          }),
          ...(after && 'basmala' in after && after.basmala ? [{ number: 0, words: after.basmala, bare: true }] : []),
          ...(after ? [{ number: Number(after.key.split(':')[1]), words: after.words }] : []),
        ];
        return <PageSpread key={key} single fillReading pages={[{
          title, label: title, rows: [line],
          action: <span className="flex items-center">
            <Link href={ayahHref(key)} aria-label={`افتح ${place} في المصحف`} title="افتح في المصحف" className={icon}><BookOpen size={16} aria-hidden /></Link>
            <CompareLinks links={compare[key] ?? []} label={`قارن ${place}`} className={icon} side="start" />
          </span>,
        }]} />;
      })}
    </section>
  );
}
