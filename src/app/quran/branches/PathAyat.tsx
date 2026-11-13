'use client';

import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { num } from '@shared/quran/arabicNumber';
import { ayahHref } from '@shared/ayahMarks';
import CompareLinks from '@/components/common/CompareLinks';
import type { CompareLink } from '../compare/pairCards';
import { useGrowth } from './Grow';
import { useOuterPaths } from './Paths';

const icon = 'rounded p-1 text-[var(--home-muted)] hover:text-[var(--home-ink)]';

/**
 * Under the card's buttons: the ayat of the paths a tap lit (not a search), each read in full with where it is,
 * and buttons on the right of that line to open it in the mushaf and in compare, as in the app.
 */
export default function PathAyat({ ayat, names, compare = {} }: { ayat: { key: string; words: string[] }[]; names: Record<number, string>; compare?: Record<string, CompareLink[]> }) {
  const paths = useOuterPaths();
  const studio = useGrowth().studio;
  if (!paths || studio) return null;
  const lit = new Set([...paths.pinned].flatMap(([id, ayahKeys]) => id === 'search' ? [] : ayahKeys));
  const shown = ayat.filter(ayah => lit.has(ayah.key));
  if (shown.length === 0) return null;
  const many = shown.length > 1;
  const place = (surah: number, number: number) => `${names[surah] ?? num(surah)} ${num(number)}`;
  return (
    <section data-path-ayat aria-live="polite" className={`rounded-[var(--card-radius)] border border-[var(--home-rule)] bg-[var(--home-card)] px-4 text-center ${many ? 'py-1' : 'py-3'}`}>
      {shown.map(ayah => {
        const [surah, number] = ayah.key.split(':').map(Number);
        // A tree's ayah may run on into the next one (past its ﴿n﴾ end): the card reads the ayah alone.
        const end = ayah.words.findIndex(word => word.startsWith('﴿'));
        return (
          <div key={ayah.key} className={`border-[var(--home-rule)] [&+&]:border-t ${many ? 'py-2' : ''}`}>
            <p dir="rtl" className={`font-quran leading-loose ${many ? 'text-xl' : 'text-2xl'}`}>{(end < 0 ? ayah.words : ayah.words.slice(0, end)).join(' ')}</p>
            {/* The place stays centred under the ayah; its buttons sit on the line's right edge. */}
            <div className="relative flex min-h-7 items-center justify-center">
              <p className="text-sm text-[var(--home-muted)]">{place(surah, number)}</p>
              <div className="absolute inset-y-0 start-[-0.5rem] flex items-center">
                <Link href={ayahHref(ayah.key)} aria-label={`افتح ${place(surah, number)} في المصحف`} title="افتح في المصحف" className={icon}><BookOpen size={16} aria-hidden /></Link>
                <CompareLinks links={compare[ayah.key] ?? []} label={`قارن ${place(surah, number)}`} className={icon} side="start" />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
