'use client';

import { useEffect, useReducer, useRef, useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { ADHKAR_OCCASIONS, adhkarFor, type AdhkarOccasion } from '@shared/adhkar';
import { ADHKAR_LABELS, ADHKAR_TABS, adhkarQuotes, adhkarTitle } from '@shared/adhkarCite';
import { countOf, counting } from '@shared/adhkarCount';
import { num } from '@shared/quran/arabicNumber';
import { AyatLines } from '@/components/stories/StoryAyatLines';
import type { AyatPage } from '@/lib/storyAyat';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Segmented from '@/components/common/Segmented';
import Reference from '@/components/common/Reference';

const TABS = ADHKAR_TABS.filter(key => ADHKAR_OCCASIONS.includes(key));


/** The id of a card's box on the page, for a search hit to open it. */
export const dhikrAnchor = (id: string) => `dhikr-${id}`;

/**
 * The adhkar page of the utilities, the app's (mobile/src/components/Adhkar.tsx): al-Nawawi's al-Adhkar, each with a named
 * scholar's grade. The Quran selections come in the mushaf's own lines (`quran`, cut on the server). The counter lives in
 * this page's state only; it ends when the tab, the page or the browser tab is left. The app's fajr and asr reminders are
 * phone notifications, which a web page cannot send.
 */
export default function Adhkar({ quran, on, start }: { quran: Record<string, AyatPage[][]>; on: boolean;
  /** A search hit: the tab to open on and the card to bring into view. */
  start?: { occasion: AdhkarOccasion; id?: string } }) {
  const [occasion, setOccasion] = useState<AdhkarOccasion>(start?.occasion ?? 'morning');
  const items = adhkarFor(occasion);
  const [count, dispatch] = useReducer(counting, null);
  useEffect(() => { dispatch({ type: 'leave' }); }, [occasion, on]);
  useEffect(() => {
    const away = () => { if (document.hidden) dispatch({ type: 'leave' }); };
    document.addEventListener('visibilitychange', away);
    return () => document.removeEventListener('visibilitychange', away);
  }, []);
  const asked = useRef(start?.id);
  useEffect(() => {
    const id = asked.current;
    if (!on || !id) return;
    asked.current = undefined;
    // The mushaf lines fit their width after the first paint, so the card moves; follow it while the page settles (the app's).
    const toCard = () => document.getElementById(dhikrAnchor(id))?.scrollIntoView({ block: 'start' });
    const timers = [0, 200, 600].map(wait => window.setTimeout(toCard, wait));
    return () => timers.forEach(window.clearTimeout);
  }, [on]);
  return (
    <div className="grid gap-4">
      <Segmented label="وقت الذكر" tabs fill options={TABS.map(key => ({ key, label: ADHKAR_LABELS[key], current: key === occasion, onClick: () => setOccasion(key) }))} />
      {items.map(item => {
        const counted = countOf(count, item.id);
        const target = item.repeat?.count;
        return (
          <Card key={item.id} id={dhikrAnchor(item.id)} className="grid scroll-mt-20 gap-3.5 p-[18px]">
            {item.content.kind === 'text'
              ? <p className="text-justify text-[1.3125rem] leading-[2.5rem]">{item.content.text}</p>
              : (quran[item.id] ?? []).map((pages, i) => <AyatLines key={i} pages={pages} />)}
            {item.virtueQuote && <p className="text-[0.9375rem] leading-relaxed text-[var(--home-muted)]">«{item.virtueQuote}»</p>}
            {target && (
              <div className="flex items-center gap-3">
                <Button size="round" variant="outline" disabled={counted >= target} aria-label={`عُدَّ مرة، ${num(counted)} من ${num(target)}`}
                  onClick={() => dispatch({ type: 'tap', id: item.id, target })}><Check strokeWidth={2.5} aria-hidden /></Button>
                <span aria-hidden dir="ltr" className="text-xl">{num(counted)} / {num(target)}</span>
                {counted > 0 && <Button variant="ghost" size="icon" aria-label="من جديد" onClick={() => dispatch({ type: 'reset' })}><RotateCcw aria-hidden /></Button>}
              </div>
            )}
            <Reference title={adhkarTitle(item)} quotes={adhkarQuotes(item)} />
          </Card>
        );
      })}
    </div>
  );
}
