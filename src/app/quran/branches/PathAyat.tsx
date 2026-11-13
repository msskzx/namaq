'use client';

import { num } from '@shared/quran/arabicNumber';
import { useGrowth } from './Grow';
import { useOuterPaths } from './Paths';

/** Under the card's buttons: the ayat of the paths a tap lit (not a search), each read in full with where it is. */
export default function PathAyat({ ayat, names }: { ayat: { key: string; words: string[] }[]; names: Record<number, string> }) {
  const paths = useOuterPaths();
  const studio = useGrowth().studio;
  if (!paths || studio) return null;
  const lit = new Set([...paths.pinned].flatMap(([id, ayahKeys]) => id === 'search' ? [] : ayahKeys));
  const shown = ayat.filter(ayah => lit.has(ayah.key));
  if (shown.length === 0) return null;
  const many = shown.length > 1;
  return (
    <section data-path-ayat aria-live="polite" className={`rounded-[var(--card-radius)] border border-[var(--home-rule)] bg-[var(--home-card)] px-4 text-center ${many ? 'py-1' : 'py-3'}`}>
      {shown.map(ayah => {
        const [surah, number] = ayah.key.split(':').map(Number);
        // A tree's ayah may run on into the next one (past its ﴿n﴾ end): the card reads the ayah alone.
        const end = ayah.words.findIndex(word => word.startsWith('﴿'));
        return (
          <div key={ayah.key} className={`border-[var(--home-rule)] [&+&]:border-t ${many ? 'py-2' : ''}`}>
            <p dir="rtl" className={`font-quran leading-loose ${many ? 'text-xl' : 'text-2xl'}`}>{(end < 0 ? ayah.words : ayah.words.slice(0, end)).join(' ')}</p>
            <p className="text-sm text-[var(--home-muted)]">{`${names[surah] ?? num(surah)} ${num(number)}`}</p>
          </div>
        );
      })}
    </section>
  );
}
