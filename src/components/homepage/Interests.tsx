'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Check, Pencil, Sparkles, X } from 'lucide-react';
import { newVisit } from '@shared/feedSeen';
import { INTERESTS, interestsAsked, pickedInterests, SECTIONS, toggledInterest } from '@shared/interests';
import Button from '@/components/common/Button';
import Chip from '@/components/common/Chip';
import Sheet from '@/components/common/Sheet';
import SettingRow from '@/components/common/SettingRow';
import { TOUR_DONE, TOUR_SEEN } from './Tour';

/**
 * «اهتماماتي» on the website, as the app's (mobile/src/components/Interests.tsx): the picker under the sections, the
 * settings row, the first-open sheet and the chip row over the feed. Kept in this browser only; none picked means all.
 * «فاجئني من غير اهتماماتي» is the app's alone: the website's feed has no surprise card.
 */

export const usePicked = () => useSyncExternalStore(pickedInterests.subscribe, pickedInterests.read, pickedInterests.server);

/** A short line for what is picked: the names, or «الكل» while nothing is. */
export const interestsLabel = (picked: readonly string[]) =>
  picked.length ? INTERESTS.filter(interest => picked.includes(interest.id)).map(interest => interest.name).join('، ') : 'الكل';

/** The interests under their sections; each click is kept at once. */
export function InterestPicker() {
  const picked = usePicked();
  return <div className="flex flex-col gap-3.5" dir="rtl">
    {SECTIONS.map(section => <div key={section.id} className="flex flex-col gap-2">
      <h3 className="text-sm font-normal text-[var(--home-muted)]">{section.name}</h3>
      <div className="flex flex-wrap gap-2">
        {INTERESTS.filter(interest => interest.section === section.id).map(interest =>
          <Chip key={interest.id} label={interest.name} on={picked.includes(interest.id)} check onClick={() => pickedInterests.write(toggledInterest(picked, interest.id))} />)}
      </div>
    </div>)}
  </div>;
}

/**
 * Starts the feed afresh when the picks changed since the picker opened (`mark`), never under the reader's eyes and never
 * when nothing changed.
 */
function useRefreshOnChange() {
  const read = () => JSON.stringify(pickedInterests.read());
  const shown = useRef(read());
  return { mark: () => { shown.current = read(); }, refresh: () => { if (read() !== shown.current) { shown.current = read(); newVisit(); } } };
}

/** The settings section «اهتماماتي»: what is picked (click to change); folding it or closing settings brings the new feed. */
export function InterestsSetting() {
  const picked = usePicked();
  const { mark, refresh } = useRefreshOnChange();
  useEffect(() => refresh, []); // eslint-disable-line react-hooks/exhaustive-deps -- on leaving settings
  return <div className="flex flex-col gap-1" dir="rtl">
    <SettingRow Icon={Sparkles} title="اهتماماتي" value={interestsLabel(picked)} onFold={open => (open ? mark() : refresh())}><InterestPicker /></SettingRow>
  </div>;
}

/** The picker in a sheet, with «تم»: the pencil on the chip row, and the first open. */
function InterestsSheet({ open, onClose, title, intro }: { open: boolean; onClose: () => void; title: string; intro?: string }) {
  const picked = usePicked();
  return <Sheet open={open} onClose={onClose} label={title} className="overflow-y-auto">
    <div className="flex flex-col gap-4 p-5">
      <div className="flex items-center gap-2">
        <h2 className="flex-1 text-lg font-bold">{title}</h2>
        <Button size="round" variant="muted" onClick={onClose} aria-label="إغلاق" title="إغلاق"><X aria-hidden /></Button>
      </div>
      {intro && <p className="leading-7 text-[var(--home-muted)]">{intro}</p>}
      <InterestPicker />
      <Button variant="primary" onClick={onClose} className="self-stretch"><Check size={18} aria-hidden />{intro ? (picked.length ? 'ابدأ' : 'ابدأ بالكل') : 'تم'}</Button>
    </div>
  </Sheet>;
}

/**
 * The first open (owner, 2026-11-19, like a new account on Pinterest): «ماذا تحب أن تتعلّم؟», any number or none; asked once,
 * after the tour (`tour`: the page has one to show). «ابدأ» and the close button both keep what is picked.
 */
export function InterestsWelcome({ tour }: { tour: boolean }) {
  const asked = useSyncExternalStore(interestsAsked.subscribe, interestsAsked.read, interestsAsked.server);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (asked) return;
    let toured = true;
    try { toured = localStorage.getItem(TOUR_SEEN) === '1'; } catch {}
    const replay = new URLSearchParams(window.location.search).get('tour') === '1';
    if (!tour || (toured && !replay)) setOpen(true);
    const done = () => setOpen(true);
    window.addEventListener(TOUR_DONE, done);
    return () => window.removeEventListener(TOUR_DONE, done);
  }, [asked, tour]);
  if (!open) return null;
  const done = () => { interestsAsked.write(); setOpen(false); newVisit(); };
  return <InterestsSheet open onClose={done} title="ماذا تحب أن تتعلّم؟" intro="اختر ما شئت، وتأتيك بطاقاته في الصفحة الرئيسية. تغيّرها متى شئت من الإعدادات." />;
}

/** The one interest shown alone, while it is still among the picks (none picked means all). */
export const onlyOf = (only: string | null, picked: readonly string[]) => (only && (!picked.length || picked.includes(only)) ? only : null);

/** The chip row over the feed: «لك» (the mixed feed) and each interest picked; a click shows that interest's cards alone. */
export function InterestChips({ only, onOnly }: { only: string | null; onOnly: (id: string | null) => void }) {
  const picked = usePicked();
  const [editing, setEditing] = useState(false);
  const { mark, refresh } = useRefreshOnChange();
  const shown = INTERESTS.filter(interest => !picked.length || picked.includes(interest.id));
  return <>
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none]" dir="rtl">
      <div role="radiogroup" aria-label="اهتماماتي" className="contents">
        <Chip label="لك" role="radio" on={!only} onClick={() => onOnly(null)} />
        {shown.map(interest => <Chip key={interest.id} role="radio" label={interest.name} on={only === interest.id} onClick={() => onOnly(only === interest.id ? null : interest.id)} />)}
      </div>
      <Chip label={<Pencil size={16} aria-hidden />} name="عدّل اهتماماتي" onClick={() => { mark(); setEditing(true); }} />
    </div>
    <InterestsSheet open={editing} onClose={() => { setEditing(false); refresh(); }} title="اهتماماتي" />
  </>;
}
