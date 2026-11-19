import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type ComponentRef } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Text } from '@/ui/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from 'expo-router';
import { ArrowLeft, ArrowLeftRight, BookOpenText, BookOpen, Bookmark, Check, EyeOff, Headphones, Layers, LightbulbOff, ListTree, NotebookPen, History, Play, Pointer, Search, Send, Sparkles, TableOfContents, TextSearch } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { readBookmarks, subscribeBookmarks, toggleBookmark } from '@shared/bookmarks';
import { ayahBookmarkId, ayahHref, clearForgotten, markAyah, markWord, wordMarkKey, readAyahMarks, subscribeAyahMarks, markForgotten, rememberAyah, readDueMarks, subscribeDueMarks } from '@shared/ayahMarks';
import { readAyahNotes, subscribeAyahNotes } from '@shared/ayahNotes';
import { readFasilas, serverFasilas, setQuranFasila, subscribeFasilas } from '@shared/readingMarks';
import { readGestures, type GestureAction } from '@shared/readerGestures';
import { compareKeys, forgottenOrder, isKey, nextForgotten, type RecitePosition } from '@shared/quran/recite';
import TabHint from './TabHint';
import TopBar, { TOP_BAR } from '@/ui/TopBar';
import { TAB_BAR, tabBarBottom, tabBarTop } from '@/ui/tabBarSpace';
import ReaderPager from './ReaderPager';
import MushafPageView, { type Touch, type Write } from './MushafPageView';
import { IndexSheet, type Jump } from './ReaderSheets';
import AyahPreviewSheet, { type Preview } from './AyahPreviewSheet';
import TopicSheet, { type TopicOpen } from './TopicSheet';
import NoteSheet from './NoteSheet';
import WordSheet from './WordSheet';
import IrabSheet, { type IrabTarget } from './IrabSheet';
import BalaghaSheet from './BalaghaSheet';
import GharibSheet, { type GharibTarget } from './GharibSheet';
import TreeIcon from './TreeIcon';
import ActButton from '@/ui/ActButton';
import FloatingMenu from '@/ui/FloatingMenu';
import FasilaIcon from './FasilaIcon';
import { shareAyah } from './AyahShare';
import ListenBar, { LISTEN_BAR } from './ListenBar';
import RecitePill, { RECITE_BAR } from './recite/RecitePill';
import FloatingBar from '@/ui/FloatingBar';
import IconButton from '@/ui/IconButton';
import { useRecite } from './recite/useRecite';
import ListenSheet from './ListenSheet';
import { listen, useListening } from '@/lib/listen';
import { hasQiraat } from '@shared/quran/qiraatData';
import { hasTrees } from '@/lib/branchList';
import { compareTargetsOfAyah } from '@/lib/compare';
import { firstAyahOfPage, PAGES, pageData, pageOfAyah, surahBefore } from '@/lib/mushaf';
import { pageModel, reciteView } from '@shared/quran/recitePage';
import { lemmasAtMushafWord } from '@shared/quran/words';
import { sectionAt, surahTopicsOf } from '@shared/quran/surahTopics';
import { words } from '@/lib/words';
import { isBoolean, isNumberIn, isRecord, readJson, writeJson } from '@/lib/storage';
import { setImmersive } from '@/lib/chrome';
import { buzz } from '@/lib/haptics';
import { useKeyboardHeight } from '@/lib/keyboard';
import { usePageTouch } from '@/lib/usePageTouch';
import { settleZoom } from '@/lib/pageZoom';
import { useIntent } from '@/lib/intent';
import { usePalette } from '@/lib/theme';
import { penRule } from '@/lib/settings';
import { surahName } from '@shared/quran/surahNames';
import { SURAH_TITLES } from '@shared/quran/surahNames';

/** Where the reader was: the page, and the recitation if one was running. Kept so the app opens where it was left. */
const PLACE = 'reader-place';
/** Where the last recitation (not a review) stopped, to continue it later. */
const LAST_RECITE = 'reader-recite-last';
/** `y`: how far down the page the reader had scrolled, when the text is bigger than the printed page. */
type Place = { page: number; position?: RecitePosition | null; reviewing?: boolean; y?: number };
const isPosition = (value: unknown): value is RecitePosition =>
  isRecord(value) && isKey(value.start as string) && (value.shown === null || isKey(value.shown as string)) && isNumberIn(0, Infinity)(value.words) && (value.word === undefined || isNumberIn(0, Infinity)(value.word));
const isPlace = (value: unknown): value is Place =>
  isRecord(value) && isNumberIn(1, PAGES)(value.page) && (value.position == null || isPosition(value.position)) && (value.reviewing === undefined || isBoolean(value.reviewing)) && (value.y === undefined || isNumberIn(-Infinity, Infinity)(value.y));
