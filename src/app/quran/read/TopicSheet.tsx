'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { List, X } from 'lucide-react';
import surahRows from '@shared/data/quran/surahs.json';
import { num } from '@shared/quran/arabicNumber';
import { ayahHref } from '@shared/ayahMarks';
import { surahTopicsCredit, surahTopicsOf, type TopicSection } from '@shared/quran/surahTopics';
import { surahAim } from '@shared/quran/surahAims';
import { citeLabel, citeUrl } from '@shared/quran/surahOrder';
import ExternalLink from '@/components/common/ExternalLink';
import { useSwipeClose } from '@/components/common/useSwipeClose';

export type TopicOpen = { surah: number; section: number };

const names: Record<number, string> = Object.fromEntries(surahRows.map(row => [row.number, row.name]));
const range = (s: TopicSection) => (s.from === undefined ? '' : s.from === s.to ? num(s.from) : `${num(s.from)}–${num(s.to!)}`);

/**
 * A surah's topics, the app's sheet (mobile/src/components/TopicSheet.tsx): al-Biqa'i's aim of the surah in his words,
 * then the sections the Sharjah topical tafsir divides it into, the one tapped in the accent colour. A row opens its ayah.
 */
export default function TopicSheet({ open, onClose }: { open: TopicOpen | null; onClose: () => void }) {
  const sheet = useRef<HTMLDialogElement>(null);
  const [shown, setShown] = useState(open);
  if (open && open !== shown) setShown(open);
  useEffect(() => {
    const dialog = sheet.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  useSwipeClose(sheet, !!open, { direction: 'down', onClose: () => sheet.current?.close() });
  const topics = shown ? surahTopicsOf(shown.surah) : null;
  const aim = shown ? surahAim(shown.surah) : undefined;
  const rows = (list: TopicSection[], depth: number): React.ReactNode[] => list.flatMap((section, i) => {
    const on = !depth && shown?.section === i;
    const label = depth ? section.title : `${num(i + 1)}. ${section.title}`;
    const style = `flex gap-3 ${depth ? 'py-1 text-[0.9375rem] leading-6' : 'py-2 text-[1.0625rem] leading-7'} ${on ? 'text-[var(--home-accent)]' : depth ? 'text-[var(--home-muted)]' : ''}`;
    const body = <><span className="flex-1">{label}</span><span className={on ? '' : 'text-[var(--home-muted)]'}>{range(section)}</span></>;
    return [
      section.from === undefined
        ? <div key={`${depth}-${i}-${section.title}`} className={style} style={{ paddingInlineStart: depth * 18 }}>{body}</div>
        : <Link key={`${depth}-${i}-${section.title}`} href={ayahHref(`${shown!.surah}:${section.from}`)} onClick={() => sheet.current?.close()} className={style} style={{ paddingInlineStart: depth * 18 }}>{body}</Link>,
      ...rows(section.parts ?? [], depth + 1),
    ];
  });
  return (
    <dialog ref={sheet} aria-label={shown ? `موضوعات سورة ${names[shown.surah] ?? ''}` : undefined} onClose={onClose} onClick={event => { if (event.target === sheet.current) sheet.current?.close(); }}
      dir="rtl" lang="ar" className="m-0 mx-auto mt-auto max-h-[85dvh] w-full max-w-lg rounded-t-[22px] border-0 bg-[var(--home-paper)] p-0 text-[var(--home-ink)] backdrop:bg-[var(--home-backdrop)]">
      {shown && topics && <div className="flex max-h-[85dvh] flex-col pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <span aria-hidden className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-[var(--home-rule)]" />
        <div className="flex shrink-0 items-center gap-2 px-4 pb-2 pt-1 text-[var(--home-muted)]">
          <List size={20} aria-hidden />
          <h2 className="flex-1 text-base font-normal">{`موضوعات سورة ${names[shown.surah] ?? num(shown.surah)}`}</h2>
          <button type="button" onClick={() => sheet.current?.close()} aria-label="إغلاق" title="إغلاق" className="flex size-9 items-center justify-center rounded-full"><X size={18} aria-hidden /></button>
        </div>
        <div className="min-h-0 overflow-y-auto px-[18px] pb-1">
          {aim && (
            <div className="mb-1.5 border-b border-[var(--home-rule)] pb-2.5">
              <p className="text-[1.0625rem] leading-[1.8]">{aim.text}</p>
              <ExternalLink href={citeUrl(aim.src)} className="text-[0.8125rem] text-[var(--home-muted)]">{citeLabel(aim.src, num)}</ExternalLink>
            </div>
          )}
          {rows(topics.sections, 0)}
        </div>
        <p className="mx-[18px] mt-2 shrink-0 text-[0.8125rem] leading-[1.7] text-[var(--home-muted)]">{surahTopicsCredit(topics)}</p>
      </div>}
    </dialog>
  );
}
