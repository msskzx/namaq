'use client';

import React, { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { ArrowLeft, ArrowRight, BookOpen, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronUp, EyeOff, File, List, PenLine, Search, Undo2, X } from 'lucide-react';
import { readAyahNotes, serverAyahNotes, subscribeAyahNotes } from '@shared/ayahNotes';
import { plainName } from '@shared/quran/normalize';
import NoteDialog from '@/components/quran/NoteDialog';
import { ayahBookmarkId, ayahHref, markForgotten, rememberAyah, readDueMarks, serverAyahMarks, subscribeDueMarks } from '@shared/ayahMarks';
import { readBookmarks, serverBookmarks, subscribeBookmarks, toggleBookmark } from '@shared/bookmarks';
import { readGestures, serverGestures, subscribeGestures, type GestureAction } from '@shared/readerGestures';
import { wordTargets } from '@shared/quran/writeAyah';
import { useWriteBoxes } from './useWriteBoxes';
import { WRITE_KEY } from './writeKey';
import { nextOpening, OPENINGS_KEY, type Openings } from '@shared/quran/openings';
import { atStart, compareKeys, forgottenOrder, previousKey, isHidden, nextAyah, nextForgotten, positionQuery, readPosition, revealAyah, revealWord, stepBack, type RecitePosition } from '@shared/quran/recite';
import AyahActions from './AyahActions';
import AyahPreviewSheet, { type Preview } from './AyahPreviewSheet';
import TopicSheet, { type TopicOpen } from './TopicSheet';
import type { AyahLinks } from './ayahLinks';
import { usePageGestures } from './usePageGestures';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Button from '@/components/common/Button';
import { NavActions, useDesktopRail } from '@/components/common/NavBar';
import { useSwipe } from '@/components/common/useSwipe';
import { useSwipeClose } from '@/components/common/useSwipeClose';
import { SettingsHelp } from '@/components/common/SettingsHelp';
import Segmented from '@/components/common/Segmented';
import { useNavigatingRouter } from '@/components/common/NavigationLoader';
import { useSearchParams } from 'next/navigation';
import { num } from '@shared/quran/arabicNumber';
import { pageGroups, spreadOf, turn, type MushafPage as MushafPageData } from '@shared/quran/readerPage';
import { useLanguage } from '@/components/language/LanguageContext';
import styles from '@/components/homepage/Home.module.css';
import mushaf from './Mushaf.module.css';
import type { IndexSurah } from '@shared/quran/juzIndex';
import SurahIndex from './SurahIndex';
import { AyahShareDialog } from '@/components/share/AyahShare';
import MushafPage, { settleTextSize, type Checked, type Write } from './MushafPage';

export type ReaderPage = { page: number; data: MushafPageData; top?: number };

const SPREAD_KEY = 'quran-reader-spread';
/** The text size (1 is the printed page), kept on this device. */
const TEXT_SIZE_KEY = 'quran-reader-text-size';
/** The last page read: /quran/read opens there. */
export const LAST_PAGE_KEY = 'quran-reader-page';
const BAR_KEY = 'quran-reader-bar';
export const LAST_RECITE_KEY = 'quran-recite-last';
const WIDE = '(min-width: 1024px) and (orientation: landscape)';
const PHONE = '(max-width: 640px)';

const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {}
};

