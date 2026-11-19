'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Button from '@/components/common/Button';
import useSWR from 'swr';
import Card from '@/components/common/Card';
import Empty from '@/components/common/Empty';
import LoadingDots from '@/components/common/LoadingDots';
import { SearchField } from '@/components/common/Field';
import type { SahihSearch } from '@/lib/sahih';
import { num } from '@shared/quran/arabicNumber';

/** Hits a page shows at a time; «المزيد» brings the next, so every hit can be reached. */
const STEP = 50;
const fetcher = (url: string) => fetch(url).then(response => response.json() as Promise<SahihSearch>);

function Hit({ href, where, line }: { href: string; where: string; line: string }) {
  return (
    <Card href={href} className="flex flex-col gap-1 px-3.5 py-2.5">
      <span className="line-clamp-1 text-[0.8125rem] text-[var(--home-muted)]">{where}</span>
      <span className="line-clamp-3 leading-[1.8]">{line}</span>
    </Card>
  );
}

/** The hadith tab's search (the app's): a field over the books; while something is typed, its hits stand where the books were. */
export default function HadithSearch({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  // The search runs once typing pauses, not on every letter.
  const [typed, setTyped] = useState('');
  useEffect(() => { const wait = setTimeout(() => setTyped(query.trim()), 250); return () => clearTimeout(wait); }, [query]);
  const [shown, setShown] = useState({ typed: '', count: STEP });
  const count = shown.typed === typed ? shown.count : STEP;
  const { data, isLoading } = useSWR(typed ? `/api/hadith/search?q=${encodeURIComponent(typed)}&n=${count}` : null, fetcher, { keepPreviousData: true });
  return <>
    <SearchField label="ابحث في الصحيحين" placeholder="ابحث في الأبواب والأحاديث" value={query} onChangeText={setQuery} />
    {!typed ? children : !data && isLoading ? <LoadingDots /> : data && <>
      <h2 className="text-[0.9375rem] text-[var(--home-muted)]">{`في الأبواب (${num(data.babCount)})`}</h2>
      {data.babs.length || data.babCount ? data.babs.map(hit => <Hit key={`b-${hit.book}-${hit.kitab}-${hit.bab}`} href={hit.n ? `/hadith/sahih/${hit.book}/${hit.n}` : `/hadith/sahih/${hit.book}/kitab/${hit.kitab}`} where={hit.where} line={hit.line} />)
        : <Empty text="لا باب فيه هذه الكلمات" />}
      <h2 className="text-[0.9375rem] text-[var(--home-muted)]">{`في الأحاديث (${num(data.hadithCount)})`}</h2>
      {data.hadith.length || data.hadithCount ? data.hadith.map(hit => <Hit key={`h-${hit.book}-${hit.n}`} href={`/hadith/sahih/${hit.book}/${hit.n}`} where={hit.where} line={hit.line} />)
        : <Empty text="لا حديث فيه هذه الكلمات" />}
      {data.total > data.babs.length + data.hadith.length && (
        <Button className="self-start" onClick={() => setShown({ typed, count: count + STEP })}>{`المزيد (${num(data.total - data.babs.length - data.hadith.length)})`}</Button>
      )}
    </>}
  </>;
}
