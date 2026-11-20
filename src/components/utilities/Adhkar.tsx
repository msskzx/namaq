'use client';

import { useEffect, useReducer, useRef, useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { ADHKAR_OCCASIONS, adhkarFor, type AdhkarCitation, type AdhkarOccasion, type Dhikr } from '@shared/adhkar';
import { countOf, counting } from '@shared/adhkarCount';
import { num } from '@shared/quran/arabicNumber';
import { AyatLines } from '@/components/stories/StoryAyatLines';
import type { AyatPage } from '@/lib/storyAyat';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Segmented from '@/components/common/Segmented';
import Reference, { type Quote } from '@/components/common/Reference';

const LABELS: Record<AdhkarOccasion, string> = { morning: 'صباح', evening: 'مساء', waking: 'يقظة', sleep: 'نوم', 'after-prayer': 'صلاة' };
const ORDER: AdhkarOccasion[] = ['morning', 'evening', 'sleep', 'waking', 'after-prayer'];
const TABS = ORDER.filter(key => ADHKAR_OCCASIONS.includes(key));
const BOOK: Record<AdhkarCitation['source'], string> = { 'adhkar-nawawi': 'الأذكار', 'nataij-afkar': 'نتائج الأفكار' };

/** «الأذكار ٧٨ ح٢١٣», with the volume before the page when the book has several (the app's). */
const cite = (citation: AdhkarCitation) =>
  `${BOOK[citation.source]} ${citation.volume > 1 ? `${num(citation.volume)}/` : ''}${num(citation.page)}${citation.report ? ` ح${num(citation.report)}` : ''}`;

/** A card's reference, as the app's: when and how often in al-Nawawi's words, remarks, corrected slips, then every grade. */
function quotes(item: Dhikr): Quote[] {
  const at = { cite: cite(item.citation), url: item.citation.url };
  return [
    { text: item.occasionQuote, ...at },
    ...(item.repeat ? [{ text: item.repeat.quote, ...at }] : []),
    ...(item.instructionQuote ? [{ text: item.instructionQuote, ...at }] : []),
    ...(item.noteQuote ? [{ text: item.noteQuote, ...at }] : []),
    ...(item.fixes ?? []).map(fix => ({ text: fix.quote, cite: `في المطبوع «${fix.printed}»، والصواب «${fix.reads}» كما هنا: ${cite(fix.citation)}`, url: fix.citation.url })),
    ...item.grades.map(grade => ({ text: grade.quote, cite: `${grade.scholar}${grade.reportedBy ? `، نقله ${grade.reportedBy}` : ''}، ${cite(grade.citation)}`, url: grade.citation.url })),
  ];
}

/** The id of a card's box on the page, for a search hit to open it. */
export const dhikrAnchor = (id: string) => `dhikr-${id}`;

/**
 * The adhkar page of the utilities, the app's (mobile/src/components/Adhkar.tsx): al-Nawawi's al-Adhkar, each with a named
 * scholar's grade. The Quran selections come in the mushaf's own lines (`quran`, cut on the server). The counter lives in
 * this page's state only; it ends when the tab, the page or the browser tab is left. The app's fajr and asr reminders are
 * phone notifications, which a web page cannot send.
 */
export default function Adhkar({ quran, on, start }: { quran: Record<string, AyatPage[]>; on: boolean;
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
    if (!on || !asked.current) return;
    document.getElementById(dhikrAnchor(asked.current))?.scrollIntoView({ block: 'start' });
    asked.current = undefined;
  }, [on]);
  return (
    <div className="grid gap-4">
      <Segmented label="وقت الذكر" tabs fill options={TABS.map(key => ({ key, label: LABELS[key], current: key === occasion, onClick: () => setOccasion(key) }))} />
      {items.map(item => {
        const counted = countOf(count, item.id);
        const target = item.repeat?.count;
        return (
          <Card key={item.id} id={dhikrAnchor(item.id)} className="grid scroll-mt-20 gap-3.5 p-[18px]">
            {item.content.kind === 'text'
              ? <p className="text-justify text-[1.3125rem] leading-[2.5rem]">{item.content.text}</p>
              : <AyatLines pages={quran[item.id] ?? []} />}
            {item.virtueQuote && <p className="text-[0.9375rem] leading-relaxed text-[var(--home-muted)]">«{item.virtueQuote}»</p>}
            {target && (
              <div className="flex items-center gap-3">
                <Button size="round" variant="outline" disabled={counted >= target} aria-label={`عُدَّ مرة، ${num(counted)} من ${num(target)}`}
                  onClick={() => dispatch({ type: 'tap', id: item.id, target })}><Check strokeWidth={2.5} aria-hidden /></Button>
                <span aria-hidden dir="ltr" className="text-xl">{num(counted)} / {num(target)}</span>
                {counted > 0 && <Button variant="ghost" size="icon" aria-label="من جديد" onClick={() => dispatch({ type: 'reset' })}><RotateCcw aria-hidden /></Button>}
              </div>
            )}
            <Reference title={`${cite(item.citation)} · ${item.collections.join('، ')}`} quotes={quotes(item)} />
          </Card>
        );
      })}
    </div>
  );
}
