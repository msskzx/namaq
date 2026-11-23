import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type ComponentRef } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { BlurView } from 'expo-blur';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Text } from '@/ui/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from 'expo-router';
import { ArrowLeft, EyeOff, Headphones, Lightbulb, LightbulbOff, History, Pointer, Search } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { readBookmarks, subscribeBookmarks, toggleBookmark } from '@shared/bookmarks';
import { ayahBookmarkId, ayahHref, markAyah, wordMarkKey, markForgotten, toggleForgotten, rememberAyah, readDueMarks, subscribeDueMarks } from '@shared/ayahMarks';
import { readAyahNotes, subscribeAyahNotes } from '@shared/ayahNotes';
import { readFasilas, serverFasilas, setQuranFasila, subscribeFasilas } from '@shared/readingMarks';
import { readGestures, type Gesture as Touching, type GestureAction } from '@shared/readerGestures';
import { forgotToggle, inSelection, isForgotten, isPhrase, selectedText, selectionOf, wordKeys, type Selection } from '@shared/quran/selection';
import { compareKeys, forgottenAyat, isKey, nextInReview, reviewedBefore, reviewPosition, type RecitePosition } from '@shared/quran/recite';
import TabHint from './TabHint';
import TopBar, { TOP_BAR } from '@/ui/TopBar';
import { TAB_BAR, tabBarBottom, tabBarTop } from '@/ui/tabBarSpace';
import ReaderPager from './ReaderPager';
import MushafPageView, { type Touch, type Write } from './MushafPageView';
import { IndexSheet, type Jump } from './ReaderSheets';
import BulbPop, { type Pop } from '@/ui/BulbPop';
import AyahPreviewSheet, { type Preview } from './AyahPreviewSheet';
import TopicSheet, { type TopicOpen } from './TopicSheet';
import NoteSheet from './NoteSheet';
import WordSheet from './WordSheet';
import IrabSheet, { type IrabTarget } from './IrabSheet';
import BalaghaSheet from './BalaghaSheet';
import GharibSheet, { type GharibTarget } from './GharibSheet';
import ActButton, { type ButtonBox } from '@/ui/ActButton';
import FloatingMenu from '@/ui/FloatingMenu';
import { ayahMenuGroups, useAyahMenuFacts } from './AyahMenu';
import FasilaIcon from './FasilaIcon';
import { shareAyah } from './AyahShare';
import ListenBar, { LISTEN_BAR } from './ListenBar';
import RecitePill, { RECITE_BAR } from './recite/RecitePill';
import FloatingBar from '@/ui/FloatingBar';
import IconButton from '@/ui/IconButton';
import { useRecite } from './recite/useRecite';
import ListenSheet from './ListenSheet';
import { listen, useListening } from '@/lib/listen';
import { firstAyahOfPage, PAGES, pageData, pageOfAyah, surahBefore } from '@/lib/mushaf';
import { spreadOf } from '@shared/quran/readerPage';
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
import { mushafSpread, penRule } from '@/lib/settings';
import { isWide } from '@/ui/column';
import { surahName } from '@shared/quran/surahNames';
import { SURAH_TITLES } from '@shared/quran/surahNames';

/** Where the reader was: the page, and the recitation if one was running. Kept so the app opens where it was left. */
const PLACE = 'reader-place';
/** Where the last recitation (not a review) stopped, to continue it later. */
const LAST_RECITE = 'reader-recite-last';
/** `y`: how far down the page the reader had scrolled, when the text is bigger than the printed page. */
type Place = { page: number; position?: RecitePosition | null; reviewing?: boolean; reviewFrom?: string; y?: number };
const isPosition = (value: unknown): value is RecitePosition =>
  isRecord(value) && isKey(value.start as string) && (value.shown === null || isKey(value.shown as string)) && isNumberIn(0, Infinity)(value.words) && (value.gaps === undefined || (Array.isArray(value.gaps) && value.gaps.every(isNumberIn(0, Infinity))));
