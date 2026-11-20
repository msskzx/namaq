'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { matchesQuery } from '@shared/tarajimLine';
import type { PersonHead, PickPerson } from '@/lib/tarajim';
import Chip from '@/components/common/Chip';
import Button from '@/components/common/Button';
import Sheet from '@/components/common/Sheet';
import { SearchField } from '@/components/common/Field';

/**
 * The people a comparing page is about, as the app's between, life and nasab screens pick them: a chip each, removed by
 * its × (the first stays when `keepFirst`, the last one when `keepLast`), and «أضف» opening a search of the converted
 * entries by name, kunya or laqab. Each pick is a link, so the page's address holds the people picked.
 */
export default function PeoplePicker({ picked, people, hrefOf, keepFirst = false, keepLast = true, startOpen = picked.length < 2 && !keepFirst }: {
  picked: PersonHead[]; people: PickPerson[]; hrefOf: (slugs: string[]) => string; keepFirst?: boolean; keepLast?: boolean;
  /** The search opens with the page (the nasab search from the tarajim hub); by default when fewer than two are picked. */
  startOpen?: boolean;
}) {
  const [adding, setAdding] = useState(startOpen);
  const [query, setQuery] = useState('');
  const slugs = picked.map(p => p.slug);
  const offered = people.filter(p => !slugs.includes(p.slug) && matchesQuery(p.hay, query));
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {picked.map((p, i) => ((keepFirst && i === 0) || (keepLast && picked.length === 1)
          ? <Chip key={p.slug} label={p.name} on />
          : <Chip key={p.slug} label={p.name} clearHref={hrefOf(slugs.filter(s => s !== p.slug))} clearLabel={`أزل ${p.name}`} />))}
        <Button size="sm" onClick={() => setAdding(true)}><Plus size={16} aria-hidden />أضف</Button>
      </div>
      <Sheet open={adding} onClose={() => setAdding(false)} label="أضف شخصًا">
        <div className="flex flex-col gap-2 p-4">
          <SearchField label="ابحث في التراجم" placeholder="ابحث باسم أو كنية أو لقب" value={query} onChangeText={setQuery} />
          <div className="flex max-h-[60vh] flex-col overflow-y-auto">
            {offered.map(p => (
              <Button key={p.slug} variant="ghost" href={hrefOf([...slugs, p.slug])} onClick={() => { setAdding(false); setQuery(''); }} className="justify-start">{p.name}</Button>
            ))}
          </div>
        </div>
      </Sheet>
    </>
  );
}
