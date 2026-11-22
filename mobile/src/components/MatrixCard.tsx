import { Fragment, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { Text } from '@/ui/Text';
import { readAyah } from '@/lib/openReader';
import { Gesture, GestureDetector, ScrollView, type GestureType } from 'react-native-gesture-handler';
import { useFitReport, type OnFit } from '@/lib/useFit';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { num } from '@shared/quran/arabicNumber';
import type { Lane } from './TreeCard';
import { matrixOf, readId, surahNames, type MatrixAyah, type MatrixCell, type Presentation } from '@/lib/branches';
import { sharedTone } from '@/lib/marks';
import type { Size } from '@/lib/camera';
import { toneColor, type Palette, CARD } from '@/lib/theme';
import AyahFlow, { AyahWords } from './quran/text/AyahFlow';
import Hourglass from '@/ui/Hourglass';
import Svg, { Circle, Path } from 'react-native-svg';
import { connectionTone, wordConnections, type ConnectionEnd } from '@shared/quran/mutashabih/connections';
import type { Group, Tag } from '@shared/quran/mutashabih/types';
import { BACK_EDGE_SLOP } from '@/lib/stackOptions';
import IconButton from '@/ui/IconButton';
import { Tap } from '@/ui/Tap';
import { useInsideCard } from '@/ui/Card';
import { FEATURE_ICON } from '@/components/featureIcons';

type Props = {
  /** In a feed card that follows its content: how much taller the rows are than the card (lib/useFit.ts). */
  onFit?: OnFit;
  presentation: Presentation; palette: Palette; view: Size; lane?: Lane; around: boolean; onTap: (ayahKeys: string[] | null) => void; onMove: () => void;
  /** The bookmark row, after the last ayah. */
  footer?: React.ReactNode;
  /** The footer stays under the scrolling rows instead of after them, as on home's tree card, so its buttons are always in sight; the rows then scroll inside one framed card. */
  pinFooter?: boolean;
  /** A book group's word connections (the website's GroupConnections): drawn for the tags given, between the ayat in the middle column. */
  connections?: { group: Group; tags: Tag[] };
  /** The connections studio playing: lines still hidden (`r<n>`), and the one waiting for an answer. The read-along lights what `now` names (matrixReading). */
  growth?: { hidden: Set<string>; now: Set<string>; ask?: { id: string; left: number; seconds: number } };
  /** The read-along studio is playing: the word read lights with its matches in the other rows. */
  reading?: boolean;
  /** Told when a swipe moved off the ayah column to the ayah before or after. */
  onColumn?: () => void;
  /** A gesture around the card that should still see sideways drags (the tour's step swipe). */
  alongside?: GestureType;
  /** Shown under an ayah's text in the middle column, by the row's first ayah (a checked quiz answer). */
  note?: (key: string) => React.ReactNode;
  /** Inside the card under its rows, in the middle column (a book's words under the ayat it names). */
  below?: React.ReactNode;
  /** The rows scrolled (the branches tab hides its top bar while they scroll down). */
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void };

type Host = ComponentRef<typeof View>;
/** Where each word of the middle column registers itself, keyed `ayah:index` as the group's positions are. */
const Words = createContext<{ words: Map<string, Host>; measure: () => void } | null>(null);
type Route = { id: string; tag: Tag; d: string; from: { x: number; y: number }; to: { x: number; y: number } };

/** A column is most of the card wide, so the next one peeks in beside it (the website's 86%). */
const SHARE = 0.86;
const GAP = 8;
/** The matrix card's inner margin, round all its columns. */
const PAD = 12;
const EDGE = 16;
const SWIPE = 0.2;
const FLICK = 500;

type Light = { lit: string | null; onWord: (link: string) => void };
/** The read-along in one row: the word being read (`row:key:index`) and its link (`link:<link>`), lit together. */
type Read = { row: number; now: Set<string> };

/** A word's colour: shared by every row in full, by only some rows faded into the card, lit on the highlight. */
function toneOf(ayah: MatrixAyah, i: number, palette: Palette, light?: Light) {
  const link = ayah.links?.get(i);
  if (link && light?.lit === link.link) return { color: palette.onHighlight, backgroundColor: palette.highlight };
  const color = sharedTone(palette, ayah, i);
  return color ? { color } : undefined;
}

/** The word the read-along is on, and the words matched with it in the other rows, lit as a tap lights them. */
function readTone(ayah: MatrixAyah, i: number, palette: Palette, read?: Read) {
  if (!read?.now.size) return undefined;
  const link = ayah.links?.get(i)?.link;
  if (!read.now.has(readId(read.row, ayah.key, i)) && !(link && read.now.has(`link:${link}`))) return undefined;
  return { color: palette.onHighlight, backgroundColor: palette.highlight };
}

/** `shown`: how many of this ayah's words show (the studio's growing ayah); the rest keep their place unseen. */
const UNSEEN = { color: 'transparent' } as const;
function Ayah({ ayah, palette, muted, light, read, shown = Infinity }: { ayah: MatrixAyah; palette: Palette; muted: boolean; light?: Light; read?: Read; shown?: number }) {
  const [, number] = ayah.key.split(':').map(Number);
  const registry = useContext(Words);
  const press = (i: number) => {
    const link = light && ayah.links?.get(i)?.link;
    return link ? () => light.onWord(link) : undefined;
  };
  if (registry && !muted) return <>
    {ayah.words.map((word, i) => {
      const tone = readTone(ayah, i, palette, read) ?? toneOf(ayah, i, palette, light);
      return <View key={i} ref={view => { if (view) registry.words.set(`${ayah.key}:${i}`, view); else registry.words.delete(`${ayah.key}:${i}`); }} onLayout={registry.measure} collapsable={false}>
        <Text onPress={press(i)}><AyahWords look={{ ...tone, ...(i >= shown ? UNSEEN : null) }}>{word}</AyahWords></Text>
      </View>;
    })}
    <AyahWords look={{ color: palette.accent, ...(ayah.words.length > shown ? UNSEEN : null) }}>{num(number)}</AyahWords>
  </>;
  return <>
    {ayah.words.map((word, i) => {
      const tone = readTone(ayah, i, palette, read) ?? toneOf(ayah, i, palette, light);
      return <Text key={i}>{i > 0 ? ' ' : ''}<Text onPress={press(i)}><AyahWords look={{ ...tone, ...(i >= shown ? UNSEEN : null) }}>{word}</AyahWords></Text></Text>;
    })}
    <Text style={[{ color: muted ? palette.muted : palette.accent }, ayah.words.length > shown && UNSEEN]}> {num(number)} </Text>
  </>;
}

/** One ayah card of the matrix; the tree's lit-path card under the tree is this card too (owner, 2026-11-14). */
export function Cell({ cell, at, palette, width, current, onPress, light, note, still, read, tools, stacked = false, shown, around }: { cell: MatrixCell; at: 'before' | 'ayah' | 'after'; palette: Palette; width: number; current: boolean;
  /** The ayat drawn around this one (the card under a tree with the surrounding ayat on): read with it and named in its range. */
  around?: { before: MatrixAyah[]; after: MatrixAyah[] };
  /** The studio's growing ayah: how many words of the cell (its ayat in turn) show; the rest keep their place unseen. */
  shown?: number;
  /** One row of the matrix's single card (owner, 2026-11-14): no card of its own, the rows parted by rules, as the compare card stacks its sides. */
  stacked?: boolean;
  /** Left out where the card is only read (under the tree): it is then no button, so its own buttons stay reachable. */
  onPress?: () => void; light?: Light; note?: Props['note']; still?: boolean; read?: Read;
  /** More buttons beside the read button. */
  tools?: React.ReactNode }) {
  if (!cell) return <View style={{ width }} />;
  const own = cell.ayat[0];
  const first = around?.before[0] ?? own;
  const last = around?.after[around.after.length - 1] ?? cell.ayat[cell.ayat.length - 1];
  const [surah, number] = first.key.split(':').map(Number);
  const [lastSurah, lastNumber] = last.key.split(':').map(Number);
  const range = first === last ? num(number) : `${num(number)}–${lastSurah === surah ? num(lastNumber) : `${surahNames[lastSurah]} ${num(lastNumber)}`}`;
  const muted = at !== 'ayah';
  const wordViews = !!useContext(Words);
  const [head, setHead] = useState(26);
  // Each ayah of a passage shows what is left of `shown` after the ayat before it.
  const shownOf = (index: number) => shown === undefined ? undefined : shown - cell.ayat.slice(0, index).reduce((sum, item) => sum + item.words.length, 0);
  // A word takes the touch from the cell, so it does the cell's tap too (double tap to save, the studio's answer…).
  const tapped = current && !muted && light ? { lit: light.lit, onWord: (link: string) => { light.onWord(link); onPress?.(); } } : undefined;
  // The ayat around this one, drawn as the tree now draws their boxes (as its own), each with the basmala, muted, between it
  // and the next surah's first ayah.
  const mutedText = { color: palette.muted };
  const aroundOf = (ayat: MatrixAyah[], side: 'before' | 'after') => ayat.map(ayah => <Text key={ayah.key}>
    {side === 'after' && ayah.basmala && <AyahWords look={mutedText}>{`${ayah.basmala.join(' ')} `}</AyahWords>}
    <Ayah ayah={ayah} palette={palette} muted={false} />
    {side === 'before' && ayah.basmala && <AyahWords look={mutedText}>{` ${ayah.basmala.join(' ')} `}</AyahWords>}
  </Text>);
  const basmala = first.basmala && <AyahFlow center color={palette.muted}><AyahWords>{first.basmala.join(' ')}</AyahWords></AyahFlow>;
  return (
    // The card's own buttons sit beside its tap area, not in it: a button inside a pressable is lost on the web and to screen readers (R0055).
    <View style={stacked ? { width, paddingVertical: 8 } : { width, opacity: current ? 1 : 0.45, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.rule, ...CARD, paddingHorizontal: 12, paddingVertical: 8 }}>
    <Tap onPress={onPress} accessible={!!onPress} accessibilityRole={onPress ? 'button' : undefined} accessibilityLabel={`${surahNames[surah]} ${range}`}>
      {/* As the compare card heads a side (owner, 2026-11-15): the buttons at the right edge, in the thumb's reach, and the surah's
          name and number in the middle. The row is set left to right and filled from its right end, in any host. */}
      <View {...({ dir: 'ltr' } as object)} onLayout={event => setHead(event.nativeEvent.layout.height)} style={{ direction: 'ltr', flexDirection: 'row-reverse', alignItems: 'center', gap: 4, marginBottom: 4, minHeight: 26 }}>
        <Text style={{ flex: 1, color: palette.muted, fontSize: 15, textAlign: 'center', paddingHorizontal: current && !still ? (tools ? 64 : 32) : 0 }}>
          {lastSurah !== surah ? `${surahNames[surah]} ${num(number)} ثم ${surahNames[lastSurah]} ${num(lastNumber)}` : `${surahNames[surah]} ${range}`}{at === 'before' ? ' · قبلها' : at === 'after' ? ' · بعدها' : ''}
        </Text>
      </View>
      {at === 'after' && basmala}
      {around ? <AyahFlow center color={palette.ink}>
          {aroundOf(around.before, 'before')}
          {cell.ayat.map((ayah, index) => <Ayah key={ayah.key} ayah={ayah} palette={palette} muted={false} light={tapped} read={read} shown={shownOf(index)} />)}
          {aroundOf(around.after, 'after')}
        </AyahFlow>
      : wordViews && !muted
        // Each word its own box, so the connection lines can find it: a wrapping row from the right, as the text runs.
        ? <AyahFlow row center color={palette.ink}>{cell.ayat.map((ayah, index) => <Ayah key={ayah.key} ayah={ayah} palette={palette} muted={muted} light={tapped} read={muted ? undefined : read} shown={shownOf(index)} />)}</AyahFlow>
        : <AyahFlow center color={muted ? palette.muted : palette.ink}>
          {cell.ayat.map((ayah, index) => <Ayah key={ayah.key} ayah={ayah} palette={palette} muted={muted} light={tapped} read={muted ? undefined : read} shown={shownOf(index)} />)}
        </AyahFlow>}
      {at === 'before' && basmala}
      {at === 'ayah' && note?.(own.key)}
    </Tap>
    {/* Centred on the heading row, as when they sat in it. */}
    {current && !still && <View style={{ position: 'absolute', top: 8, right: stacked ? 0 : 12, height: head, flexDirection: 'row-reverse', alignItems: 'center', gap: 4, zIndex: 1 }}>
      <IconButton Icon={FEATURE_ICON.mushaf} label={`قراءة ${surahNames[own.key.split(':').map(Number)[0]]} ${num(Number(own.key.split(':')[1]))}`} onPress={() => readAyah(own.key)} size="small" />
      {tools}
    </View>}
    </View>
  );
}

/** The matrix as share as image draws it: the ayah column only, one card per row. */
export function MatrixShare({ presentation, palette, width }: { presentation: Presentation; palette: Palette; width: number }) {
  const matrix = useMemo(() => matrixOf(presentation, false), [presentation]);
  return (
    <View style={{ width, gap: 10 }}>
      {matrix.rows.map((row, r) => <Cell key={r} cell={row.ayah} at="ayah" palette={palette} width={width} current still onPress={() => {}} />)}
    </View>
  );
}

/**
 * The website's ayah matrix: a row per ayah of the tree, coloured where every row shares a word. With the surrounding switch,
 * the ayah before and after each sit in columns either side; a sideways swipe steps a column, then on to the next tree.
 */
export default function MatrixCard({ onFit, presentation, palette, view, lane, around, onTap, onMove, footer, pinFooter = false, connections, growth, reading, onColumn, alongside, note, below, onScroll }: Props) {
  const matrix = useMemo(() => matrixOf(presentation, around), [presentation, around]);
  const count = matrix.columns.length;
  // One column fills the card; with the ayat around it, its neighbours peek in from the sides.
  // On home the card's frame is the view's edge; on the branches page it keeps a margin from the screen's.
  // Inside a card (a checked quiz in a feed card) the matrix draws no frame of its own: no box in a box (owner, 2026-11-19).
  const inside = useInsideCard();
  const framed = !pinFooter && !inside;
  const width = count === 1 ? view.width - 2 * PAD - (framed ? 2 * EDGE : 0) : Math.round(view.width * SHARE);
  const step = width + GAP;
  // Columns run right to left like the text: the ayah before on the right, the ayah after on the left.
  const xOf = (i: number) => PAD + (count - 1 - i) * step;
  const shiftOf = (i: number) => view.width / 2 - (xOf(i) + width / 2);
  const start = matrix.columns.indexOf('ayah');
  const [column, setColumn] = useState(start);
  useEffect(() => { if (column !== start) onColumn?.(); }, [column]); // eslint-disable-line react-hooks/exhaustive-deps
  const shift = useSharedValue(shiftOf(start));
  const base = useSharedValue(shiftOf(start));
  const at = useSharedValue(start);
  const mode = useSharedValue<'column' | 'swipe' | 'none'>('none');
  const from = useSharedValue(0);
  const shifts = matrix.columns.map((_, i) => shiftOf(i));
  // A new card width (the phone turned) keeps the same column in the middle.
  useEffect(() => {
    base.value = shifts[at.value];
    shift.value = shifts[at.value];
  }, [view.width]); // eslint-disable-line react-hooks/exhaustive-deps

  const goTo = (i: number) => {
    at.value = i;
    base.value = shifts[i];
    shift.value = withTiming(shifts[i], { duration: 250 });
    setColumn(i);
  };

  const pan = Gesture.Pan()
    .hitSlop(BACK_EDGE_SLOP)
    .activeOffsetX([-12, 12])
    .failOffsetY([-12, 12])
    .onStart(event => {
      const forward = event.translationX > 0;
      const opens = forward ? at.value < count - 1 : at.value > 0;
      mode.value = opens ? 'column' : lane ? 'swipe' : 'none';
      cancelAnimation(shift);
      if (mode.value === 'swipe' && lane) {
        cancelAnimation(lane.offset);
        from.value = Math.round(lane.offset.value / lane.width);
      }
      scheduleOnRN(onMove);
    })
    .onUpdate(event => {
      if (mode.value === 'column') shift.value = base.value + event.translationX;
      else if (mode.value === 'swipe' && lane) {
        const forward = event.translationX > 0;
        const open = forward ? from.value + 1 < lane.count : from.value > 0;
        lane.offset.value = from.value * lane.width + (open ? event.translationX : event.translationX / 4);
      }
    })
    .onEnd(event => {
      scheduleOnRN(onMove);
      if (mode.value === 'column') {
        const far = Math.abs(event.translationX) > view.width * SWIPE || Math.abs(event.velocityX) > FLICK;
        const next = far ? Math.min(count - 1, Math.max(0, at.value + (event.translationX > 0 ? 1 : -1))) : at.value;
        at.value = next;
        base.value = shifts[next];
        shift.value = withTiming(shifts[next], { duration: 250 });
        scheduleOnRN(setColumn, next);
      } else if (mode.value === 'swipe' && lane) {
        lane.settle(from.value, event.translationX, event.velocityX);
      }
      mode.value = 'none';
    });

  const lanes = useAnimatedStyle(() => ({ transform: [{ translateX: shift.value }] }));
  const middle = matrix.columns.indexOf('ayah');
  const lines = useConnectionLines(connections, column === middle, palette);
  // In the studio's recall mode, a mark where the next line lands waits for a tap (or its timer).
  const asked = growth?.ask && lines.routes.find(route => route.id === growth.ask!.id);
  const keysOf = (cell: MatrixCell) => cell?.ayat.map(ayah => ayah.key) ?? [];
  // A tapped word lights the words lined up with it in the other rows, as on the compare tab.
  const [lit, setLit] = useState<string | null>(null);
  // Links are numbered per tree, so a new tree starts with nothing lit.
  useEffect(() => setLit(null), [presentation]);
  const light: Light = { lit, onWord: link => setLit(current => (current === link ? null : link)) };
  const fit = useFitReport(onFit);

  if (alongside) pan.simultaneousWithExternalGesture(alongside);
  return (
    <GestureDetector gesture={pan}>
      <View collapsable={false} style={{ width: view.width, height: view.height, overflow: 'hidden', direction: 'ltr' }}>
        <ScrollView {...fit} nestedScrollEnabled onScroll={onScroll} scrollEventThrottle={16} style={pinFooter && !inside ? { flex: 1, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.rule, ...CARD } : { flex: 1 }} contentContainerStyle={{ paddingVertical: framed ? 12 : 0 }} showsVerticalScrollIndicator={false}>
          <Words.Provider value={connections ? lines.registry : null}>
          {/* One card as wide as all its columns (owner, 2026-11-14): the rows parted by rules, solid between surahs and dashed within one. */}
          <Animated.View ref={lines.frame} onLayout={lines.measure} collapsable={false} style={[{ width: count * step - GAP + 2 * PAD, paddingHorizontal: PAD, paddingVertical: 4 }, framed && { backgroundColor: palette.card, borderWidth: 1, borderColor: palette.rule, ...CARD }, lanes]}>
            {matrix.rows.map((row, r) => (
              <Fragment key={r}>
              {r > 0 && <RowRule dashed={surahOf(row.ayah) === surahOf(matrix.rows[r - 1].ayah)} color={palette.rule} />}
              <View style={{ flexDirection: 'row-reverse', gap: GAP, alignItems: 'stretch' }}>
                {matrix.columns.map((name, i) => (
                  <Cell key={name} stacked cell={row[name]} at={name} palette={palette} width={width} current={i === column} light={light} note={note}
                    read={reading && growth ? { row: r, now: growth.now } : undefined}
                    onPress={() => (i === column ? onTap(keysOf(row[name])) : goTo(i))} />
                ))}
              </View>
              </Fragment>
            ))}
            {below && <>
              <RowRule dashed={false} color={palette.rule} />
              <View style={{ flexDirection: 'row-reverse', gap: GAP }}>
                {matrix.columns.map(name => <View key={name} style={{ width }}>{name === 'ayah' ? below : null}</View>)}
              </View>
            </>}
            {lines.routes.length > 0 && <Svg pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, width: count * step - GAP + 2 * PAD, height: '100%' }}>
              {lines.routes.filter(route => !growth?.hidden.has(route.id)).map(route => (
                <Fragment key={route.id}>
                  <Path d={route.d} stroke={toneColor(palette, connectionTone(route.tag))} strokeWidth={1.25} fill="none" />
                  <Circle cx={route.from.x} cy={route.from.y} r={2} fill={palette.paperDeep} stroke={toneColor(palette, connectionTone(route.tag))} strokeWidth={1.25} />
                  <Circle cx={route.to.x} cy={route.to.y} r={2} fill={palette.paperDeep} stroke={toneColor(palette, connectionTone(route.tag))} strokeWidth={1.25} />
                </Fragment>
              ))}
            </Svg>}
            {asked && <View pointerEvents="none" style={{ position: 'absolute', left: asked.to.x - 22, top: asked.to.y - 52, width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.card, borderWidth: 1, borderColor: palette.accent }}>
              {growth!.ask!.seconds ? <Hourglass left={growth!.ask!.left} seconds={growth!.ask!.seconds} color={palette.accent} /> : <Text style={{ color: palette.accent, fontSize: 22, fontWeight: '700' }}>؟</Text>}
            </View>}
          </Animated.View>
          </Words.Provider>
          {!pinFooter && footer}
        </ScrollView>
        {pinFooter && footer}
      </View>
    </GestureDetector>
  );
}

