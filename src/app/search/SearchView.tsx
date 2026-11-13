'use client';

import React, { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowLeftRight, BookOpen, ChevronDown, ChevronLeft, List, NotebookPen, ScrollText, Search, TextSearch, Users, X, type LucideProps } from 'lucide-react';
import { readAyahNotes, serverAyahNotes, subscribeAyahNotes, notesByDate } from '@shared/ayahNotes';
import { ayahHref } from '@shared/ayahMarks';
import { num } from '@shared/quran/arabicNumber';
import { branchesHref } from '@shared/quran/branches';
import { surahPairHref } from '@shared/quran/curatedComparisons';
import { mushafText } from '@shared/quran/mushafText';
import { holdsTerms, SEARCH_ORDER, type SearchGroup, type SearchHit, type SearchKind } from '@shared/quran/searchAll';
import surahRows from '@shared/data/quran/surahs.json';
import { NavActions } from '@/components/common/NavBar';
import TreeIcon from '@/components/common/TreeIcon';
import styles from './Search.module.css';

/** Results a group shows until its arrow opens the rest; at most this many when open (shared/quran/searchSources.ts). */
export const GROUP_SHOWN = 3;
const GROUP_MAX = 100;
const AROUND = 6;

const GROUPS: Record<SearchKind, { title: string; Icon: (props: LucideProps) => React.ReactNode }> = {
  surah: { title: 'السور', Icon: List },
  ayah: { title: 'الآيات', Icon: BookOpen },
  word: { title: 'الألفاظ', Icon: TextSearch },
  tree: { title: 'المتشابهات', Icon: TreeIcon },
  compare: { title: 'المقارنة', Icon: ArrowLeftRight },
  event: { title: 'قصص الأنبياء', Icon: Users },
  tuhfa: { title: 'تحفة الأطفال', Icon: ScrollText },
  note: { title: 'تأملاتي', Icon: NotebookPen },
};

const names: Record<number, string> = Object.fromEntries(surahRows.map(row => [row.number, row.name]));
const ayahLabel = (key: string) => { const [surah, ayah] = key.split(':').map(Number); return `${names[surah]} ${num(ayah)}`; };

export function hitHref(hit: SearchHit): string {
  switch (hit.kind) {
    case 'surah': return ayahHref(`${hit.number}:1`);
    case 'ayah': case 'note': return ayahHref(hit.key);
    case 'word': return `/quran/words?w=${encodeURIComponent(hit.name)}`;
    case 'tree': return branchesHref(hit.id, undefined, { query: hit.text });
    case 'compare': return surahPairHref(hit.a, hit.b);
    case 'event': return `/quran/prophets/${hit.slug}?event=${hit.event}`;
    case 'tuhfa': return `/quran/tajwid/tuhfat-al-atfal#bayt-${hit.verse}`;
  }
}

function HitBody({ hit }: { hit: SearchHit }) {
  switch (hit.kind) {
    case 'surah':
      return <><span className={styles.muted}>{num(hit.number)}</span><span className={styles.grow}>{hit.name}</span></>;
    case 'ayah': {
      const start = Math.max(0, hit.from - AROUND);
      const end = Math.min(hit.words.length, hit.to + 1 + AROUND);
      return <span className={styles.grow}>
        <span className={styles.quran}>
          {start > 0 ? '… ' : ''}
          {hit.words.slice(start, end).map((word, at) => <span key={at} className={start + at >= hit.from && start + at <= hit.to ? styles.hit : undefined}>{`${mushafText(word)} `}</span>)}
          {end < hit.words.length ? '…' : ''}
        </span>
        <span className={`${styles.muted} block`}>{ayahLabel(hit.key)}</span>
      </span>;
    }
    case 'word':
      return <><span className={`${styles.grow} ${styles.quran}`}>{mushafText(hit.name)}</span><span className={styles.count}>{num(hit.count)}</span></>;
    case 'tree':
      return <span className={`${styles.grow} ${styles.quran}`}>{mushafText(hit.text)}</span>;
    case 'compare':
      return <span className={styles.grow}>{hit.title}</span>;
    case 'event':
      return <><span className={styles.grow}>{hit.title}</span><span className={styles.muted}>{hit.prophet}</span></>;
    case 'tuhfa':
      return <><span className={styles.muted}>{num(hit.verse)}</span><span className={`${styles.grow} ${styles.verse}`}><span>{hit.first}</span><span>{hit.second}</span></span></>;
    case 'note':
      return <span className={styles.grow}><span className="line-clamp-2">{hit.text}</span><span className={`${styles.muted} block`}>{ayahLabel(hit.key)}</span></span>;
  }
}

