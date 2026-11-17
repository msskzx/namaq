import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type ComponentRef } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Text } from '@/components/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from 'expo-router';
import { ArrowLeft, ArrowLeftRight, BookOpen, Bookmark, Check, ChevronLeft, ChevronsLeft, EyeOff, Layers, LightbulbOff, List, ListTree, NotebookPen, PenLine, Play, Send, Sparkles, TableOfContents, TextSearch, Undo2, X, type LucideProps } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { plainName } from '@shared/quran/normalize';
import { readBookmarks, subscribeBookmarks, toggleBookmark } from '@shared/bookmarks';
import { ayahBookmarkId, ayahHref, markForgotten, rememberAyah, readDueMarks, subscribeDueMarks } from '@shared/ayahMarks';
import { readAyahNotes, subscribeAyahNotes } from '@shared/ayahNotes';
import { readFasilas, serverFasilas, setQuranFasila, subscribeFasilas } from '@shared/readingMarks';
import { readGestures, type GestureAction } from '@shared/readerGestures';
import { atStart, compareKeys, forgottenOrder, nextForgotten, revealAyah, stepBack, type RecitePosition } from '@shared/quran/recite';
import { wordTargets } from '@shared/quran/writeAyah';
import { useWriteBoxes } from '@/lib/useWriteBoxes';
import { nextOpening, openingRound, type Openings } from '@shared/quran/openings';
import TabHint from './TabHint';
import TopBar from './TopBar';
import { TAB_BAR, tabBarBottom, tabBarTop } from './tabBarSpace';
import ReaderPager from './ReaderPager';
import MushafPageView, { type Checked, type Touch, type Write } from './MushafPageView';
import { IndexSheet, type Jump } from './ReaderSheets';
import AyahPreviewSheet, { type Preview } from './AyahPreviewSheet';
import TopicSheet, { type TopicOpen } from './TopicSheet';
import NoteSheet from './NoteSheet';
import WordSheet from './WordSheet';
import IrabSheet, { type IrabTarget } from './IrabSheet';
import BalaghaSheet from './BalaghaSheet';
import TreeIcon from './TreeIcon';
import ActButton, { ACT_WIDTH } from './ActButton';
import FasilaIcon from './FasilaIcon';
import { shareAyah } from './AyahShare';
import ListenBar, { LISTEN_BAR } from './ListenBar';
import ListenSheet from './ListenSheet';
import { listen, useListening } from '@/lib/listen';
import { hasQiraat } from '@shared/quran/qiraatData';
import { hasTrees } from '@/lib/branchList';
import { compareTargetsOfAyah } from '@/lib/compare';
import { ayahCounts, PAGES, pageData, pageOfAyah, surahBefore, surahNames } from '@/lib/mushaf';
import { pageModel, reciteView } from '@shared/quran/recitePage';
import { lemmasAtMushafWord } from '@shared/quran/words';
import { sectionAt, surahTopicsOf } from '@shared/quran/surahTopics';
import { words } from '@/lib/words';
import { readJson, writeJson } from '@/lib/storage';
import { setImmersive } from '@/lib/chrome';
import { buzz } from '@/lib/haptics';
import { useKeyboardHeight } from '@/lib/keyboard';
import { usePageTouch } from '@/lib/usePageTouch';
import { settleZoom } from '@/lib/pageZoom';
import { useIntent } from '@/lib/intent';
import { usePalette, type Palette } from '@/lib/theme';

/** Where the reader was: the page, and the recitation if one was running. Kept so the app opens where it was left. */
const PLACE = 'reader-place';
/** Where the last recitation (not a review) stopped, to continue it later. */
const LAST_RECITE = 'reader-recite-last';
/** `y`: how far down the page the reader had scrolled, when the text is bigger than the printed page. */
type Place = { page: number; position?: RecitePosition | null; reviewing?: boolean; y?: number };
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
const plainSurah = (key: string) => { const [surah, ayah] = key.split(':').map(Number); return `${plainName(surahNames[surah] ?? '').replace(/^سورة\s*/, '')} ${num(ayah)}`; };

/** The recite pill's height: one icon button tall, and a little room around it. */
const RECITE_BAR = 52;

