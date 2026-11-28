import { Fragment, createContext, useCallback, useContext, useMemo, useRef, useState, type ComponentRef } from 'react';
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
import { sharedMark } from '@/lib/marks';
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
import { useOnChange } from '@/lib/hooks/useOnChange';
import { useAdjustOn } from '@/lib/hooks/useAdjustOn';
import { useLater } from '@/lib/hooks/useLater';
import { useLatestRun } from '@/lib/hooks/useLatestRun';

type Props = {
  onFit?: OnFit;
  presentation: Presentation; palette: Palette; view: Size; lane?: Lane; around: boolean; onTap: (ayahKeys: string[] | null) => void; onMove: () => void;
  footer?: React.ReactNode;
  pinFooter?: boolean;
  connections?: { group: Group; tags: Tag[] };
  growth?: { hidden: Set<string>; now: Set<string>; ask?: { id: string; left: number; seconds: number } };
  reading?: boolean;
  onColumn?: () => void;
  alongside?: GestureType;
  note?: (key: string) => React.ReactNode;
  below?: React.ReactNode;
  after?: React.ReactNode;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void };

type Host = ComponentRef<typeof View>;
const Words = createContext<{ words: Map<string, Host>; measure: () => void } | null>(null);
type Route = { id: string; tag: Tag; d: string; from: { x: number; y: number }; to: { x: number; y: number } };

const SHARE = 0.86;
const GAP = 8;
const PAD = 12;
const EDGE = 16;
const SWIPE = 0.2;
const FLICK = 500;

type Light = { lit: string | null; onWord: (link: string) => void };
type Read = { row: number; now: Set<string> };

function isLit(ayah: MatrixAyah, i: number, light?: Light, read?: Read) {
  const link = ayah.links?.get(i)?.link;
  if (link && light?.lit === link) return true;
  if (!read?.now.size) return false;
  return read.now.has(readId(read.row, ayah.key, i)) || !!(link && read.now.has(`link:${link}`));
}

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
      const lit = isLit(ayah, i, light, read);
      return <View key={i} ref={view => { if (view) registry.words.set(`${ayah.key}:${i}`, view); else registry.words.delete(`${ayah.key}:${i}`); }} onLayout={registry.measure} collapsable={false}>
        <Text><AyahWords lit={lit} mark={sharedMark(ayah, i)} onPress={press(i)} look={i >= shown ? UNSEEN : undefined}>{word}</AyahWords></Text>
      </View>;
    })}
    <AyahWords look={{ color: palette.accent, ...(ayah.words.length > shown ? UNSEEN : null) }}>{num(number)}</AyahWords>
  </>;
  return <>{ayahRuns({ ayah, palette, muted, light, read, shown })}</>;
}

function ayahRuns({ ayah, palette, muted, light, read, shown = Infinity }: { ayah: MatrixAyah; palette: Palette; muted: boolean; light?: Light; read?: Read; shown?: number }) {
  const [, number] = ayah.key.split(':').map(Number);
  return [
    ...ayah.words.map((word, i) => {
      const link = light && ayah.links?.get(i)?.link;
      return <AyahWords key={i} lit={isLit(ayah, i, light, read)} mark={sharedMark(ayah, i)} onPress={link ? () => light.onWord(link) : undefined} look={i >= shown ? UNSEEN : undefined}>{`${i > 0 ? ' ' : ''}${word}`}</AyahWords>;
    }),
    <AyahWords key="n" look={{ color: muted ? palette.muted : palette.accent, ...(ayah.words.length > shown ? UNSEEN : null) }}>{` ${num(number)} `}</AyahWords>,
  ];
}

