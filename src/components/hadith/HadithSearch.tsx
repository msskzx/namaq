'use client';

import { useDeferredValue, useState, type ReactNode } from 'react';
import useSWR from 'swr';
import Card from '@/components/common/Card';
import Empty from '@/components/common/Empty';
import LoadingDots from '@/components/common/LoadingDots';
import { SearchField } from '@/components/common/Field';
import type { SahihSearch } from '@/lib/sahih';

const fetcher = (url: string) => fetch(url).then(response => response.json() as Promise<SahihSearch>);

function Hit({ href, where, line }: { href: string; where: string; line: string }) {
  return (
    <Card href={href} className="flex flex-col gap-1 px-3.5 py-2.5">
      <span className="truncate text-[0.8125rem] text-[var(--home-muted)]">{where}</span>
      <span className="line-clamp-3 leading-[1.8]">{line}</span>
    </Card>
  );
}

/** The hadith tab's search (the app's): a field over the books; while something is typed, its hits stand where the books were. */
export default function HadithSearch({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  const typed = useDeferredValue(query.trim());
  const { data, isLoading } = useSWR(typed ? `/api/hadith/search?q=${encodeURIComponent(typed)}` : null, fetcher, { keepPreviousData: true });
  return <>
    <SearchField label="ابحث في الصحيحين" placeholder="ابحث في الأبواب والأحاديث" value={query} onChangeText={setQuery} />
    {!typed ? children : !data && isLoading ? <LoadingDots /> : data && <>
      <h2 className="text-[0.9375rem] text-[var(--home-muted)]">في الأبواب</h2>
      {data.babs.length ? data.babs.map(hit => <Hit key={`b-${hit.book}-${hit.kitab}-${hit.bab}`} href={hit.n ? `/hadith/sahih/${hit.book}/${hit.n}` : `/hadith/sahih/${hit.book}/kitab/${hit.kitab}`} where={hit.where} line={hit.line} />)
        : <Empty text="لا باب فيه هذه الكلمات" />}
      <h2 className="text-[0.9375rem] text-[var(--home-muted)]">في الأحاديث</h2>
      {data.hadith.length ? data.hadith.map(hit => <Hit key={`h-${hit.book}-${hit.n}`} href={`/hadith/sahih/${hit.book}/${hit.n}`} where={hit.where} line={hit.line} />)
        : <Empty text="لا حديث فيه هذه الكلمات" />}
    </>}
  </>;
}