function IconButton({ Icon, label, onPress, palette, on = false, disabled = false, color }: { Icon: (props: LucideProps) => React.ReactNode; label: string; onPress: () => void; palette: Palette; on?: boolean; disabled?: boolean; color?: string }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled, selected: on }} hitSlop={6}
      style={{ padding: 9, borderRadius: 999, backgroundColor: on ? palette.accent : 'transparent', opacity: disabled ? 0.35 : 1 }}>
      <Icon size={24} color={on ? palette.onAccent : color ?? palette.ink} />
    </Pressable>
  );
}


/** The 1441 Madinah mushaf, page by page, with recite mode (تسميع) and the forgot and save marks (the website's /quran/read on a phone). */
export default function Reader() {
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  const focused = useIsFocused();
  const place = useMemo(() => readJson<Place>(PLACE), []);
  const [page, setPage] = useState(() => Math.min(PAGES, Math.max(1, place?.page ?? 1)));
  const [position, setPosition] = useState<RecitePosition | null>(place?.position ?? null);
  const [reviewing, setReviewing] = useState(!!place?.reviewing && !!place?.position);
  /** The selected ayah, and after a long press the word it landed on (its place in the ayah). */
  const [mark, setMark] = useState<{ key: string; page: number; word?: number } | null>(null);
  const [wordLemmas, setWordLemmas] = useState<number[] | null>(null);
  const [irab, setIrab] = useState<IrabTarget | null>(null);
  const [balagha, setBalagha] = useState<string | null>(null);
  const [tools, setTools] = useState(false);
  const [sheet, setSheet] = useState<'index' | null>(null);
  const [actions, setActions] = useState<{ key: string; x: number; y: number; lemmas: number[]; word?: number } | null>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [zoom, setZoom] = useState(() => settleZoom(readJson<number>(ZOOM) ?? 1));
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
  // The reader's فاصلة (owner, 2026-11-16): set only from an ayah's buttons, never by turning pages; `reader-place` keeps the page open.
  const fasila = useSyncExternalStore(subscribeFasilas, readFasilas, serverFasilas).quran ?? null;
  const [noting, setNoting] = useState<string | null>(null);
  // Listening (owner's sketch, 2026-11-17): the recitation playing, and the sheet of its range, repeats and reciter.
  const listening = useListening();
  const [listenFrom, setListenFrom] = useState<string | null>(null);
  const [listenOpen, setListenOpen] = useState(false);
  // The page follows the ayah being read, until the reader turns away; «عُد إلى الآية» brings it back.
  const [following, setFollowing] = useState(true);
  const listenPage = listening ? pageOfAyah(listening.key) ?? null : null;
  useEffect(() => { if (listenPage && following) setPage(listenPage); }, [listenPage, following]);
  useEffect(() => { if (!listening) setFollowing(true); }, [listening]);
  const saved = useMemo(() => new Set(bookmarks.filter(item => item.id.startsWith('ayah:')).map(item => item.id.slice(5))), [bookmarks]);
  const forgotten = useMemo(() => forgottenOrder(Object.keys(forgot)), [forgot]);
  const last = useMemo(() => (focused ? readJson<Place>(LAST_RECITE) : undefined), [focused, position]); // eslint-disable-line react-hooks/exhaustive-deps

  // The surah openings quiz: a random surah's start at a time, its first ayah written (owner, 2026-11-13).
  const [openings, setOpenings] = useState<Openings | null>(null);
  const reciting = !!position;
  const mode = reciting ? 'recite' : 'read';
  const model = modelOf(page);
  const view = position ? reciteView(model, position) : null;

  // Write mode (owner, 2026-11-13): the next ayah's words stay boxes in their places, and the reader writes its first
  // and last few words, one box each; a full box moves on by itself. The last box shows the ayah, the written words
  // green when right and amber when wrong.
  const [writing, setWriting] = useState(() => readJson<boolean>(WRITE) ?? false);
  const [checked, setChecked] = useState<Checked | null>(null);
  // A review or the openings quiz asks one ayah at a time: once it shows, nothing more is written until the next one.
  const reviewDone = (reviewing || !!openings) && !!position?.shown;
  const writeKey = writing && view?.upcoming && !reviewDone ? view.upcoming : null;
  const writeWords = useMemo(() => (writeKey ? model.lines.flatMap(line => line?.filter(group => group.word && `${group.surah}:${group.ayah}` === writeKey).map(group => group.word) ?? []) : []), [writeKey, model]);
  const offset = writeKey?.endsWith(':1') ? view?.titled.get(Number(writeKey.split(':')[0])) ?? 0 : 0;
  // Words already shown (by the next-word button) are not asked.
  const asked = writeKey && view ? wordTargets(writeWords).filter(at => view.hidden(writeKey, at + offset)) : [];
  const boxes = useWriteBoxes({ ayah: writeKey, words: writeWords, asked, autoFocus: true, onDone: graded => {
    if (!writeKey || !position) return;
    setChecked({ key: writeKey, ...graded });
    // A mistake puts the ayah on the forgotten shelf (owner, 2026-11-13).
    if (graded.wrong.length) markForgotten(writeKey);
    setPosition(revealAyah(position, writeKey));
  } });
  const keyboard = useKeyboardHeight(reciting && writing);
  const toggleWriting = () => { setWriting(on => { writeJson(WRITE, !on); return !on; }); setChecked(null); boxes.blur(); };
  const write: Write | null = writeKey ? { key: writeKey, targets: asked, typed: boxes.typed, current: boxes.current, onBox: boxes.pick, onActive: (y, h) => follow.current(y, h) } : null;
  // Scrolls the box being written into the part of the screen above the pill and keyboard.
  const follow = useRef((_y: number, _h: number) => {});

  // The app's bars step aside while reading; a tap brings them back.
  useEffect(() => {
    setImmersive(focused && !tools);
    return () => setImmersive(false);
  }, [focused, tools]);

  // However a recitation starts (the eye button, the index's continue or review, the homepage), the bars step aside for it.
  useEffect(() => {
    if (reciting) { setTools(false); setActions(null); }
  }, [reciting]);

  const scrollY = useRef(place?.y ?? 0);
  const keep = () => writeJson(PLACE, { page, position, reviewing, y: flowing ? Math.round(scrollY.current) : 0 } satisfies Place);
  useEffect(() => {
    keep();
    if (position && !reviewing && !openings) writeJson(LAST_RECITE, { page, position } satisfies Place);
  }, [page, position, reviewing, openings]); // eslint-disable-line react-hooks/exhaustive-deps

  const turnTo = useCallback((next: number) => {
    setPage(next);
    setActions(null);
  }, []);
  const turnByHand = useCallback((next: number) => { setFollowing(false); turnTo(next); }, [turnTo]);
  const jump = useCallback((to: Jump, recite?: 'review') => {
    setPage(to.page);
    setActions(null);
    setTools(false);
    setMark(to.mark && !position ? { key: to.key, page: to.page } : null);
    setOpenings(null);
    if (recite === 'review') {
      setReviewing(true);
      setPosition({ start: to.key, shown: null, words: 0 });
    } else if (position) {
      // While reciting, a link starts the recitation again from where it leads.
      setReviewing(false);
      setPosition({ start: to.key, shown: null, words: 0 });
    }
  }, [position]);

  // The homepage opens the mushaf at a surah or juz, or starts a recitation.
  const askOpening = (next: Openings) => {
    const key = next.keys[next.at];
    setOpenings(next);
    setPage(pageOfAyah(key) ?? 1);
    setActions(null);
    setTools(false);
    setMark(null);
    setReviewing(false);
    setChecked(null);
    setPosition({ start: key, shown: null, words: 0 });
  };
  useIntent('read', intent => {
    if (intent.openings) {
      const keys = openingRound(intent.openings.range, Math.random);
      if (keys.length) {
        setWriting(true);
        writeJson(WRITE, true);
        askOpening({ range: intent.openings.range, keys, at: 0 });
        return;
      }
    }
    setOpenings(null);
    const to = (intent.at && pageOfAyah(intent.at)) || intent.page || page;
    setPage(to);
    setActions(null);
    setTools(false);
    setReviewing(!!intent.recite && !!intent.review);
    setMark(intent.at && !intent.recite ? { key: intent.at, page: to } : null);
    setPosition(intent.recite ? { start: intent.at ?? modelOf(to).order[0], shown: null, words: 0 } : null);
    if (intent.write) { setWriting(true); writeJson(WRITE, true); setChecked(null); }
  });

  const startRecite = () => {
    setActions(null);
    setTools(false);
    setReviewing(false);
    setPosition({ start: mark?.page === page ? mark.key : model.order[0], shown: null, words: 0 });
  };
  const stopRecite = () => { setActions(null); setReviewing(false); setOpenings(null); setPosition(null); setChecked(null); boxes.blur(); };
  const reviewNext = reviewing && position ? nextForgotten(forgotten, position.start) : null;
  const reviewAt = position ? forgotten.filter(key => compareKeys(key, position.start) < 0).length + 1 : 1;
  const reviewTotal = forgotten.length + (position && !forgotten.includes(position.start) ? 1 : 0);

  const revealNextAyah = () => {
    if (!position || !view) return;
    if (reviewDone) {
      if (openings) askOpening(nextOpening(openings, Math.random));
      else if (reviewNext) jump({ page: pageOfAyah(reviewNext) ?? page, key: reviewNext, mark: false }, 'review');
      return;
    }
    const next = view.nextAyah();
    if (next) setPosition(next);
    else if (page < PAGES) turnTo(page + 1);
  };
  const revealNextWord = () => {
    if (!position || !view) return;
    const next = !reviewDone && view.nextWord();
    if (next) setPosition(next);
    else revealNextAyah();
  };
  const stepBackOne = () => { if (position) setPosition(stepBack(position, ayahCounts)); };

  const ayahText = (key: string) => model.lines.flatMap(line => line?.filter(group => group.word && `${group.surah}:${group.ayah}` === key).map(group => group.word) ?? []).join(' ');
  const toggleSaved = (key: string) => toggleBookmark({ id: ayahBookmarkId(key), text: ayahText(key), href: ayahHref(key) });

  const run = (action: GestureAction, key: string | null, x: number, y: number, word?: number) => {
    if (action === 'tools') setTools(on => !on);
    else if (action === 'next-ayah') revealNextAyah();
    else if (action === 'next-word') revealNextWord();
    else if (action === 'back') stepBackOne();
    else if (key && action === 'actions') { buzz(); setActions({ key, x, y, word, lemmas: word === undefined ? [] : lemmasAtMushafWord(words, key, word) }); }
    else if (key && action === 'forgot') markForgotten(key);
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

  // While reciting the page ends above the recite pill, so it never covers a line.
  // While writing, the page keeps its size and scrolls above the keyboard (owner, 2026-11-13: no squeezed page),
  // following the box being written.
  const pillBottom = keyboard ? keyboard + 8 : tools ? tabBarTop(insets.bottom) + 8 : tabBarBottom(insets.bottom);
  const pageInsets = { top: insets.top, bottom: (reciting ? tabBarBottom(insets.bottom) + RECITE_BAR + 8 : listening ? tabBarBottom(insets.bottom) : insets.bottom) + (listening ? LISTEN_BAR + 8 : 0) };
  const height = size ? size.height - pageInsets.top - pageInsets.bottom : 0;
  const scroller = useRef<ComponentRef<typeof ScrollView>>(null);
  const scrolled = useRef(0);
  const scrollTo = (y: number) => { scroller.current?.scrollTo({ y, animated: false }); scrolled.current = y; scrollY.current = y; };
  useEffect(() => { if (!keyboard && !flowing) scrollTo(0); }, [keyboard, flowing]); // eslint-disable-line react-hooks/exhaustive-deps
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
    anchor.current = { share: focalY / Math.max(1, pagerHeight), screen: focalY - scrolled.current, from: heights[page] ?? 0 };
    restoring.current = false;
    quietUntil.current = Date.now() + 800;
    setZoom(next);
    writeJson(ZOOM, next);
  }, [pagerHeight, heights, page]);
  const onFocus = useCallback((y: number, h: number) => follow.current(y, h), []);
  follow.current = (y, h) => {
    if (!size || (!keyboard && (!flowing || Date.now() < quietUntil.current))) return;
    const top = insets.top + 8;
    const bottom = keyboard ? size.height - pillBottom - RECITE_BAR - 12 : size.height - pageInsets.bottom - 8;
    if (y + h > bottom) scroller.current?.scrollTo({ y: scrolled.current + y + h - bottom + 24, animated: true });
    else if (y < top) scroller.current?.scrollTo({ y: Math.max(0, scrolled.current - (top - y) - 24), animated: true });
  };
  const [topic, setTopic] = useState<TopicOpen | null>(null);
  const onTopic = useCallback((surah: number, section: number) => setTopic({ surah, section }), []);
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
        top={surahBefore(at)} names={surahNames} mark={!position && mark?.page === at ? mark.key : null} markWord={!position && mark?.page === at ? mark.word ?? null : null}
        recite={position ? reciteView(atModel, position) : null} playing={listening?.key ?? null} forgot={forgot} saved={saved} fasila={position ? null : fasila?.key ?? null} onTouch={onTouch}
        write={at === page ? write : null} checked={position && at === page ? checked : null} onTopic={onTopic} />
    );
  };

  const actionKey = actions?.key;
  const forgotCount = actionKey ? (forgot[actionKey]?.forgot ?? 0) : 0;
  // Where else the ayah is: its compare cards, the trees that hold it and its readings, each shown only when there are any.
  const targets = useMemo(() => (actionKey ? compareTargetsOfAyah(actionKey) : []), [actionKey]);
  const trees = useMemo(() => !!actionKey && hasTrees(actionKey), [actionKey]);
  const readings = !!actionKey && hasQiraat(actionKey);
  const [preview, setPreview] = useState<Preview | null>(null);
  // The surah's topics, opened at the section holding the ayah (owner, 2026-11-14: the header names no topic).
  const [actionSurah, actionAyah] = (actionKey ?? '0:0').split(':').map(Number);
  const topics = !!actionKey && !position && !!surahTopicsOf(actionSurah);
  const buttons = 8 + (forgotCount > 0 ? 1 : 0) + (targets.length ? 1 : 0) + (trees ? 1 : 0) + (readings ? 1 : 0) + (topics ? 1 : 0) + (actions?.lemmas.length ? 1 : 0) + (actions?.word !== undefined ? 1 : 0);
  // On a narrow phone the buttons wrap onto a second row rather than run off the screen.
  const barWidth = Math.min(buttons * (ACT_WIDTH + 2) + 10, (size?.width ?? 360) - 16);
  // Each row of labelled buttons is about 62 tall; the bar sits above the pressed line.
  const barRows = Math.ceil(buttons / Math.max(1, Math.floor((barWidth - 10) / (ACT_WIDTH + 2))));
  return (
    <View style={{ flex: 1, backgroundColor: palette.paperDeep }} onLayout={event => setSize({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })}>
      <ScrollView ref={scroller} scrollEnabled={!!keyboard || flowing} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always" scrollEventThrottle={32}
        onScroll={event => { scrolled.current = event.nativeEvent.contentOffset.y; scrollY.current = scrolled.current; }}
        onScrollEndDrag={() => { setScrollTop(scrolled.current); keep(); }} onMomentumScrollEnd={() => { setScrollTop(scrolled.current); keep(); }}
        style={{ flex: 1 }} contentContainerStyle={{ paddingTop: pageInsets.top, paddingBottom: keyboard ? keyboard + RECITE_BAR + 24 : pageInsets.bottom }}>
        {size && height > 0 && (
          <ReaderPager page={page} count={PAGES} width={size.width} height={pagerHeight} onPage={turnByHand} onMove={onMove} render={render} onPull={openIndex} zoom={zoom} onZoom={zoomTo} scrollTop={scrollTop} />
        )}
      </ScrollView>
      {tools && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
          <TopBar>
            <IconButton Icon={List} label="فهرس السور والبحث" palette={palette} onPress={() => setSheet('index')} />
            <IconButton Icon={EyeOff} label={reciting ? 'إنهاء التسميع' : 'تسميع: أخفِ الآيات وأظهرها واحدة واحدة'} palette={palette} on={reciting} onPress={() => (reciting ? stopRecite() : startRecite())} />
          </TopBar>
        </View>
      )}
      {actions && (
        <View accessibilityRole="toolbar" accessibilityLabel={`الآية ${num(Number(actions.key.split(':')[1]))} من السورة ${num(Number(actions.key.split(':')[0]))}`}
          style={{ position: 'absolute', top: Math.max(insets.top + 8, actions.y - 20 - barRows * 62), left: Math.min((size?.width ?? 300) - barWidth - 8, Math.max(8, actions.x - barWidth / 2)), maxWidth: (size?.width ?? 360) - 16, flexDirection: 'row', flexWrap: 'wrap', gap: 2, padding: 5, borderRadius: 12, borderWidth: 1, borderColor: palette.rule, backgroundColor: palette.paper, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, elevation: 6 }}>
          {/* Listening comes first (owner's sketch, 2026-11-17): from this ayah to its surah's end, with the repeats last set. */}
          <ActButton Icon={Play} label="استمع من هذه الآية" name="استمع" palette={palette} onPress={() => { const key = actions.key; setActions(null); setFollowing(true); listen(key); }} />
          <ActButton Icon={LightbulbOff} label={forgotCount ? 'نسيتها مرة أخرى' : 'نسيتها'} name="نسيتها" palette={palette} on={forgotCount > 0} onPress={() => { markForgotten(actions.key); setActions(null); }} />
          {forgotCount > 0 && <ActButton Icon={Check} label="تذكّرتها" name="تذكّرتها" palette={palette} color={palette.green} onPress={() => { rememberAyah(actions.key); setActions(null); }} />}
          <ActButton Icon={Bookmark} label={saved.has(actions.key) ? 'أزلها من المحفوظات' : 'احفظ الآية'} name="احفظ" palette={palette} on={saved.has(actions.key)} onPress={() => { toggleSaved(actions.key); setActions(null); }} />
          <ActButton Icon={FasilaIcon} label={fasila?.key === actions.key ? 'أزل الفاصلة' : 'ضع الفاصلة هنا: هنا توقفت'} name="فاصلة" palette={palette} on={fasila?.key === actions.key}
            onPress={() => { const key = actions.key; setQuranFasila(fasila?.key === key ? null : { key, page: pageOfAyah(key) ?? page }); setActions(null); }} />
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
          {/* The ayah's balagha: al-Itqan's paragraphs and al-Kashshaf's passage, pills between them (owner, 2026-11-16). */}
          <ActButton Icon={Sparkles} label="البلاغة في الآية" name="البلاغة" palette={palette} onPress={() => { const key = actions.key; setActions(null); setBalagha(key); }} />
          {/* The word's places: its label names the long-pressed word, which is lit on the page. */}
          {actions.lemmas.length > 0 && <ActButton Icon={TextSearch} label={`مواضع «${words.lemmas[actions.lemmas[0]][0]}» في القرآن`} name="المواضع" palette={palette}
            onPress={() => { const lemmas = actions.lemmas; setActions(null); setWordLemmas(lemmas); }} />}
          {/* Share is always the last button. */}
          <ActButton Icon={Send} label="مشاركة" name="مشاركة" palette={palette} onPress={() => { const key = actions.key; setActions(null); shareAyah(key, palette, notes[key]?.text); }} />
        </View>
      )}
      {/* The tree and compare buttons preview in place; each item, and the sheet's last button, opens its page (owner, 2026-11-13). */}
      <AyahPreviewSheet preview={preview} onClose={() => setPreview(null)} palette={palette} />
      <TopicSheet open={topic} onClose={() => setTopic(null)} onJump={jumpToAyah} palette={palette} />
      <NoteSheet ayah={noting} onClose={() => setNoting(null)} palette={palette} />
      {/* The word long-pressed: its count and the ayat it is in (owner, 2026-11-13). */}
      <WordSheet lemmas={wordLemmas} onClose={() => setWordLemmas(null)} palette={palette} />
      <IrabSheet target={irab} onClose={() => setIrab(null)} palette={palette} />
      <BalaghaSheet ayah={balagha} onClose={() => setBalagha(null)} palette={palette} />
      {/* The recite pill: see-through and low at the bottom like the tab bar (owner, 2026-11-13), and just above the tab bar when the app's bars are shown. */}
      {position && (
        <View accessibilityRole="toolbar" accessibilityLabel="أدوات التسميع"
          style={{ position: 'absolute', left: TAB_BAR.side, right: TAB_BAR.side, bottom: pillBottom, height: RECITE_BAR, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', borderRadius: 999, overflow: 'hidden', borderWidth: 1, borderColor: palette.glassEdge }}>
          <BlurView intensity={40} tint={palette.scheme} style={StyleSheet.absoluteFill} />
          <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: palette.glass }]} />
          {reviewing && <Text style={{ color: palette.muted, fontSize: 13, paddingHorizontal: 8 }}>مراجعة {num(reviewAt)} من {num(reviewTotal)}</Text>}
          {openings && <Text numberOfLines={1} accessibilityLabel={`أوائل السور، السورة ${num(openings.at + 1)} من ${num(openings.keys.length)}`} style={{ color: palette.muted, fontSize: 13, paddingHorizontal: 8 }}>{`${num(openings.at + 1)} من ${num(openings.keys.length)}`}</Text>}
          <IconButton Icon={Undo2} label="ارجع خطوة" palette={palette} disabled={atStart(position)} onPress={stepBackOne} />
          <IconButton Icon={ChevronLeft} label="أظهر الكلمة التالية" palette={palette} disabled={reviewDone} onPress={revealNextWord} />
          <IconButton Icon={reviewDone ? ArrowLeft : ChevronsLeft} label={reviewDone ? (openings ? 'السورة التالية' : 'الآية المنسية التالية') : 'أظهر الآية التالية'} palette={palette}
            disabled={reviewDone ? !openings && !reviewNext : !view?.upcoming && page === PAGES} onPress={revealNextAyah} />
          <IconButton Icon={PenLine} label={writing ? 'أوقف الكتابة' : 'اكتب أول كل آية وآخرها'} palette={palette} on={writing} onPress={toggleWriting} />
          <IconButton Icon={X} label="إنهاء التسميع" palette={palette} onPress={stopRecite} />
        </View>
      )}
      <ListenBar bottom={reciting ? pillBottom + RECITE_BAR + 8 : pillBottom} side={TAB_BAR.side} palette={palette}
        onRepeat={() => { setListenFrom(listening?.key ?? null); setListenOpen(true); }} />
      {listening && listenPage && listenPage !== page && (
        <Pressable onPress={() => setFollowing(true)} accessibilityRole="button" accessibilityLabel={`عُد إلى الآية التي تُتلى، ${plainSurah(listening.key)}`}
          style={{ position: 'absolute', alignSelf: 'center', bottom: (reciting ? pillBottom + RECITE_BAR + 8 : pillBottom) + LISTEN_BAR + 10, height: 36, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, borderRadius: 999, overflow: 'hidden', borderWidth: 1, borderColor: palette.glassEdge }}>
          <BlurView intensity={40} tint={palette.scheme} style={StyleSheet.absoluteFill} />
          <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: palette.glass }]} />
          <Text style={{ color: palette.ink, fontSize: 14 }}>{`عُد إلى الآية · ${plainSurah(listening.key)}`}</Text>
        </Pressable>
      )}
      <ListenSheet open={listenOpen} start={listenFrom} onClose={() => setListenOpen(false)} palette={palette} />
      {/* Back to the فاصلة from any other page, with the bars (a tap), so it never covers the page's last line. */}
      {tools && !position && fasila && fasila.page !== page && (
        <Pressable onPress={() => jump({ page: fasila.page, key: fasila.key, mark: false })} accessibilityRole="button"
          accessibilityLabel={`عد إلى فاصلتك، ${surahNames[Number(fasila.key.split(':')[0])] ?? ''} ${num(Number(fasila.key.split(':')[1]))}`}
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
      <IndexSheet open={sheet === 'index'} onClose={() => setSheet(null)} onJump={jump} palette={palette} page={page} forgotten={forgotten} recite={reciting}
        last={last?.position ? () => { setReviewing(false); setOpenings(null); setPosition(last.position!); setPage(last.page); } : null} />
    </View>
  );
}
