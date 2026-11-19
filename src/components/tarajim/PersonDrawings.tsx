'use client';

import { useState, type ReactNode } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import type { DrawingsView, RingTie } from '@/lib/tarajim';
import Segmented from '@/components/common/Segmented';
import Button from '@/components/common/Button';
import { NasabTree, nasabHref, TieSays, TiesRing, tiesHref } from './TarajimParts';
import LifeTimeline, { lifeHref } from './LifeTimeline';

// What the person page draws for someone whose Siyar entry is converted (owner 2026-11-19: "the profile page does not
// show any graphs"): «نسبه» as text or as the tree (a toggle, the text first), «حياته» on the timeline, «صلاته» as the
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

/** «نسبه»: the name as the book writes it, or the tree of his fathers; the text first (owner 2026-11-19). */
export function NasabToggle({ view, text }: { view: DrawingsView; text: ReactNode }) {
  const [shown, setShown] = useState<'text' | 'tree'>('text');
  return (
    <div className="flex flex-col gap-3" lang="ar" dir="rtl">
      <Segmented label="كيف يُعرض النسب" tabs options={[
        { key: 'text', label: 'النص', current: shown === 'text', onClick: () => setShown('text') },
        { key: 'tree', label: 'الشجرة', current: shown === 'tree', onClick: () => setShown('tree') },
      ]} />
      {shown === 'text' ? text : <NasabTree view={view.nasab} />}
      <div><Button size="sm" href={nasabHref([view.slug])}>{view.sex === 'FEMALE' ? 'قارن نسبها بغيرها' : 'قارن نسبه بغيره'}</Button></div>
    </div>
  );
}

/** «حياته» on the timeline. */
export function LifeSection({ view }: { view: DrawingsView }) {
  if (view.life.length === 0) return null;
  return (
    <Section title={view.sex === 'FEMALE' ? 'حياتها' : 'حياته'}>
      <LifeTimeline items={view.life} compare={lifeHref([view.slug])} />
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
      <TiesRing view={view.ties} onPick={slug => router.push(`/people/${slug}`)} onShow={setShown} />
      {shown && <TieSays tie={shown} />}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" href={tiesHref(view.slug)}>{she ? 'تنقّل في صلاتها' : 'تنقّل في صلاته'}</Button>
      </div>
    </Section>
  );
}
