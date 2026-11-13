'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowLeftRight, Bookmark, BookOpen, Moon } from 'lucide-react';
import Button from '@/components/common/Button';
import { mushafText } from '@shared/quran/mushafText';
import { readBookmarks, serverBookmarks, subscribeBookmarks, toggleBookmark } from '@shared/bookmarks';
import { compareAnchor, compareBookmarkId, savedAs } from '@shared/compareBookmarks';
import type { CardAyah, PairCard } from '@shared/quran/compareCards';
import { hijriDate, todaysJuz } from '@shared/hijri';
import { JUZ_INDEX } from '@shared/quran/juzIndex';
import { num } from '@shared/quran/arabicNumber';
import styles from './Homepage.module.css';

/** One ayah with its shared words in the accent and shared roots in purple, as on the compare cards. */
function Ayah({ ayah }: { ayah: CardAyah }) {
  return <p className={styles.dailyAyah} lang="ar" dir="rtl">
    {ayah.words.map((word, i) => {
      const mark = ayah.marks?.[i];
      return <span key={i}>{i > 0 ? ' ' : ''}<span className={mark ? styles[mark.kind === 'root' ? 'dailyRoot' : mark.kind === 'related' ? 'dailyRelated' : 'dailySame'] : undefined}>{mushafText(word)}</span></span>;
    })}
    <span className={styles.dailySame}>{' '}{num(ayah.number)}</span>
  </p>;
}

/** «الجزء ٣», or «الجزءان ٢٩ و٣٠» on the last day of a 29-day month. */
const juzLabel = (juz: number[]) => juz.length > 1 ? `الجزءان ${num(juz[0])} و${num(juz[1])}` : `الجزء ${num(juz[0])}`;

/** The homepage's top card: today's Hijri date, today's juz (one juz a Hijri day) and one look-alike pair to reflect on today. No streaks, nothing counted. */
export default function DailyCard({ pair, names, ar }: { pair?: PairCard | null; names: Map<number, string>; ar: boolean }) {
  // The date is the reader's own day, so it is worked out in the browser, not on the server.
  const [date, setDate] = useState<string | null>(null);
  const [juz, setJuz] = useState<number[] | null>(null);
  useEffect(() => { setDate(hijriDate(new Date())); setJuz(todaysJuz(new Date())); }, []);
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks, serverBookmarks);
  if (!pair && !date) return null;
  const savedIds = pair ? savedAs(pair.id, bookmarks) : [];
  const saved = savedIds.length > 0;
  const [a, b] = pair?.sides ?? [];
  const href = a && b ? `/quran/compare?a=${Math.min(a.surah, b.surah)}&b=${Math.max(a.surah, b.surah)}#${compareAnchor(a, b)}` : '';
  const compareLabel = ar ? 'افتحها في المقارنة' : 'Open in compare';
  const saveLabel = saved ? (ar ? 'أزلها من المحفوظات' : 'Remove from saved') : (ar ? 'احفظ' : 'Save');
  return <section className={styles.daily} aria-label={ar ? 'اليوم' : 'Today'} dir="rtl">
    <div className={styles.dailyHead}>
      {pair && <>
        <Button size="lg" variant="muted" href={href} aria-label={compareLabel} title={compareLabel}><ArrowLeftRight aria-hidden /></Button>
        <Button size="lg" variant="muted" aria-pressed={saved} aria-label={saveLabel} title={saveLabel} className={saved ? 'text-[var(--home-accent)]' : undefined}
          onClick={() => toggleBookmark({ id: compareBookmarkId(pair.id), text: `${a?.ayat[0]?.words.slice(0, 6).join(' ') ?? ''} …`, href }, savedIds)}>
          <Bookmark aria-hidden fill={saved ? 'currentColor' : 'none'} />
        </Button>
      </>}
      {date && <div className={styles.today}>
        <p className={styles.hijri} lang="ar"><Moon size={18} aria-hidden />{date}</p>
        {juz && <Link className={styles.hijri} lang="ar" href={`/quran/read/ayah/${JUZ_INDEX[juz[0] - 1].surah}/${JUZ_INDEX[juz[0] - 1].ayah}`}
          aria-label={ar ? `اقرأ ${juzLabel(juz)}، جزء اليوم` : `Read today's juz (${juz.join(' and ')})`} title={ar ? 'جزء اليوم' : "Today's juz"}>
          <BookOpen size={18} aria-hidden />{juzLabel(juz)}
        </Link>}
      </div>}
    </div>
    {pair?.sides.map(side => <div key={side.surah} className={styles.dailySide}>
      <p className={styles.dailyLabel} lang="ar">{names.get(side.surah)} <bdi>{num(side.ayat[0].number)}</bdi></p>
      <Ayah ayah={side.ayat[0]} />
    </div>)}
  </section>;
}
