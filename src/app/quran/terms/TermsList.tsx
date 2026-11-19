'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { counted } from '@shared/quran/arabicNumber';
import { plainName } from '@shared/quran/balaghaTerms';
import Card from '@/components/common/Card';
import Empty from '@/components/common/Empty';
import { SearchField } from '@/components/common/Field';
import type { TermListItem } from '@/lib/balaghaTerms';

/** The terms under their chapters with a search over their names (the app's terms screen); each card opens the term's page. */
export default function TermsList({ chapters }: { chapters: { title: string; items: TermListItem[] }[] }) {
  const [query, setQuery] = useState('');
  const shown = useMemo(() => {
    const plain = plainName(query).trim();
    return chapters.map(chapter => ({ ...chapter, items: plain ? chapter.items.filter(item => item.plain.includes(plain)) : chapter.items })).filter(chapter => chapter.items.length);
  }, [chapters, query]);
  return <>
    <SearchField label="ابحث عن مصطلح" placeholder="ابحث عن مصطلح" value={query} onChangeText={setQuery} />
    {!shown.length && <Empty text="لا مصطلح بهذا الاسم. جرّب كلمة أقصر." />}
    {shown.map(chapter => (
      <section key={chapter.title} className="flex flex-col gap-2">
        <h2 className="mt-1.5 text-[0.9375rem] text-[var(--home-muted)]">{chapter.title}</h2>
        {chapter.items.map(item => (
          <Card key={item.name} href={`/quran/terms/${encodeURIComponent(item.plain)}`} className="flex items-center gap-2.5 px-3.5 py-2.5">
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-[1.1875rem]">{item.plain}</span>
              <span className="truncate text-sm text-[var(--home-muted)]">{item.line}</span>
            </span>
            <span className="text-[0.8125rem] text-[var(--home-muted)]">{counted(item.count, ['مثال', 'مثالان', 'أمثلة'])}</span>
            <ChevronLeft size={18} aria-hidden className="text-[var(--home-muted)]" />
          </Card>
        ))}
      </section>
    ))}
  </>;
}
