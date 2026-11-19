'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { NasabView, PersonHead } from '@/lib/tarajim';
import Chip from '@/components/common/Chip';
import Button from '@/components/common/Button';
import Sheet from '@/components/common/Sheet';
import { SearchField } from '@/components/common/Field';
import { nasabHref, NasabTree } from '@/components/tarajim/TarajimParts';

const bare = (text: string) => text.replace(/[ً-ْٰـ]/g, '').replace(/[أإآ]/g, 'ا');

/** The people picked (each removed by its ×, the first stays) and «أضف» to pick another from the converted entries. */
export default function NasabPage({ view, people }: { view: NasabView; people: PersonHead[] }) {
  const [adding, setAdding] = useState(false);
  const [query, setQuery] = useState('');
  const picked = view.people.map(p => p.slug);
  const words = bare(query).split(/\s+/).filter(Boolean);
  const offered = people.filter(p => !picked.includes(p.slug) && words.every(w => bare(p.name).includes(w)));
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4" lang="ar" dir="rtl">
      <h1 className="text-[1.75rem]">النسب</h1>
      <div className="flex flex-wrap gap-2">
        {view.people.map((p, i) => (i > 0
          ? <Chip key={p.slug} label={p.name} clearHref={nasabHref(picked.filter(s => s !== p.slug))} clearLabel={`أزل ${p.name}`} />
          : <Chip key={p.slug} label={p.name} on />))}
        <Button size="sm" onClick={() => setAdding(true)}><Plus size={16} aria-hidden />أضف</Button>
      </div>
      <NasabTree view={view} />
      <Sheet open={adding} onClose={() => setAdding(false)} label="أضف شخصًا">
        <div className="flex flex-col gap-2 p-4">
          <SearchField label="ابحث عن شخص" placeholder="ابحث عن شخص" value={query} onChangeText={setQuery} />
          <div className="flex max-h-[60vh] flex-col overflow-y-auto">
            {offered.map(p => <Button key={p.slug} variant="ghost" href={nasabHref([...picked, p.slug])} onClick={() => setAdding(false)} className="justify-start">{p.name}</Button>)}
          </div>
        </div>
      </Sheet>
    </div>
  );
}
