import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ComponentRef } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Text } from '@/components/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from 'expo-router';
import { ArrowLeft, ArrowLeftRight, Bookmark, Check, ChevronLeft, ChevronsLeft, EyeOff, Layers, LightbulbOff, List, NotebookPen, PenLine, Send, TextSearch, Undo2, X, type LucideProps } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { readBookmarks, subscribeBookmarks, toggleBookmark } from '@shared/bookmarks';
import { ayahBookmarkId, ayahHref, markForgotten, rememberAyah, readDueMarks, subscribeDueMarks } from '@shared/ayahMarks';
import { readAyahNotes, subscribeAyahNotes } from '@shared/ayahNotes';
import { readGestures, type GestureAction } from '@shared/readerGestures';
import { atStart, compareKeys, forgottenOrder, nextForgotten, revealAyah, stepBack, type RecitePosition } from '@shared/quran/recite';
import { keepsSpace, maxLetters, typedLetters, wordTargets, writtenRight } from '@shared/quran/writeAyah';
import { nextOpening, openingRound, type Openings } from '@shared/quran/openings';
import TabHint from './TabHint';
import TopBar from './TopBar';
import { TAB_BAR, tabBarBottom, tabBarTop } from './tabBarSpace';
import ReaderPager from './ReaderPager';
import MushafPageView, { type Checked, type Touch, type Write } from './MushafPageView';
import { IndexSheet, type Jump } from './ReaderSheets';
import AyahPreviewSheet, { type Preview } from './AyahPreviewSheet';
import NoteSheet from './NoteSheet';
import WordSheet from './WordSheet';
import TreeIcon from './TreeIcon';
import { shareAyah } from './AyahShare';
import { hasQiraat } from '@shared/quran/qiraatData';
import { hasTrees } from '@/lib/branchList';
import { compareTargetsOfAyah } from '@/lib/compare';
import { ayahCounts, PAGES, pageData, pageOfAyah, surahBefore, surahNames } from '@/lib/mushaf';
import { pageModel, reciteView } from '@shared/quran/recitePage';
import { lemmasAtMushafWord } from '@shared/quran/words';
import { words } from '@/lib/words';
import { readJson, writeJson } from '@/lib/storage';
import { setImmersive } from '@/lib/chrome';
import { buzz } from '@/lib/haptics';
import { useKeyboardHeight } from '@/lib/keyboard';
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
/** Whether recite mode asks to write each ayah's first and last words (on) or only reveals them (off). */
const WRITE = 'reader-write';

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

function IconButton({ Icon, label, onPress, palette, on = false, disabled = false, color }: { Icon: (props: LucideProps) => React.ReactNode; label: string; onPress: () => void; palette: Palette; on?: boolean; disabled?: boolean; color?: string }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled, selected: on }} hitSlop={6}
      style={{ padding: 9, borderRadius: 999, backgroundColor: on ? palette.accent : 'transparent', opacity: disabled ? 0.35 : 1 }}>
      <Icon size={24} color={on ? palette.onAccent : color ?? palette.ink} />
    </Pressable>
  );
}