/** The text size (1 is the printed page), kept on this phone from one visit to the next. */
const ZOOM = 'reader-zoom';
/** Whether recite mode asks to write each ayah's first and last words (on) or only reveals them (off). */
const WRITE = 'reader-write';
const WORD_FORGOT = { ar: 'نسيت الكلمة', en: 'I forgot this word' };
const UNDO_WORD_FORGOT = { ar: 'تراجع', en: 'Undo' };
const UNDO_WORD_NAME = { ar: 'تراجع عن نسيان الكلمة', en: 'Undo forgotten word' };
const AYAH_FORGOT = { ar: 'نسيت الآية', en: 'I forgot this ayah' };
const AYAH_FORGOT_AGAIN = { ar: 'نسيت الآية مجددًا', en: 'I forgot this ayah again' };

const models = new Map<number, ReturnType<typeof pageModel>>();
const modelOf = (page: number) => {
  let model = models.get(page);
  if (!model) models.set(page, (model = pageModel(pageData(page), surahBefore(page))));
  return model;
};

/** «البقرة ٥»: an ayah named as the reader names it, surah first. */
const plainSurah = (key: string) => { const [surah, ayah] = key.split(':').map(Number); return `${surahName(surah)} ${num(ayah)}`; };

/** The 1441 Madinah mushaf, page by page, with recite mode (تسميع) and the forgot and save marks (the website's /quran/read on a phone). */
export default function Reader() {
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  const focused = useIsFocused();
  const place = useMemo(() => readJson(PLACE, isPlace), []);
  const [page, setPage] = useState(() => Math.min(PAGES, Math.max(1, place?.page ?? 1)));
  const [position, setPosition] = useState<RecitePosition | null>(place?.position ?? null);
  const [reviewing, setReviewing] = useState(!!place?.reviewing && !!place?.position);
  const [reciteMenu, setReciteMenu] = useState<{ x: number; y: number } | null>(null);
  /** The selected ayah, and after a long press the word it landed on (its place in the ayah). */
  const [mark, setMark] = useState<{ key: string; page: number; word?: number } | null>(null);
  const [wordLemmas, setWordLemmas] = useState<number[] | null>(null);
  const [irab, setIrab] = useState<IrabTarget | null>(null);
  const [balagha, setBalagha] = useState<string | null>(null);
  const [gharib, setGharib] = useState<GharibTarget | null>(null);
  const [tools, setTools] = useState(false);
  const [sheet, setSheet] = useState<'index' | null>(null);
  const [actions, setActions] = useState<{ key: string; x: number; y: number; lemmas: number[]; word?: number } | null>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [zoom, setZoom] = useState(() => settleZoom(readJson(ZOOM, isNumberIn(0, Infinity)) ?? 1));
  const flowing = zoom > 1;
  /** Each page's drawn height: with bigger text a page runs past the screen and the reader scrolls down it. */
  const [heights, setHeights] = useState<Record<number, number>>({});
  const onHeight = useCallback((at: number, h: number) => setHeights(prev => (Math.abs((prev[at] ?? 0) - h) < 1 ? prev : { ...prev, [at]: h })), []);
  /** After a pinch, the share of the page's height that was between the fingers, and how far below the screen's top. */
  const anchor = useRef<{ share: number; screen: number; from: number } | null>(null);
  /** Until when keeping an ayah in sight waits, so it doesn't undo where a pinch left the page. */
  const quietUntil = useRef(0);
  const allForgot = useSyncExternalStore(subscribeAyahMarks, readAyahMarks);
  const forgot = useSyncExternalStore(subscribeDueMarks, readDueMarks);
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks);
  const notes = useSyncExternalStore(subscribeAyahNotes, readAyahNotes);
  // The reader's فاصلة: a page, set only from the ribbon in the top bar, never by turning pages (owner, 2026-11-16; per page
  // with nothing drawn on the page, 2026-11-17). `reader-place` keeps the page open.
  const fasila = useSyncExternalStore(subscribeFasilas, readFasilas, serverFasilas).quran ?? null;
  const [noting, setNoting] = useState<string | null>(null);
  // Listening (owner's sketch, 2026-11-17): the recitation playing, and the sheet of its range, repeats and reciter.
  const listening = useListening();
  const [listenFrom, setListenFrom] = useState<string | null>(null);
  const [listenOpen, setListenOpen] = useState(false);
  // The page follows the ayah being read, until the reader turns away; «عُد إلى الآية» brings it back.
  const [following, setFollowing] = useState(true);
  const listenPage = listening ? pageOfAyah(listening.key) ?? null : null;
  // Reciting keeps its own place on the pages; the recitation does not move them then.
  useEffect(() => { if (listenPage && following && !position) setPage(listenPage); }, [listenPage, following, position]); // eslint-disable-line react-hooks/exhaustive-deps
  // A new recitation (from the ayah buttons or the sheet) follows again.
  useEffect(() => { if (listening) setFollowing(true); }, [listening?.range]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (!listening) setFollowing(true); }, [listening]);
  const saved = useMemo(() => new Set(bookmarks.filter(item => item.id.startsWith('ayah:')).map(item => item.id.slice(5))), [bookmarks]);
  const forgotten = useMemo(() => forgottenOrder(Object.keys(forgot)), [forgot]);
  const last = useMemo(() => (focused ? readJson(LAST_RECITE, isPlace) : undefined), [focused, position]); // eslint-disable-line react-hooks/exhaustive-deps

  const reciting = !!position;
  const mode = reciting ? 'recite' : 'read';
  const model = modelOf(page);
  // Write mode (owner, 2026-11-13): the next ayah's words stay boxes in their places, and the reader writes what the pen
  // setting asks (recite/useRecite.ts, the one recite mode of the mushaf, the home card and the quiz).
  const [writing, setWriting] = useState(() => readJson(WRITE, isBoolean) ?? false);
  const [pen] = penRule.use();
  // A review asks one ayah at a time: once it shows, nothing more is written until the next one.
  const recite = useRecite({ model, position, setPosition, writing, pen, autoFocus: true,
    until: reviewing ? position?.start ?? null : null,
    onPastEnd: () => {
      if (reviewing) { if (reviewNext) jump({ page: pageOfAyah(markAyah(reviewNext)) ?? page, key: reviewNext, mark: false }, 'review'); }
      else if (page < PAGES) turnTo(page + 1);
    } });
  const { view, boxes, checked, setChecked } = recite;
  const writeKey = recite.write?.key ?? null;
  const keyboard = useKeyboardHeight(reciting && writing);
  const toggleWriting = () => { setWriting(on => { writeJson(WRITE, !on); return !on; }); setChecked(null); boxes.blur(); };
  const write: Write | null = recite.write ? { ...recite.write, onActive: (y, h) => follow.current(y, h) } : null;
  // Scrolls the box being written into the part of the screen above the pill and keyboard.
  const follow = useRef((_y: number, _h: number) => {});

  // The app's bars step aside while reading; a tap brings them back.
  useEffect(() => {
    setImmersive(focused && !tools);
    return () => setImmersive(false);
  }, [focused, tools]);

  // However a recitation starts (the eye's menu, an ayah's menu, the homepage), the bars step aside for it.
  useEffect(() => {
    if (reciting) { setTools(false); setActions(null); }
  }, [reciting]);

  const scrollY = useRef(place?.y ?? 0);
  const keep = () => writeJson(PLACE, { page, position, reviewing, y: flowing ? Math.round(scrollY.current) : 0 } satisfies Place);
  useEffect(() => {
    keep();
    if (position && !reviewing) writeJson(LAST_RECITE, { page, position } satisfies Place);
  }, [page, position, reviewing]); // eslint-disable-line react-hooks/exhaustive-deps

  const turnTo = useCallback((next: number) => {
    setPage(next);
    setActions(null);
  }, []);
  const turnByHand = useCallback((next: number) => { setFollowing(false); turnTo(next); }, [turnTo]);
  const jump = useCallback((to: Jump, recite?: 'review') => {
    setFollowing(false);
    setPage(to.page);
    setActions(null);
    setTools(false);
    setMark(to.mark && !position ? { key: to.key, page: to.page } : null);
    if (recite === 'review') {
      setReviewing(true);
      setPosition({ start: markAyah(to.key), ...(markWord(to.key) !== undefined ? { word: markWord(to.key) } : {}), shown: null, words: 0 });
    } else if (position) {
      // While reciting, a link starts the recitation again from where it leads.
      setReviewing(false);
      setPosition({ start: markAyah(to.key), ...(markWord(to.key) !== undefined ? { word: markWord(to.key) } : {}), shown: null, words: 0 });
    }
  }, [position]);

  // The homepage opens the mushaf at a surah or juz, or starts a recitation.
  useIntent('read', intent => {
    setFollowing(false);
    const to = (intent.at && pageOfAyah(intent.at)) || intent.page || page;
    setPage(to);
    setActions(null);
    setTools(false);
    setReviewing(!!intent.recite && !!intent.review);
    setMark(intent.at && !intent.recite ? { key: intent.at, page: to } : null);
    setPosition(intent.recite ? { start: intent.at ?? modelOf(to).order[0], ...(intent.word !== undefined ? { word: intent.word } : {}), shown: null, words: 0 } : null);
  });

  // The page's start by default; the eye's menu and an ayah's long-press menu pass the ayah (owner, 2026-11-17).
  const startRecite = (from: string = model.order[0]) => {
    setActions(null);
    setTools(false);
    setReviewing(false);
    setMark(null);
    setPosition({ start: from, shown: null, words: 0 });
  };
  const stopRecite = () => { setActions(null); setReviewing(false); setPosition(null); setChecked(null); boxes.blur(); };
  const reviewKey = position ? position.word === undefined ? position.start : wordMarkKey(position.start, position.word) : '';
  const reviewNext = reviewing && position ? nextForgotten(forgotten, reviewKey) : null;
  const reviewAt = position ? forgotten.filter(key => compareKeys(key, reviewKey) < 0).length + 1 : 1;
  const reviewTotal = forgotten.length + (position && !forgotten.includes(reviewKey) ? 1 : 0);

  const revealNextAyah = recite.nextAyah;
  const revealNextWord = recite.nextWord;
  const stepBackOne = recite.back;

  const ayahText = (key: string) => model.lines.flatMap(line => line?.filter(group => group.word && `${group.surah}:${group.ayah}` === key).map(group => group.word) ?? []).join(' ');
  const toggleSaved = (key: string) => toggleBookmark({ id: ayahBookmarkId(key), text: ayahText(key), href: ayahHref(key) });

  const run = (action: GestureAction, key: string | null, x: number, y: number, word?: number) => {
    if (action === 'tools') setTools(on => !on);
    else if (action === 'next-ayah') revealNextAyah();
    else if (action === 'next-word') revealNextWord();
    else if (action === 'back') stepBackOne();
    else if (key && action === 'actions') { buzz(); setActions({ key, x, y, word, lemmas: word === undefined ? [] : lemmasAtMushafWord(words, key, word) }); }
    else if (key && action === 'forgot') markForgotten(position?.start === key && position.word !== undefined ? wordMarkKey(key, position.word) : key);
    else if (key && action === 'save') toggleSaved(key);
  };

  const moved = useRef(0);
  const actionsOpen = useRef(false);
  actionsOpen.current = !!actions;
  const latest = useRef(run);
  latest.current = run;
  const shown = useRef(page);
  shown.current = page;
  const onMove = useCallback(() => {
    moved.current = Date.now();
    // A neighbour about to slide in shows its top where the reader is now, however the page got scrolled there.
    setScrollTop(scrolled.current);
    touches.cancel();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const openIndex = useCallback(() => { setActions(null); setSheet('index'); }, []);
  const writingNow = useRef(false);
  writingNow.current = !!writeKey;
  // While reading, a tap, double tap or long press selects the ayah, and a tap on the page clears it. A second single
  // tap on the marked ayah lets it go (owner, 2026-11-14); it is read once the tap is known not to be a double tap.
  const touches = usePageTouch((gesture, key, x, y, word) => {
    if (mode === 'read') setMark(current => (key && !(gesture === 'tap' && current?.key === key) ? { key, page: shown.current, word: gesture === 'long' ? word : undefined } : null));
    latest.current(readGestures()[mode][gesture], key, x, y, word);
  }, () => readGestures()[mode].double !== 'none');
  const onTouch = useCallback((touch: Touch, key: string | null, x: number, y: number, word?: number) => {
    if (Date.now() - moved.current < 350) return;
    // While writing, a touch on the page only brings the keyboard back; the boxes pick a word themselves.
    if (writingNow.current) { boxes.focus(); return; }
    // A touch that closes the ayah buttons only closes them, as on the website.
    if (actionsOpen.current) { setActions(null); return; }
    touches.touch(touch, key, x, y, word);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // The page always keeps its full size: the recite and listen bars float over it (owner, 2026-11-19), wherever the
  // reader drops them. While writing, the page keeps its size and scrolls above the keyboard (owner, 2026-11-13: no
  // squeezed page), following the box being written.
  const pageInsets = { top: insets.top, bottom: insets.bottom };
  /** What the floating bars stay clear of: the status bar and the top bar above, the keyboard or the tab bar below. */
  const barClear = { top: insets.top + (tools ? TOP_BAR : 0) + 8, bottom: keyboard ? keyboard + 8 : tools ? tabBarTop(insets.bottom) + 8 : tabBarBottom(insets.bottom) };
  const height = size ? size.height - pageInsets.top - pageInsets.bottom : 0;
  const scroller = useRef<ComponentRef<typeof ScrollView>>(null);
  // The scroll view as a gesture-handler gesture, so the pager's swipe and pinch inside it are weighed together with it:
  // without it a zoomed page did not scroll and two fingers on it went to the scroll, not the pinch (owner, 2026-11-17).
  const scrollGesture = useMemo(() => Gesture.Native(), []);
  /** While two fingers pinch, the page holds still, and the scroll they started at is the one the new size is anchored to. */
  const [pinching, setPinching] = useState(false);
  const pinchFrom = useRef(0);
  const onPinch = useCallback((on: boolean) => {
    if (on) pinchFrom.current = scrolled.current;
    setPinching(on);
  }, []);
  const scrolled = useRef(0);
  const scrollTo = (y: number) => { scroller.current?.scrollTo({ y, animated: false }); scrolled.current = y; scrollY.current = y; };
  useEffect(() => { if (!keyboard && !flowing) { scrollTo(0); setScrollTop(0); } }, [keyboard, flowing]); // eslint-disable-line react-hooks/exhaustive-deps
  // With bigger text the row of pages is as tall as the current page; a neighbour sliding in shows its top where the reader is.
  const pagerHeight = flowing ? Math.max(height, heights[page] ?? 0) : height;
  const [scrollTop, setScrollTop] = useState(0);
  const restoring = useRef(flowing && !!place?.y);
  // Another page opens at its top.
  const shownPage = useRef(page);
  useLayoutEffect(() => {
    if (shownPage.current === page) return;
    shownPage.current = page;
    restoring.current = false;
    scrollTo(0);
    setScrollTop(0);
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps
  // Once the page is drawn at its size: back where the reader left it, or after a pinch, the same words under the fingers.
  const drawnHeight = heights[page];
  useEffect(() => {
    if (!drawnHeight) return;
    let y: number | null = null;
    // The first height told is the screen's, before the words are set; the page has its own height once it grows past it.
    if (restoring.current && drawnHeight > height + 1) {
      restoring.current = false;
      y = Math.min(place?.y ?? 0, drawnHeight - height);
    } else if (anchor.current && (!flowing || drawnHeight !== anchor.current.from)) {
      // Only once the page has been set again at the new size.
      const { share, screen } = anchor.current;
      anchor.current = null;
      y = flowing ? Math.max(0, Math.min(drawnHeight - height, share * drawnHeight - screen)) : 0;
    }
    if (y === null) return;
    // A frame later, once the scroll view has grown to the page's new height.
    const frame = requestAnimationFrame(() => { scrollTo(y); setScrollTop(y); });
    return () => cancelAnimationFrame(frame);
  }, [drawnHeight, zoom]); // eslint-disable-line react-hooks/exhaustive-deps
  const zoomTo = useCallback((next: number, focalY: number) => {
    anchor.current = { share: focalY / Math.max(1, pagerHeight), screen: focalY - pinchFrom.current, from: heights[page] ?? 0 };
    restoring.current = false;
    quietUntil.current = Date.now() + 800;
    setZoom(next);
    writeJson(ZOOM, next);
  }, [pagerHeight, heights, page]);
  const onFocus = useCallback((y: number, h: number) => follow.current(y, h), []);
  follow.current = (y, h) => {
    if (!size || (!keyboard && (!flowing || Date.now() < quietUntil.current))) return;
    const top = pageInsets.top + 8;
    // Over the keyboard the recite bar is held just above it, so the box being written stays above the bar too.
    const bottom = keyboard ? size.height - keyboard - RECITE_BAR - 16 : size.height - pageInsets.bottom - 8;
    if (y + h > bottom) scroller.current?.scrollTo({ y: scrolled.current + y + h - bottom + 24, animated: true });
    else if (y < top) scroller.current?.scrollTo({ y: Math.max(0, scrolled.current - (top - y) - 24), animated: true });
  };
  const [topic, setTopic] = useState<TopicOpen | null>(null);
  const jumpToAyah = useCallback((surah: number, ayah: number) => {
    const key = `${surah}:${ayah}`;
    const to = pageOfAyah(key) ?? 1;
    jump({ page: to, key, mark: true });
  }, [jump]);
  const focus = flowing ? (position ? view?.upcoming ?? null : mark?.page === page ? mark.key : null) : null;
  const render = (at: number) => {
    const atModel = modelOf(at);
    return (
      <MushafPageView page={at} data={pageData(at)} model={atModel} palette={palette} width={size?.width ?? 0} height={height}
        zoom={zoom} onHeight={onHeight} focus={at === page ? focus : null} onFocus={onFocus}
        top={surahBefore(at)} names={SURAH_TITLES} mark={!position && mark?.page === at ? mark.key : null} markWord={!position && mark?.page === at ? mark.word ?? null : null}
        recite={position ? reciteView(atModel, position) : null} playing={listening?.key ?? null} forgot={forgot} saved={saved} onTouch={onTouch}
        write={at === page ? write : null} checked={position && at === page ? checked : null} />
    );
  };

  const actionKey = actions?.key;
  const wordKey = actions?.word !== undefined ? wordMarkKey(actions.key, actions.word) : null;
  const forgotCount = actionKey ? (forgot[actionKey]?.forgot ?? 0) : 0;
  // Where else the ayah is: its compare cards, the trees that hold it and its readings, each shown only when there are any.
  const targets = useMemo(() => (actionKey ? compareTargetsOfAyah(actionKey) : []), [actionKey]);
  const trees = useMemo(() => !!actionKey && hasTrees(actionKey), [actionKey]);
  const readings = !!actionKey && hasQiraat(actionKey);
  const [preview, setPreview] = useState<Preview | null>(null);
  // The surah's topics, opened at the section holding the ayah (owner, 2026-11-14: the header names no topic).
  const [actionSurah, actionAyah] = (actionKey ?? '0:0').split(':').map(Number);
  const topics = !!actionKey && !position && !!surahTopicsOf(actionSurah);
  // The long press's menu opens where the finger pressed.
  const actionsAt = actions ? { x: actions.x, y: actions.y } : null;
  return (
    <View style={{ flex: 1, backgroundColor: palette.card }} onLayout={event => setSize({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })}>
      <GestureDetector gesture={scrollGesture}>
      <ScrollView ref={scroller} scrollEnabled={!pinching && (!!keyboard || flowing)} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always" scrollEventThrottle={32}
        onScroll={event => { scrolled.current = event.nativeEvent.contentOffset.y; scrollY.current = scrolled.current; }}
        onScrollBeginDrag={() => { moved.current = Date.now(); touches.cancel(); }}
        onScrollEndDrag={() => { setScrollTop(scrolled.current); keep(); }} onMomentumScrollEnd={() => { setScrollTop(scrolled.current); keep(); }}
        style={{ flex: 1 }} contentContainerStyle={{ paddingTop: pageInsets.top, paddingBottom: keyboard ? keyboard + RECITE_BAR + 24 : pageInsets.bottom }}>
        {size && height > 0 && (
          <ReaderPager page={page} count={PAGES} width={size.width} height={pagerHeight} onPage={turnByHand} onMove={onMove} render={render} onPull={keyboard ? undefined : openIndex} zoom={zoom} onZoom={zoomTo} scrollTop={scrollTop}
            scroll={scrollGesture} onPinch={onPinch} />
        )}
      </ScrollView>
      </GestureDetector>
      {/* Always drawn, so it slides away and back as every bar does (ui/motion) instead of popping. */}
      <View pointerEvents="box-none" style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
          {/* No logo; the buttons at the right edge, under the thumb (owner, 2026-11-17). */}
          <TopBar away={!tools}>
            {/* Search first, at the right edge; the sheet shows the surah list until something is typed (owner, 2026-11-17). */}
            <IconButton Icon={Search} label="فهرس السور والبحث" tone="ink" onPress={() => setSheet('index')} />
            {/* The فاصلة: the ribbon fills on its page; a tap puts it on the page open or takes it off. Filled, not boxed (owner, 2026-11-17). */}
            <Pressable onPress={() => { buzz(); setQuranFasila(fasila?.page === page ? null : { key: firstAyahOfPage(page), page }); }} accessibilityRole="button"
              accessibilityState={{ selected: fasila?.page === page }} accessibilityLabel={fasila?.page === page ? 'أزل الفاصلة من هذه الصفحة' : 'ضع الفاصلة في هذه الصفحة: هنا توقفت'}
              hitSlop={6} style={{ padding: 9 }}>
              <FasilaIcon size={24} color={palette.accent} filled={fasila?.page === page} />
            </Pressable>
            <IconButton Icon={EyeOff} label={reciting ? 'إنهاء التسميع' : 'تسميع: أخفِ الآيات وأظهرها واحدة واحدة'} tone="ink" on={reciting} onPress={() => (reciting ? stopRecite() : setReciteMenu({ x: (size?.width ?? 390) - 122, y: insets.top + 26 }))} />
          </TopBar>
      </View>
      {/* The eye's ways to start reciting, only those that apply (owner, 2026-11-17); they left the index sheet. */}
      {reciteMenu && (
        <FloatingMenu at={reciteMenu} label="ابدأ التسميع" onClose={() => setReciteMenu(null)} palette={palette} overlay>
          <ActButton Icon={EyeOff} label="سمّع من أول الصفحة" name="هذه الصفحة" palette={palette} onPress={() => { setReciteMenu(null); startRecite(); }} />
          {mark?.page === page && <ActButton Icon={Pointer} label="سمّع من الآية المختارة" name="الآية المختارة" palette={palette} onPress={() => { setReciteMenu(null); startRecite(mark!.key); }} />}
          {last?.position && <ActButton Icon={History} label="تابع التسميع من حيث توقفت" name="تابع" palette={palette}
            onPress={() => { setReciteMenu(null); setReviewing(false); setPosition(last.position!); setPage(last.page); }} />}
          {forgotten.length > 0 && <ActButton Icon={LightbulbOff} label="راجع ما نسيت" name="ما نسيت" palette={palette}
            onPress={() => { setReciteMenu(null); jump({ page: pageOfAyah(markAyah(forgotten[0])) ?? page, key: forgotten[0], mark: false }, 'review'); }} />}
        </FloatingMenu>
      )}
      {actions && (
        <FloatingMenu at={actionsAt} label={`الآية ${num(Number(actions.key.split(':')[1]))} من السورة ${num(Number(actions.key.split(':')[0]))}`} onClose={() => setActions(null)} top={pageInsets.top} palette={palette}>
          {/* Listening comes first (owner's sketch, 2026-11-17): from this ayah to its surah's end, with the repeats last set. */}
          <ActButton Icon={Play} label="استمع من هذه الآية" name="استمع" palette={palette} onPress={() => { const key = actions.key; setActions(null); setFollowing(true); listen(key); }} />
          {/* Already reciting: the top bar's eye ends it, so the menu does not offer it again (owner asked, 2026-11-17). */}
          {!reciting && <ActButton Icon={EyeOff} label="سمّع من هذه الآية" name="سمّع" palette={palette} onPress={() => startRecite(actions.key)} />}
          <ActButton Icon={LightbulbOff} label={forgotCount ? AYAH_FORGOT_AGAIN.ar : AYAH_FORGOT.ar} name={AYAH_FORGOT.ar} palette={palette} on={forgotCount > 0} onPress={() => { markForgotten(actions.key); setActions(null); }} />
          {wordKey && <ActButton Icon={LightbulbOff} label={allForgot[wordKey] ? UNDO_WORD_NAME.ar : WORD_FORGOT.ar} name={allForgot[wordKey] ? UNDO_WORD_FORGOT.ar : WORD_FORGOT.ar} palette={palette} on={!!allForgot[wordKey]} onPress={() => { if (allForgot[wordKey]) clearForgotten(wordKey); else markForgotten(wordKey); setActions(null); setMark(null); }} />}
          {forgotCount > 0 && <ActButton Icon={Check} label="تذكّرتها" name="تذكّرتها" palette={palette} color={palette.green} onPress={() => { rememberAyah(actions.key); setActions(null); }} />}
          <ActButton Icon={Bookmark} label={saved.has(actions.key) ? 'أزلها من المحفوظات' : 'احفظ الآية'} name="احفظ" palette={palette} on={saved.has(actions.key)} tint={palette.root} filled onPress={() => { toggleSaved(actions.key); setActions(null); }} />
          <ActButton Icon={NotebookPen} label={notes[actions.key] ? 'تأملك في الآية' : 'اكتب تأملًا'} name="تأمّل" palette={palette} on={!!notes[actions.key]} onPress={() => { setNoting(actions.key); setActions(null); }} />
          {topics && <ActButton Icon={TableOfContents} label="موضوع الآية في السورة" name="الموضوعات" palette={palette}
            onPress={() => { setActions(null); setTopic({ surah: actionSurah, section: Math.max(0, sectionAt(actionSurah, actionAyah)) }); }} />}
          {targets.length > 0 && <ActButton Icon={ArrowLeftRight} label="في المقارنة" name="المقارنة" palette={palette}
            onPress={() => { const key = actions.key; setActions(null); setPreview({ kind: 'compare', key }); }} />}
          {trees && <ActButton Icon={TreeIcon} label="متشابهات الآية" name="المتشابهات" palette={palette} onPress={() => { const key = actions.key; setActions(null); setPreview({ kind: 'trees', key }); }} />}
          {readings && <ActButton Icon={Layers} label="القراءات العشر في كلمات الآية" name="القراءات" palette={palette} onPress={() => { const key = actions.key; setActions(null); setPreview({ kind: 'readings', key }); }} />}
          <ActButton Icon={BookOpen} label="تفسير السعدي" name="التفسير" palette={palette} onPress={() => { const key = actions.key; setActions(null); setPreview({ kind: 'tafsir', key }); }} />
          {/* The pressed word's i'rab (owner, 2026-11-15). */}
          {actions.word !== undefined && <ActButton Icon={ListTree} label="إعراب الكلمة" name="الإعراب" palette={palette}
            onPress={() => { const { key, word } = actions; setActions(null); setIrab({ key, word: word! }); }} />}
          {/* The pressed word's meaning: Ibn Qutaybah on the ayah and al-Raghib on its root, pills between them (owner, 2026-11-18). */}
          {actions.word !== undefined && <ActButton Icon={BookOpenText} label="معنى الكلمة" name="المعنى" palette={palette}
            onPress={() => { const { key, word } = actions; setActions(null); setGharib({ key, word: word! }); }} />}
          {/* The ayah's balagha: al-Itqan's paragraphs and al-Kashshaf's passage, pills between them (owner, 2026-11-16). */}
          <ActButton Icon={Sparkles} label="البلاغة في الآية" name="البلاغة" palette={palette} onPress={() => { const key = actions.key; setActions(null); setBalagha(key); }} />
          {/* The word's places: its label names the long-pressed word, which is lit on the page. */}
          {actions.lemmas.length > 0 && <ActButton Icon={TextSearch} label={`مواضع «${words.lemmas[actions.lemmas[0]][0]}» في القرآن`} name="المواضع" palette={palette}
            onPress={() => { const lemmas = actions.lemmas; setActions(null); setWordLemmas(lemmas); }} />}
          {/* Share is always the last button. */}
          <ActButton Icon={Send} label="مشاركة" name="مشاركة" palette={palette} onPress={() => { const key = actions.key; setActions(null); shareAyah(key, palette, notes[key]?.text); }} />
        </FloatingMenu>
      )}
      {/* The tree and compare buttons preview in place; each item, and the sheet's last button, opens its page (owner, 2026-11-13). */}
      <AyahPreviewSheet preview={preview} onClose={() => setPreview(null)} palette={palette} />
      <TopicSheet open={topic} onClose={() => setTopic(null)} onJump={jumpToAyah} palette={palette} />
      <NoteSheet ayah={noting} onClose={() => setNoting(null)} palette={palette} />
      {/* The word long-pressed: its count and the ayat it is in (owner, 2026-11-13). */}
      <WordSheet lemmas={wordLemmas} onClose={() => setWordLemmas(null)} palette={palette} />
      <IrabSheet target={irab} onClose={() => setIrab(null)} palette={palette} />
      <BalaghaSheet ayah={balagha} onClose={() => setBalagha(null)} palette={palette} />
      <GharibSheet target={gharib} onClose={() => setGharib(null)} palette={palette} />
      {/* The recite bar and the listen bar float over the page, start low near the thumb, and stay wherever they are
          dropped; each folds into a circle (owner, 2026-11-19, ui/FloatingBar). */}
      {position && size && (
        <FloatingBar id="recite" label="أدوات التسميع" Icon={EyeOff} screen={size} clear={barClear} palette={palette}
          start={{ x: size.width / 2, y: size.height - barClear.bottom - RECITE_BAR / 2 }}>
          {fold => (
            <RecitePill recite={recite} writing={writing} onWriting={toggleWriting} onClose={stopRecite} palette={palette} onFold={fold}
              more={reviewing ? !!reviewNext : page < PAGES} after={reviewing ? { Icon: ArrowLeft, label: 'الآية المنسية التالية' } : undefined}
              lead={reviewing ? <Text style={{ color: palette.muted, fontSize: 13, paddingHorizontal: 8 }}>مراجعة {num(reviewAt)} من {num(reviewTotal)}</Text> : null} />
          )}
        </FloatingBar>
      )}
      {listening && size && (
        <FloatingBar id="listen" label="شريط الاستماع" Icon={Headphones} screen={size} clear={barClear} palette={palette}
          start={{ x: size.width / 2, y: size.height - barClear.bottom - LISTEN_BAR / 2 - (reciting ? RECITE_BAR + 8 : 0) }}>
          {fold => <ListenBar width={Math.min(size.width - TAB_BAR.side * 2, 420)} palette={palette} onFold={fold}
            onRepeat={() => { setListenFrom(listening?.key ?? null); setListenOpen(true); }} />}
        </FloatingBar>
      )}
      {/* Back to the ayah being read, under the top bar, out of the way of the bars low on the page. */}
      {listening && listenPage && listenPage !== page && (
        <Pressable onPress={() => { setFollowing(true); setPage(listenPage); setActions(null); }} accessibilityRole="button" accessibilityLabel={`عُد إلى الآية التي تُتلى، ${plainSurah(listening.key)}`}
          style={{ position: 'absolute', alignSelf: 'center', top: barClear.top, height: 36, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, borderRadius: 999, overflow: 'hidden', borderWidth: 1, borderColor: palette.glassEdge }}>
          <BlurView intensity={40} tint={palette.scheme} style={StyleSheet.absoluteFill} />
          <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: palette.glass }]} />
          <Text style={{ color: palette.ink, fontSize: 14 }}>{`عُد إلى الآية · ${plainSurah(listening.key)}`}</Text>
        </Pressable>
      )}
      <ListenSheet open={listenOpen} start={listenFrom} onClose={() => setListenOpen(false)} palette={palette} />
      {/* Back to the فاصلة from any other page, with the bars (a tap), so it never covers the page's last line. */}
      {tools && !position && fasila && fasila.page !== page && (
        <Pressable onPress={() => jump({ page: fasila.page, key: fasila.key, mark: false })} accessibilityRole="button"
          accessibilityLabel={`عد إلى فاصلتك، ${surahName(Number(fasila.key.split(':')[0]))} ${num(Number(fasila.key.split(':')[1]))}`}
          style={{ position: 'absolute', alignSelf: 'center', bottom: tabBarTop(insets.bottom) + 10, height: 40, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, borderRadius: 999, overflow: 'hidden', borderWidth: 1, borderColor: palette.glassEdge }}>
          <BlurView intensity={40} tint={palette.scheme} style={StyleSheet.absoluteFill} />
          <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: palette.glass }]} />
          <View><FasilaIcon size={18} color={palette.accent} /></View>
          <Text style={{ color: palette.ink, fontSize: 15 }}>{`عُد إلى فاصلتك · ${plainSurah(fasila.key)}`}</Text>
        </Pressable>
      )}
      {/* The keyboard writes into the box being written; the field itself is out of sight. */}
      {boxes.field}
      {/* The first visit's tip names the reading touches, so it waits out recite mode, and steps aside while an ayah's buttons are open. */}
      <TabHint id="read" palette={palette} hidden={reciting || !!actions || !!listening} />
      <IndexSheet open={sheet === 'index'} onClose={() => setSheet(null)} onJump={jump} palette={palette} page={page} recite={reciting} />
    </View>
  );
}