/** The index and search panels: they hang from the top bar, so swiping up closes them. */
function SwipePanel({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const panel = useRef<HTMLDivElement>(null);
  useSwipeClose(panel, true, { direction: 'up', onClose: () => panel.current?.hidePopover?.() });
  return <div ref={panel} popover="auto" className={mushaf.index} {...props}>{children}</div>;
}

export default function ReaderView({
  page,
  pages,
  names,
  surahs = [],
  mark,
  fontClass,
  recite,
  review = false,
  write: startWriting = false,
  openings: openingsOn = false,
  links = {},
}: {
  page: number;
  pages: ReaderPage[];
  names: Record<number, string>;
  surahs?: IndexSurah[];
  mark?: { surah: number; ayah: number };
  fontClass?: string;
  /** Recite mode (تسميع): where it started and how far it has been revealed. */
  recite?: RecitePosition | null;
  /** Each shown ayah's compare cards and trees, for its long-press buttons. */
  links?: AyahLinks;
  /** Recite only the forgotten ayat, one after another. */
  review?: boolean;
  /** Start reciting with writing on, from the top of the page (the quizzes page's write card). */
  write?: boolean;
  /** The surah openings quiz: one surah's first ayah at a time; the round is kept in sessionStorage. */
  openings?: boolean;
}) {
  const { language, languageLoaded } = useLanguage();
  const ar = !languageLoaded || language === 'ar';
  const router = useNavigatingRouter();
  const frame = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLElement>(null);
  const indexId = useId();
  const searchId = useId();
  const [phoneTools, setPhoneTools] = useState(false);
  const rail = useDesktopRail();
  const [spread, setSpread] = useState(false);
  const [phone, setPhone] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [zoom, setZoom] = useState(1);
  const flow = zoom > 1;
  // Bigger text flows down one page at a time.
  const two = spread && !phone && !flow;
  const shown = two ? pages.filter(entry => spreadOf(page).includes(entry.page)) : pages.filter(entry => entry.page === page);
  const gestures = useSyncExternalStore(subscribeGestures, readGestures, serverGestures);
  const forgot = useSyncExternalStore(subscribeDueMarks, readDueMarks, serverAyahMarks);
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks, serverBookmarks);
  const saved = useMemo(() => new Set(bookmarks.filter(item => item.id.startsWith('ayah:')).map(item => item.id.slice(5))), [bookmarks]);
  const groups = useMemo(() => shown.map(entry => pageGroups(entry.data.items, entry.top)), [shown]);
  const order = useMemo(() => [...new Set(groups.flatMap(lines => lines.flatMap(line => line?.map(group => `${group.surah}:${group.ayah}`) ?? [])))], [groups]);
  /** Words of each ayah on each shown page, so words of an ayah are counted across a spread. */
  const wordCounts = useMemo(() => groups.map(lines => {
    const counts: Record<string, number> = {};
    lines.forEach(line => line?.forEach(group => { if (group.word) counts[`${group.surah}:${group.ayah}`] = (counts[`${group.surah}:${group.ayah}`] ?? 0) + 1; }));
    return counts;
  }), [groups]);
  /** Surah titles on each shown page, with 2 steps when a basmala follows the title, else 1. */
  const titles = useMemo(() => shown.map(entry => entry.data.items.flatMap((item, at) => ('surah' in item ? [[item.surah, entry.data.items[at + 1] && 'basmala' in entry.data.items[at + 1] ? 2 : 1] as const] : []))), [shown]);
  /** Whether an ayah's end (its number) is on the shown pages. */
  const endsOn = (key: string) => {
    const [surah, ayah] = key.split(':').map(Number);
    return groups.some(lines => lines.some(line => line?.some(group => group.surah === surah && group.marks.includes(ayah))));
  };
  const ayahCounts = useMemo(() => new Map(surahs.map(surah => [surah.number, surah.numberOfAyat])), [surahs]);
  const [position, setPosition] = useState<RecitePosition | null>(recite ?? null);
  const [reviewing, setReviewing] = useState(review && !!recite);
  const sameRecite = recite ? positionQuery(recite) : '';
  useEffect(() => {
    setPosition(current => (current ? positionQuery(current) : '') === sameRecite ? current : (recite ?? null));
    setReviewing(review && !!recite);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- follows the URL's recite position, compared by its query
  }, [sameRecite, review]);
  const reciting = !!position;
  const mode = reciting ? 'recite' : 'read';
  const upcoming = position ? nextAyah(position, order) : null;
  /** While reciting, a surah's title and then its basmala are steps of their own before its first ayah (counted as its first words), unless recitation starts at that surah. */
  const titledOn = (index: number): ReadonlyMap<number, number> => new Map(position ? titles[index].filter(([surah]) => `${surah}:1` !== position.start) : []);
  const countsOn = (index: number) => {
    const titled = titledOn(index);
    if (titled.size === 0) return wordCounts[index];
    const counts = { ...wordCounts[index] };
    titled.forEach((steps, surah) => { counts[`${surah}:1`] = (counts[`${surah}:1`] ?? 0) + steps; });
    return counts;
  };
  const upcomingLength = upcoming ? shown.reduce((sum, _, index) => sum + (countsOn(index)[upcoming] ?? 0), 0) : 0;
  const hiddenOn = (index: number) => position
    ? (key: string, word: number) => isHidden(position, key, word + shown.slice(0, index).reduce((sum, _, at) => sum + (countsOn(at)[key] ?? 0), 0), upcoming)
    : undefined;
  const titleSteps = upcoming && upcoming.endsWith(':1') ? Math.max(0, ...shown.map((_, index) => titledOn(index).get(Number(upcoming.split(':')[0])) ?? 0)) : 0;
  const forgotten = useMemo(() => forgottenOrder(Object.keys(forgot)), [forgot]);
  // The surah openings quiz (the app's, owner 2026-11-13): like a review, one ayah at a time.
  const [openings, setOpenings] = useState<Openings | null>(null);
  useEffect(() => {
    if (!openingsOn || !recite) { setOpenings(null); return; }
    try {
      const round = JSON.parse(sessionStorage.getItem(OPENINGS_KEY) ?? 'null') as Openings | null;
      // Back or a reload lands on an earlier surah of the round: the round goes on from there.
      const at = round ? round.keys.indexOf(recite.start) : -1;
      setOpenings(round && at >= 0 ? { ...round, at } : { range: null, keys: [recite.start], at: 0 });
    } catch { setOpenings({ range: null, keys: [recite.start], at: 0 }); }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- follows the URL's recite start
  }, [openingsOn, sameRecite]);
  const quizzing = !!openings && !!position && position.start === openings.keys[openings.at];
  const reviewDone = (reviewing || quizzing) && !!position?.shown;
  // The ayah under review counts even after it is cleared from the list.
  const reviewAt = position ? forgotten.filter(key => compareKeys(key, position.start) < 0).length + 1 : 1;
  const reviewTotal = forgotten.length + (position && !forgotten.includes(position.start) ? 1 : 0);
  const reviewNext = reviewing && position ? nextForgotten(forgotten, position.start) : null;

  // Write mode (the app's, owner 2026-11-13): the next ayah's words stay boxes in their places, and the reader writes its
  // first and last few words, one box each; a full box moves on by itself. The last box shows the ayah, the written words
  // green when right and amber when wrong.
  const [writing, setWriting] = useState(false);
  const [checked, setChecked] = useState<Checked | null>(null);
  const writeKey = writing && upcoming && !reviewDone ? upcoming : null;
  const writeWords = useMemo(() => (writeKey ? groups.flatMap(lines => lines.flatMap(line => line?.filter(group => group.word && `${group.surah}:${group.ayah}` === writeKey).map(group => group.word) ?? [])) : []), [writeKey, groups]);
  // Words already shown (by the next-word button) are not asked.
  const asked = writeKey && position ? wordTargets(writeWords).filter(at => at + titleSteps >= position.words) : [];
  const boxes = useWriteBoxes({ ayah: writeKey, words: writeWords, asked, autoFocus: true, onDone: graded => {
    if (!writeKey || !position) return;
    setChecked({ key: writeKey, ...graded, before: 0 });
    // A mistake puts the ayah on the forgotten shelf (owner, 2026-11-13).
    if (graded.wrong.length) markForgotten(writeKey);
    setPosition(revealAyah(position, writeKey));
  } });
  const { input, typed, current } = boxes;
  // On a phone the keyboard covers the page's lower part: the recite pill rises above it, and the page (kept at its size)
  // moves up just enough to show the box being written (the app scrolls it, #691).
  const [keyboard, setKeyboard] = useState(0);
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!reciting || !writing || !viewport) { setKeyboard(0); return; }
    const measure = () => { const covered = window.innerHeight - viewport.height - viewport.offsetTop; setKeyboard(covered > 80 ? covered : 0); };
    measure();
    viewport.addEventListener('resize', measure);
    viewport.addEventListener('scroll', measure);
    return () => { viewport.removeEventListener('resize', measure); viewport.removeEventListener('scroll', measure); };
  }, [reciting, writing]);
  useLayoutEffect(() => {
    const element = stage.current;
    if (!element) return;
    element.style.transform = '';
    // Flowing text scrolls: the box being written scrolls into the part of the page above the keyboard.
    if (flow) {
      const active = element.querySelector<HTMLElement>('[data-write-active]');
      const box = active?.getBoundingClientRect();
      const room = window.innerHeight - keyboard - 52 - 24;
      if (box && (box.bottom > room || box.top < 0)) element.scrollTop += box.bottom > room ? box.bottom - room : box.top - 16;
      return;
    }
    const box = keyboard ? element.querySelector('[data-write-active]')?.getBoundingClientRect() : null;
    const room = window.innerHeight - keyboard - 52 - 24;
    if (box && box.bottom > room) element.style.transform = `translateY(${room - box.bottom}px)`;
  }, [keyboard, current, writeKey, flow]);
  // Flowing text runs past the screen: the next ayah to recite, or the one selected, scrolls into sight.
  const focusKey = flow ? (position ? upcoming : mark ? `${mark.surah}:${mark.ayah}` : null) : null;
  useEffect(() => {
    const element = stage.current;
    if (!element || !focusKey) return;
    const reveal = () => {
      if (performance.now() - pinchedAt.current < 800) return;
      const word = element.querySelector<HTMLElement>(`[data-ayah="${focusKey}"]`);
      if (!word) return;
      const box = word.getBoundingClientRect();
      const frame = element.getBoundingClientRect();
      const bottom = frame.bottom - (reciting ? 76 : 16);
      // Out of sight, it comes to a third of the way down, with the lines before it above.
      if (box.top < frame.top + 8 || box.bottom > bottom) element.scrollTop += box.top - frame.top - frame.height / 3;
    };
    reveal();
    // Again once the page is set at its size (fonts load, the text is fitted).
    const observer = new ResizeObserver(reveal);
    element.querySelectorAll('section[data-side]').forEach(page => observer.observe(page));
    return () => observer.disconnect();
  }, [focusKey, zoom, reciting]);
  /** The ayah's words on the shown pages before each one, so a box's place counts from the ayah's first word. */
  const before = (index: number, key: string) => shown.slice(0, index).reduce((sum, _, at) => sum + (wordCounts[at][key] ?? 0), 0);
  const toggleWriting = () => {
    setWriting(on => { write(WRITE_KEY, on ? 'off' : 'on'); return !on; });
    setChecked(null);
  };
  const writeOn = (index: number): Write | null => writeKey ? { key: writeKey, targets: asked, typed, current, before: before(index, writeKey), onBox: boxes.pick } : null;
  const checkedOn = (index: number): Checked | null => checked && position ? { ...checked, before: before(index, checked.key) } : null;
  const [actions, setActions] = useState<{ key: string; x: number; y: number } | null>(null);
  const [noting, setNoting] = useState<string | null>(null);
  const [sharing, setSharing] = useState<string | null>(null);
  const surahName = (key: string) => plainName(names[Number(key.split(':')[0])] ?? '').replace(/^سورة\s*/, '') || undefined;
  const [preview, setPreview] = useState<Preview | null>(null);
  const [topic, setTopic] = useState<TopicOpen | null>(null);
  const onTopic = useCallback((surah: number, section: number) => setTopic({ surah, section }), []);
  const notes = useSyncExternalStore(subscribeAyahNotes, readAyahNotes, serverAyahNotes);
  const closeActions = useCallback(() => setActions(null), []);
  /** When the ayah buttons were last closed by a press elsewhere: that press only closes them. */
  const dismissed = useRef(-Infinity);
  const dismissActions = useCallback(() => { dismissed.current = performance.now(); setActions(null); }, []);
  const go = useCallback(
    (step: 1 | -1) => {
      const target = turn(page, two, step);
      if (!(two ? spreadOf(target)[0] !== spreadOf(page)[0] : target !== page)) return;
      // An ayah that runs on past these pages stays hidden on the next one, where its rest is recited.
      const carried = position && step === 1 && position.shown && !endsOn(position.shown) ? { ...position, shown: previousKey(position.shown, ayahCounts), words: 0 } : position;
      const kept = carried && carried.shown && compareKeys(carried.shown, carried.start) < 0 ? { ...carried, shown: null } : carried;
      router.push(`/quran/read/${target}${kept ? `?${positionQuery(kept, reviewing ? { review: '1' } : {})}` : ''}`);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- endsOn and ayahCounts follow `groups` and `surahs`
    [page, two, router, position, reviewing, groups, ayahCounts],
  );
  useEffect(() => { write(LAST_PAGE_KEY, String(page)); }, [page]);
  useEffect(() => { setZoom(settleTextSize(Number(read(TEXT_SIZE_KEY)) || 1)); }, []);
  const sizeTo = useCallback((next: number) => { setZoom(next); write(TEXT_SIZE_KEY, String(next)); }, []);
  // A pinch (two fingers, or a trackpad's pinch, which browsers send as a wheel with ctrl) changes the text size, not the
  // picture: while the fingers move the page is only stretched as a preview, and set again at the new size when they lift.
  const zoomRef = useRef(zoom);
  /** When the last pinch ended: keeping an ayah in sight waits a moment, so it doesn't undo where the pinch left the page. */
  const pinchedAt = useRef(-Infinity);
  zoomRef.current = zoom;
  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    let pinch: { distance: number; page: HTMLElement; x: number; y: number; k: number } | null = null;
    const apart = (event: TouchEvent) => Math.hypot(event.touches[0].clientX - event.touches[1].clientX, event.touches[0].clientY - event.touches[1].clientY);
    const start = (event: TouchEvent) => {
      if (event.touches.length !== 2) return;
      const page = (event.target as Element).closest<HTMLElement>('section[data-side]') ?? element.querySelector<HTMLElement>('section[data-side]');
      if (!page) return;
      const box = page.getBoundingClientRect();
      const x = (event.touches[0].clientX + event.touches[1].clientX) / 2 - box.left;
      const y = (event.touches[0].clientY + event.touches[1].clientY) / 2 - box.top;
      pinch = { distance: apart(event), page, x, y, k: 1 };
      page.style.transformOrigin = `${x}px ${y}px`;
      page.toggleAttribute('data-pinching', true);
    };
    const move = (event: TouchEvent) => {
      if (!pinch || event.touches.length !== 2) return;
      event.preventDefault();
      const from = zoomRef.current;
      pinch.k = Math.min(2.2, Math.max(0.9, (from * apart(event)) / pinch.distance)) / from;
      pinch.page.style.transform = `scale(${pinch.k})`;
    };
    const end = () => {
      if (!pinch) return;
      const { page, k, y } = pinch;
      pinch = null;
      page.style.transform = '';
      page.style.transformOrigin = '';
      page.removeAttribute('data-pinching');
      const next = settleTextSize(zoomRef.current * k);
      if (next === zoomRef.current) return;
      // The words that were between the fingers stay in sight.
      const share = y / Math.max(1, page.offsetHeight);
      const screen = y + page.getBoundingClientRect().top - element.getBoundingClientRect().top;
      pinchedAt.current = performance.now();
      sizeTo(next);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const after = element.querySelector<HTMLElement>('section[data-side]');
        if (!after) return;
        const top = after.getBoundingClientRect().top - element.getBoundingClientRect().top + element.scrollTop;
        element.scrollTop = next > 1 ? top + share * after.offsetHeight - screen : 0;
      }));
    };
    let wheelTimer: ReturnType<typeof setTimeout> | undefined;
    let wheelSize = 0;
    const wheel = (event: WheelEvent) => {
      if (!event.ctrlKey) return;
      event.preventDefault();
      wheelSize = Math.min(2.2, Math.max(1, (wheelSize || zoomRef.current) * Math.exp(-event.deltaY / 100)));
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => { sizeTo(settleTextSize(wheelSize)); wheelSize = 0; }, 120);
    };
    element.addEventListener('touchstart', start, { passive: true });
    element.addEventListener('touchmove', move, { passive: false });
    element.addEventListener('touchend', end);
    element.addEventListener('touchcancel', end);
    element.addEventListener('wheel', wheel, { passive: false });
    return () => {
      clearTimeout(wheelTimer);
      element.removeEventListener('touchstart', start);
      element.removeEventListener('touchmove', move);
      element.removeEventListener('touchend', end);
      element.removeEventListener('touchcancel', end);
      element.removeEventListener('wheel', wheel);
    };
  }, [sizeTo]);
  // Another page opens at its top.
  useLayoutEffect(() => { if (stage.current) stage.current.scrollTop = 0; }, [page]);
  useEffect(() => {
    for (const step of [1, -1] as const) {
      const target = turn(page, two, step);
      if (target !== page) router.prefetch(`/quran/read/${target}`);
    }
  }, [page, two, router]);
  const chooseSpread = useCallback((next: boolean) => {
    setSpread(next);
    write(SPREAD_KEY, next ? 'two' : 'one');
  }, []);
  const hide = (next: boolean) => {
    setHidden(next);
    write(BAR_KEY, next ? 'hidden' : 'shown');
  };

  // The URL keeps the recite position, so a reload or a shared link resumes it; the last one is kept to continue later.
  const query = position ? positionQuery(position, reviewing ? { review: '1' } : quizzing ? { openings: '1' } : {}) : null;
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    const params = new URLSearchParams(window.location.search);
    for (const name of ['recite', 'upto', 'w', 'review', 'write', 'openings']) params.delete(name);
    new URLSearchParams(query ?? '').forEach((value, name) => params.set(name, value));
    const url = `${window.location.pathname}${params.size ? `?${params}` : ''}`;
    if (url !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(window.history.state, '', url);
    if (query && !reviewing && !quizzing) write(LAST_RECITE_KEY, url);
  }, [query, reviewing, quizzing]);
  const startRecite = () => {
    setActions(null);
    // Reciting starts full screen on phones: the app bars and reading tools step aside, as after a page swipe.
    setPhoneTools(false);
    setReviewing(false);
    setPosition({ start: mark ? `${mark.surah}:${mark.ayah}` : order[0], shown: null, words: 0 });
  };
  // The quizzes page's write card: recite from the top of the page with writing on.
  useEffect(() => {
    if (!startWriting || position) return;
    setWriting(true);
    write(WRITE_KEY, 'on');
    setPosition({ start: order[0], shown: null, words: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once, when the page opens with ?write=1
  }, [startWriting]);
  const nextLabel = reviewDone
    ? quizzing ? (ar ? 'السورة التالية' : 'Next surah') : (ar ? 'الآية المنسية التالية' : 'Next forgotten ayah')
    : (ar ? 'أظهر الآية التالية' : 'Reveal the next ayah');
  const stopRecite = () => { setOpenings(null); setActions(null); setReviewing(false); setPosition(null); setChecked(null); input.current?.blur(); };
  const revealNextAyah = () => {
    if (!position) return;
    if (quizzing && position.shown && openings) {
      const next = nextOpening(openings, Math.random);
      try { sessionStorage.setItem(OPENINGS_KEY, JSON.stringify(next)); } catch {}
      const key = next.keys[next.at];
      router.push(`${ayahHref(key)}?recite=${key}&openings=1`);
      return;
    }
    if (reviewing && position.shown) {
      if (reviewNext) router.push(`${ayahHref(reviewNext)}?recite=${reviewNext}&review=1`);
      return;
    }
    if (upcoming && position.words < titleSteps) setPosition({ ...position, words: position.words + 1 });
    else if (upcoming) setPosition(revealAyah(position, upcoming));
    else if ((two ? spreadOf(page)[1] : page) < 604) go(1);
  };
  const revealNextWord = () => {
    if (!position) return;
    if (upcoming && !reviewDone) setPosition(revealWord(position, upcoming, upcomingLength));
    else revealNextAyah();
  };
  const stepBackOne = () => { if (position) { setPosition(stepBack(position, ayahCounts)); setChecked(null); } };
  const ayahText = (key: string) => {
    const words = groups.flatMap(lines => lines.flatMap(line => line?.filter(group => group.word && `${group.surah}:${group.ayah}` === key).map(group => group.word) ?? []));
    return `${words.join(' ')}${endsOn(key) ? '' : ' …'}`;
  };
  const toggleSaved = (key: string) => toggleBookmark({ id: ayahBookmarkId(key), text: ayahText(key), href: ayahHref(key) });
  const openActions = (key: string, element: Element) => {
    const box = element.getBoundingClientRect();
    setActions({ key, x: box.left + box.width / 2, y: box.top });
  };
  const runGesture = (action: GestureAction, target: Element) => {
    const word = target.closest<HTMLElement>('[data-ayah]:not([data-veiled])');
    const key = word?.dataset.ayah;
    if (action === 'tools') {
      if (phone) setPhoneTools(on => !on);
      else if (!rail) hide(!hidden);
    } else if (action === 'next-ayah') revealNextAyah();
    else if (action === 'next-word') revealNextWord();
    else if (action === 'back') stepBackOne();
    else if (key && word && action === 'actions') openActions(key, word);
    else if (key && action === 'forgot') markForgotten(key);
    else if (key && action === 'save') toggleSaved(key);
  };

  useEffect(() => {
    const stored = read(SPREAD_KEY);
    setSpread(stored ? stored === 'two' : !!window.matchMedia?.(WIDE).matches);
    setHidden(read(BAR_KEY) === 'hidden');
    if (!startWriting) setWriting(read(WRITE_KEY) === 'on');
    const query = window.matchMedia?.(PHONE);
    if (!query) return;
    const update = () => setPhone(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- read once on opening; ?write=1 turns writing on itself
  }, []);

  useLayoutEffect(() => {
    const element = frame.current;
    if (!element) return;
    const size = () => {
      element.style.setProperty('--reader-height', `calc(100dvh - var(--app-tabbar, 0px) - ${Math.max(0, element.getBoundingClientRect().top + window.scrollY)}px)`);
    };
    size();
    window.addEventListener('resize', size);
    return () => window.removeEventListener('resize', size);
  }, []);

  /** The ayah the F and B keys act on: the last one revealed while reciting, or the marked one. */
  const keyAyah = position?.shown ?? (mark ? `${mark.surah}:${mark.ayah}` : null);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.isComposing || event.defaultPrevented) return;
      if (event.shiftKey && event.key.startsWith('Arrow')) return;
      // The hidden write field keeps the arrows for turning pages.
      const writeField = event.target === input.current && event.key.startsWith('Arrow');
      if (!writeField && event.target instanceof Element && event.target.closest('input, textarea, select, [popover], dialog[open], [contenteditable]:not([contenteditable="false"])')) return;
      if (event.key === 'ArrowLeft') go(1);
      else if (event.key === 'ArrowRight') go(-1);
      else if (event.key.toLowerCase() === 'd' && !phone) chooseSpread(!spread);
      else if (reciting && (event.key === ' ' || event.key === 'Enter') && !(event.target instanceof Element && event.target.closest('button, a'))) revealNextAyah();
      else if (reciting && event.key.toLowerCase() === 'w') revealNextWord();
      else if (reciting && event.key === 'Backspace') stepBackOne();
      else if (event.key.toLowerCase() === 'f' && keyAyah) markForgotten(keyAyah);
      else if (event.key.toLowerCase() === 'b' && keyAyah) toggleSaved(keyAyah);
      else return;
      event.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const previous = ar ? 'الصفحة السابقة' : 'Previous page';
  const next = ar ? 'الصفحة التالية' : 'Next page';
  const layout = ar ? (two ? 'اعرض صفحة واحدة' : 'اعرض صفحتين') : (two ? 'Show one page' : 'Show two pages');
  const index = ar ? 'فهرس السور' : 'Index of surahs';
  const search = ar ? 'ابحث عن سورة أو آية' : 'Search surahs or ayat';
  const toggleTools = phoneTools ? (ar ? 'إخفاء الأدوات' : 'Hide tools') : (ar ? 'إظهار الأدوات' : 'Show tools');
  const first = (two ? spreadOf(page)[0] : page) === 1;
  const last = (two ? spreadOf(page)[1] : page) === 604;
  const PreviousIcon = ar ? ArrowRight : ArrowLeft;
  const NextIcon = ar ? ArrowLeft : ArrowRight;
  const LayoutIcon = two ? File : BookOpen;
  const { justSwiped } = useSwipe(stage, phone, {
    forward: dx => dx > 0,
    canStep: forward => !(forward ? last : first),
    drag: () => {},
    step: forward => go(forward ? 1 : -1),
    cancel: () => {},
  });
  usePageGestures(stage, {
    onGesture: (gesture, target, mouse) => {
      // With a mouse, reading keeps clicks and double clicks for selecting text; only reciting takes them.
      if (mouse && !reciting && gesture !== 'long') return;
      // While writing, a touch on the page only brings the keyboard back; the boxes pick a word themselves.
      if (writeKey) { input.current?.focus({ preventScroll: true }); return; }
      setActions(null);
      runGesture(gestures[mode][gesture], target);
    },
    waitForDouble: () => gestures[mode].double !== 'none',
    ignore: () => justSwiped() || performance.now() - dismissed.current < 800,
  });
  const reciteLabel = reciting ? (ar ? 'إنهاء التسميع' : 'Stop reciting') : (ar ? 'تسميع: أخفِ الآيات وأظهرها واحدة واحدة' : 'Recite: hide the ayat and reveal them one by one');
  const reciteToggle = <Button size="lg" variant={reciting ? 'primary' : 'muted'} aria-pressed={reciting} onClick={() => (reciting ? stopRecite() : startRecite())} aria-label={reciteLabel} title={reciteLabel}><EyeOff aria-hidden /></Button>;
  const indexAndSearch = <>
    <Button size="lg" variant="muted" popoverTarget={indexId} aria-label={index} title={index}><List aria-hidden /></Button>
    <SwipePanel id={indexId} dir={ar ? 'rtl' : 'ltr'}>
      <nav aria-label={index}>
        <ol>
          {surahs.map(surah => surah.page && <li key={surah.number}>
            <Link prefetch={false} href={`/quran/read/${surah.page}`} className="flex items-baseline gap-3 border-b border-[var(--home-rule)] px-4 py-2 hover:bg-[var(--home-paper-deep)]" onClick={event => event.currentTarget.closest<HTMLElement>('[popover]')?.hidePopover?.()}>
              <span className="w-8 shrink-0 text-sm text-[var(--home-muted)]">{ar ? num(surah.number) : surah.number}</span>
              <span>{ar ? surah.name : surah.nameTransliterated || surah.name}</span>
            </Link>
          </li>)}
        </ol>
      </nav>
    </SwipePanel>
    <Button size="lg" variant="muted" popoverTarget={searchId} aria-label={search} title={search}><Search aria-hidden /></Button>
    <SwipePanel id={searchId} aria-label={search}>
      <SurahIndex surahs={surahs} fontClass={fontClass} onNavigate={() => document.getElementById(searchId)?.hidePopover?.()} />
    </SwipePanel>
  </>;
  return (
    <div ref={frame} data-reader-immersive={!phoneTools} data-reciting={reciting || undefined} data-keyboard={keyboard ? '' : undefined} style={keyboard ? { '--keyboard': `${keyboard}px` } as React.CSSProperties : undefined} dir={ar ? 'rtl' : 'ltr'} lang={ar ? 'ar' : 'en'} className={`${styles.page} ${fontClass ?? ''} ${mushaf.reader} flex flex-col`}>
      {rail && <SettingsHelp label={ar ? 'اختصارات القراءة' : 'Reading shortcuts'}>
        <ul className="space-y-2">
          <li><kbd>←</kbd> <kbd>→</kbd> {ar ? 'لتقليب الصفحات' : 'Turn pages'}</li>
          <li><kbd>D</kbd> {ar ? 'للتبديل بين صفحة وصفحتين' : 'Switch between one and two pages'}</li>
          <li><kbd>Space</kbd> {ar ? 'في التسميع: الآية التالية' : 'Reciting: next ayah'}، <kbd>W</kbd> {ar ? 'الكلمة التالية' : 'next word'}، <kbd>⌫</kbd> {ar ? 'خطوة للخلف' : 'step back'}</li>
          <li><kbd>F</kbd> {ar ? 'نسيتُ آخر آية ظهرت' : 'Forgot the last revealed ayah'}، <kbd>B</kbd> {ar ? 'احفظها' : 'save it'}</li>
        </ul>
      </SettingsHelp>}
      {rail && createPortal(<>
        <Button size="lg" variant="muted" onClick={() => go(-1)} disabled={first} aria-label={previous} title={previous}><PreviousIcon aria-hidden /></Button>
        <Button size="lg" variant="muted" onClick={() => go(1)} disabled={last} aria-label={next} title={next}><NextIcon aria-hidden /></Button>
        {indexAndSearch}
        <Button size="lg" variant="muted" onClick={() => chooseSpread(!spread)} aria-label={layout} title={layout}><LayoutIcon aria-hidden /></Button>
        {reciteToggle}
      </>, rail)}
      {phone && phoneTools && <NavActions>
        {indexAndSearch}
        {reciteToggle}
      </NavActions>}
      {!rail && !phone && (hidden ? (
        <div className="flex justify-end px-3 pt-1">
          <Button size="sm" variant="ghost" onClick={() => hide(false)} aria-expanded={false}>
            <ChevronDown size={16} aria-hidden />
            {ar ? 'إظهار الأدوات' : 'Show tools'}
          </Button>
        </div>
      ) : (
        <nav aria-label={ar ? 'أدوات القراءة' : 'Reading tools'} className={`${mushaf.tools} flex flex-wrap items-center justify-between gap-2 border-b border-[var(--home-rule)] px-3 py-2`}>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={() => go(-1)} disabled={first}>
              <FontAwesomeIcon icon={ar ? faArrowRight : faArrowLeft} aria-hidden />
              <span className="max-sm:sr-only">{previous}</span>
            </Button>
            <Button size="sm" onClick={() => go(1)} disabled={last}>
              <span className="max-sm:sr-only">{next}</span>
              <FontAwesomeIcon icon={ar ? faArrowLeft : faArrowRight} aria-hidden />
            </Button>
            {indexAndSearch}
            {reciteToggle}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Segmented
              label={ar ? 'عدد الصفحات' : 'Pages shown'}
              options={[
                { key: 'one', label: ar ? 'صفحة' : 'One page', current: !spread, onClick: () => chooseSpread(false) },
                { key: 'two', label: ar ? 'صفحتان' : 'Two pages', current: spread, onClick: () => chooseSpread(true) },
              ]}
            />
            <Button size="sm" variant="ghost" onClick={() => hide(true)} aria-expanded>
              <ChevronUp size={16} aria-hidden />
              <span className="max-sm:sr-only">{ar ? 'إخفاء الأدوات' : 'Hide tools'}</span>
            </Button>
          </div>
        </nav>
      ))}
      <article ref={stage} dir="rtl" lang="ar" data-gestures={gestures[mode].long !== 'none' || undefined} data-flow={flow || undefined} className={`${mushaf.stage} ${two ? mushaf.spread : ''}`}>
        {phone && <Button size="sm" variant="muted" className="sr-only focus:not-sr-only focus:absolute focus:bottom-16 focus:z-10" aria-expanded={phoneTools} onClick={() => setPhoneTools(shown => !shown)}>
          {phoneTools ? <ChevronUp size={16} aria-hidden /> : <ChevronDown size={16} aria-hidden />}
          {toggleTools}
        </Button>}
        {shown.map((entry, at) => (
          <MushafPage key={entry.page} page={entry.page} data={entry.data} names={names} top={entry.top} mark={mark} hidden={hiddenOn(at)} titled={titledOn(at)} next={upcoming} forgot={forgot} saved={saved}
            write={writeOn(at)} checked={checkedOn(at)} zoom={zoom} onTopic={onTopic} />
        ))}
      </article>
      {actions && <AyahActions ayah={actions.key} x={actions.x} y={actions.y} ar={ar} forgot={forgot[actions.key]?.forgot ?? 0} saved={saved.has(actions.key)} noted={!!notes[actions.key]} links={links[actions.key]}
        onForgot={() => markForgotten(actions.key)} onClear={() => rememberAyah(actions.key)} onSave={() => toggleSaved(actions.key)} onNote={() => setNoting(actions.key)} onShare={() => setSharing(actions.key)}
        onPreview={kind => setPreview(kind === 'tafsir' ? { kind, key: actions.key } : kind === 'readings' ? { kind, key: actions.key, qiraat: links[actions.key]?.qiraat ?? [] } : { kind, key: actions.key, all: kind === 'trees' ? links[actions.key]?.trees ?? '/quran/branches' : `/quran/compare?a=${actions.key.split(':')[0]}` })} onClose={closeActions} onDismiss={dismissActions} />}
      <AyahPreviewSheet preview={preview} onClose={() => setPreview(null)} />
      <TopicSheet open={topic} onClose={() => setTopic(null)} />
      {noting && <NoteDialog ayah={noting} name={surahName(noting)} ar={ar} onClose={() => setNoting(null)} />}
      {sharing && <AyahShareDialog ayah={sharing} name={surahName(sharing)} note={notes[sharing]?.text} onClose={() => setSharing(null)} />}
      {position && <div className={mushaf.reciteBar}><div className={mushaf.recitePill} dir={ar ? 'rtl' : 'ltr'} role="toolbar" aria-label={ar ? 'أدوات التسميع' : 'Recite tools'}>
        {reviewing && <span className="px-2 text-sm text-[var(--home-muted)]">{ar
          ? `مراجعة ${num(reviewAt)} من ${num(reviewTotal)}`
          : `Review ${reviewAt} of ${reviewTotal}`}</span>}
        {quizzing && openings && <span className="px-2 text-sm text-[var(--home-muted)]" aria-label={ar ? `أوائل السور، السورة ${num(openings.at + 1)} من ${num(openings.keys.length)}` : `Surah openings, ${openings.at + 1} of ${openings.keys.length}`}>{ar
          ? `${num(openings.at + 1)} من ${num(openings.keys.length)}`
          : `${openings.at + 1} of ${openings.keys.length}`}</span>}
        <Button size="lg" variant="muted" aria-label={ar ? 'ارجع خطوة' : 'Step back'} title={ar ? 'ارجع خطوة' : 'Step back'} disabled={atStart(position)} onClick={stepBackOne}><Undo2 aria-hidden /></Button>
        <Button size="lg" variant="muted" aria-label={ar ? 'أظهر الكلمة التالية' : 'Reveal the next word'} title={ar ? 'أظهر الكلمة التالية' : 'Reveal the next word'} disabled={reviewDone} onClick={revealNextWord}>{ar ? <ChevronLeft aria-hidden /> : <ChevronRight aria-hidden />}</Button>
        <Button size="lg" variant="ghost" aria-label={nextLabel} title={nextLabel}
          disabled={reviewDone ? !quizzing && !reviewNext : !upcoming && last} onClick={revealNextAyah}>{reviewDone ? (ar ? <ArrowLeft aria-hidden /> : <ArrowRight aria-hidden />) : ar ? <ChevronsLeft aria-hidden /> : <ChevronsRight aria-hidden />}</Button>
        <Button size="lg" variant={writing ? 'primary' : 'muted'} aria-pressed={writing} aria-label={writing ? (ar ? 'أوقف الكتابة' : 'Stop writing') : (ar ? 'اكتب أول كل آية وآخرها' : 'Write the first and last words of each ayah')}
          title={writing ? (ar ? 'أوقف الكتابة' : 'Stop writing') : (ar ? 'اكتب أول كل آية وآخرها' : 'Write the first and last words of each ayah')} onClick={toggleWriting}><PenLine aria-hidden /></Button>
        <Button size="lg" variant="muted" aria-label={ar ? 'إنهاء التسميع' : 'Stop reciting'} title={ar ? 'إنهاء التسميع' : 'Stop reciting'} onClick={stopRecite}><X aria-hidden /></Button>
      </div></div>}
      {/* The keyboard writes into the box being written; the field itself is out of sight. */}
      {reciting && writing && boxes.field({ 'aria-label': ar ? 'اكتب الكلمة' : 'Write the word' })}
    </div>
  );
}

type ReaderProps = Omit<React.ComponentProps<typeof ReaderView>, 'mark'>;

export function MarkedReaderView(props: ReaderProps) {
  const router = useNavigatingRouter();
  const [surah, ayah] = String(useSearchParams().get('a') ?? '').split(':').map(Number);
  const asked = surah > 0 && ayah > 0;
  const shown = props.pages.find(entry => entry.page === props.page);
  const holds = asked && !!shown && pageGroups(shown.data.items, shown.top).some(line => line?.some(group => group.surah === surah && group.ayah === ayah));
  useEffect(() => {
    if (asked && !holds) router.replace(`/quran/read/ayah/${surah}/${ayah}`);
  }, [asked, holds, surah, ayah, router]);
  const params = useSearchParams();
  return <ReaderView {...props} mark={holds ? { surah, ayah } : undefined} recite={readPosition(params)} review={params.get('review') === '1'} write={params.get('write') === '1'} openings={params.get('openings') === '1'} />;
}
