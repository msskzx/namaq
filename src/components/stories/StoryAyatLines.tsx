'use client';

import Folded from '@/components/common/Folded';
import MushafPage from '@/app/quran/read/MushafPage';
import { SURAH_TITLES } from '@shared/quran/surahNames';
import type { AyatPage } from '@/lib/storyAyat';

/** A story's ayat in the mushaf's own lines, shown at first and foldable (owner, 2026-11-18; the app's StoryAyat); `folded` starts closed (a feed card). */
export default function StoryAyatLines({ credit, pages, folded = false }: { credit: string; pages: AyatPage[]; folded?: boolean }) {
  return (
    <Folded credit={credit} startOpen={!folded} bare>
      <AyatLines pages={pages} />
    </Folded>
  );
}

/** Ayat in the mushaf's own lines, page after page (the app's AyatRange): a story's ayat, an adhkar card's Quran selection. */
export function AyatLines({ pages }: { pages: AyatPage[] }) {
  return <div lang="ar">{pages.map(part => <MushafPage key={part.page} page={part.page} data={part.data} top={part.top} names={SURAH_TITLES} slice={part.slice} />)}</div>;
}