const surahOf = (cell: MatrixCell) => cell?.ayat[0]?.key.split(':')[0];

/** A rule across the matrix card between two rows; iOS draws no dashed border on one edge only, so a dashed box is clipped to its top edge. */
function RowRule({ dashed, color }: { dashed: boolean; color: string }) {
  if (!dashed) return <View style={{ height: 1, backgroundColor: color }} />;
  return <View style={{ height: 1, overflow: 'hidden' }}><View style={{ height: 3, borderWidth: 1, borderColor: color, borderStyle: 'dashed' }} /></View>;
}

type Box = { left: number; right: number; top: number; bottom: number };

/**
 * The website's ConnectionLines: a curve from each word of one ayah to its counterpart in the next, coloured by the kind of
 * difference; a word missing on one side points at the gap where it would sit. Words are measured in the lane's own points.
 */
function useConnectionLines(connections: Props['connections'], shown: boolean, palette: Palette) {
  const words = useRef(new Map<string, Host>()).current;
  const frame = useRef<Host>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [layout, setLayout] = useState(0);
  // Many words report their layout at once: measure once, on the next frame.
  const pending = useRef(false);
  const measure = useCallback(() => {
    if (pending.current) return;
    pending.current = true;
    requestAnimationFrame(() => { pending.current = false; setLayout(value => value + 1); });
  }, []);
  const registry = useMemo(() => ({ words, measure }), [words, measure]);
  const group = connections?.group;
  const tags = connections?.tags.join(' ') ?? '';
  useEffect(() => {
    const root = frame.current;
    if (!root || !group || !tags || !shown) { setRoutes([]); return; }
    const links = tags.split(' ').flatMap(tag => wordConnections(group, tag as Tag).map(link => ({ ...link, tag: tag as Tag })));
    const place = (key: string) => new Promise<Box | null>(resolve => {
      const view = words.get(key);
      if (!view) { resolve(null); return; }
      try { view.measureLayout(root, (x, y, w, h) => resolve({ left: x, right: x + w, top: y, bottom: y + h }), () => resolve(null)); } catch { resolve(null); }
    });
    const end = async (side: ConnectionEnd): Promise<Box | null> => {
      if ('gap' in side) {
        const box = await place(`${side.gap.key}:${side.gap.index}`);
        if (!box) return null;
        const x = side.edge === 'after' ? box.left - 4 : box.right + 4;
        return { left: x, right: x, top: box.top, bottom: box.bottom };
      }
      const boxes = await Promise.all(side.words.map(word => place(`${word.key}:${word.index}`)));
      if (boxes.some(box => !box)) return null;
      const all = boxes as Box[];
      return { left: Math.min(...all.map(box => box.left)), right: Math.max(...all.map(box => box.right)), top: Math.min(...all.map(box => box.top)), bottom: Math.max(...all.map(box => box.bottom)) };
    };
    let active = true;
    void Promise.all(links.map(async (link, index) => {
      const [a, b] = await Promise.all([end(link.from), end(link.to)]);
      if (!a || !b) return [];
      const from = { x: (a.left + a.right) / 2, y: a.bottom + 2 };
      const to = { x: (b.left + b.right) / 2, y: b.top - 2 };
      const mid = (from.y + to.y) / 2;
      return [{ id: `r${index}`, tag: link.tag, from, to, d: `M ${from.x} ${from.y} C ${from.x} ${mid}, ${to.x} ${mid}, ${to.x} ${to.y}` }];
    })).then(found => { if (active) setRoutes(found.flat()); });
    return () => { active = false; };
  }, [group, tags, shown, layout, words, palette]);
  return { registry, frame, routes, measure };
}