export function Cell({ cell, at, palette, width, current, onPress, light, note, still, read, tools, stacked = false, shown, around }: { cell: MatrixCell; at: 'before' | 'ayah' | 'after'; palette: Palette; width: number; current: boolean;
  around?: { before: MatrixAyah[]; after: MatrixAyah[] };
  shown?: number;
  stacked?: boolean;
  onPress?: () => void; light?: Light; note?: Props['note']; still?: boolean; read?: Read;
  tools?: React.ReactNode }) {
  const wordViews = !!useContext(Words);
  const [head, setHead] = useState(26);
  if (!cell) return <View style={{ width }} />;
  const own = cell.ayat[0];
  const first = around?.before[0] ?? own;
  const last = around?.after[around.after.length - 1] ?? cell.ayat[cell.ayat.length - 1];
  const [surah, number] = first.key.split(':').map(Number);
  const [lastSurah, lastNumber] = last.key.split(':').map(Number);
  const range = first === last ? num(number) : `${num(number)}–${lastSurah === surah ? num(lastNumber) : `${surahNames[lastSurah]} ${num(lastNumber)}`}`;
  const muted = at !== 'ayah';
  const shownOf = (index: number) => shown === undefined ? undefined : shown - cell.ayat.slice(0, index).reduce((sum, item) => sum + item.words.length, 0);
  const tapped = current && !muted && light ? { lit: light.lit, onWord: (link: string) => { light.onWord(link); onPress?.(); } } : undefined;
  const mutedText = { color: palette.muted };
  const aroundOf = (ayat: MatrixAyah[], side: 'before' | 'after') => ayat.flatMap(ayah => [
    side === 'after' && ayah.basmala && <AyahWords key={`${ayah.key}b`} look={mutedText}>{`${ayah.basmala.join(' ')} `}</AyahWords>,
    ...ayahRuns({ ayah, palette, muted: false }),
    side === 'before' && ayah.basmala && <AyahWords key={`${ayah.key}a`} look={mutedText}>{` ${ayah.basmala.join(' ')} `}</AyahWords>,
    ' ',
  ]);
  const basmala = first.basmala && <AyahFlow center color={palette.muted} menu={false}><AyahWords>{first.basmala.join(' ')}</AyahWords></AyahFlow>;
  return (
    // see R0055
    <View style={stacked ? { width, paddingVertical: 8 } : { width, opacity: current ? 1 : 0.45, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.rule, ...CARD, paddingHorizontal: 12, paddingVertical: 8 }}>
    <Tap onPress={onPress} accessible={!!onPress} accessibilityRole={onPress ? 'button' : undefined} accessibilityLabel={`${surahNames[surah]} ${range}`}>
      <View {...({ dir: 'ltr' } as object)} onLayout={event => setHead(event.nativeEvent.layout.height)} style={{ direction: 'ltr', flexDirection: 'row-reverse', alignItems: 'center', gap: 4, marginBottom: 4, minHeight: 26 }}>
        <Text style={{ flex: 1, color: palette.muted, fontSize: 15, textAlign: 'center', paddingHorizontal: current && !still ? (tools ? 64 : 32) : 0 }}>
          {lastSurah !== surah ? `${surahNames[surah]} ${num(number)} ثم ${surahNames[lastSurah]} ${num(lastNumber)}` : `${surahNames[surah]} ${range}`}{at === 'before' ? ' · قبلها' : at === 'after' ? ' · بعدها' : ''}
        </Text>
      </View>
      {at === 'after' && basmala}
      {around ? <AyahFlow center color={palette.ink} menu={false}>
          {aroundOf(around.before, 'before')}
          {cell.ayat.flatMap((ayah, index) => [...ayahRuns({ ayah, palette, muted: false, light: tapped, read, shown: shownOf(index) }), ' '])}
          {aroundOf(around.after, 'after')}
        </AyahFlow>
      : wordViews && !muted
        ? <AyahFlow row center color={palette.ink} menu={false}>{cell.ayat.map((ayah, index) => <Ayah key={ayah.key} ayah={ayah} palette={palette} muted={muted} light={tapped} read={muted ? undefined : read} shown={shownOf(index)} />)}</AyahFlow>
        : <AyahFlow center color={muted ? palette.muted : palette.ink} menu={false}>
          {cell.ayat.flatMap((ayah, index) => [...ayahRuns({ ayah, palette, muted, light: tapped, read: muted ? undefined : read, shown: shownOf(index) }), ' '])}
        </AyahFlow>}
      {at === 'before' && basmala}
      {at === 'ayah' && note?.(own.key)}
    </Tap>
    {current && !still && <View style={{ position: 'absolute', top: 8, right: stacked ? 0 : 12, height: head, flexDirection: 'row-reverse', alignItems: 'center', gap: 4, zIndex: 1 }}>
      <IconButton Icon={FEATURE_ICON.mushaf} label={`قراءة ${surahNames[own.key.split(':').map(Number)[0]]} ${num(Number(own.key.split(':')[1]))}`} onPress={() => readAyah(own.key)} size="small" />
      {tools}
    </View>}
    </View>
  );
}

export function MatrixShare({ presentation, palette, width }: { presentation: Presentation; palette: Palette; width: number }) {
  const matrix = useMemo(() => matrixOf(presentation, false), [presentation]);
  return (
    <View style={{ width, gap: 10 }}>
      {matrix.rows.map((row, r) => <Cell key={r} cell={row.ayah} at="ayah" palette={palette} width={width} current still onPress={() => {}} />)}
    </View>
  );
}

