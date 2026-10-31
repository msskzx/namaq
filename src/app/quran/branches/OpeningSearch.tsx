'use client';

import React, { useEffect, useId, useState } from 'react';

import { GitBranch, Search } from 'lucide-react';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';
import { num } from '@/lib/quran/arabicNumber';
import { branchesHref, searchPhrases, type BranchesView, type Opening } from '@/lib/quran/branches';
import type { JuzRange } from '@/lib/quran/juz';
import { useNavigatingRouter } from '@/components/common/NavigationLoader';
const NOTE = 'text-sm text-[var(--home-muted)]';
const SEARCH = 'w-full rounded-sm border border-[var(--home-rule)] bg-transparent ps-10 pe-3 h-11 text-[var(--home-ink)] placeholder:text-[var(--home-muted)]';

type Suggestion = Opening;

export const SUGGESTIONS = 10;

export default function OpeningSearch({ phrases, query: submitted = '', juz = null, unavailable = false, view = {}, alternatives = [], remote = false, phraseCount }: { remote?: boolean; phraseCount?: number; top: Opening[]; phrases: Opening[]; current?: string; query?: string; juz?: JuzRange | null; unavailable?: boolean; view?: BranchesView; alternatives?: Opening[] }) {
  const router = useNavigatingRouter();
  const { language } = useLanguage();
  const ar = language === 'ar';
  const listId = useId();
  const [query, setQuery] = useState(submitted);
  const [dismissed, setDismissed] = useState(!!submitted);
  const [selected, setSelected] = useState(-1);
  useEffect(() => setSelected(-1), [phrases]);
  const from = juz?.from;
  const to = juz?.to;
  const request = new URLSearchParams({ q: query });
  if (from !== undefined && to !== undefined) { request.set('juzFrom', String(from)); request.set('juzTo', String(to)); }
  const requestKey = request.toString();
  const [fetched, setFetched] = useState<{ key: string; suggestions: Suggestion[] }>();
  useEffect(() => {
    if (!remote || !query.trim() || dismissed) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch(`/api/quran/branch-phrases?${requestKey}`, { signal: controller.signal })
        .then(response => { if (!response.ok) throw new Error('Search failed'); return response.json(); })
        .then(data => { if (!controller.signal.aborted) setFetched({ key: requestKey, suggestions: data.suggestions }); })
        .catch(() => {});
    }, 150);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query, remote, dismissed, requestKey]);
  const suggestions: Suggestion[] = remote && fetched?.key === requestKey ? fetched.suggestions : searchPhrases(phrases, query).slice(0, SUGGESTIONS);
  const visible = !!query.trim() && !dismissed;
  const href = (phrase: Suggestion) => branchesHref(phrase.id, juz ?? undefined, { ...view, occurrences: undefined });
  const open = (phrase: Suggestion) => {
    setQuery('');
    setSelected(-1);
    router.push(href(phrase));
  };
  const search = () => {
    setDismissed(true);
    setSelected(-1);
    router.push(branchesHref('', juz ?? undefined, { surah: view.surah, query: query.trim() }));
  };
  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <label className="relative block">
          <span className="sr-only">{ar ? 'ابحث عن عبارة مشتركة بين آيتين أو أكثر' : 'Search phrases shared by two or more ayat'}</span>
          <Search aria-hidden className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--home-muted)]" />
          <input type="search" role="combobox" aria-autocomplete="list" aria-expanded={visible} aria-controls={listId} aria-activedescendant={visible && selected >= 0 && suggestions[selected] ? `${listId}-${selected}` : undefined} value={query}
            onChange={event => {
            setQuery(event.target.value);
            setSelected(-1);
            setDismissed(false);
            if (!event.target.value && submitted) router.push(branchesHref('', juz ?? undefined, { surah: view.surah }));
          }}
            placeholder={ar ? `ابحث بين ${num(phraseCount ?? phrases.length)} عبارة مشتركة بين آيتين أو أكثر` : `Search ${phraseCount ?? phrases.length} shared phrases`}
            onKeyDown={event => {
              if (event.key === 'Escape') { setDismissed(true); setSelected(-1); }
              if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && suggestions.length) {
                event.preventDefault();
                setDismissed(false);
                setSelected(index => event.key === 'ArrowDown' ? (index + 1) % suggestions.length : (index <= 0 ? suggestions.length - 1 : index - 1));
              }
              if (event.key === 'Enter' && query.trim()) { event.preventDefault(); if (visible && suggestions[selected]) open(suggestions[selected]); else search(); }
            }} className={SEARCH} />
        </label>
        {visible && <ul id={listId} role="listbox" aria-label={ar ? 'عبارات مقترحة' : 'Suggested phrases'} className="absolute inset-x-0 top-full z-20 mt-1 flex flex-col rounded border border-[var(--home-rule)] bg-[var(--home-paper)] shadow-lg">
          {suggestions.length === 0 ? <li role="presentation" className={`${NOTE} px-3 py-2`}><span role="status">{ar ? 'لا عبارة مشتركة تطابق البحث.' : 'No shared phrase matches your search.'}</span></li> : suggestions.map((opening, index) => (
            <li key={opening.id} role="presentation">
              <button id={`${listId}-${index}`} data-branch-navigation type="button" role="option" aria-selected={selected === index} onClick={() => open(opening)} className={`flex w-full items-baseline gap-2 px-3 py-2 text-start hover:bg-[var(--home-paper-deep)] ${selected === index ? 'bg-[var(--home-paper-deep)]' : ''}`}>
                <span className="text-lg font-arabic flex-1" dir="rtl">{ar ? opening.text : opening.textEn ?? opening.text}</span>
                <span className="text-[var(--home-accent)]">{ar ? num(opening.count) : opening.count}</span>
              </button>
            </li>
          ))}
        </ul>}
      </div>
      {unavailable && <p role="status" className={NOTE}>{ar
        ? 'لا تطابق العبارة المطلوبة آيتان أو أكثر داخل هذه الأجزاء. عد إلى القائمة أو امسح نطاق الأجزاء.'
        : 'No two ayat share the requested phrase in this range. Return to the list or clear the juz range.'}</p>}
      {alternatives.length > 1 && <div role="group" aria-label={ar ? 'مجموعات العبارة' : 'Matching phrase groups'} className="flex flex-col gap-2">
        <p className={NOTE}>{ar ? 'تطابق هذه العبارة مجموعات مختلفة. اختر العبارة المقصودة.' : 'This link matches different groups. Choose the intended phrase.'}</p>
        {alternatives.map(phrase => <Button key={phrase.partition} href={href(phrase)} onClick={() => { setQuery(''); setSelected(-1); }} className="self-start">
          <GitBranch size={16} aria-hidden />
          <span dir="rtl">{phrase.text}</span>
          <span>{ar ? num(phrase.count) : phrase.count}</span>
        </Button>)}
      </div>}
    </div>
  );
}
