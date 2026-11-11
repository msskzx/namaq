'use client';

import LoadingDots from '@/components/common/LoadingDots';
import React, { useEffect, useId, useMemo, useRef, useState } from 'react';

import { Search } from 'lucide-react';
import TreeIcon from '@/components/common/TreeIcon';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';
import { num } from '@shared/quran/arabicNumber';
import { branchesHref, type BranchesView, type Opening } from '@shared/quran/branches';
import { ALL_KINDS, searchSharedPhrases } from '@shared/quran/branchSearch';
import type { JuzRange } from '@shared/quran/juz';
import { useNavigatingRouter } from '@/components/common/NavigationLoader';
import { matchesSurah } from '@shared/quran/surahSearch';
const NOTE = 'text-sm text-[var(--home-muted)]';
const SEARCH = 'w-full rounded-sm border border-[var(--home-rule)] bg-transparent ps-10 pe-3 h-11 text-[var(--home-ink)] placeholder:text-[var(--home-muted)]';

type Suggestion = Opening;
export type SurahCount = { number: number; name: string; count: number };
const SURAH_HITS = 3;

export const SUGGESTIONS = 10;

const inventories = new Map<string, Promise<Opening[]>>();
const NONE: Opening[] = [];

function loadPhrases(key: string): Promise<Opening[]> {
  if (!inventories.has(key)) inventories.set(key, fetch(`/api/quran/branch-phrases?${key}`)
    .then(response => (response.ok ? response.json() : Promise.reject(new Error('Phrases failed'))))
    .then((data: { phrases: Opening[] }) => data.phrases)
    .catch(error => {
      inventories.delete(key);
      throw error;
    }));
  return inventories.get(key)!;
}

