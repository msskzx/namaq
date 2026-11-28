import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type ComponentRef } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
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
import { forgottenAyat, isKey, nextInReview, reviewedBefore, reviewPosition, type RecitePosition } from '@shared/quran/recite';
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
import { openAyahPage } from '@/lib/ways';
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
import { surahName, SURAH_TITLES } from '@shared/quran/surahNames';

const PLACE = 'reader-place';
const INDICATOR = 20;
const LAST_RECITE = 'reader-recite-last';
type Place = { page: number; position?: RecitePosition | null; reviewing?: boolean; reviewFrom?: string; y?: number };
const isPosition = (value: unknown): value is RecitePosition =>
  isRecord(value) && isKey(value.start as string) && (value.shown === null || isKey(value.shown as string)) && isNumberIn(0, Infinity)(value.words) && (value.gaps === undefined || (Array.isArray(value.gaps) && value.gaps.every(isNumberIn(0, Infinity))));
const isPlace = (value: unknown): value is Place =>
  isRecord(value) && isNumberIn(1, PAGES)(value.page) && (value.position == null || isPosition(value.position)) && (value.reviewing === undefined || isBoolean(value.reviewing)) && (value.reviewFrom === undefined || isKey(value.reviewFrom as string)) && (value.y === undefined || isNumberIn(-Infinity, Infinity)(value.y));
const ZOOM = 'reader-zoom';
const WRITE = 'reader-write';

const models = new Map<number, ReturnType<typeof pageModel>>();
const modelOf = (page: number) => {
  let model = models.get(page);
  if (!model) models.set(page, (model = pageModel(pageData(page), surahBefore(page))));
  return model;
};

const plainSurah = (key: string) => { const [surah, ayah] = key.split(':').map(Number); return `${surahName(surah)} ${num(ayah)}`; };

