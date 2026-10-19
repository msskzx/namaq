'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeBranch, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/common/Button';
import { num } from '@/lib/quran/arabicNumber';
import { branchesHref, loose, startsWith, type Opening } from '@/lib/quran/branches';
import type { JuzRange } from '@/lib/quran/juz';
import { normalizeWord } from '@/lib/quran/normalize';
const NOTE = 'text-sm text-[var(--home-muted)]';
const SEARCH = 'w-full rounded-sm border border-[var(--home-rule)] bg-transparent ps-10 pe-3 py-2 text-[var(--home-ink)] placeholder:text-[var(--home-muted)]';

export const SUGGESTIONS = 10;

export default function OpeningSearch({ top, phrases, current, juz = null }: { top: Opening[]; phrases: Opening[]; current: string; juz?: JuzRange | null }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const needle = query.split(/\s+/).map(w => normalizeWord(w).trim()).filter(Boolean).join(' ');
  const suggestions = needle
    ? [...phrases.filter(p => loose(p.id).startsWith(needle)), ...phrases.filter(p => !loose(p.id).startsWith(needle) && loose(p.id).includes(needle))].slice(0, SUGGESTIONS)
    : [];

  return (
    <div className="flex flex-col gap-2">
      <div role="group" className="flex flex-wrap gap-2" aria-label="أكثر الفواتح تكرارًا">
        {top.map(o => (
          <Button key={o.id} size="sm" href={branchesHref(o.id, juz ?? undefined)} active={startsWith(current, o.id)} aria-current={o.id === current ? 'page' : undefined}>
            <FontAwesomeIcon icon={faCodeBranch} />
            {`${o.text} (${num(o.count)})`}
          </Button>
        ))}
      </div>
      <label className="relative block">
        <span className="sr-only">ابحث عن عبارة تبدأ بها آيتان أو أكثر</span>
        <FontAwesomeIcon icon={faMagnifyingGlass} className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--home-muted)]" />
        <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={`ابحث بين ${num(phrases.length)} عبارة تبدأ بها آيتان أو أكثر`}
          onKeyDown={e => { if (e.key === 'Enter' && suggestions[0]) { setQuery(''); router.push(branchesHref(suggestions[0].id, juz ?? undefined)); } }} className={SEARCH} />
      </label>
      {needle && (
        <ul aria-label="عبارات مقترحة" className="flex flex-col rounded border border-[var(--home-rule)]">
          {suggestions.length === 0 ? <li className={`${NOTE} px-2 py-1`}>لا عبارة مشتركة تطابق البحث.</li> : suggestions.map(o => (
            <li key={o.id}>
              <Link href={branchesHref(o.id, juz ?? undefined)} onClick={() => setQuery('')} className="flex items-baseline gap-2 px-2 py-1 hover:bg-[var(--home-paper-deep)]">
                <span className="text-lg font-arabic flex-1">{o.text}</span>
                <span className="text-[var(--home-accent)]">{num(o.count)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
