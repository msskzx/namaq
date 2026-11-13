'use client';

import { useEffect, useState } from 'react';
import MushafText from '@/components/common/MushafText';
import { num } from '@shared/quran/arabicNumber';
import { ayahHref } from '@shared/ayahMarks';
import { quranContexts } from '@/lib/quran/quranText';
import { ShareImageDialog } from './ShareImage';
import { shareUrl } from './shareTarget';

/** One ayah as share as image draws it, as in the phone app: its surah and number, the ayah in Hafs, and the reader's own note under it. */
export default function AyahShare({ ayah, name, note }: { ayah: string; name?: string; note?: string }) {
  const [surah, number] = ayah.split(':').map(Number);
  const [words, setWords] = useState('');
  useEffect(() => {
    let live = true;
    quranContexts([ayah]).then(([context]) => { if (live && context) setWords(context.ayah.words.join(' ')); }).catch(() => {});
    return () => { live = false; };
  }, [ayah]);
  return <div dir="rtl" lang="ar" data-share-pending={words ? undefined : true} className="flex flex-col gap-1.5 rounded-[var(--card-radius)] border border-[var(--home-rule)] bg-[var(--home-card)] p-3.5 text-[var(--home-ink)]">
    <p className="text-sm text-[var(--home-muted)]">{name ?? surah} <bdi>{num(number)}</bdi></p>
    <p className="font-[family-name:var(--font-quran)] text-[1.375rem] leading-[2]"><MushafText>{words}</MushafText></p>
    {note && <p className="whitespace-pre-line border-t border-[var(--home-rule)] pt-2 text-[1.0625rem] leading-relaxed">{note}</p>}
  </div>;
}

/** Share as image on an ayah, with the reader's note when there is one. */
export function AyahShareDialog({ ayah, name, note, onClose }: { ayah: string; name?: string; note?: string; onClose: () => void }) {
  return <ShareImageDialog source={{ content: <AyahShare ayah={ayah} name={name} note={note} /> }} link={shareUrl(ayahHref(ayah))} onClose={onClose} />;
}
