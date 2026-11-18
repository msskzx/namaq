'use client';

import { num } from '@shared/quran/arabicNumber';
import { pathToggleKey } from '@shared/quran/pathHighlight';
import { treeSurahs } from '@shared/quran/treeSurahs';
import { useGrowth } from './Grow';
import { useOuterPaths } from './Paths';
import Chip from '@/components/common/Chip';

/** Under the card's buttons, like tags under a post: the surahs the tree's ayat come from. On a tree, a tap lights that surah's ayat. */
export default function SurahChips({ ayahKeys, names, interactive = true }: { ayahKeys: string[]; names: Record<number, string>; interactive?: boolean }) {
  const paths = useOuterPaths();
  const growth = useGrowth();
  // In the studio the chips stay, the growing ayah's surah lit, as in the app; a tap there would light paths over the growth.
  const studio = growth.studio;
  const surahs = treeSurahs(ayahKeys);
  return (
    <ul data-surah-chips aria-label="السور" className="-mt-1 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
      {surahs.map(({ surah, ayahKeys: keys }) => {
        const name = names[surah] ?? num(surah);
        const count = keys.length > 1 ? keys.length : undefined;
        if (studio) return <li key={surah} className="contents"><Chip small lit label={name} count={count} on={growth.lit?.split(':')[0] === String(surah)} /></li>;
        if (!interactive || !paths) return <li key={surah} className="contents"><Chip small label={name} count={count} /></li>;
        const id = `surah:${surah}`;
        const on = paths.pinned.has(pathToggleKey(id, keys));
        return (
          <li key={surah} className="contents">
            <Chip small lit label={name} count={count} on={on} name={`سورة ${name}`} onClick={() => paths.pin(id, keys)} />
          </li>
        );
      })}
    </ul>
  );
}