const isPlace = (value: unknown): value is Place =>
  isRecord(value) && isNumberIn(1, PAGES)(value.page) && (value.position == null || isPosition(value.position)) && (value.reviewing === undefined || isBoolean(value.reviewing)) && (value.reviewFrom === undefined || isKey(value.reviewFrom as string)) && (value.y === undefined || isNumberIn(-Infinity, Infinity)(value.y));
/** The text size (1 is the printed page), kept on this phone from one visit to the next. */
const ZOOM = 'reader-zoom';
/** Whether recite mode asks to write each ayah's first and last words (on) or only reveals them (off). */
const WRITE = 'reader-write';

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
  /** Where «ما نسيت» began, at the page open (owner, 2026-11-21): the review wraps round to it. Unset, it began at the first. */
  const [reviewFrom, setReviewFrom] = useState(place?.reviewFrom ?? null);
  useEffect(() => { if (!reviewing) setReviewFrom(null); }, [reviewing]);
  const [reciteMenu, setReciteMenu] = useState<{ x: number; y: number } | null>(null);
  /** The selected ayah, and after a long press the words it selected (their places in the ayah). */
  const [mark, setMark] = useState<{ key: string; page: number; words?: { from: number; to: number } } | null>(null);
  const [wordLemmas, setWordLemmas] = useState<number[] | null>(null);
  const [irab, setIrab] = useState<IrabTarget | null>(null);
  const [balagha, setBalagha] = useState<string | null>(null);
  const [gharib, setGharib] = useState<GharibTarget | null>(null);
  const [tools, setTools] = useState(false);
  const [sheet, setSheet] = useState<'index' | null>(null);
  /**
   * The long press's menu (owner, 2026-11-19): the ayah's actions, and with a pressed word a tab to the word's own (or the
   * words' own, once the finger dragged over more after the long press). `holding` while the finger that pressed is still
   * down, so the page holds still for the drag; `dragging` once it reached another word, so the menu steps aside.
   */
  const [actions, setActions] = useState<{ key: string; x: number; y: number; lemmas: number[]; words?: Selection; holding?: boolean; dragging?: boolean;
    /** The «نسيت» bubble open over its button. */
    bubble?: ButtonBox } | null>(null);
  const [phrase, setPhrase] = useState<string | null>(null);
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
  const forgotten = useMemo(() => forgottenAyat(Object.keys(forgot)), [forgot]);
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
  const keep = () => writeJson(PLACE, { page, position, reviewing, ...(reviewFrom ? { reviewFrom } : {}), y: flowing ? Math.round(scrollY.current) : 0 } satisfies Place);
  useEffect(() => {
    keep();
    if (position && !reviewing) writeJson(LAST_RECITE, { page, position } satisfies Place);
  }, [page, position, reviewing, reviewFrom]); // eslint-disable-line react-hooks/exhaustive-deps

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
      setPosition(reviewPosition(to.key, readDueMarks()));
    } else if (position) {
      // While reciting, a link starts the recitation again from where it leads.
      setReviewing(false);
      setPosition(reviewPosition(to.key));
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
    setPosition(!intent.recite ? null : intent.at
      ? reviewPosition(intent.word !== undefined ? wordMarkKey(intent.at, intent.word) : intent.at, intent.review ? readDueMarks() : {})
      : { start: modelOf(to).order[0], shown: null, words: 0 });
  });

  // The page's start by default; the eye's menu and an ayah's long-press menu pass the ayah (owner, 2026-11-17).
  const startRecite = (from: string = model.order[0]) => {
    setActions(null);
    setTools(false);
    setReviewing(false);
    setMark(null);
    setPosition({ start: from, shown: null, words: 0 });
  };
  // The bar's reset (owner, 2026-11-20): the whole page hidden again, recited from its first ayah, without leaving recite mode.
  const restartPage = () => { setActions(null); setReviewing(false); setChecked(null); setPosition({ start: model.order[0], shown: null, words: 0 }); };
  const stopRecite = () => { setActions(null); setReviewing(false); setPosition(null); setChecked(null); boxes.blur(); };
  // A review stops at each forgotten ayah once, with all its forgotten words (owner, 2026-11-21).
  const reviewKey = position?.start ?? '';
  const from = reviewFrom ?? forgotten[0] ?? reviewKey;
  const reviewNext = reviewing && position ? nextInReview(forgotten, reviewKey, from) : null;
  const reviewAt = position ? reviewedBefore(forgotten, reviewKey, from) + 1 : 1;
  const reviewTotal = forgotten.length + (position && !forgotten.includes(reviewKey) ? 1 : 0);

  const revealNextAyah = recite.nextAyah;
  const revealNextWord = recite.nextWord;
  const stepBackOne = recite.back;

  // An ayah's own page: with two pages open it may be the left one, not the page the reader is on.
  const modelAt = (key: string) => modelOf(pageOfAyah(key) ?? page);
  const ayahText = (key: string) => modelAt(key).lines.flatMap(line => line?.filter(group => group.word && `${group.surah}:${group.ayah}` === key).map(group => group.word) ?? []).join(' ');
  /** The ayah's words by their place in it, the ۞ sign not counted (the places a selection counts). */
  const ayahWords = (key: string) => modelAt(key).lines.flatMap(line => line?.filter(group => group.word && group.word !== '۞' && `${group.surah}:${group.ayah}` === key).map(group => group.word) ?? []);
  const toggleSaved = (key: string) => toggleBookmark({ id: ayahBookmarkId(key), text: ayahText(key), href: ayahHref(key) });

  // The gesture's mark pops where the finger was (owner, 2026-11-21), like the heart on a double tap.
  const [pop, setPop] = useState<Pop | null>(null);
  /** The reader's top on the screen: a touch's page y less it is where the pop goes. */
  const root = useRef<ComponentRef<typeof View>>(null);
  const origin = useRef(0);
  const popAt = (x: number, y: number, kind: Pop['kind'], on: boolean) => setPop(was => ({ id: (was?.id ?? 0) + 1, x, y: y - origin.current, kind, on }));
  const run = (action: GestureAction, key: string | null, x: number, y: number, word?: number, gesture?: Touching) => {
    if (action === 'tools') setTools(on => !on);
    else if (action === 'next-ayah') revealNextAyah();
    else if (action === 'next-word') revealNextWord();
    else if (action === 'back') stepBackOne();
    else if (key && action === 'actions') {
      buzz();
      setActions({ key, x, y, holding: gesture === 'long' && word !== undefined, ...(word === undefined ? { lemmas: [] } : { words: selectionOf(key, word), lemmas: lemmasAtMushafWord(words, key, word) }) });
    }
    else if (key && action === 'forgot') popAt(x, y, 'forgot', toggleForgotten(position?.start === key && position.gaps ? position.gaps.map(word => wordMarkKey(key, word)) : key));
    else if (key && action === 'save') popAt(x, y, 'save', toggleSaved(key));
  };

  const moved = useRef(0);
  const actionsOpen = useRef(false);
  actionsOpen.current = !!actions;
  const actionsNow = useRef(actions);
  actionsNow.current = actions;
  // The finger that long-pressed a word drags over its ayah's words: they are selected, and the menu opens again where it lifts
  // on their own actions (owner, 2026-11-19).
  const onSelect = useCallback((key: string, anchor: number, now: number, x: number, y: number, done: boolean) => {
    const current = actionsNow.current;
    if (!current || current.key !== key || !current.holding) return;
    const picked = selectionOf(key, anchor, now);
    const dragged = !!current.dragging || picked.to > picked.from;
    const lemmas = picked.to > picked.from ? [] : lemmasAtMushafWord(words, key, picked.from);
    setActions(done
      ? { ...current, words: picked, lemmas, holding: false, dragging: false, ...(dragged ? { x, y } : {}) }
      : { ...current, words: picked, lemmas, dragging: dragged });
    setMark(was => (was?.key === key ? { ...was, words: { from: picked.from, to: picked.to } } : was));
  }, []);
  const latest = useRef(run);
  latest.current = run;
  const shown = useRef(page);
  const spreadNow = useRef(false);
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
    // Selected words with their menu open (owner, 2026-11-21): a tap on them closes the menu, and a double tap does the
    // double tap's action on just those words (forgot marks or rests them), then closes it.
    const open = actionsNow.current;
    if (open?.words && inSelection(open.words, key, word)) {
      setActions(null);
      const action = readGestures()[mode].double;
      if (gesture !== 'double') return;
      if (action === 'forgot') { buzz(); popAt(x, y, 'forgot', toggleForgotten(wordKeys(open.words))); }
      else latest.current(action, key, x, y, word, gesture);
      return;
    }
    // With two pages open, the page touched becomes the page the reader is on: the فاصلة, reciting and the place kept follow it.
    const touched = key ? pageOfAyah(key) : undefined;
    if (touched && touched !== shown.current && spreadNow.current) setPage(touched);
    if (mode === 'read') setMark(current => (key && !(gesture === 'tap' && current?.key === key) ? { key, page: pageOfAyah(key) ?? shown.current, ...(gesture === 'long' && word !== undefined ? { words: { from: word, to: word } } : {}) } : null));
    latest.current(readGestures()[mode][gesture], key, x, y, word, gesture);
  }, () => readGestures()[mode].double !== 'none');
  const onTouch = useCallback((touch: Touch, key: string | null, x: number, y: number, word?: number) => {
    if (Date.now() - moved.current < 350) return;
    // While writing, a touch on the page only brings the keyboard back; the boxes pick a word themselves.
    if (writingNow.current) { boxes.focus(); return; }
    // A touch that closes the ayah buttons only closes them, as on the website, except a tap on the selected words: it may be
    // the first of a double tap on them.
    if (actionsOpen.current && !(touch !== 'long' && inSelection(actionsNow.current?.words, key, word) && readGestures()[mode].double !== 'none')) { setActions(null); return; }
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
  // What the page lights: the selected ayah while reading; while reciting, the ayah (and words) a long press opened the
  // menu on, as the website does (owner, 2026-11-20: a selection drew nothing in recite mode).
  const selected = position ? (actions ? { key: actions.key, page: pageOfAyah(actions.key) ?? page, words: actions.words } : null) : mark;
  // Lying down on a tablet, two facing pages, the odd one on the right (owner, 2026-11-23); a page turn turns both. Bigger
  // text, which reflows and scrolls, and reciting, which walks one page's ayat, keep one page.
  const [spreadOn] = mushafSpread.use();
  const spread = spreadOn && !!size && isWide(size.width, size.height) && !flowing && !reciting;
  spreadNow.current = spread;
  const pageView = (at: number, width: number) => {
    const atModel = modelOf(at);
    return (
      <MushafPageView page={at} data={pageData(at)} model={atModel} palette={palette} width={width} height={height}
        zoom={zoom} onHeight={onHeight} focus={at === page ? focus : null} onFocus={onFocus}
        top={surahBefore(at)} names={SURAH_TITLES} mark={selected?.page === at ? selected.key : null} markWords={selected?.page === at ? selected.words ?? null : null}
        recite={position ? reciteView(atModel, position) : null} playing={listening?.key ?? null} forgot={forgot} saved={saved} onTouch={onTouch} onSelect={onSelect}
        write={at === page ? write : null} checked={position && at === page ? checked : null} />
    );
  };
  const render = (at: number) => {
    const width = size?.width ?? 0;
    if (!spread) return pageView(at, width);
    // The pager's pages are spreads here; its direction is right to left, so the first of the row (the odd page) sits on the right.
    return (
      <View style={{ flexDirection: 'row', width, height }}>
        {spreadOf(at * 2 - 1).map(one => <View key={one} style={{ width: width / 2 }}>{pageView(one, width / 2)}</View>)}
      </View>
    );
  };

  const actionKey = actions?.key;
  // With two pages open, the ribbon is filled when the فاصلة is on either.
  const fasilaHere = !!fasila && (spread ? spreadOf(page).includes(fasila.page) : fasila.page === page);
  // «نسيت» is one bulb toggle (owner, 2026-11-19): forgotten while due for review, and a tap then rests it. With a word lit
  // (long pressed, or dragged over) it opens a bubble with a bulb for the ayah and one for the lit words, each its own blank.
  const lit = actions?.words;
  const litKeys = lit ? wordKeys(lit) : [];
  const litText = actions && lit ? selectedText(ayahWords(actions.key), lit) : '';
  const ayahForgot = !!actionKey && !!forgot[actionKey];
  const litForgot = isForgotten(litKeys, forgot);
  const toggleForgot = (keys: string[]) => {
    const { rest, forget } = forgotToggle(keys, forgot);
    for (const key of rest) rememberAyah(key);
    for (const key of forget) markForgotten(key);
  };
  // «نسخ» copies the whole ayah, with its place (owner, 2026-11-19: no copying a word).
  const copyAyah = (key: string) => { setActions(null); void Clipboard.setStringAsync(`«${ayahText(key)}»\n${plainSurah(key)}`); };
  const openBubble = (box: ButtonBox) => setActions(was => was && { ...was, bubble: was.bubble ? undefined : box });
  // Where else the ayah is: its compare cards, the trees that hold it and its readings, each shown only when there are any.
  const facts = useAyahMenuFacts(actionKey);
  const [preview, setPreview] = useState<Preview | null>(null);
  // The surah's topics, opened at the section holding the ayah (owner, 2026-11-14: the header names no topic).
  const [actionSurah, actionAyah] = (actionKey ?? '0:0').split(':').map(Number);
  const topics = !!actionKey && !position && !!surahTopicsOf(actionSurah);
  // The long press's menu opens where the finger pressed.
  const actionsAt = actions && !actions.dragging ? { x: actions.x, y: actions.y } : null;
  return (
    <View ref={root} style={{ flex: 1, backgroundColor: palette.card }} onLayout={event => { setSize({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height }); root.current?.measureInWindow((_x: number, y: number) => { origin.current = y; }); }}>
      <GestureDetector gesture={scrollGesture}>
      <ScrollView ref={scroller} scrollEnabled={!pinching && !actions?.holding && (!!keyboard || flowing)} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always" scrollEventThrottle={32}
        onScroll={event => { scrolled.current = event.nativeEvent.contentOffset.y; scrollY.current = scrolled.current; }}
        onScrollBeginDrag={() => { moved.current = Date.now(); touches.cancel(); }}
        onScrollEndDrag={() => { setScrollTop(scrolled.current); keep(); }} onMomentumScrollEnd={() => { setScrollTop(scrolled.current); keep(); }}
        style={{ flex: 1 }} contentContainerStyle={{ paddingTop: pageInsets.top, paddingBottom: keyboard ? keyboard + RECITE_BAR + 24 : pageInsets.bottom }}>
        {size && height > 0 && (
          <ReaderPager key={spread ? 'spread' : 'page'} page={spread ? Math.ceil(page / 2) : page} count={spread ? Math.ceil(PAGES / 2) : PAGES} width={size.width} height={pagerHeight} onPage={spread ? at => turnByHand(at * 2 - 1) : turnByHand} onMove={onMove} render={render} onPull={keyboard ? undefined : openIndex} zoom={zoom} onZoom={zoomTo} scrollTop={scrollTop}
            scroll={scrollGesture} onPinch={onPinch} hold={!!actions?.holding} />
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
            <Pressable onPress={() => { buzz(); setQuranFasila(fasilaHere ? null : { key: firstAyahOfPage(page), page }); }} accessibilityRole="button"
              accessibilityState={{ selected: fasilaHere }} accessibilityLabel={fasilaHere ? 'أزل الفاصلة من هذه الصفحة' : 'ضع الفاصلة في هذه الصفحة: هنا توقفت'}
              hitSlop={6} style={{ padding: 9 }}>
              <FasilaIcon size={24} color={palette.accent} filled={fasilaHere} />
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
            onPress={() => {
              setReciteMenu(null);
              // From the page open (owner, 2026-11-21): its first forgotten ayah, or the next one after it, wrapping to the first.
              const first = forgotten.find(key => (pageOfAyah(key) ?? 0) >= page) ?? forgotten[0];
              jump({ page: pageOfAyah(first) ?? page, key: first, mark: false }, 'review');
              setReviewFrom(first);
            }} />}
        </FloatingMenu>
      )}
      {actions && (
        <FloatingMenu at={actionsAt} label={`الآية ${num(actionAyah)} من السورة ${num(actionSurah)}`} onClose={() => setActions(null)} top={pageInsets.top} palette={palette}
          // Three groups, a thin line between them and no titles (owner, 2026-11-19): the reader's own actions, the Quran's, sending.
          groups={ayahMenuGroups(facts, {
            listen: () => { const key = actions.key; setActions(null); setFollowing(true); listen(key); },
            recite: reciting ? undefined : () => startRecite(actions.key),
            forgot: lit
              ? { on: ayahForgot || litForgot, label: 'نسيت: الآية أو ما أضاءته', expanded: !!actions.bubble, onPressAt: openBubble }
              : { on: ayahForgot, onPress: () => toggleForgot([actions.key]) },
            save: { on: saved.has(actions.key), onPress: () => { toggleSaved(actions.key); setActions(null); } },
            note: { on: !!notes[actions.key], onPress: () => { setNoting(actions.key); setActions(null); } },
            tafsir: () => { const key = actions.key; setActions(null); setPreview({ kind: 'tafsir', key }); },
            irab: lit ? () => { const key = actions.key; setActions(null); setIrab({ key, word: lit.from }); } : undefined,
            meaning: lit ? () => { const key = actions.key; setActions(null); setGharib({ key, word: lit.from }); } : undefined,
            balagha: () => { const key = actions.key; setActions(null); setBalagha(key); },
            readings: () => { const key = actions.key; setActions(null); setPreview({ kind: 'readings', key }); },
            trees: () => { const key = actions.key; setActions(null); setPreview({ kind: 'trees', key }); },
            compare: () => { const key = actions.key; setActions(null); setPreview({ kind: 'compare', key }); },
            // The lit word's places, or the dragged words' as one phrase in the search.
            places: lit && isPhrase(lit)
              ? { label: `مواضع «${litText}» في القرآن`, onPress: () => { setActions(null); setPhrase(litText); setSheet('index'); } }
              : actions.lemmas.length > 0 ? { label: `مواضع «${words.lemmas[actions.lemmas[0]][0]}» في القرآن`, onPress: () => { const lemmas = actions.lemmas; setActions(null); setWordLemmas(lemmas); } } : undefined,
            topics: topics ? () => { setActions(null); setTopic({ surah: actionSurah, section: Math.max(0, sectionAt(actionSurah, actionAyah)) }); } : undefined,
            copy: () => copyAyah(actions.key),
            share: () => { const key = actions.key; setActions(null); shareAyah(key, palette, notes[key]?.text); },
          }, palette)} />
      )}
      {/* The bubble over «نسيت», as a chat app's reactions (owner, 2026-11-19): the ayah, or the lit words. */}
      {actions?.bubble && lit && !actions.dragging && (
        <FloatingMenu bubble at={{ x: actions.bubble.x + actions.bubble.width / 2, y: actions.bubble.y }} span={actions.bubble.height}
          label="ما نسيت" onClose={() => setActions(was => was && { ...was, bubble: undefined })} top={pageInsets.top} palette={palette}>
          <ActButton wide Icon={ayahForgot ? LightbulbOff : Lightbulb} label={ayahForgot ? 'تذكّرت الآية' : 'نسيت الآية'} name="الآية" palette={palette} on={ayahForgot} onPress={() => toggleForgot([actions.key])} />
          <ActButton wide Icon={litForgot ? LightbulbOff : Lightbulb} label={`${litForgot ? 'تذكّرت' : 'نسيت'} «${litText}»`} quran name={litText} palette={palette} on={litForgot} onPress={() => toggleForgot(litKeys)} />
        </FloatingMenu>
      )}
      {/* The tree and compare buttons preview in place; each item, and the sheet's last button, opens its page (owner, 2026-11-13). */}
      <AyahPreviewSheet preview={preview} onClose={() => setPreview(null)} palette={palette} />
      <BulbPop pop={pop} palette={palette} />
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
            <RecitePill recite={recite} writing={writing} onWriting={toggleWriting} onClose={stopRecite} onRestart={reviewing ? undefined : restartPage} palette={palette} onFold={fold}
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
      <IndexSheet open={sheet === 'index'} query={phrase} onClose={() => { setSheet(null); setPhrase(null); }} onJump={jump} palette={palette} page={page} recite={reciting} />
    </View>
  );
}
