'use client';

import useSWR from 'swr';
import { Network } from 'lucide-react';
import type { VirtuesView } from '@/lib/tarajim';
import Button from '@/components/common/Button';
import { nasabHref, tiesHref } from './TarajimParts';

const fetchJson = (url: string) => fetch(url).then(res => res.json());

/** For someone whose Siyar entry is converted: the app's «صلاته» and «النسب» drawings, a click away from his page. */
export default function PersonAppLinks({ slug }: { slug: string }) {
  const { data } = useSWR<VirtuesView[]>(`/api/tarajim?virtues=${encodeURIComponent(slug)}`, fetchJson, { revalidateOnFocus: false });
  const person = data?.[0];
  if (!person) return null;
  const she = person.sex === 'FEMALE';
  return (
    <div className="flex flex-wrap gap-2" lang="ar" dir="rtl">
      <Button href={tiesHref(slug)}><Network size={18} aria-hidden />{she ? 'صلاتها' : 'صلاته'}</Button>
      <Button href={nasabHref([slug])}>{she ? 'نسبها' : 'نسبه'}</Button>
    </div>
  );
}
