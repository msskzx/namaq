import { Fragment, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/Text';
import { BookOpen } from 'lucide-react-native';
import { readAyah } from '@/lib/openReader';
import { Gesture, GestureDetector, ScrollView, type GestureType } from 'react-native-gesture-handler';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import type { Lane } from './TreeCard';
import { matrixOf, surahNames, type MatrixAyah, type MatrixCell, type Presentation } from '@/lib/branches';
import type { Size } from '@/lib/camera';
import { QURAN_FONT, blend, toneColor, type Palette, CARD } from '@/lib/theme';
import Hourglass from './Hourglass';
import Svg, { Circle, Path } from 'react-native-svg';
import { connectionTone, wordConnections, type ConnectionEnd } from '@shared/quran/mutashabih/connections';
import type { Group, Tag } from '@shared/quran/mutashabih/types';

type Props = { presentation: Presentation; palette: Palette; view: Size; lane?: Lane; around: boolean; onTap: (ayahKeys: string[] | null) => void; onMove: () => void;
  /** The bookmark row, after the last ayah. */
  footer?: React.ReactNode;
  /** A book group's word connections (the website's GroupConnections): drawn for the tags given, between the ayat in the middle column. */
  connections?: { group: Group; tags: Tag[] };
  /** The connections studio playing: lines still hidden (`r<n>`), and the one waiting for an answer. */
  growth?: { hidden: Set<string>; now: Set<string>; ask?: { id: string; left: number; seconds: number } };
  /** Told when a swipe moved off the ayah column to the ayah before or after. */
  onColumn?: () => void;
  /** A gesture around the card that should still see sideways drags (the tour's step swipe). */
  alongside?: GestureType;
  /** Shown under an ayah's text in the middle column, by the row's first ayah (a checked quiz answer). */
  note?: (key: string) => React.ReactNode };

type Host = ComponentRef<typeof View>;
/** Where each word of the middle column registers itself, keyed `ayah:index` as the group's positions are. */
const Words = createContext<{ words: Map<string, Host>; measure: () => void } | null>(null);
type Route = { id: string; tag: Tag; d: string; from: { x: number; y: number }; to: { x: number; y: number } };

/** A column is most of the card wide, so the next one peeks in beside it (the website's 86%). */
const SHARE = 0.86;
const GAP = 8;
const SWIPE = 0.2;
const FLICK = 500;

type Light = { lit: string | null; onWord: (link: string) => void };

/** A word's colour: shared by every row in full, by only some rows faded into the card, lit on the highlight. */
function toneOf(ayah: MatrixAyah, i: number, palette: Palette, light?: Light) {
  const link = ayah.links?.get(i);
  if (link && light?.lit === link.link) return { color: palette.onHighlight, backgroundColor: palette.highlight };
  if (ayah.rooted.has(i)) return { color: palette.root };
  if (ayah.exact.has(i)) return { color: palette.accent };
  if (link?.some) return { color: blend(link.exact ? palette.accent : palette.root, palette.card, 0.55) };
  return undefined;
}

function Ayah({ ayah, palette, muted, light }: { ayah: MatrixAyah; palette: Palette; muted: boolean; light?: Light }) {
  const [, number] = ayah.key.split(':').map(Number);
  const registry = useContext(Words);
  const press = (i: number) => {
    const link = light && ayah.links?.get(i)?.link;
    return link ? () => light.onWord(link) : undefined;
  };
  if (registry && !muted) return <>
    {ayah.words.map((word, i) => {
      const tone = toneOf(ayah, i, palette, light);
      return <View key={i} ref={view => { if (view) registry.words.set(`${ayah.key}:${i}`, view); else registry.words.delete(`${ayah.key}:${i}`); }} onLayout={registry.measure} collapsable={false}>
        <Text onPress={press(i)} style={[{ fontFamily: QURAN_FONT, fontSize: 21, lineHeight: 44, color: palette.ink }, tone]}>{mushafText(word)}</Text>
      </View>;
    })}
    <Text style={{ fontFamily: QURAN_FONT, fontSize: 21, lineHeight: 44, color: palette.accent }}>{num(number)}</Text>
  </>;
  return <>
    {ayah.words.map((word, i) => {
      const tone = toneOf(ayah, i, palette, light);
      return <Text key={i}>{i > 0 ? ' ' : ''}<Text onPress={press(i)} style={tone}>{mushafText(word)}</Text></Text>;
    })}
    <Text style={{ color: muted ? palette.muted : palette.accent }}> {num(number)} </Text>
  </>;
}

function Cell({ cell, at, palette, width, current, onPress, light, note }: { cell: MatrixCell; at: 'before' | 'ayah' | 'after'; palette: Palette; width: number; current: boolean; onPress: () => void; light?: Light; note?: Props['note'] }) {
  if (!cell) return <View style={{ width }} />;
  const first = cell.ayat[0];
  const last = cell.ayat[cell.ayat.length - 1];
  const [surah, number] = first.key.split(':').map(Number);
  const [lastSurah, lastNumber] = last.key.split(':').map(Number);
  const range = first === last ? num(number) : `${num(number)}–${lastSurah === surah ? num(lastNumber) : `${surahNames[lastSurah]} ${num(lastNumber)}`}`;
  const muted = at !== 'ayah';
  const wordViews = !!useContext(Words);
  // A word takes the touch from the cell, so it does the cell's tap too (double tap to save, the studio's answer…).
  const tapped = current && !muted && light ? { lit: light.lit, onWord: (link: string) => { light.onWord(link); onPress(); } } : undefined;
  const basmala = first.basmala && <Text style={{ fontFamily: QURAN_FONT, fontSize: 18, lineHeight: 36, color: palette.muted, textAlign: 'center' }}>{mushafText(first.basmala.join(' '))}</Text>;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${surahNames[surah]} ${range}`}
      style={{ width, opacity: current ? 1 : 0.45, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.rule, ...CARD, paddingHorizontal: 12, paddingVertical: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
        <Text style={{ color: palette.ink, fontSize: 16, fontWeight: '600' }}>{surahNames[surah]}</Text>
        <Text style={{ color: palette.muted, fontSize: 13 }}>{lastSurah !== surah ? `الآية ${num(number)} ثم سورة ${surahNames[lastSurah]} ${num(lastNumber)}` : `${first === last ? 'الآية' : 'الآيات'} ${range}`}</Text>
        {current && <Pressable onPress={() => readAyah(first.key)} hitSlop={8} accessibilityRole="button" accessibilityLabel="قراءة الآية" style={{ position: 'absolute', end: -4, top: -4, padding: 4 }}>
          <BookOpen size={18} color={palette.muted} />
        </Pressable>}
      </View>
      {at === 'after' && basmala}
      {wordViews && !muted
        // Each word its own box, so the connection lines can find it: a wrapping row from the right, as the text runs.
        ? <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', columnGap: 6 }}>{cell.ayat.map(ayah => <Ayah key={ayah.key} ayah={ayah} palette={palette} muted={muted} light={tapped} />)}</View>
        : <Text style={{ fontFamily: QURAN_FONT, fontSize: 21, lineHeight: 44, color: muted ? palette.muted : palette.ink, writingDirection: 'rtl', textAlign: 'right' }}>
          {cell.ayat.map(ayah => <Ayah key={ayah.key} ayah={ayah} palette={palette} muted={muted} light={tapped} />)}
        </Text>}
      {at === 'before' && basmala}
      {at === 'ayah' && note?.(first.key)}
    </Pressable>
  );
}

/**
 * The website's ayah matrix: a row per ayah of the tree, coloured where every row shares a word. With the surrounding switch,
 * the ayah before and after each sit in columns either side; a sideways swipe steps a column, then on to the next tree.
 */
export default function MatrixCard({ presentation, palette, view, lane, around, onTap, onMove, footer, connections, growth, onColumn, alongside, note }: Props) {
  const matrix = useMemo(() => matrixOf(presentation, around), [presentation, around]);
  const count = matrix.columns.length;
  const width = Math.round(view.width * SHARE);
  const step = width + GAP;
  // Columns run right to left like the text: the ayah before on the right, the ayah after on the left.
  const xOf = (i: number) => (count - 1 - i) * step;
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

  if (alongside) pan.simultaneousWithExternalGesture(alongside);
  return (
    <GestureDetector gesture={pan}>
      <View collapsable={false} style={{ width: view.width, height: view.height, overflow: 'hidden', direction: 'ltr' }}>
        <ScrollView contentContainerStyle={{ paddingVertical: 12 }} showsVerticalScrollIndicator={false}>
          <Words.Provider value={connections ? lines.registry : null}>
          <Animated.View ref={lines.frame} onLayout={lines.measure} collapsable={false} style={[{ width: count * step - GAP, gap: 10 }, lanes]}>
            {matrix.rows.map((row, r) => (
              <View key={r} style={{ flexDirection: 'row-reverse', gap: GAP, alignItems: 'stretch' }}>
                {matrix.columns.map((name, i) => (
                  <Cell key={name} cell={row[name]} at={name} palette={palette} width={width} current={i === column} light={light} note={note}
                    onPress={() => (i === column ? onTap(keysOf(row[name])) : goTo(i))} />
                ))}
              </View>
            ))}
            {lines.routes.length > 0 && <Svg pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, width: count * step - GAP, height: '100%' }}>
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
          {footer}
        </ScrollView>
      </View>
    </GestureDetector>
  );
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
