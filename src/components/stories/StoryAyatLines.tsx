'use client';

import Folded from '@/components/common/Folded';
import MushafPage from '@/app/quran/read/MushafPage';
import { SURAH_TITLES } from '@shared/quran/surahNames';
import type { AyatPage } from '@/lib/storyAyat';

/** A story's ayat in the mushaf's own lines, shown at first and foldable (owner, 2026-11-18; the app's StoryAyat). */
export default function StoryAyatLines({ credit, pages }: { credit: string; pages: AyatPage[] }) {
  return (
    <Folded credit={credit} startOpen bare>
      <div lang="ar">
        {pages.map(part => <MushafPage key={part.page} page={part.page} data={part.data} top={part.top} names={SURAH_TITLES} slice={part.slice} />)}
      </div>
    </Folded>
  );
}
