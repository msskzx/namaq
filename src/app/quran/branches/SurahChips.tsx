'use client';

import { num } from '@shared/quran/arabicNumber';
import { pathToggleKey } from '@shared/quran/pathHighlight';
import { treeSurahs } from '@shared/quran/treeSurahs';
import { useGrowth } from './Grow';
import { useOuterPaths } from './Paths';

const CHIP = 'inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full border px-2.5 text-sm';

/** Under the card's buttons, like tags under a post: the surahs the tree's ayat come from. On a tree, a tap lights that surah's ayat. */
export default function SurahChips({ ayahKeys, names, interactive = true }: { ayahKeys: string[]; names: Record<number, string>; interactive?: boolean }) {
  const paths = useOuterPaths();
  const studio = useGrowth().studio;
  if (studio) return null;
  const surahs = treeSurahs(ayahKeys);
  return (
    <ul data-surah-chips aria-label="السور" className="-mt-1 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
      {surahs.map(({ surah, ayahKeys: keys }) => {
        const name = names[surah] ?? num(surah);
        const count = keys.length > 1 && <span className="text-xs opacity-70">{num(keys.length)}</span>;
        if (!interactive || !paths) return <li key={surah} className={`${CHIP} border-[var(--home-rule)] text-[var(--home-ink)]`}>{name}{count}</li>;
        const id = `surah:${surah}`;
        const on = paths.pinned.has(pathToggleKey(id, keys));
        return (
          <li key={surah} className="contents">
            <button type="button" aria-pressed={on} aria-label={`سورة ${name}`} title={`سورة ${name}`} onClick={() => paths.pin(id, keys)}
              className={`${CHIP} transition-colors ${on ? 'border-[var(--home-accent)] bg-[var(--home-paper-deep)] text-[var(--home-accent)]' : 'border-[var(--home-rule)] text-[var(--home-ink)] hover:bg-[var(--home-paper-deep)]'}`}>
              {name}{count}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
