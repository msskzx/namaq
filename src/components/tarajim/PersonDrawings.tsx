'use client';

import { useState, type ReactNode } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import type { DrawingsView, RingTie } from '@/lib/tarajim';
import { DRAWING_OR_TEXT, type DrawingOrText } from '@shared/drawingText';
import Segmented from '@/components/common/Segmented';
import Button from '@/components/common/Button';
import { ArrowLeftRight, Link2, Waypoints } from 'lucide-react';
import CardWithRow from '@/components/common/CardWithRow';
import { lifeSources } from '@shared/events/lifeTimeline';
import { sourceEntries } from '@shared/quiz/sources';
import { betweenHref, BookCredit, NasabTree, nasabHref, TieSays, TiesRing, tiesHref } from './TarajimParts';
import LifeTimeline, { lifeHref } from './LifeTimeline';

// What the person page draws for someone whose Siyar entry is converted (owner 2026-11-19: "the profile page does not
// show any graphs"): «نسبه» as the tree or as text (owner 2026-11-20: the drawing first), «حياته» on the timeline, «صلاته» as the
// ring. The same views as the app's person page (mobile/src/screens/person.tsx), drawn by the shared Tarajim parts.

const fetchJson = (url: string) => fetch(url).then(res => (res.ok ? res.json() : undefined));

/** The drawings of a converted person (`view`); none for anyone else, who keeps the page's older parts. `loading` until it is known which. */
export function useDrawings(slug: string) {
  const { data, isLoading } = useSWR<DrawingsView | undefined>(slug ? `/api/tarajim?drawings=${encodeURIComponent(slug)}` : null, fetchJson, { revalidateOnFocus: false });
  return { view: data, loading: isLoading };
}

/** A section as the page draws them: its name, then its body on the page itself. */
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3" lang="ar" dir="rtl">
      <h2 className="text-3xl text-gray-900 dark:text-gray-200">{title}</h2>
      {children}
    </section>
  );
}

/** A button of a section's row under its card: an icon, named for screen readers, going to `href`. */
function RowLink({ href, label, Icon }: { href: string; label: string; Icon: typeof Link2 }) {
  return <Button size="lg" variant="muted" href={href} aria-label={label} title={label}><Icon aria-hidden /></Button>;
}

/** «نسبه»: the tree of his fathers, or the name as the book writes it (owner 2026-11-20: «الرسم | النص», the drawing first), in the home card's shape. */
export function NasabToggle({ view, text }: { view: DrawingsView; text: ReactNode }) {
  const [shown, setShown] = useState<DrawingOrText>('drawing');
  return (
    <div className="flex flex-col gap-3" lang="ar" dir="rtl">
      <Segmented label="كيف يُعرض النسب" tabs className="self-start"
        options={DRAWING_OR_TEXT.map(item => ({ ...item, current: shown === item.key, onClick: () => setShown(item.key) }))} />
      <CardWithRow className="flex flex-col gap-3 p-4" row={<RowLink href={nasabHref([view.slug])} Icon={ArrowLeftRight} label={view.sex === 'FEMALE' ? 'قارن نسبها بغيرها' : 'قارن نسبه بغيره'} />}>
        {shown === 'text' ? <>{text}<BookCredit credit={view.nasab.credit} /></> : <NasabTree view={view.nasab} text={false} />}
      </CardWithRow>
    </div>
  );
}

/** «حياته» on the timeline, its sentences on the book line under it. */
export function LifeSection({ view }: { view: DrawingsView }) {
  if (view.life.length === 0) return null;
  const she = view.sex === 'FEMALE';
  return (
    <Section title={she ? 'حياتها' : 'حياته'}>
      <CardWithRow className="px-2.5 py-3.5" source={sourceEntries(lifeSources(view.life))}
        row={<RowLink href={lifeHref([view.slug])} Icon={ArrowLeftRight} label={she ? 'قارن حياتها بغيرها' : 'قارن حياته بغيره'} />}>
        <LifeTimeline items={view.life} inCard />
      </CardWithRow>
    </Section>
  );
}

/** «صلاته» as the ring; a click on someone without a page shows the sentence that states the tie. */
export function TiesSection({ view }: { view: DrawingsView }) {
  const [shown, setShown] = useState<RingTie | undefined>();
  const router = useRouter();
  if (!view.ties || view.ties.groups.length === 0) return null;
  const she = view.sex === 'FEMALE';
  return (
    <Section title={she ? 'صلاتها' : 'صلاته'}>
      <CardWithRow className="flex flex-col gap-3 p-4" row={<>
        <RowLink href={tiesHref(view.slug)} Icon={Waypoints} label={she ? 'تنقّل في صلاتها' : 'تنقّل في صلاته'} />
        <RowLink href={betweenHref([view.slug])} Icon={Link2} label={she ? 'بينها وبين…' : 'بينه وبين…'} />
      </>}>
        <TiesRing view={view.ties} onPick={slug => router.push(`/people/${slug}`)} onShow={setShown} />
        {shown && <TieSays tie={shown} />}
        <BookCredit credit={view.ties.credit} />
      </CardWithRow>
    </Section>
  );
}