export default function MatrixCard({ onFit, presentation, palette, view, lane, around, onTap, onMove, footer, pinFooter = false, connections, growth, reading, onColumn, alongside, note, below, after, onScroll }: Props) {
  const matrix = useMemo(() => matrixOf(presentation, around), [presentation, around]);
  const count = matrix.columns.length;
  const inside = useInsideCard();
  const framed = !pinFooter && !inside;
  const width = count === 1 ? view.width - 2 * PAD - (framed ? 2 * EDGE : 0) : Math.round(view.width * SHARE);
  const step = width + GAP;
  const xOf = (i: number) => PAD + (count - 1 - i) * step;
  const shiftOf = (i: number) => view.width / 2 - (xOf(i) + width / 2);
  const start = matrix.columns.indexOf('ayah');
  const [column, setColumn] = useState(start);
  useOnChange([column], () => { if (column !== start) onColumn?.(); });
  const shift = useSharedValue(shiftOf(start));
  const base = useSharedValue(shiftOf(start));
  const at = useSharedValue(start);
  const mode = useSharedValue<'column' | 'swipe' | 'none'>('none');
  const from = useSharedValue(0);
  const shifts = matrix.columns.map((_, i) => shiftOf(i));
  useOnChange([view.width], () => {
    base.value = shifts[at.value];
    shift.value = shifts[at.value];
  });

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
  const asked = growth?.ask && lines.routes.find(route => route.id === growth.ask!.id);
  const keysOf = (cell: MatrixCell) => cell?.ayat.map(ayah => ayah.key) ?? [];
  const [lit, setLit] = useState<string | null>(null);
  useAdjustOn([presentation], () => setLit(null));
  const light: Light = { lit, onWord: link => setLit(current => (current === link ? null : link)) };
  const fit = useFitReport(onFit);

  if (alongside) pan.simultaneousWithExternalGesture(alongside);
  return (
    <GestureDetector gesture={pan}>
      <View collapsable={false} style={{ width: view.width, height: view.height, overflow: 'hidden', direction: 'ltr' }}>
        <ScrollView {...fit} nestedScrollEnabled onScroll={onScroll} scrollEventThrottle={16} style={pinFooter && !inside ? { flex: 1, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.rule, ...CARD } : { flex: 1 }} contentContainerStyle={{ paddingVertical: framed ? 12 : 0 }} showsVerticalScrollIndicator={false}>
          <Words.Provider value={connections ? lines.registry : null}>
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
          {!pinFooter && after}
        </ScrollView>
        {pinFooter && footer}
      </View>
    </GestureDetector>
  );
}

const surahOf = (cell: MatrixCell) => cell?.ayat[0]?.key.split(':')[0];

function RowRule({ dashed, color }: { dashed: boolean; color: string }) {
  if (!dashed) return <View style={{ height: 1, backgroundColor: color }} />;
  return <View style={{ height: 1, overflow: 'hidden' }}><View style={{ height: 3, borderWidth: 1, borderColor: color, borderStyle: 'dashed' }} /></View>;
}

type Box = { left: number; right: number; top: number; bottom: number };

function useConnectionLines(connections: Props['connections'], shown: boolean, palette: Palette) {
  const words = useRef(new Map<string, Host>()).current;
  const frame = useRef<Host>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [layout, setLayout] = useState(0);
  const pending = useRef(false);
  const frameLater = useLater();
  const measure = useCallback(() => {
    if (pending.current) return;
    pending.current = true;
    frameLater.nextFrame(() => { pending.current = false; setLayout(value => value + 1); });
  }, [frameLater]);
  const begin = useLatestRun();
  const registry = useMemo(() => ({ words, measure }), [words, measure]);
  const group = connections?.group;
  const tags = connections?.tags.join(' ') ?? '';
  useOnChange([group, tags, shown, layout, words, palette], () => {
    const live = begin();
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
    void Promise.all(links.map(async (link, index) => {
      const [a, b] = await Promise.all([end(link.from), end(link.to)]);
      if (!a || !b) return [];
      const from = { x: (a.left + a.right) / 2, y: a.bottom + 2 };
      const to = { x: (b.left + b.right) / 2, y: b.top - 2 };
      const mid = (from.y + to.y) / 2;
      return [{ id: `r${index}`, tag: link.tag, from, to, d: `M ${from.x} ${from.y} C ${from.x} ${mid}, ${to.x} ${mid}, ${to.x} ${to.y}` }];
    })).then(found => { if (live()) setRoutes(found.flat()); });
  });
  return { registry, frame, routes, measure };
}