export default function Reader() {
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  const focused = useIsFocused();
  const place = useMemo(() => readJson(PLACE, isPlace), []);
  const [page, setPage] = useState(() => Math.min(PAGES, Math.max(1, place?.page ?? 1)));
  const [position, setPosition] = useState<RecitePosition | null>(place?.position ?? null);
  const [reviewing, setReviewing] = useState(!!place?.reviewing && !!place?.position);
  const [reviewFrom, setReviewFrom] = useState(place?.reviewFrom ?? null);
  useEffect(() => { if (!reviewing) setReviewFrom(null); }, [reviewing]);
  const [reciteMenu, setReciteMenu] = useState<{ x: number; y: number } | null>(null);
  const [mark, setMark] = useState<{ key: string; page: number; words?: { from: number; to: number } } | null>(null);
  const [wordLemmas, setWordLemmas] = useState<number[] | null>(null);
  const [irab, setIrab] = useState<IrabTarget | null>(null);
  const [balagha, setBalagha] = useState<string | null>(null);
  const [gharib, setGharib] = useState<GharibTarget | null>(null);
  const [tools, setTools] = useState(false);
  const [sheet, setSheet] = useState<'index' | null>(null);
  const [actions, setActions] = useState<{ key: string; x: number; y: number; lemmas: number[]; words?: Selection; holding?: boolean; dragging?: boolean;
    bubble?: ButtonBox } | null>(null);
  const [phrase, setPhrase] = useState<string | null>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [zoom, setZoom] = useState(() => settleZoom(readJson(ZOOM, isNumberIn(0, Infinity)) ?? 1));
  const flowing = zoom > 1;
  const [heights, setHeights] = useState<Record<number, number>>({});
  const onHeight = useCallback((at: number, h: number) => setHeights(prev => (Math.abs((prev[at] ?? 0) - h) < 1 ? prev : { ...prev, [at]: h })), []);
  const anchor = useRef<{ share: number; screen: number; from: number } | null>(null);
  const quietUntil = useRef(0);
  const forgot = useSyncExternalStore(subscribeDueMarks, readDueMarks);
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks);
  const notes = useSyncExternalStore(subscribeAyahNotes, readAyahNotes);
  const fasila = useSyncExternalStore(subscribeFasilas, readFasilas, serverFasilas).quran ?? null;
  const [noting, setNoting] = useState<string | null>(null);
  const listening = useListening();
  const [listenFrom, setListenFrom] = useState<string | null>(null);
  const [listenOpen, setListenOpen] = useState(false);
  const [following, setFollowing] = useState(true);
  const listenPage = listening ? pageOfAyah(listening.key) ?? null : null;
  useEffect(() => { if (listenPage && following && !position) setPage(listenPage); }, [listenPage, following, position]);
  useEffect(() => { if (listening) setFollowing(true); }, [listening?.range]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (!listening) setFollowing(true); }, [listening]);
  const saved = useMemo(() => new Set(bookmarks.filter(item => item.id.startsWith('ayah:')).map(item => item.id.slice(5))), [bookmarks]);
  const forgotten = useMemo(() => forgottenAyat(Object.keys(forgot)), [forgot]);
  const last = useMemo(() => (focused ? readJson(LAST_RECITE, isPlace) : undefined), [focused, position]); // eslint-disable-line react-hooks/exhaustive-deps

  const reciting = !!position;
  const mode = reciting ? 'recite' : 'read';
  const model = modelOf(page);
  const [writing, setWriting] = useState(() => readJson(WRITE, isBoolean) ?? false);
  const [pen] = penRule.use();
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
  const follow = useRef((_y: number, _h: number) => {});

  useEffect(() => {
    setImmersive(focused && !tools);
    return () => setImmersive(false);
  }, [focused, tools]);

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
      setReviewing(false);
      setPosition(reviewPosition(to.key));
    }
  }, [position]);

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

  const startRecite = (from: string = model.order[0]) => {
    setActions(null);
    setTools(false);
    setReviewing(false);
    setMark(null);
    setPosition({ start: from, shown: null, words: 0 });
  };
  const restartPage = () => { setActions(null); setReviewing(false); setChecked(null); setPosition({ start: model.order[0], shown: null, words: 0 }); };
  const stopRecite = () => { setActions(null); setReviewing(false); setPosition(null); setChecked(null); boxes.blur(); };
  const reviewKey = position?.start ?? '';
  const from = reviewFrom ?? forgotten[0] ?? reviewKey;
  const reviewNext = reviewing && position ? nextInReview(forgotten, reviewKey, from) : null;
  const reviewAt = position ? reviewedBefore(forgotten, reviewKey, from) + 1 : 1;
  const reviewTotal = forgotten.length + (position && !forgotten.includes(reviewKey) ? 1 : 0);

  const revealNextAyah = recite.nextAyah;
  const revealNextWord = recite.nextWord;
  const stepBackOne = recite.back;

  const modelAt = (key: string) => modelOf(pageOfAyah(key) ?? page);
  const ayahText = (key: string) => modelAt(key).lines.flatMap(line => line?.filter(group => group.word && `${group.surah}:${group.ayah}` === key).map(group => group.word) ?? []).join(' ');
  const ayahWords = (key: string) => modelAt(key).lines.flatMap(line => line?.filter(group => group.word && group.word !== '۞' && `${group.surah}:${group.ayah}` === key).map(group => group.word) ?? []);
  const toggleSaved = (key: string) => toggleBookmark({ id: ayahBookmarkId(key), text: ayahText(key), href: ayahHref(key) });

  const [pop, setPop] = useState<Pop | null>(null);
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
    setScrollTop(scrolled.current);
    touches.cancel();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const openIndex = useCallback(() => { setActions(null); setSheet('index'); }, []);
  const writingNow = useRef(false);
  writingNow.current = !!writeKey;
  const touches = usePageTouch((gesture, key, x, y, word) => {
    const open = actionsNow.current;
    if (open?.words && inSelection(open.words, key, word)) {
      setActions(null);
      const action = readGestures()[mode].double;
      if (gesture !== 'double') return;
      if (action === 'forgot') { buzz(); popAt(x, y, 'forgot', toggleForgotten(wordKeys(open.words))); }
      else latest.current(action, key, x, y, word, gesture);
      return;
    }
    const touched = key ? pageOfAyah(key) : undefined;
    if (touched && touched !== shown.current && spreadNow.current) setPage(touched);
    if (mode === 'read') setMark(current => (key && !(gesture === 'tap' && current?.key === key) ? { key, page: pageOfAyah(key) ?? shown.current, ...(gesture === 'long' && word !== undefined ? { words: { from: word, to: word } } : {}) } : null));
    latest.current(readGestures()[mode][gesture], key, x, y, word, gesture);
  }, () => readGestures()[mode].double !== 'none');
  const onTouch = useCallback((touch: Touch, key: string | null, x: number, y: number, word?: number) => {
    if (Date.now() - moved.current < 350) return;
    if (writingNow.current) { boxes.focus(); return; }
    if (actionsOpen.current && !(touch !== 'long' && inSelection(actionsNow.current?.words, key, word) && readGestures()[mode].double !== 'none')) { setActions(null); return; }
    touches.touch(touch, key, x, y, word);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const pageInsets = { top: insets.top, bottom: Platform.OS === 'ios' ? Math.max(0, insets.bottom - INDICATOR) : insets.bottom };
  const barClear = { top: insets.top + (tools ? TOP_BAR : 0) + 8, bottom: keyboard ? keyboard + 8 : tools ? tabBarTop(insets.bottom) + 8 : tabBarBottom(insets.bottom) };
  const height = size ? size.height - pageInsets.top - pageInsets.bottom : 0;
  const scroller = useRef<ComponentRef<typeof ScrollView>>(null);
  const scrollGesture = useMemo(() => Gesture.Native(), []);
  const [pinching, setPinching] = useState(false);
  const pinchFrom = useRef(0);
  const onPinch = useCallback((on: boolean) => {
    if (on) pinchFrom.current = scrolled.current;
    setPinching(on);
  }, []);
  const scrolled = useRef(0);
  const scrollTo = (y: number) => { scroller.current?.scrollTo({ y, animated: false }); scrolled.current = y; scrollY.current = y; };
  useEffect(() => { if (!keyboard && !flowing) { scrollTo(0); setScrollTop(0); } }, [keyboard, flowing]);
  const pagerHeight = flowing ? Math.max(height, heights[page] ?? 0) : height;
  const [scrollTop, setScrollTop] = useState(0);
  const restoring = useRef(flowing && !!place?.y);
  const shownPage = useRef(page);
  useLayoutEffect(() => {
    if (shownPage.current === page) return;
    shownPage.current = page;
    restoring.current = false;
    scrollTo(0);
    setScrollTop(0);
  }, [page]);
  const drawnHeight = heights[page];
  useEffect(() => {
    if (!drawnHeight) return;
    let y: number | null = null;
    if (restoring.current && drawnHeight > height + 1) {
      restoring.current = false;
      y = Math.min(place?.y ?? 0, drawnHeight - height);
    } else if (anchor.current && (!flowing || drawnHeight !== anchor.current.from)) {
      const { share, screen } = anchor.current;
      anchor.current = null;
      y = flowing ? Math.max(0, Math.min(drawnHeight - height, share * drawnHeight - screen)) : 0;
    }
    if (y === null) return;
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
  const selected = position ? (actions ? { key: actions.key, page: pageOfAyah(actions.key) ?? page, words: actions.words } : null) : mark;
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
    return (
      <View style={{ flexDirection: 'row', width, height }}>
        {spreadOf(at * 2 - 1).map(one => <View key={one} style={{ width: width / 2 }}>{pageView(one, width / 2)}</View>)}
      </View>
    );
  };

  const actionKey = actions?.key;
  const fasilaHere = !!fasila && (spread ? spreadOf(page).includes(fasila.page) : fasila.page === page);
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
  const copyAyah = (key: string) => { setActions(null); void Clipboard.setStringAsync(`«${ayahText(key)}»\n${plainSurah(key)}`); };
  const openBubble = (box: ButtonBox) => setActions(was => was && { ...was, bubble: was.bubble ? undefined : box });
  const facts = useAyahMenuFacts(actionKey);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [actionSurah, actionAyah] = (actionKey ?? '0:0').split(':').map(Number);
  const topics = !!actionKey && !position && !!surahTopicsOf(actionSurah);
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
      <View pointerEvents="box-none" style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
          <TopBar away={!tools}>
            <IconButton Icon={Search} label="فهرس السور والبحث" tone="ink" onPress={() => setSheet('index')} />
            <Pressable onPress={() => { buzz(); setQuranFasila(fasilaHere ? null : { key: firstAyahOfPage(page), page }); }} accessibilityRole="button"
              accessibilityState={{ selected: fasilaHere }} accessibilityLabel={fasilaHere ? 'أزل الفاصلة من هذه الصفحة' : 'ضع الفاصلة في هذه الصفحة: هنا توقفت'}
              hitSlop={6} style={{ padding: 9 }}>
              <FasilaIcon size={24} color={palette.accent} filled={fasilaHere} />
            </Pressable>
            <IconButton Icon={EyeOff} label={reciting ? 'إنهاء التسميع' : 'تسميع: أخفِ الآيات وأظهرها واحدة واحدة'} tone="ink" on={reciting} onPress={() => (reciting ? stopRecite() : setReciteMenu({ x: (size?.width ?? 390) - 122, y: insets.top + 26 }))} />
          </TopBar>
      </View>
      {reciteMenu && (
        <FloatingMenu at={reciteMenu} label="ابدأ التسميع" onClose={() => setReciteMenu(null)} palette={palette} overlay>
          <ActButton Icon={EyeOff} label="سمّع من أول الصفحة" name="هذه الصفحة" palette={palette} onPress={() => { setReciteMenu(null); startRecite(); }} />
          {mark?.page === page && <ActButton Icon={Pointer} label="سمّع من الآية المختارة" name="الآية المختارة" palette={palette} onPress={() => { setReciteMenu(null); startRecite(mark!.key); }} />}
          {last?.position && <ActButton Icon={History} label="تابع التسميع من حيث توقفت" name="تابع" palette={palette}
            onPress={() => { setReciteMenu(null); setReviewing(false); setPosition(last.position!); setPage(last.page); }} />}
          {forgotten.length > 0 && <ActButton Icon={LightbulbOff} label="راجع ما نسيت" name="ما نسيت" palette={palette}
            onPress={() => {
              setReciteMenu(null);
              const first = forgotten.find(key => (pageOfAyah(key) ?? 0) >= page) ?? forgotten[0];
              jump({ page: pageOfAyah(first) ?? page, key: first, mark: false }, 'review');
              setReviewFrom(first);
            }} />}
        </FloatingMenu>
      )}
      {actions && (
        <FloatingMenu at={actionsAt} label={`الآية ${num(actionAyah)} من السورة ${num(actionSurah)}`} onClose={() => setActions(null)} top={pageInsets.top} palette={palette}
          groups={ayahMenuGroups(facts, {
            listen: () => { const key = actions.key; setActions(null); setFollowing(true); listen(key); },
            page: () => { const key = actions.key; setActions(null); openAyahPage(key); },
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
            places: lit && isPhrase(lit)
              ? { label: `مواضع «${litText}» في القرآن`, onPress: () => { setActions(null); setPhrase(litText); setSheet('index'); } }
              : actions.lemmas.length > 0 ? { label: `مواضع «${words.lemmas[actions.lemmas[0]][0]}» في القرآن`, onPress: () => { const lemmas = actions.lemmas; setActions(null); setWordLemmas(lemmas); } } : undefined,
            topics: topics ? () => { setActions(null); setTopic({ surah: actionSurah, section: Math.max(0, sectionAt(actionSurah, actionAyah)) }); } : undefined,
            copy: () => copyAyah(actions.key),
            share: () => { const key = actions.key; setActions(null); shareAyah(key, palette, notes[key]?.text); },
          }, palette)} />
      )}
      {actions?.bubble && lit && !actions.dragging && (
        <FloatingMenu bubble at={{ x: actions.bubble.x + actions.bubble.width / 2, y: actions.bubble.y }} span={actions.bubble.height}
          label="ما نسيت" onClose={() => setActions(was => was && { ...was, bubble: undefined })} top={pageInsets.top} palette={palette}>
          <ActButton wide Icon={ayahForgot ? LightbulbOff : Lightbulb} label={ayahForgot ? 'تذكّرت الآية' : 'نسيت الآية'} name="الآية" palette={palette} on={ayahForgot} onPress={() => toggleForgot([actions.key])} />
          <ActButton wide Icon={litForgot ? LightbulbOff : Lightbulb} label={`${litForgot ? 'تذكّرت' : 'نسيت'} «${litText}»`} quran name={litText} palette={palette} on={litForgot} onPress={() => toggleForgot(litKeys)} />
        </FloatingMenu>
      )}
      <AyahPreviewSheet preview={preview} onClose={() => setPreview(null)} palette={palette} />
      <BulbPop pop={pop} palette={palette} />
      <TopicSheet open={topic} onClose={() => setTopic(null)} onJump={jumpToAyah} palette={palette} />
      <NoteSheet ayah={noting} onClose={() => setNoting(null)} palette={palette} />
      <WordSheet lemmas={wordLemmas} onClose={() => setWordLemmas(null)} palette={palette} />
      <IrabSheet target={irab} onClose={() => setIrab(null)} palette={palette} />
      <BalaghaSheet ayah={balagha} onClose={() => setBalagha(null)} palette={palette} />
      <GharibSheet target={gharib} onClose={() => setGharib(null)} palette={palette} />
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
      {listening && listenPage && listenPage !== page && (
        <Pressable onPress={() => { setFollowing(true); setPage(listenPage); setActions(null); }} accessibilityRole="button" accessibilityLabel={`عُد إلى الآية التي تُتلى، ${plainSurah(listening.key)}`}
          style={{ position: 'absolute', alignSelf: 'center', top: barClear.top, height: 36, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, borderRadius: 999, overflow: 'hidden', borderWidth: 1, borderColor: palette.glassEdge }}>
          <BlurView intensity={40} tint={palette.scheme} style={StyleSheet.absoluteFill} />
          <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: palette.glass }]} />
          <Text style={{ color: palette.ink, fontSize: 14 }}>{`عُد إلى الآية · ${plainSurah(listening.key)}`}</Text>
        </Pressable>
      )}
      <ListenSheet open={listenOpen} start={listenFrom} onClose={() => setListenOpen(false)} palette={palette} />
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
      {boxes.field}
      <TabHint id="read" palette={palette} hidden={reciting || !!actions || !!listening} />
      <IndexSheet open={sheet === 'index'} query={phrase} onClose={() => { setSheet(null); setPhrase(null); }} onJump={jump} palette={palette} page={page} recite={reciting} />
    </View>
  );
}
