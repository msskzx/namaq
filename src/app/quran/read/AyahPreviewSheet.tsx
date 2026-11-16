'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { ArrowLeftRight, BookOpen, ChevronLeft, Layers, ListTree, Sparkles, X } from 'lucide-react';
import surahRows from '@shared/data/quran/surahs.json';
import { num } from '@shared/quran/arabicNumber';
import { QIRAAT_SOURCE, whoReads, type WordDifference } from '@shared/quran/qiraat';
import { tafsirRuns, tafsirSadiCredit, tafsirSadiPage, type TafsirPassage } from '@shared/quran/tafsirSadi';
import ExternalLink from '@/components/common/ExternalLink';
import TreeIcon from '@/components/common/TreeIcon';
import LoadingDots from '@/components/common/LoadingDots';
import { useSwipeClose } from '@/components/common/useSwipeClose';
import TreeViewCard from '@/app/quran/branches/TreeViewCard';
import type { AyahPreview } from './ayahPreview';
import IrabPanel from './IrabPanel';
import OpenInBook from '@/components/quran/OpenInBook';
import type { IrabAyah } from './irab';
import BalaghaPanel from './BalaghaPanel';
import type { BalaghaAyah } from './balagha';

/** Trees, compare and tafsir load their preview; readings come with the page (ayahLinks.ts). Readings and tafsir have no page of their own. */
export type Preview = { kind: 'trees' | 'compare'; key: string; all: string } | { kind: 'readings'; key: string; qiraat: WordDifference[] } | { kind: 'tafsir'; key: string } | { kind: 'balagha'; key: string }
  | { kind: 'irab'; key: string; page: number; n: number };

const names: Record<number, string> = Object.fromEntries(surahRows.map(row => [row.number, row.name]));
const load = async <T,>(api: string, key: string): Promise<T> => {
  const response = await fetch(`/api/quran/${api}?k=${encodeURIComponent(key)}`);
  if (!response.ok) throw new Error('preview');
  return response.json();
};
const CARD = 'block rounded-[var(--card-radius)] border border-[var(--home-rule)] bg-[var(--home-card)]';

/** Each differing word of the ayah in a card: Hafs's reading first, then the others in the accent colour, each with who reads it. */
function Readings({ qiraat }: { qiraat: WordDifference[] }) {
  return qiraat.map(word => (
    <div key={word.at.join('-')} className={`${CARD} shrink-0 px-3.5`}>
      {word.readings.map((reading, i) => (
        <div key={i} className={`flex items-center gap-3 py-2 ${i ? 'border-t border-[var(--home-rule)]' : ''}`}>
          <span className={`min-w-[6.5rem] font-quran text-2xl leading-[1.9] ${i ? 'text-[var(--home-accent)]' : ''}`}>{reading.text}</span>
          <span className="flex-1 text-sm leading-6 text-[var(--home-muted)]">{whoReads(reading, word.readings)}</span>
        </div>
      ))}
    </div>
  ));
}