/** A long-press button: the icon with its name under it (owner, 2026-11-13: the buttons got many, so each says what it is). */
function ActButton({ Icon, label, name, onPress, palette, on = false, color }: { Icon: (props: LucideProps) => React.ReactNode; label: string; name: string; onPress: () => void; palette: Palette; on?: boolean; color?: string }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected: on }}
      style={{ width: ACT_WIDTH, alignItems: 'center', gap: 3, paddingTop: 7, paddingBottom: 5, borderRadius: 10, backgroundColor: on ? palette.accent : 'transparent' }}>
      <Icon size={22} color={on ? palette.onAccent : color ?? palette.ink} />
      <Text numberOfLines={1} style={{ fontSize: 11, color: on ? palette.onAccent : palette.muted }}>{name}</Text>
    </Pressable>
  );
}
const ACT_WIDTH = 56;

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
  const [actions, setActions] = useState<{ key: string; x: number; y: number; lemmas: number[] } | null>(null);
  const [wordLemmas, setWordLemmas] = useState<number[] | null>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [zoom, setZoom] = useState(() => settleZoom(readJson<number>(ZOOM) ?? 1));
  const zoomTo = useCallback((next: number) => { setZoom(next); writeJson(ZOOM, next); }, []);
  const forgot = useSyncExternalStore(subscribeDueMarks, readDueMarks);
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks);
  const notes = useSyncExternalStore(subscribeAyahNotes, readAyahNotes);
  const [noting, setNoting] = useState<string | null>(null);
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
  const [typed, setTyped] = useState<Record<number, string>>({});
  const [current, setCurrent] = useState<number | null>(null);
  const [checked, setChecked] = useState<Checked | null>(null);
  const input = useRef<ComponentRef<typeof TextInput>>(null);
  // A review or the openings quiz asks one ayah at a time: once it shows, nothing more is written until the next one.
  const reviewDone = (reviewing || !!openings) && !!position?.shown;
  const writeKey = writing && view?.upcoming && !reviewDone ? view.upcoming : null;
  const writeWords = useMemo(() => (writeKey ? model.lines.flatMap(line => line?.filter(group => group.word && `${group.surah}:${group.ayah}` === writeKey).map(group => group.word) ?? []) : []), [writeKey, model]);
  const offset = writeKey?.endsWith(':1') ? view?.titled.get(Number(writeKey.split(':')[0])) ?? 0 : 0;
  // Words already shown (by the next-word button) are not asked.
  const asked = writeKey && view ? wordTargets(writeWords).filter(at => view.hidden(writeKey, at + offset)) : [];
  const askedKey = asked.join(',');
  useEffect(() => {
    setTyped({});
    setCurrent(writeKey ? (askedKey ? Number(askedKey.split(',')[0]) : null) : null);
    if (writeKey) setTimeout(() => input.current?.focus(), 50);
  }, [writeKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const keyboard = useKeyboardHeight(reciting && writing);
  const toggleWriting = () => { setWriting(on => { writeJson(WRITE, !on); return !on; }); setChecked(null); input.current?.blur(); };
  const check = (filled: Record<number, string>) => {
    if (!writeKey || !position) return;
    const right = asked.filter(at => writtenRight(filled[at] ?? '', writeWords[at]));
    setChecked({ key: writeKey, right, wrong: asked.filter(at => !right.includes(at)) });
    setPosition(revealAyah(position, writeKey));
  };
  const moveOn = (filled: Record<number, string>) => {
    const at = current === null ? -1 : asked.indexOf(current);
    if (at + 1 < asked.length) setCurrent(asked[at + 1]);
    else check(filled);
  };
  const onWrite = (text: string) => {
    if (current === null) return;
    const done = /\s/.test(text) && !keepsSpace(text, writeWords[current]);
    const letters = typedLetters(text);
    const filled = { ...typed, [current]: letters };
    setTyped(filled);
    if (done || letters.length >= maxLetters(writeWords[current])) moveOn(filled);
  };
  const onWriteKey = (key: string) => {
    if (key !== 'Backspace' || current === null || typed[current]) return;
    const at = asked.indexOf(current);
    if (at > 0) setCurrent(asked[at - 1]);
  };
  const write: Write | null = writeKey ? { key: writeKey, targets: asked, typed, current, onBox: at => { setCurrent(at); input.current?.focus(); }, onActive: (y, h) => follow.current(y, h) } : null;
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

  useEffect(() => {
    writeJson(PLACE, { page, position, reviewing } satisfies Place);
    if (position && !reviewing && !openings) writeJson(LAST_RECITE, { page, position } satisfies Place);
  }, [page, position, reviewing, openings]);

  const turnTo = useCallback((next: number) => {
    setPage(next);
    setActions(null);
  }, []);
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
  const stopRecite = () => { setActions(null); setReviewing(false); setOpenings(null); setPosition(null); setChecked(null); input.current?.blur(); };
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
    else if (key && action === 'actions') { buzz(); setActions({ key, x, y, lemmas: word === undefined ? [] : lemmasAtMushafWord(words, key, word) }); }
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
  const shown = useRef(page);
  shown.current = page;
  const onMove = useCallback(() => {
    moved.current = Date.now();
    if (pending.current) { clearTimeout(pending.current.timer); pending.current = null; }
  }, []);
  useEffect(() => () => { if (pending.current) clearTimeout(pending.current.timer); }, []);
  const openIndex = useCallback(() => { setActions(null); setSheet('index'); }, []);
  const writingNow = useRef(false);
  writingNow.current = !!writeKey;
  const onTouch = useCallback((touch: Touch, key: string | null, x: number, y: number, word?: number) => {
    if (Date.now() - moved.current < 350) return;
    // While writing, a touch on the page only brings the keyboard back; the boxes pick a word themselves.
    if (writingNow.current) { input.current?.focus(); return; }
    // A touch that closes the ayah buttons only closes them, as on the website.
    if (actionsOpen.current) { setActions(null); return; }
    // While reading, a tap or long press selects the ayah, and a tap on the page clears it.
    if (mode === 'read') setMark(key ? { key, page: shown.current } : null);
    const set = readGestures()[mode];
    if (touch === 'long') { latest.current(set.long, key, x, y, word); return; }
    if (pending.current) {
      clearTimeout(pending.current.timer);
      pending.current = null;
      latest.current(set.double, key, x, y, word);
      return;
    }
    if (set.double === 'none') { latest.current(set.tap, key, x, y, word); return; }
    pending.current = { timer: setTimeout(() => { pending.current = null; latest.current(set.tap, key, x, y, word); }, DOUBLE_TAP) };
  }, [mode]);

  // While reciting the page ends above the recite pill, so it never covers a line.
  // While writing, the page keeps its size and scrolls above the keyboard (owner, 2026-11-13: no squeezed page),
  // following the box being written.
  const pillBottom = keyboard ? keyboard + 8 : tools ? tabBarTop(insets.bottom) + 8 : tabBarBottom(insets.bottom);
  const pageInsets = { top: insets.top, bottom: reciting ? tabBarBottom(insets.bottom) + RECITE_BAR + 8 : insets.bottom };
  const height = size ? size.height - pageInsets.top - pageInsets.bottom : 0;
  const scroller = useRef<ComponentRef<typeof ScrollView>>(null);
  const scrolled = useRef(0);
  useEffect(() => { if (!keyboard) { scroller.current?.scrollTo({ y: 0, animated: false }); scrolled.current = 0; } }, [keyboard]);
  follow.current = (y, h) => {
    if (!keyboard || !size) return;
    const top = insets.top + 8;
    const bottom = size.height - pillBottom - RECITE_BAR - 12;
    if (y + h > bottom) scroller.current?.scrollTo({ y: scrolled.current + y + h - bottom + 24, animated: true });
    else if (y < top) scroller.current?.scrollTo({ y: Math.max(0, scrolled.current - (top - y) - 24), animated: true });
  };
  const render = (at: number, width: number, pageHeight: number) => {
    const atModel = modelOf(at);
    return (
      <MushafPageView page={at} data={pageData(at)} model={atModel} palette={palette} width={width} height={pageHeight}
        top={surahBefore(at)} names={surahNames} mark={!position && mark?.page === at ? mark.key : null}
        recite={position ? reciteView(atModel, position) : null} forgot={forgot} saved={saved} onTouch={onTouch}
        write={at === page ? write : null} checked={position ? checked : null} />
    );
  };

  const actionKey = actions?.key;
  const forgotCount = actionKey ? (forgot[actionKey]?.forgot ?? 0) : 0;
  // Where else the ayah is: its compare cards, the trees that hold it and its readings, each shown only when there are any.
  const targets = useMemo(() => (actionKey ? compareTargetsOfAyah(actionKey) : []), [actionKey]);
  const trees = useMemo(() => !!actionKey && hasTrees(actionKey), [actionKey]);
  const readings = !!actionKey && hasQiraat(actionKey);
  const [preview, setPreview] = useState<Preview | null>(null);
  const buttons = 4 + (forgotCount > 0 ? 1 : 0) + (targets.length ? 1 : 0) + (trees ? 1 : 0) + (readings ? 1 : 0) + (actions?.lemmas.length ? 1 : 0);
  // On a narrow phone the buttons wrap onto a second row rather than run off the screen.
  const barWidth = Math.min(buttons * (ACT_WIDTH + 2) + 10, (size?.width ?? 360) - 16);
  // Each row of labelled buttons is about 62 tall; the bar sits above the pressed line.
  const barRows = Math.ceil(buttons / Math.max(1, Math.floor((barWidth - 10) / (ACT_WIDTH + 2))));
  return (
    <View style={{ flex: 1, backgroundColor: palette.paperDeep }} onLayout={event => setSize({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })}>
      <ScrollView ref={scroller} scrollEnabled={!!keyboard} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always" scrollEventThrottle={32}
        onScroll={event => { scrolled.current = event.nativeEvent.contentOffset.y; }}
        style={{ flex: 1 }} contentContainerStyle={{ paddingTop: pageInsets.top, paddingBottom: keyboard ? keyboard + RECITE_BAR + 24 : pageInsets.bottom }}>
        {size && height > 0 && (
          <ReaderPager page={page} count={PAGES} width={size.width} height={height} onPage={turnTo} onMove={onMove} render={render} onPull={openIndex} zoom={zoom} onZoom={zoomTo} />
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
          <ActButton Icon={LightbulbOff} label={forgotCount ? 'نسيتها مرة أخرى' : 'نسيتها'} name="نسيتها" palette={palette} on={forgotCount > 0} onPress={() => { markForgotten(actions.key); setActions(null); }} />
          {forgotCount > 0 && <ActButton Icon={Check} label="تذكّرتها" name="تذكّرتها" palette={palette} color={palette.green} onPress={() => { rememberAyah(actions.key); setActions(null); }} />}
          <ActButton Icon={Bookmark} label={saved.has(actions.key) ? 'أزلها من المحفوظات' : 'احفظ الآية'} name="احفظ" palette={palette} on={saved.has(actions.key)} onPress={() => { toggleSaved(actions.key); setActions(null); }} />
          <ActButton Icon={NotebookPen} label={notes[actions.key] ? 'تأملك في الآية' : 'اكتب تأملًا'} name="تأمّل" palette={palette} on={!!notes[actions.key]} onPress={() => { setNoting(actions.key); setActions(null); }} />
          {targets.length > 0 && <ActButton Icon={ArrowLeftRight} label="في المقارنة" name="المقارنة" palette={palette}
            onPress={() => { const key = actions.key; setActions(null); setPreview({ kind: 'compare', key }); }} />}
          {trees && <ActButton Icon={TreeIcon} label="الأشجار التي فيها الآية" name="الأشجار" palette={palette} onPress={() => { const key = actions.key; setActions(null); setPreview({ kind: 'trees', key }); }} />}
          {readings && <ActButton Icon={Layers} label="القراءات العشر في كلمات الآية" name="القراءات" palette={palette} onPress={() => { const key = actions.key; setActions(null); setPreview({ kind: 'readings', key }); }} />}
          {actions.lemmas.length > 0 && <ActButton Icon={TextSearch} label={`مواضع «${words.lemmas[actions.lemmas[0]][0]}» في القرآن`} name="المواضع" palette={palette}
            onPress={() => { const lemmas = actions.lemmas; setActions(null); setWordLemmas(lemmas); }} />}
          {/* Share is always the last button. */}
          <ActButton Icon={Send} label="مشاركة" name="مشاركة" palette={palette} onPress={() => { const key = actions.key; setActions(null); shareAyah(key, palette, notes[key]?.text); }} />
        </View>
      )}
      {/* The tree and compare buttons preview in place; each item, and the sheet's last button, opens its page (owner, 2026-11-13). */}
      <AyahPreviewSheet preview={preview} onClose={() => setPreview(null)} palette={palette} />
      <NoteSheet ayah={noting} onClose={() => setNoting(null)} palette={palette} />
      {/* The word long-pressed: its count and the ayat it is in (owner, 2026-11-13). */}
      <WordSheet lemmas={wordLemmas} onClose={() => setWordLemmas(null)} palette={palette} />
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
      {/* The keyboard writes into the box being written; the field itself is out of sight. */}
      {writeKey && (
        <TextInput ref={input} value={current === null ? '' : typed[current] ?? ''} onChangeText={onWrite} onKeyPress={event => onWriteKey(event.nativeEvent.key)}
          autoCorrect={false} autoCapitalize="none" spellCheck={false} autoComplete="off" blurOnSubmit={false} onSubmitEditing={() => moveOn(typed)}
          accessibilityLabel="اكتب الكلمة" style={{ position: 'absolute', opacity: 0, width: 1, height: 1, top: 0, left: 0 }} />
      )}
      {/* The first visit's tip names the reading touches, so it waits out recite mode, and steps aside while an ayah's buttons are open. */}
      <TabHint id="read" palette={palette} hidden={reciting || !!actions} />
      <IndexSheet open={sheet === 'index'} onClose={() => setSheet(null)} onJump={jump} palette={palette} page={page} forgotten={forgotten} recite={reciting}
        last={last?.position ? () => { setReviewing(false); setOpenings(null); setPosition(last.position!); setPage(last.page); } : null} />
    </View>
  );
}
