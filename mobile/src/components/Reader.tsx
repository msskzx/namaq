import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Text } from '@/components/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from 'expo-router';
import { ArrowLeft, ArrowLeftRight, Bookmark, Check, ChevronLeft, ChevronsLeft, EyeOff, LightbulbOff, List, Undo2, X, type LucideProps } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { readBookmarks, subscribeBookmarks, toggleBookmark } from '@shared/bookmarks';
import { ayahBookmarkId, ayahHref, clearForgotten, markForgotten, readAyahMarks, subscribeAyahMarks } from '@shared/ayahMarks';
import { readGestures, type GestureAction } from '@shared/readerGestures';
import { atStart, compareKeys, forgottenOrder, nextForgotten, stepBack, type RecitePosition } from '@shared/quran/recite';
import TopBar from './TopBar';
import { TAB_BAR, tabBarBottom, tabBarTop } from './tabBarSpace';
import ReaderPager from './ReaderPager';
import MushafPageView, { type Touch } from './MushafPageView';
import { IndexSheet, type Jump } from './ReaderSheets';
import CompareTargetsSheet from './CompareTargetsSheet';
import TreeIcon from './TreeIcon';
import { hasTrees } from '@/lib/branchList';
import { compareTargetsOfAyah, type CompareTarget } from '@/lib/compare';
import { openCompare, openTreesOf } from '@/lib/ways';
import { ayahCounts, PAGES, pageData, pageOfAyah, surahBefore, surahNames } from '@/lib/mushaf';
import { pageModel, reciteView } from '@shared/quran/recitePage';
import { readJson, writeJson } from '@/lib/storage';
import { setImmersive } from '@/lib/chrome';
import { buzz } from '@/lib/haptics';
import { settleZoom } from '@/lib/pageZoom';
import { useIntent } from '@/lib/intent';
import { usePalette, type Palette } from '@/lib/theme';

/** Where the reader was: the page, and the recitation if one was running. Kept so the app opens where it was left. */
const PLACE = 'reader-place';
/** Where the last recitation (not a review) stopped, to continue it later. */
const LAST_RECITE = 'reader-recite-last';
type Place = { page: number; position?: RecitePosition | null; reviewing?: boolean };
/** How big the page is drawn, kept from one visit to the next. */
const ZOOM = 'reader-zoom';

/** How long (ms) a first tap waits for a second one, when a double tap does something. */
const DOUBLE_TAP = 260;

const models = new Map<number, ReturnType<typeof pageModel>>();
const modelOf = (page: number) => {
  let model = models.get(page);
  if (!model) models.set(page, (model = pageModel(pageData(page), surahBefore(page))));
  return model;
};

/** The recite pill's height: one icon button tall, and a little room around it. */
const RECITE_BAR = 52;

