'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { ArrowLeftRight, ChevronLeft, X } from 'lucide-react';
import surahRows from '@shared/data/quran/surahs.json';
import { num } from '@shared/quran/arabicNumber';
import TreeIcon from '@/components/common/TreeIcon';
import LoadingDots from '@/components/common/LoadingDots';
import { useSwipeClose } from '@/components/common/useSwipeClose';
import BranchTree from '@/app/quran/branches/BranchTree';
import type { AyahPreview } from './ayahPreview';

export type Preview = { kind: 'trees' | 'compare'; key: string; all: string };

const names: Record<number, string> = Object.fromEntries(surahRows.map(row => [row.number, row.name]));
const load = async (key: string): Promise<AyahPreview> => {
  const response = await fetch(`/api/quran/ayah-preview?k=${encodeURIComponent(key)}`);
  if (!response.ok) throw new Error('preview');
  return response.json();
};
/** A wide tree opens at its middle, where its top-down root is. */
const centre = (card: HTMLElement | null) => { if (card) card.scrollLeft = (card.scrollWidth - card.clientWidth) / 2 * (getComputedStyle(card).direction === 'rtl' ? -1 : 1); };
const CARD = 'block rounded-[var(--card-radius)] border border-[var(--home-rule)] bg-[var(--home-card)]';

/**
 * What an ayah's tree or compare button shows in the reader, the app's sheet (mobile/src/components/AyahPreviewSheet.tsx):
 * a short preview instead of leaving the mushaf, each item opening its own page, and a last button that opens the whole page.
 */
export default function AyahPreviewSheet({ preview, onClose }: { preview: Preview | null; onClose: () => void }) {
  const sheet = useRef<HTMLDialogElement>(null);
  const [shown, setShown] = useState(preview);
  if (preview && preview !== shown) setShown(preview);
  useEffect(() => {
    const dialog = sheet.current;
    if (!dialog) return;
    if (preview && !dialog.open) dialog.showModal();
    if (!preview && dialog.open) dialog.close();
  }, [preview]);
  useSwipeClose(sheet, !!preview, { direction: 'down', onClose: () => sheet.current?.close() });
  const { data, error } = useSWR(shown ? ['ayah-preview', shown.key] : null, ([, key]) => load(key), { revalidateOnFocus: false });
  const [surah, number] = (shown?.key ?? '0:0').split(':').map(Number);
  const trees = shown?.kind === 'trees';
  const Icon = trees ? TreeIcon : ArrowLeftRight;
  return (
    <dialog ref={sheet} aria-label={shown ? (trees ? 'الأشجار التي فيها الآية' : 'مواضع الآية في المقارنة') : undefined} onClose={onClose} onClick={event => { if (event.target === sheet.current) sheet.current?.close(); }}
      dir="rtl" lang="ar" className="m-0 mx-auto mt-auto max-h-[85dvh] w-full max-w-lg rounded-t-[22px] border-0 bg-[var(--home-paper)] p-0 text-[var(--home-ink)] backdrop:bg-[var(--home-backdrop)]">
      {shown && <div className="flex max-h-[85dvh] flex-col pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <span aria-hidden className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-[var(--home-rule)]" />
        <div className="flex shrink-0 items-center gap-2 px-4 pb-2 pt-1 text-[var(--home-muted)]">
          <Icon size={20} aria-hidden />
          <h2 className="flex-1 text-base font-normal">{`${names[surah] ?? num(surah)} ${num(number)}`}</h2>
          <button type="button" onClick={() => sheet.current?.close()} aria-label="إغلاق" title="إغلاق" className="flex size-9 items-center justify-center rounded-full"><X size={18} aria-hidden /></button>
        </div>
        <div className="flex min-h-0 flex-col gap-2.5 overflow-y-auto px-4 pb-1">
          {!data && !error && <p className="py-6 text-center"><LoadingDots label="جارٍ التحميل" /></p>}
          {error && <p role="alert" className="py-6 text-center text-sm text-[var(--home-muted)]">تعذّر التحميل.</p>}
          {trees && data?.trees.map(tree => (
            // A tap opens that tree; a wide tree scrolls sideways inside its card. Trees draw top-down and left to right inside, as on the branches page.
            <Link key={tree.id} href={tree.href} aria-label="افتح هذه الشجرة" ref={centre} className={`${CARD} shrink-0 overflow-x-auto overscroll-x-contain`}>
              <div inert data-down dir="ltr" className="mx-auto w-max min-w-full p-1 [&_[data-tree-content]]:mx-auto [&_[data-tree-content]]:flex-col [&_[data-tree]]:overflow-visible [&_[data-tree]]:border-0 [&_[data-tree]]:bg-transparent [&_[data-tree]]:p-2">
                <BranchTree tree={tree.tree} ayat={tree.ayat} prefixes={tree.prefixes} offsets={tree.offsets} names={names} zoomable={false} viewportHeight={null} surround={{ on: false, sync: true }} />
              </div>
            </Link>
          ))}
          {!trees && data?.compare.map(item => (
            <Link key={item.href} href={item.href} aria-label={`${item.page}، ${item.partner}`} className={`${CARD} shrink-0 px-3.5 py-2.5`}>
              <span className="flex items-center gap-1.5 text-sm text-[var(--home-muted)]">
                <span className="flex-1">{item.page}</span>
                <span>{item.partner}</span>
                <ChevronLeft size={16} aria-hidden />
              </span>
              <span className="mt-1 block text-justify font-quran text-xl leading-[1.9] [text-align-last:right]">
                {item.words.map((word, i) => <span key={i} className={word.shared ? 'text-[var(--home-accent)]' : undefined}>{`${i ? ' ' : ''}${word.text}`}</span>)}
              </span>
            </Link>
          ))}
        </div>
        <Link href={shown.all} className="mx-4 mt-2.5 flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-[10px] border border-[var(--home-rule)] text-[1.0625rem]">
          <Icon size={20} aria-hidden />
          {trees ? 'افتح في المتشابهات' : `كل مقارنات ${names[surah] ?? ''}`}
          <ChevronLeft size={18} aria-hidden className="text-[var(--home-muted)]" />
        </Link>
      </div>}
    </dialog>
  );
}
