'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { num } from '@/lib/quran/arabicNumber';
import { searchSurahs } from '@/lib/quran/surahSearch';
import { FIELD } from '../panel';

type Surah = { number: number; name: string };

export default function SurahPicker({ name, label, value, surahs }: { name: string; label: string; value: number; surahs: Surah[] }) {
  const id = useId();
  const [selected, setSelected] = useState(value);
  const [query, setQuery] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const list = useRef<HTMLUListElement>(null);
  const text = (s: Surah) => `${num(s.number)}. ${s.name}`;
  const current = surahs.find(s => s.number === selected);
  const open = query !== null;
  const found = open ? searchSurahs(surahs, query) : [];
  useEffect(() => {
    const box = list.current;
    const row = box?.children[active] as HTMLElement | undefined;
    if (!box || !row) return;
    if (row.offsetTop < box.scrollTop) box.scrollTop = row.offsetTop;
    else if (row.offsetTop + row.offsetHeight > box.scrollTop + box.clientHeight) box.scrollTop = row.offsetTop + row.offsetHeight - box.clientHeight;
  }, [active, open]);
  const choose = (s: Surah) => {
    setSelected(s.number);
    setQuery(null);
  };
  const begin = () => {
    setQuery('');
    setActive(Math.max(0, surahs.findIndex(s => s.number === selected)));
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        begin();
      }
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(k => Math.min(Math.max(k + (e.key === 'ArrowDown' ? 1 : -1), 0), found.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (found[active]) choose(found[active]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setQuery(null);
    }
  };

  return (
    <div className="relative min-w-48 flex-1">
      <input type="hidden" name={name} value={selected} />
      <input type="text" role="combobox" aria-label={label} aria-expanded={open && found.length > 0} aria-controls={`${id}-list`} aria-autocomplete="list"
        aria-activedescendant={open && found[active] ? `${id}-${found[active].number}` : undefined}
        placeholder="ابحث بالاسم أو الرقم" autoComplete="off" value={open ? query : current ? text(current) : ''}
        onFocus={begin} onClick={() => !open && begin()} onBlur={() => setQuery(null)} onKeyDown={onKeyDown}
        onChange={e => {
          const label = current ? text(current) : '';
          const v = e.target.value;
          setQuery(open ? v : v.startsWith(label) ? v.slice(label.length) : label.startsWith(v) ? '' : v);
          setActive(0);
        }}
        className={`${FIELD} w-full pe-7`} />
      <FontAwesomeIcon icon={faChevronDown} className="pointer-events-none absolute end-2.5 top-1/2 -translate-y-1/2 size-3 text-gray-400" />
      {open && (found.length === 0 ? (
        <p role="status" className="absolute z-20 top-full mt-1 w-full rounded border border-gray-300 dark:border-white/15 bg-white dark:bg-gray-900 shadow-lg text-sm px-2 py-1.5 text-gray-500 dark:text-gray-400">لا سورة بهذا الاسم.</p>
      ) : (
        <ul ref={list} id={`${id}-list`} role="listbox" aria-label={label} className="absolute z-20 top-full mt-1 w-full max-h-72 overflow-y-auto rounded border border-gray-300 dark:border-white/15 bg-white dark:bg-gray-900 shadow-lg text-sm">
          {found.map((s, k) => (
            <li key={s.number} id={`${id}-${s.number}`} role="option" aria-selected={s.number === selected}
              onMouseDown={e => e.preventDefault()} onClick={() => choose(s)} onMouseEnter={() => setActive(k)}
              className={`px-2 py-1.5 cursor-pointer aria-selected:font-semibold ${k === active ? 'bg-amber-100 dark:bg-white/10' : ''}`}>
              {text(s)}
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