function IconButton({ Icon, label, onPress, palette, on = false, disabled = false }: { Icon: (props: LucideProps) => React.ReactNode; label: string; onPress: () => void; palette: Palette; on?: boolean; disabled?: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled, selected: on }} hitSlop={6}
      style={{ padding: 9, borderRadius: 999, backgroundColor: on ? palette.accent : 'transparent', opacity: disabled ? 0.35 : 1 }}>
      <Icon size={24} color={on ? palette.onAccent : palette.ink} />
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
  const [mark, setMark] = useState<{ key: string; page: number } | null>(null);
  const [tools, setTools] = useState(false);
  const [sheet, setSheet] = useState<'index' | null>(null);
  const [actions, setActions] = useState<{ key: string; x: number; y: number } | null>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [zoom, setZoom] = useState(() => settleZoom(readJson<number>(ZOOM) ?? 1));
  const zoomTo = useCallback((next: number) => { setZoom(next); writeJson(ZOOM, next); }, []);
  const forgot = useSyncExternalStore(subscribeAyahMarks, readAyahMarks);
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks);
  const saved = useMemo(() => new Set(bookmarks.filter(item => item.id.startsWith('ayah:')).map(item => item.id.slice(5))), [bookmarks]);
  const forgotten = useMemo(() => forgottenOrder(Object.keys(forgot)), [forgot]);
  const last = useMemo(() => (focused ? readJson<Place>(LAST_RECITE) : undefined), [focused, position]); // eslint-disable-line react-hooks/exhaustive-deps

  const reciting = !!position;
  const mode = reciting ? 'recite' : 'read';
  const model = modelOf(page);
  const view = position ? reciteView(model, position) : null;

  // The app's bars step aside while reading; a tap brings them back.
  useEffect(() => {
    setImmersive(focused && !tools);
    return () => setImmersive(false);
  }, [focused, tools]);

  // However a recitation starts (the eye button, the index's continue or review, the homepage), the bars step aside for it.
  useEffect(() => {
    if (reciting) { setTools(false); setActions(null); }
  }, [reciting]);

  useEffect(() => {
    writeJson(PLACE, { page, position, reviewing } satisfies Place);
    if (position && !reviewing) writeJson(LAST_RECITE, { page, position } satisfies Place);
  }, [page, position, reviewing]);

  const turnTo = useCallback((next: number) => {
    setPage(next);
    setActions(null);
  }, []);
  const jump = useCallback((to: Jump, recite?: 'review') => {
    setPage(to.page);
    setActions(null);
    setTools(false);
    setMark(to.mark && !position ? { key: to.key, page: to.page } : null);
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
  useIntent('read', intent => {
    const to = (intent.at && pageOfAyah(intent.at)) || intent.page || page;
    setPage(to);
    setActions(null);
    setTools(false);
    setReviewing(!!intent.recite && !!intent.review);
    setMark(intent.at && !intent.recite ? { key: intent.at, page: to } : null);
    setPosition(intent.recite ? { start: intent.at ?? modelOf(to).order[0], shown: null, words: 0 } : null);
  });

  const startRecite = () => {
    setActions(null);
    setTools(false);
    setReviewing(false);
    setPosition({ start: mark?.page === page ? mark.key : model.order[0], shown: null, words: 0 });
  };
  const stopRecite = () => { setActions(null); setReviewing(false); setPosition(null); };
  const reviewDone = reviewing && !!position?.shown;
  const reviewNext = reviewing && position ? nextForgotten(forgotten, position.start) : null;
  const reviewAt = position ? forgotten.filter(key => compareKeys(key, position.start) < 0).length + 1 : 1;
  const reviewTotal = forgotten.length + (position && !forgotten.includes(position.start) ? 1 : 0);

  const revealNextAyah = () => {
    if (!position || !view) return;
    if (reviewDone) {
      if (reviewNext) jump({ page: pageOfAyah(reviewNext) ?? page, key: reviewNext, mark: false }, 'review');
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

  const run = (action: GestureAction, key: string | null, x: number, y: number) => {
    if (action === 'tools') setTools(on => !on);
    else if (action === 'next-ayah') revealNextAyah();
    else if (action === 'next-word') revealNextWord();
    else if (action === 'back') stepBackOne();
    else if (key && action === 'actions') { buzz(); setActions({ key, x, y }); }
    else if (key && action === 'forgot') markForgotten(key);
    else if (key && action === 'save') toggleSaved(key);
  };

  // A tap waits for a second one only when a double tap does something, so a plain tap stays instant otherwise.
  const pending = useRef<{ timer: ReturnType<typeof setTimeout> } | null>(null);
  const moved = useRef(0);
  const actionsOpen = useRef(false);
  actionsOpen.current = !!actions;
  const latest = useRef(run);
  latest.current = run;
  const onMove = useCallback(() => {
    moved.current = Date.now();
    if (pending.current) { clearTimeout(pending.current.timer); pending.current = null; }
  }, []);
  useEffect(() => () => { if (pending.current) clearTimeout(pending.current.timer); }, []);
  const openIndex = useCallback(() => { setActions(null); setSheet('index'); }, []);
  const onTouch = useCallback((touch: Touch, key: string | null, x: number, y: number) => {
    if (Date.now() - moved.current < 350) return;
    // A touch that closes the ayah buttons only closes them, as on the website.
    if (actionsOpen.current) { setActions(null); return; }
    const set = readGestures()[mode];
    if (touch === 'long') { latest.current(set.long, key, x, y); return; }
    if (pending.current) {
      clearTimeout(pending.current.timer);
      pending.current = null;
      latest.current(set.double, key, x, y);
      return;
    }
    if (set.double === 'none') { latest.current(set.tap, key, x, y); return; }
    pending.current = { timer: setTimeout(() => { pending.current = null; latest.current(set.tap, key, x, y); }, DOUBLE_TAP) };
  }, [mode]);

  // While reciting the page ends above the recite pill, so it never covers a line.
  const pageInsets = { top: insets.top, bottom: reciting ? tabBarBottom(insets.bottom) + RECITE_BAR + 8 : insets.bottom };
  const height = size ? size.height - pageInsets.top - pageInsets.bottom : 0;
  const render = (at: number, width: number, pageHeight: number) => {
    const atModel = modelOf(at);
    return (
      <MushafPageView page={at} data={pageData(at)} model={atModel} palette={palette} width={width} height={pageHeight}
        top={surahBefore(at)} names={surahNames} mark={mark?.page === at ? mark.key : null}
        recite={position ? reciteView(atModel, position) : null} forgot={forgot} saved={saved} onTouch={onTouch} />
    );
  };

  const actionKey = actions?.key;
  const forgotCount = actionKey ? (forgot[actionKey]?.forgot ?? 0) : 0;
  // Where else the ayah is: its compare cards and the trees that hold it, each shown only when there are any.
  const targets = useMemo(() => (actionKey ? compareTargetsOfAyah(actionKey) : []), [actionKey]);
  const trees = useMemo(() => !!actionKey && hasTrees(actionKey), [actionKey]);
  const [choosing, setChoosing] = useState<CompareTarget[] | null>(null);
  const buttons = 2 + (forgotCount > 0 ? 1 : 0) + (targets.length ? 1 : 0) + (trees ? 1 : 0);
  const barWidth = buttons * 48 + 12;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paperDeep }} onLayout={event => setSize({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })}>
      <View style={{ paddingTop: pageInsets.top, paddingBottom: pageInsets.bottom }}>
        {size && height > 0 && (
          <ReaderPager page={page} count={PAGES} width={size.width} height={height} onPage={turnTo} onMove={onMove} render={render} onPull={openIndex} zoom={zoom} onZoom={zoomTo} />
        )}
      </View>
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
          style={{ position: 'absolute', top: Math.max(insets.top + 8, actions.y - 70), left: Math.min((size?.width ?? 300) - barWidth - 8, Math.max(8, actions.x - barWidth / 2)), flexDirection: 'row', gap: 6, padding: 6, borderRadius: 12, borderWidth: 1, borderColor: palette.rule, backgroundColor: palette.paper, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, elevation: 6 }}>
          <Pressable accessibilityRole="button" accessibilityLabel={forgotCount ? `نسيتها مرة أخرى (نسيتها ${num(forgotCount)} من قبل)` : 'نسيتها'}
            onPress={() => { markForgotten(actions.key); setActions(null); }}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4, padding: 9, borderRadius: 10, backgroundColor: forgotCount ? palette.accent : 'transparent' }}>
            <LightbulbOff size={24} color={forgotCount ? palette.onAccent : palette.ink} />
            {forgotCount > 0 && <Text style={{ color: palette.onAccent, fontSize: 14 }}>{num(forgotCount)}</Text>}
          </Pressable>
          {forgotCount > 0 && <IconButton Icon={Check} label="تذكّرتها، أزلها من المراجعة" palette={palette} onPress={() => { clearForgotten(actions.key); setActions(null); }} />}
          <IconButton Icon={Bookmark} label={saved.has(actions.key) ? 'أزلها من المحفوظات' : 'احفظ الآية'} palette={palette} on={saved.has(actions.key)} onPress={() => { toggleSaved(actions.key); setActions(null); }} />
          {targets.length > 0 && <IconButton Icon={ArrowLeftRight} label="في المقارنة" palette={palette}
            onPress={() => { setActions(null); if (targets.length === 1) openCompare(targets[0]); else setChoosing(targets); }} />}
          {trees && <IconButton Icon={TreeIcon} label="الأشجار التي فيها الآية" palette={palette} onPress={() => { const key = actions.key; setActions(null); openTreesOf(key); }} />}
        </View>
      )}
      <CompareTargetsSheet targets={choosing} onPick={target => { setChoosing(null); openCompare(target); }} onClose={() => setChoosing(null)} palette={palette} />
      {/* The recite pill: see-through and low at the bottom like the tab bar (owner, 2026-11-13), and just above the tab bar when the app's bars are shown. */}
      {position && (
        <View accessibilityRole="toolbar" accessibilityLabel="أدوات التسميع"
          style={{ position: 'absolute', left: TAB_BAR.side, right: TAB_BAR.side, bottom: tools ? tabBarTop(insets.bottom) + 8 : tabBarBottom(insets.bottom), height: RECITE_BAR, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', borderRadius: 999, overflow: 'hidden', borderWidth: 1, borderColor: palette.glassEdge }}>
          <BlurView intensity={40} tint={palette.scheme} style={StyleSheet.absoluteFill} />
          <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: palette.glass }]} />
          {reviewing && <Text style={{ color: palette.muted, fontSize: 13, paddingHorizontal: 8 }}>مراجعة {num(reviewAt)} من {num(reviewTotal)}</Text>}
          <IconButton Icon={Undo2} label="ارجع خطوة" palette={palette} disabled={atStart(position)} onPress={stepBackOne} />
          <IconButton Icon={ChevronLeft} label="أظهر الكلمة التالية" palette={palette} disabled={reviewDone} onPress={revealNextWord} />
          <IconButton Icon={reviewDone ? ArrowLeft : ChevronsLeft} label={reviewDone ? 'الآية المنسية التالية' : 'أظهر الآية التالية'} palette={palette}
            disabled={reviewDone ? !reviewNext : !view?.upcoming && page === PAGES} onPress={revealNextAyah} />
          <IconButton Icon={X} label="إنهاء التسميع" palette={palette} onPress={stopRecite} />
        </View>
      )}
      <IndexSheet open={sheet === 'index'} onClose={() => setSheet(null)} onJump={jump} palette={palette} page={page} forgotten={forgotten} recite={reciting}
        last={last?.position ? () => { setReviewing(false); setPosition(last.position!); setPage(last.page); } : null} />
    </View>
  );
}
