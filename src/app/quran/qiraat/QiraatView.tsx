"use client";

// The website's «القراءات», as the app's page (mobile/src/screens/qiraat.tsx): every place the ten readers differ, under its
// surah, found by a word or a surah's name, narrowed to a reader or one of his riwayat. docs/plans/quran-qiraat.md
import { useMemo, useState, type ReactNode } from 'react';
import Card from '@/components/common/Card';
import Chip from '@/components/common/Chip';
import Empty from '@/components/common/Empty';
import ExternalLink from '@/components/common/ExternalLink';
import { SearchField } from '@/components/common/Field';
import LitAyat from '@/components/quran/text/LitAyat';
import { num } from '@shared/quran/arabicNumber';
import { QIRAAT_SOURCE, READERS, RIWAYAT, whoReads, type WordDifference } from '@shared/quran/qiraat';
import { qiraatOf } from '@shared/quran/qiraatData';
import { filterName, filterRawis, qiraatPlaces, riwayatOf, type QiraatFilter } from '@shared/quran/qiraatPlaces';
import { surahName } from '@shared/quran/surahNames';
import { QIRAAT_MEANINGS } from './data/meanings';

/** Each ayah's words as the Madina page prints them, the ۞ mark kept, as qiraat.json counts them. */
export type AyahTexts = Record<string, string[]>;

function Word({ word, mark }: { word: WordDifference; mark: number[] }) {
  return word.readings.map((reading, i) => {
    const marked = mark.length > 0 && reading.rawis.some(n => mark.includes(n));
    return (
      <div key={i} data-marked={marked || undefined} className={`flex items-center gap-3 py-1.5 ${i ? 'border-t border-[var(--home-rule)]' : ''} ${marked ? 'bg-[color-mix(in_srgb,var(--home-accent)_12%,transparent)] px-2 -mx-2' : ''}`}>
        <span className={`min-w-[6.5rem] font-quran text-2xl leading-[1.9] ${i ? 'text-[var(--home-accent)]' : ''}`}>{reading.text}</span>
        <span className={`flex-1 text-sm leading-6 ${marked ? '' : 'text-[var(--home-muted)]'}`}>{whoReads(reading, word.readings)}</span>
      </div>
    );
  });
}

/** The page's own card; inside the feed's post, which is a card already, a plain block. */
function Frame({ lines, id, children }: { lines: boolean; id: string; children: ReactNode }) {
  return lines
    ? <div className="flex flex-col gap-1 px-4 py-2.5">{children}</div>
    : <Card as="article" id={id} className="flex flex-col gap-1 px-4 py-2.5">{children}</Card>;
}

/**
 * One place: the ayah with the words the readers differ on banded, then each of those words as every reader reads it. Built
 * once and drawn by this page and the home feed's readings card, which sets the ayah in the mushaf's own lines instead
 * (`lines`) and lists at most `max` words before «المزيد».
 */
export function QiraatPlace({ ayah, words, text = [], mark = [], lines, max, more }: { ayah: string; words?: number[]; text?: string[]; mark?: number[];
  lines?: ReactNode; max?: number; more?: string }) {
  const all = qiraatOf(ayah);
  const every = (words ?? all.map((_, i) => i)).map(i => all[i]);
  const shown = max ? every.slice(0, max) : every;
  // A phrase the source quotes across the end of the ayah before (89:20 «لمّا وتحبون») is not banded.
  const fits = (word: WordDifference) => word.readings[0].text.split(/\s+/).filter(Boolean).join(' ') === text.slice(word.at[0], word.at[1] + 1).join(' ');
  // qiraat.json counts the ۞ mark as a word; the page words drawn here leave it out (as the app's QiraatPlace).
  const before = (at: number) => text.slice(0, at).filter(w => w === '۞').length;
  const lit = shown.filter(fits).map(word => [word.at[0] - before(word.at[0]), word.at[1] - before(word.at[1])] as [number, number]);
  const [surah, number] = ayah.split(':').map(Number);
  const meaning = QIRAAT_MEANINGS[ayah];
  return (
    <Frame lines={!!lines} id={`a${ayah.replace(':', '-')}`}>
      {lines ?? <>
        <span className="text-sm text-[var(--home-muted)]">{`${surahName(surah)} ${num(number)}`}</span>
        <LitAyat ayat={[{ words: text.filter(w => w !== '۞'), lit, number }]} />
      </>}
      <hr className="border-[var(--home-rule)] opacity-60" />
      {shown.map((word, i) => <div key={`${i}@${word.at.join("-")}`} className={i ? 'border-t border-dashed border-[var(--home-rule)]' : ''}><Word word={word} mark={mark} /></div>)}
      {shown.length < every.length && more && <a href={more} className="text-sm text-[var(--home-accent)]">المزيد</a>}
      {!lines && meaning && (
        <div className="flex flex-col gap-1 pt-2">
          {meaning.quotes.map(q => <blockquote key={q} className="border-s-2 border-[var(--home-rule)] ps-3">«{q}»</blockquote>)}
          <ExternalLink href={meaning.url} className="text-sm text-[var(--home-muted)] underline">{meaning.source}</ExternalLink>
        </div>
      )}
    </Frame>
  );
}

export default function QiraatView({ texts }: { texts: AyahTexts }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<QiraatFilter>({});
  const surahs = useMemo(() => qiraatPlaces(filter, query), [filter, query]);
  const mark = filterRawis(filter);
  return (
    <div dir="rtl" className="max-w-3xl mx-auto p-4 flex flex-col gap-3 text-[var(--home-ink)]">
      <h1 className="text-3xl">القراءات</h1>
      <SearchField label="ابحث عن كلمة أو سورة" placeholder="ابحث عن كلمة أو سورة" value={query} onChangeText={setQuery} className="w-full" />
      <div role="tablist" aria-label="القرّاء" className="flex flex-wrap gap-2">
        <Chip role="tab" label="الكل" on={!filter.reader} onClick={() => setFilter({})} />
        {READERS.map(r => <Chip key={r.id} role="tab" label={r.name} on={filter.reader === r.id} onClick={() => setFilter({ reader: r.id })} />)}
      </div>
      {filter.reader && (
        <>
          <div role="tablist" aria-label="الرواة" className="flex flex-wrap gap-2">
            <Chip role="tab" label={READERS.find(r => r.id === filter.reader)!.name} on={!filter.riwaya} onClick={() => setFilter({ reader: filter.reader })} />
            {riwayatOf(filter.reader).map(n => <Chip key={n} role="tab" label={RIWAYAT[n - 1].name} on={filter.riwaya === n} onClick={() => setFilter({ reader: filter.reader, riwaya: n })} />)}
          </div>
          <p className="text-[var(--home-muted)]">{`المواضع التي يقرأ فيها ${filterName(filter)} بغير قراءة حفص`}</p>
        </>
      )}
      {!surahs.length && <Empty text="لا موضع بهذه الكلمة. جرّب كلمة أقصر." />}
      {surahs.map(({ surah, places }) => (
        <section key={surah} className="flex flex-col gap-2.5">
          <h2 className="mt-1.5 text-[var(--home-muted)]">{surahName(surah)}</h2>
          {places.map(place => <QiraatPlace key={place.key} ayah={place.key} words={place.words} text={texts[place.key] ?? []} mark={mark} />)}
        </section>
      ))}
      {surahs.length > 0 && <ExternalLink href={QIRAAT_SOURCE.url} className="text-sm text-[var(--home-muted)]">{`المصدر: ${QIRAAT_SOURCE.name}`}</ExternalLink>}
    </div>
  );
}