export default function OpeningSearch({ phrases: given, query: submitted = '', juz = null, unavailable = false, view = {}, alternatives = [], remote = false, surahs = [] }: { surahs?: SurahCount[]; remote?: boolean; top: Opening[]; phrases?: Opening[]; current?: string; query?: string; juz?: JuzRange | null; unavailable?: boolean; view?: BranchesView; alternatives?: Opening[] }) {
  const router = useNavigatingRouter();
  const { language } = useLanguage();
  const ar = language === 'ar';
  const listId = useId();
  const [query, setQuery] = useState(submitted);
  const [dismissed, setDismissed] = useState(!!submitted);
  const [selected, setSelected] = useState(-1);
  const from = juz?.from;
  const to = juz?.to;
  const [loaded, setLoaded] = useState<{ range: string; phrases: Opening[] }>();
  const scope = new URLSearchParams({ ...view.filters, ...(from !== undefined && to !== undefined && { juzFrom: String(from), juzTo: String(to) }), ...(view.saved?.length && { b: view.saved.join('|') }), ...(view.surah && { s: String(view.surah) }) });
  const range = scope.toString();
  const ready = !!given || remote || loaded?.range === range;
  const typed = !!query.trim();
  useEffect(() => {
    if (ready) return;
    let live = true;
    loadPhrases(`all=1${range ? `&${range}` : ''}`).then(phrases => live && setLoaded({ range, phrases }), () => {});
    return () => { live = false; };
  }, [ready, from, to, range, typed]);
  const phrases = given ?? (loaded?.range === range ? loaded.phrases : NONE);
  useEffect(() => setSelected(-1), [phrases]);
  const request = new URLSearchParams(range);
  request.set('q', query);
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
  // Trees the search finds outside the current filters: listed last, under their own label.
  const [outsideFetched, setOutsideFetched] = useState<{ key: string; outside: Suggestion[] }>();
  useEffect(() => {
    if (!query.trim() || dismissed) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch(`/api/quran/branch-phrases?outside=1&${requestKey}`, { signal: controller.signal })
        .then(response => { if (!response.ok) throw new Error('Search failed'); return response.json(); })
        .then(data => { if (!controller.signal.aborted) setOutsideFetched({ key: requestKey, outside: data.outside }); })
        .catch(() => {});
    }, 200);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query, dismissed, requestKey]);
  const outside: Suggestion[] = outsideFetched?.key === requestKey ? outsideFetched.outside : [];
  const local = useMemo(() => remote ? [] : searchSharedPhrases(phrases, query).slice(0, SUGGESTIONS), [remote, phrases, query]);
  const suggestions: Suggestion[] = remote && fetched?.key === requestKey ? fetched.suggestions : local;
  const surahHits = useMemo(() => query.trim() ? surahs.filter(surah => matchesSurah(surah, query.trim())).slice(0, SURAH_HITS) : [], [surahs, query]);
  const options = [...surahHits.map(surah => ({ surah })), ...suggestions.map(phrase => ({ phrase })), ...outside.map(phrase => ({ phrase, outside: true }))];
  const visible = !!query.trim() && !dismissed;
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!visible) return;
    const close = (event: PointerEvent) => { if (!box.current?.contains(event.target as Node)) { setDismissed(true); setSelected(-1); } };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [visible]);
  const href = (phrase: Suggestion) => branchesHref(phrase.id, juz ?? undefined, { ...view, occurrences: undefined, card: undefined, query: phrase.text });
  const open = (phrase: Suggestion) => {
    setQuery('');
    setSelected(-1);
    router.push(href(phrase));
  };
  // A tree outside the filters opens with the filters reset to every kind of tree, so it sits in the swiped list.
  const openOutside = (phrase: Suggestion) => {
    setQuery('');
    setSelected(-1);
    router.push(branchesHref(phrase.id, undefined, { mode: view.mode, query: phrase.text, filters: { categories: ALL_KINDS } }));
  };
  const pickSurah = (surah: SurahCount) => {
    setQuery('');
    setSelected(-1);
    router.push(branchesHref('', juz ?? undefined, { surah: surah.number, mode: view.mode, saved: view.saved, filters: view.filters }));
  };
  const choose = (option: typeof options[number]) => 'surah' in option ? pickSurah(option.surah) : 'outside' in option ? openOutside(option.phrase) : open(option.phrase);
  const search = () => {
    setDismissed(true);
    setSelected(-1);
    router.push(branchesHref('', juz ?? undefined, { surah: view.surah, query: query.trim(), mode: view.mode, saved: view.saved, filters: view.filters }));
  };
  return (
    <div className="flex flex-col gap-3">
      <div ref={box} className="relative">
        <label className="relative block">
          <span className="sr-only">{ar ? 'ابحث عن عبارة مشتركة بين آيتين أو أكثر' : 'Search phrases shared by two or more ayat'}</span>
          <Search aria-hidden className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--home-muted)]" />
          <input type="search" role="combobox" aria-autocomplete="list" aria-expanded={visible} aria-controls={listId} aria-activedescendant={visible && selected >= 0 && options[selected] ? `${listId}-${selected}` : undefined} value={query}
            onChange={event => {
            setQuery(event.target.value);
            setSelected(-1);
            setDismissed(false);
            if (!event.target.value && submitted && !(event.nativeEvent instanceof InputEvent && event.nativeEvent.inputType)) router.push(branchesHref('', juz ?? undefined, { surah: view.surah, mode: view.mode }));
          }}
            placeholder={ar ? 'ابحث' : 'Search'}
            onKeyDown={event => {
              if (event.key === 'Escape') { setDismissed(true); setSelected(-1); }
              if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && options.length) {
                event.preventDefault();
                setDismissed(false);
                setSelected(index => event.key === 'ArrowDown' ? (index + 1) % options.length : (index <= 0 ? options.length - 1 : index - 1));
              }
              if (event.key === 'Enter' && !query.trim() && submitted) router.push(branchesHref('', juz ?? undefined, { surah: view.surah, mode: view.mode }));
              if (event.key === 'Enter' && query.trim()) { event.preventDefault(); if (visible && options[selected]) choose(options[selected]); else search(); }
            }} className={SEARCH} />
        </label>
        {visible && <ul id={listId} role="listbox" aria-label={ar ? 'عبارات مقترحة' : 'Suggested phrases'} className="absolute inset-x-0 top-full z-20 mt-1 flex flex-col rounded border border-[var(--home-rule)] bg-[var(--home-paper)] shadow-lg">
          {surahHits.length > 0 && <li role="presentation" className={`${NOTE} px-3 pt-2 text-xs`}>{ar ? 'السور' : 'Surahs'}</li>}
          {surahHits.map((surah, index) => <li key={`s${surah.number}`} role="presentation">
            <button id={`${listId}-${index}`} type="button" role="option" aria-selected={selected === index} onClick={() => pickSurah(surah)} className={`flex w-full items-baseline gap-2 px-3 py-2 text-start hover:bg-[var(--home-paper-deep)] ${selected === index ? 'bg-[var(--home-paper-deep)]' : ''}`}>
              <span className={`${NOTE} w-7 shrink-0 tabular-nums`}>{ar ? num(surah.number) : surah.number}</span>
              <span className="flex-1">{surah.name}</span>
              <span className="text-[var(--home-accent)]">{ar ? num(surah.count) : surah.count}</span>
            </button>
          </li>)}
          {surahHits.length > 0 && suggestions.length > 0 && <li role="presentation" className={`${NOTE} border-t border-[var(--home-rule)] px-3 pt-2 text-xs`}>{ar ? 'العبارات' : 'Phrases'}</li>}
          {suggestions.length === 0 ? surahHits.length > 0 && ready || outside.length > 0 ? null : <li role="presentation" className={`${NOTE} px-3 py-2`}>{!ready ? <LoadingDots label={ar ? 'جارٍ تحميل العبارات' : 'Loading phrases'} /> : <span role="status">{ar ? 'لا عبارة مشتركة تطابق البحث.' : 'No shared phrase matches your search.'}</span>}</li> : suggestions.map((opening, i) => {
            const index = surahHits.length + i;
            return <li key={opening.id} role="presentation">
              <button id={`${listId}-${index}`} data-branch-navigation type="button" role="option" aria-selected={selected === index} onClick={() => open(opening)} className={`flex w-full items-baseline gap-2 px-3 py-2 text-start hover:bg-[var(--home-paper-deep)] ${selected === index ? 'bg-[var(--home-paper-deep)]' : ''}`}>
                <span className="text-lg font-arabic flex-1" dir="rtl">{ar ? opening.text : opening.textEn ?? opening.text}</span>
                <span className="text-[var(--home-accent)]">{ar ? num(opening.count) : opening.count}</span>
              </button>
            </li>;
          })}
          {outside.length > 0 && <li role="presentation" className={`${NOTE} border-t border-[var(--home-rule)] px-3 pt-2 text-xs`}>{ar ? 'خارج التصفية الحالية، فتحها يمسح التصفية' : 'Outside your filters; opening one clears them'}</li>}
          {outside.map((opening, i) => {
            const index = surahHits.length + suggestions.length + i;
            return <li key={`o${opening.id}`} role="presentation">
              <button id={`${listId}-${index}`} data-branch-navigation type="button" role="option" aria-selected={selected === index} onClick={() => openOutside(opening)} className={`flex w-full items-baseline gap-2 px-3 py-2 text-start text-[var(--home-muted)] hover:bg-[var(--home-paper-deep)] ${selected === index ? 'bg-[var(--home-paper-deep)]' : ''}`}>
                <span className="text-lg font-arabic flex-1" dir="rtl">{ar ? opening.text : opening.textEn ?? opening.text}</span>
                <span>{ar ? num(opening.count) : opening.count}</span>
              </button>
            </li>;
          })}
        </ul>}
      </div>
      {unavailable && <UnavailableNote />}
      {alternatives.length > 1 && <div role="group" aria-label={ar ? 'مجموعات العبارة' : 'Matching phrase groups'} className="flex flex-col gap-2">
        <p className={NOTE}>{ar ? 'تطابق هذه العبارة مجموعات مختلفة. اختر العبارة المقصودة.' : 'This link matches different groups. Choose the intended phrase.'}</p>
        {alternatives.map(phrase => <Button key={phrase.partition} href={href(phrase)} onClick={() => { setQuery(''); setSelected(-1); }} className="self-start">
          <TreeIcon size={16} aria-hidden />
          <span dir="rtl">{phrase.text}</span>
          <span>{ar ? num(phrase.count) : phrase.count}</span>
        </Button>)}
      </div>}
    </div>
  );
}

/** Said in the page when the requested phrase has no tree in the chosen juz range (the search box itself sits in the top bar). */
export function UnavailableNote() {
  const ar = useLanguage().language === 'ar';
  return <p role="status" className={NOTE}>{ar
    ? 'لا تطابق العبارة المطلوبة آيتان أو أكثر داخل هذه الأجزاء. امسح نطاق الأجزاء من زر التصفية.'
    : 'No two ayat share the requested phrase in this range. Clear the juz range from the filter button.'}</p>;
}