const hitKey = (hit: SearchHit) => hit.kind === 'surah' ? `s${hit.number}` : hit.kind === 'ayah' || hit.kind === 'note' ? `${hit.kind}${hit.key}` : hit.kind === 'word' ? `w${hit.id}`
  : hit.kind === 'tree' ? `t${hit.id}` : hit.kind === 'compare' ? `c${hit.a}:${hit.b}` : hit.kind === 'event' ? `e${hit.slug}${hit.event}` : `v${hit.verse}`;

/** The reader's notes join the groups the server found, in their place in the order. */
export function withNotes(groups: SearchGroup[], notes: { key: string; text: string }[], query: string): SearchGroup[] {
  const hits: SearchHit[] = notes.filter(note => holdsTerms(note.text, query)).map(note => ({ kind: 'note', ...note }));
  const all = hits.length ? [...groups.filter(group => group.kind !== 'note'), { kind: 'note' as const, hits }] : groups;
  return all.sort((a, b) => SEARCH_ORDER.indexOf(a.kind) - SEARCH_ORDER.indexOf(b.kind));
}

/** The app's one search on the website: surahs first, then ayat, words, trees, compare pages, events, Tuhfa verses and notes. */
export default function SearchView() {
  const [query, setQuery] = useState('');
  const [found, setFound] = useState<{ query: string; groups: SearchGroup[] }>({ query: '', groups: [] });
  const [open, setOpen] = useState<SearchKind | null>(null);
  const notes = useSyncExternalStore(subscribeAyahNotes, readAyahNotes, serverAyahNotes);
  useEffect(() => {
    const typed = query.trim();
    setOpen(null);
    if (!typed) { setFound({ query: '', groups: [] }); return; }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(typed)}`, { signal: controller.signal })
        .then(response => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
        .then(({ groups }: { groups: SearchGroup[] }) => setFound({ query: typed, groups }))
        .catch(() => { if (!controller.signal.aborted) setFound({ query: typed, groups: [] }); });
    }, 200);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query]);
  const groups = useMemo(() => {
    const all = found.query ? withNotes(found.groups, notesByDate(notes).map(key => ({ key, text: notes[key].text })), found.query) : [];
    return open ? all.filter(group => group.kind === open) : all;
  }, [found, notes, open]);
  const waiting = query.trim() !== found.query;
  return <div className={styles.page} dir="rtl">
    <h1 className="sr-only">البحث</h1>
    <NavActions>
      <label className={styles.box}>
        <Search size={18} className={styles.icon} aria-hidden />
        <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="ابحث" aria-label="ابحث في كل شيء" />
        {query && <button type="button" className={styles.clear} onClick={() => setQuery('')} aria-label="مسح"><X size={18} aria-hidden /></button>}
      </label>
    </NavActions>
    {!waiting && found.query && !groups.length && <p className={styles.empty}>لا توجد نتيجة مطابقة.</p>}
    {groups.map(group => {
      const { title, Icon } = GROUPS[group.kind];
      const more = group.hits.length > GROUP_SHOWN;
      const shown = group.hits.slice(0, open ? GROUP_MAX : GROUP_SHOWN);
      return <section key={group.kind}>
        <button type="button" className={styles.heading} disabled={!more && !open} onClick={() => setOpen(open ? null : group.kind)}
          aria-label={open ? `${title}: أغلق` : more ? `${title}: عرض الكل` : title}>
          <h2><Icon size={20} aria-hidden />{title}</h2>
          {open ? <ChevronDown size={22} className={styles.count} aria-hidden /> : more ? <ChevronLeft size={22} className={styles.count} aria-hidden /> : null}
        </button>
        {shown.map(hit => <Link key={hitKey(hit)} href={hitHref(hit)} className={hit.kind === 'ayah' ? styles.ayah : styles.row}><HitBody hit={hit} /></Link>)}
        {open && group.hits.length > GROUP_MAX && <p className={`${styles.muted} text-center mt-1`}>{`أول ${num(GROUP_MAX)} نتيجة، زد كلمة لتضييق البحث.`}</p>}
      </section>;
    })}
  </div>;
}
