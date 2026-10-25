'use client';

// docs/plans/quran-similar-ayat.md
import React, { useEffect, useRef, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown19, faArrowDownWideShort, faChevronDown, faLightbulb, faMagnifyingGlass, type IconDefinition } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/common/Button';
import Toggle from '@/components/common/Toggle';
import { num } from '@/lib/quran/arabicNumber';
import type { SurahGroup } from '@/lib/quran/surahPairs';
import { surahMatch } from '@/lib/quran/surahSearch';
import { FIELD, NOTE, PANEL } from '../panel';
import { modeHref } from './modeHref';
import { useNavigatingRouter } from '@/components/common/NavigationLoader';

type Mode = 'text' | 'themes';

function Switch({ off, on, checked, onChange, offIcon, onIcon }: { off: string; on: string; checked: boolean; onChange: (on: boolean) => void; offIcon: IconDefinition; onIcon: IconDefinition }) {
  const label = (active: boolean) => 'cursor-pointer ' + (active ? 'font-semibold text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400');
  return (
    <div className="flex items-center gap-2 text-sm">
      <button type="button" tabIndex={-1} aria-hidden className={label(!checked)} onClick={() => onChange(false)}>{off}</button>
      <Toggle label={on} checked={checked} onChange={onChange}
        offIcon={<FontAwesomeIcon icon={offIcon} className="size-3" />} onIcon={<FontAwesomeIcon icon={onIcon} className="size-3" />} />
      <button type="button" tabIndex={-1} aria-hidden className={label(checked)} onClick={() => onChange(true)}>{on}</button>
    </div>
  );
}

const ROW = 'w-full flex items-baseline gap-2 px-2 py-1 text-start rounded hover:bg-amber-100 dark:hover:bg-white/10 aria-[current=true]:bg-amber-100 aria-[current=true]:font-semibold dark:aria-[current=true]:bg-white/10';
const COUNT = 'text-amber-700 dark:text-amber-300 tabular-nums';

export function SurahPairs({ groups, names, mode, surah, a, b }: { groups: SurahGroup[]; names: Record<number, string>; mode: Mode; surah: number | null; a: number; b: number }) {
  const router = useNavigatingRouter();
  const [byNumber, setByNumber] = useState(false);
  const [query, setQuery] = useState('');
  const list = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const box = list.current;
    const row = box?.querySelector<HTMLElement>('[aria-current="true"]');
    if (box && query) box.scrollTop = 0;
    else if (box && row) box.scrollTop = row.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop - box.clientHeight / 3;
  }, [surah, a, b, mode, query]);
  const go = (href: string) => router.push(href, { scroll: false });
  const sorted = (byNumber ? groups : [...groups].sort((p, q) => q.total - p.total || p.surah - q.surah)).filter(g => surahMatch(query, g.surah, names[g.surah] ?? '') !== null);
  const open = (s: number) => (surah === null ? s === a || s === b : s === surah);
  const unit = mode === 'themes' ? 'موضوع مشترك' : 'آية متشابهة';

  return (
    <section className={`${PANEL} flex flex-col gap-3`}>
      <h2 className="text-xl">{mode === 'themes' ? 'السور بالمواضيع المشتركة' : 'السور بالآيات المتشابهة'}</h2>
      <p className={NOTE}>{`كل سورة بعدد ما يجمعها بغيرها (${unit}). افتح سورة لترى ما يقابلها، واختر واحدة لمقارنتهما.`}</p>
      {mode === 'text' && (
        <Button size="sm" href="/quran/compare?a=55&af=46&at=61&b=55&bf=62&bt=77" className="w-fit">
          <FontAwesomeIcon icon={faLightbulb} />
          مثال: الرحمن ٤٦–٦١ مقابل ٦٢–٧٧
        </Button>
      )}
      <Switch off={mode === 'themes' ? 'الأكثر مواضيع مشتركة أولًا' : 'الأكثر آيات متشابهة أولًا'} on="بترتيب المصحف" checked={byNumber} onChange={setByNumber} offIcon={faArrowDownWideShort} onIcon={faArrowDown19} />
      <label className="relative">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute start-2.5 top-1/2 -translate-y-1/2 size-3 text-gray-400" />
        <input type="search" aria-label="ابحث عن سورة" placeholder="ابحث عن سورة بالاسم أو الرقم" value={query} onChange={e => setQuery(e.target.value)} className={`${FIELD} w-full ps-8`} />
      </label>
      {sorted.length === 0 ? <p className={NOTE}>{groups.length === 0 ? 'لا سور.' : 'لا سورة بهذا الاسم.'}</p> : (
        <ul ref={list} className="flex flex-col gap-2 max-h-[min(75vh,48rem)] overflow-y-auto">
          {sorted.map(g => (
            <li key={g.surah}>
              <details key={`${mode}:${surah}:${a}:${b}`} open={open(g.surah)} className="group rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 open:border-amber-400 dark:open:border-amber-600">
                <summary className="flex items-center gap-2 px-3 py-2 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className={`${NOTE} w-7 shrink-0 tabular-nums`}>{num(g.surah)}</span>
                  <span className="flex-1">{names[g.surah]}</span>
                  <span className={COUNT}>{num(g.total)}</span>
                  <FontAwesomeIcon icon={faChevronDown} className="size-3 text-gray-400 transition-transform group-open:rotate-180" />
                </summary>
                <ul className="border-t border-gray-200 dark:border-white/10 p-1">
                  {g.self > 0 && mode === 'text' && (
                    <li>
                      <button type="button" className={ROW} aria-current={surah === g.surah} onClick={() => go(`/quran/compare?s=${g.surah}`)}>
                        <span className="flex-1">داخل السورة</span>
                        <span className={COUNT}>{num(g.self)}</span>
                      </button>
                    </li>
                  )}
                  {g.total === 0 && <li className={`${NOTE} px-2 py-1`}>{mode === 'themes' ? 'لا مواضيع مشتركة مع سورة أخرى.' : 'لا آيات متشابهة.'}</li>}
                  {g.partners.map(p => (
                    <li key={p.other}>
                      <button type="button" className={ROW} aria-current={surah === null && ((g.surah === a && p.other === b) || (g.surah === b && p.other === a))}
                        onClick={() => go(modeHref(mode, { a: String(g.surah), b: String(p.other) }))}>
                        <span className="flex-1">{`و${names[p.other]}`}</span>
                        <span className={COUNT}>{num(p.count)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