/**
 * What an ayah's tree, compare or readings button shows in the reader, the app's sheet (mobile/src/components/AyahPreviewSheet.tsx):
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
  const tafsirKey = shown?.kind === 'tafsir' ? shown.key : null;
  const balaghaKey = shown?.kind === 'balagha' ? shown.key : null;
  const irab = shown?.kind === 'irab' ? shown : null;
  const { data: irabData, error: irabError } = useSWR(irab ? ['irab', irab.key, irab.page, irab.n] : null,
    async ([, key, page, n]) => { const response = await fetch(`/api/quran/irab?k=${encodeURIComponent(key)}&p=${page}&n=${n}`); if (!response.ok) throw new Error('irab'); return response.json() as Promise<IrabAyah>; },
    { revalidateOnFocus: false });
  const { data, error: previewError } = useSWR(shown && shown.kind !== 'readings' && !tafsirKey && !irab && !balaghaKey ? ['ayah-preview', shown.key] : null, ([api, key]) => load<AyahPreview>(api, key), { revalidateOnFocus: false });
  const { data: tafsir, error: tafsirError } = useSWR(tafsirKey ? ['tafsir', tafsirKey] : null, ([api, key]) => load<TafsirPassage>(api, key), { revalidateOnFocus: false });
  const { data: balagha, error: balaghaError } = useSWR(balaghaKey ? ['balagha', balaghaKey] : null, ([api, key]) => load<BalaghaAyah>(api, key), { revalidateOnFocus: false });
  const error = tafsirKey ? tafsirError : irab ? irabError : balaghaKey ? balaghaError : previewError;
  const [surah, number] = (shown?.key ?? '0:0').split(':').map(Number);
  const run = tafsirKey ? tafsir : null;
  const trees = shown?.kind === 'trees';
  const readings = shown?.kind === 'readings' ? shown.qiraat : null;
  const Icon = trees ? TreeIcon : readings ? Layers : tafsirKey ? BookOpen : irab ? ListTree : balaghaKey ? Sparkles : ArrowLeftRight;
  return (
    <dialog ref={sheet} aria-label={shown ? (trees ? 'الأشجار التي فيها الآية' : readings ? 'القراءات العشر في كلمات الآية' : tafsirKey ? 'تفسير السعدي' : irab ? 'إعراب الكلمة' : balaghaKey ? 'البلاغة في الآية' : 'مواضع الآية في المقارنة') : undefined} onClose={onClose} onClick={event => { if (event.target === sheet.current) sheet.current?.close(); }}
      dir="rtl" lang="ar" className="m-0 mx-auto mt-auto max-h-[85dvh] w-full max-w-lg rounded-t-[22px] border-0 bg-[var(--home-paper)] p-0 text-[var(--home-ink)] backdrop:bg-[var(--home-backdrop)]">
      {shown && <div className="flex max-h-[85dvh] flex-col pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <span aria-hidden className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-[var(--home-rule)]" />
        <div className="flex shrink-0 items-center gap-2 px-4 pb-2 pt-1 text-[var(--home-muted)]">
          <Icon size={20} aria-hidden />
          {/* Al-Sa'di explains a run of ayat at once, so the tafsir names the whole run. */}
          <h2 className="flex-1 text-base font-normal">{`${names[surah] ?? num(surah)} ${run && run.from !== run.to ? `${num(run.from)}–${num(run.to)}` : num(number)}`}</h2>
          <button type="button" onClick={() => sheet.current?.close()} aria-label="إغلاق" title="إغلاق" className="flex size-9 items-center justify-center rounded-full"><X size={18} aria-hidden /></button>
        </div>
        <div className="flex min-h-0 flex-col gap-2.5 overflow-y-auto px-4 pb-1">
          {readings && <Readings qiraat={readings} />}
          {tafsirKey && tafsir && (
            <p className="whitespace-pre-line px-0.5 text-[1.1875rem] leading-[1.9]">
              {tafsirRuns(tafsir.text).map((run, i) => (run.quran ? <span key={i} className="font-quran text-[var(--home-accent)]">{run.text}</span> : run.text))}
            </p>
          )}
          {balaghaKey && balagha && <BalaghaPanel key={balaghaKey} ayah={balaghaKey} data={balagha} />}
          {irab && irabData && <IrabPanel key={`${irab.key}/${irab.page}/${irab.n}`} ayah={irab.key} data={irabData} />}
          {!readings && !(tafsirKey ? tafsir : irab ? irabData : balaghaKey ? balagha : data) && !error && <p className="py-6 text-center"><LoadingDots label="جارٍ التحميل" /></p>}
          {error && <p role="alert" className="py-6 text-center text-sm text-[var(--home-muted)]">تعذّر التحميل.</p>}
          {/* Each tree is the branches page's own card (owner, 2026-11-14): zoom, pan, a path lit on a click, its own tree/matrix switch, opening in the settings' view. */}
          {trees && data?.trees.map(tree => (
            // A drag on the tree pans it; it never slides the sheet away.
            <div key={tree.id} data-no-swipe-close className={`${CARD} shrink-0 overflow-hidden`}>
              <TreeViewCard tree={tree} height="min(24rem, 55dvh)" names={names} />
            </div>
          ))}
          {shown.kind === 'compare' && data?.compare.map(item => (
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
        {shown.kind === 'irab' || shown.kind === 'balagha' ? null : shown.kind === 'tafsir' ? tafsir && <div className="mx-4 mt-2.5 flex shrink-0 items-center gap-3 text-sm"><ExternalLink href={tafsirSadiPage(tafsir)} className="flex-1 text-[var(--home-muted)]">{tafsirSadiCredit(tafsir)}</ExternalLink><OpenInBook book="sadi" ayah={shown.key} /></div>
          : shown.kind === 'readings' ? <ExternalLink href={QIRAAT_SOURCE.url} className="mx-4 mt-2.5 shrink-0 text-sm text-[var(--home-muted)]">{`المصدر: ${QIRAAT_SOURCE.name}`}</ExternalLink> : <Link href={shown.all} className="mx-4 mt-2.5 flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-[10px] border border-[var(--home-rule)] text-[1.0625rem]">
          <Icon size={20} aria-hidden />
          {trees ? 'افتح في المتشابهات' : `كل مقارنات ${names[surah] ?? ''}`}
          <ChevronLeft size={18} aria-hidden className="text-[var(--home-muted)]" />
        </Link>}
      </div>}
    </dialog>
  );
}
