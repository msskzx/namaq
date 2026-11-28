import { createContext, memo, useContext, useEffect, useId, useRef, useState, type ComponentRef } from 'react';
import { Pressable, View, type LayoutChangeEvent } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Text, UI_SCALE } from '@/ui/Text';
import { ZoomIn, type LucideProps } from 'lucide-react-native';
import type { BranchPiece } from '@shared/quran/branchInventory';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { ayatLabel, closingSign, endedIn, keys, shownAyat, withStarts, type Branch } from '@shared/quran/branches';
import { pathToggleKey } from '@shared/quran/pathHighlight';
import { markColour } from '@shared/quran/compareCardLook';
import { bare } from '@shared/quran/quranText/ayahWords';
import { writtenForms, writtenPieces, writtenStrands, type WrittenForm } from '@shared/quran/writtenForms';
import { num } from '@shared/quran/arabicNumber';
import { quranText } from '@/lib/quranText';
import { aroundOf, likenessAt, mixedBefore, NOTHING_SHARED, subtreeOf, type Around, type Beside, type Matches, type Presentation, type Shared as SharedWords } from '@/lib/branches';
import { lineId, nodeIndices, nodeId } from '@/lib/growth';
import { CURVE, litSpine, type Span } from '@/lib/litSpine';
import { blend, toneOf, UI_FONT, type Palette, CARD } from '@/lib/theme';
import Hourglass from '@/ui/Hourglass';
import TreeIcon from './TreeIcon';
import type { SceneBox, SceneEdge, ScenePart, SceneText, TreeScene } from '@/lib/scene';
import { TreeText, useWordSize } from './quran/text/AyahFlow';
import { FLOW_LINE } from '@shared/quran/quranText/flow';

type Tap = (ayahKeys: string[], lightPath?: () => void) => void;
export type Paths = { lit: Set<string>; pinned: Map<string, string[]>; pin: (id: string, keys: string[]) => void };
export type NodeActions = { onSubtree: (piece: BranchPiece) => void };
export type Direction = 'side' | 'down';
export type TreeGrowth = { hidden: Set<string>; now: Set<string>; ask?: { id: string; left: number; seconds: number }; lit: string | null; tour?: boolean; words?: number };
const NO_GROWTH: TreeGrowth = { hidden: new Set(), now: new Set(), lit: null };

export type RenderNode = (node: Branch, index: number, path: string[]) => React.ReactNode | undefined;
type Shared = { size: number; spellings: boolean; palette: Palette; names: Record<number, string>; matches: Matches; offsets: Record<string, number>; onTap: Tap; down: boolean; indices: Map<Branch, number>; around?: Around; edges: SceneEdge[]; render?: RenderNode; paths?: Paths; actions?: NodeActions; inTree: Set<string>;
  earlier: Set<string> };
const isLit = (shared: Shared, growth: TreeGrowth, ayahKeys: string[]) => growth !== NO_GROWTH
  ? growth.lit !== null && ayahKeys.includes(growth.lit)
  : !!shared.paths && ayahKeys.some(key => shared.paths!.lit.has(key));
const tapped = (shared: Shared, ayahKeys: string[]) => !shared.paths ? [] : ayahKeys.filter(key => [...shared.paths!.pinned].some(([id, lit]) => id !== 'search' && lit.includes(key)));
const Growth = createContext<TreeGrowth>(NO_GROWTH);
type Host = ComponentRef<typeof View>;
type Registry = Map<string, { view: Host | null; text: SceneText }>;
const Boxes = createContext<Registry | null>(null);
type PartSpec = Omit<ScenePart, 'x' | 'y' | 'w' | 'h'>;
type Parts = Map<string, { box: string; view: Host | null; spec: PartSpec }>;
const PartsOf = createContext<Parts | null>(null);
const BoxId = createContext<string | null>(null);
const LABEL = Math.round(12 * UI_SCALE);
function usePart(spec: PartSpec) {
  const parts = useContext(PartsOf);
  const box = useContext(BoxId);
  const slot = useId();
  return (view: Host | null) => {
    if (!parts || !box) return;
    if (view) parts.set(slot, { box, view, spec }); else parts.delete(slot);
  };
}
const edge = (shared: Shared, from: string, to: string, back = false) => { if (!shared.edges.some(item => item.from === from && item.to === to)) shared.edges.push({ from, to, back }); };

const LINE = 2;
const FADE = 250;
const REACH = 150;
const isMark = (word: string) => word === '۝' || word.startsWith('﴿');

function Fade({ id, children, style, delay = 0 }: { id: string; children: React.ReactNode; style?: object;
  delay?: number }) {
  const growth = useContext(Growth);
  const hidden = growth.hidden.has(id) && growth.ask?.id !== id;
  const opacity = useSharedValue(hidden ? 0 : 1);
  useEffect(() => { opacity.value = hidden ? 0 : withDelay(delay, withTiming(1, { duration: FADE })); }, [hidden, opacity, delay]);
  const faded = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[style, faded]} pointerEvents={hidden ? 'none' : 'auto'}>{children}</Animated.View>;
}

function References({ text, shared, center, ruled }: { text: string; shared: Shared; center?: boolean;
  ruled?: boolean }) {
  const part = usePart({ label: text, size: LABEL, align: center ? 'center' : 'right' });
  return <Text ref={ruled ? undefined : part} style={{ fontSize: 12, color: shared.palette.muted, textAlign: center ? 'center' : 'right', marginTop: center ? 0 : 4 }}>{text}</Text>;
}

function startLabel(shared: Shared, ayahKeys: string[], ending: string[] = []) {
  const lit = tapped(shared, ayahKeys);
  if (lit.length === 0 || (lit.length === 1 && ending.includes(lit[0]))) return undefined;
  if (lit.length > 1) return `الآيات: ${num(lit.length)}`;
  const [surah, ayah] = lit[0].split(':').map(Number);
  return shared.names[surah] ? `${shared.names[surah]} ${num(ayah)}` : `${num(surah)}:${num(ayah)}`;
}

function StartReference({ label, shared }: { label?: string; shared: Shared }) {
  if (!label) return null;
  return <Ruled label={label} shared={shared}><Text style={{ fontSize: 12, color: shared.palette.muted, textAlign: 'center' }}>{label}</Text></Ruled>;
}

function Ruled({ label, shared, children }: { label: string; shared: Shared; children: React.ReactNode }) {
  const part = usePart({ label, size: LABEL, align: 'center', rule: true });
  return (
    <View ref={part} collapsable={false} style={{ borderBottomWidth: 1, borderColor: shared.palette.rule, paddingVertical: 2, marginBottom: 2 }}>
      {children}
    </View>
  );
}

type Marks = SharedWords;

function tonesOf(words: string[], ayahKeys: string[], at: number, shared: Shared, marks?: Marks, forms?: Branch['forms'], differs?: number[], given?: Branch['tones']) {
  const { palette, matches, offsets } = shared;
  return words.map((word, i) => {
    if (given) {
      const written = writtenForms({ forms }, i, word, shared.paths?.lit);
      if (written.length > 1 || (bare(written[0].word) !== bare(word) && !isMark(word))) return palette.marks.written;
      return markColour(given[i] === 'written' ? 'exact' : given[i], palette, given[i] === 'written');
    }
    const kinds = marks ? [likenessAt(marks, i)] : ayahKeys.map(key => {
      const match = matches[key];
      return match && likenessAt(match, (offsets[key] ?? 0) + at + i);
    });
    const all = !isMark(word) && kinds.length > 0 && kinds.every(Boolean);
    const kind = all ? (kinds.includes('root') ? 'root' : kinds.includes('written') ? 'written' : 'exact') : undefined;
    const written = writtenForms({ forms }, i, word, shared.paths?.lit);
    if (differs?.includes(i)) return palette.marks.written;
    if (kind === 'root' && written.length === 1) return palette.marks.root;
    if (written.length > 1 || (bare(written[0].word) !== bare(word) && !isMark(word))) return palette.marks.written;
    return kind && palette.marks[kind];
  });
}

type WordsProps = { words: string[]; ayahKeys: string[]; at: number; shared: Shared; size: number; marks?: Marks; color?: string; forms?: Branch['forms']; differs?: number[]; tones?: Branch['tones'] };
function BraidEdge({ count, join, palette }: { count: number; join?: boolean; palette: Palette }) {
  const part = usePart({ size: 0, braid: { count, join: !!join } });
  const d = Array.from({ length: count }, (_, i) => {
    const y = ((i + 0.5) / count) * 100;
    return join ? `M12 ${y} C6 ${y} 6 50 0 50` : `M12 50 C6 50 6 ${y} 0 ${y}`;
  }).join(' ');
  return (
    <View ref={part} style={{ width: 16, alignSelf: 'stretch' }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Svg width="100%" height="100%" viewBox="0 0 12 100" preserveAspectRatio="none"><Path d={d} stroke={palette.rule} strokeWidth={2} fill="none" vectorEffect="non-scaling-stroke" /></Svg>
    </View>
  );
}

function Word({ form, color, size, palette }: { form: WrittenForm; color: string; size: number; palette: Palette }) {
  const part = usePart({ size, words: [{ text: quranText(form.word), color }], lineHeight: size * FLOW_LINE });
  return <TreeText ref={part} look={{ color }}><Written form={form} palette={palette} /></TreeText>;
}

function Written({ form, palette }: { form: WrittenForm; palette: Palette }) {
  return <>{quranText(form.word)}{form.faint ? <Text style={{ color: palette.rule }}>{form.faint}</Text> : null}</>;
}

function Strand({ words, refs, size, palette }: { words: string; refs: string; size: number; palette: Palette }) {
  const frame = usePart({ size: 0, frame: true });
  const ink = palette.marks.written ?? palette.ink;
  const text = usePart({ size, words: [{ text: words, color: ink }], lineHeight: size * FLOW_LINE });
  const label = usePart({ label: refs, size: 11, align: 'center' });
  return (
    <View ref={frame} testID="strand" style={{ alignItems: 'center', borderWidth: 1, borderColor: palette.rule, borderRadius: 10, paddingHorizontal: 8 }}>
      <TreeText ref={text} look={{ color: ink }}>{words}</TreeText>
      <Text ref={label} style={{ fontFamily: UI_FONT, fontSize: 11, lineHeight: 14, color: palette.muted, marginTop: -4, paddingBottom: 2, maxWidth: 200, textAlign: 'center' }}>{refs}</Text>
    </View>
  );
}

// see docs/adr/0035-a-tree-node-shows-words-only-as-the-mushaf-writes-them.md
// see docs/adr/0036-a-word-written-differently-moves-to-its-neighbour.md
function Words({ words, ayahKeys, at, shared, size, marks, color, forms, differs, tones: given }: WordsProps) {
  const tones = tonesOf(words, ayahKeys, at, shared, marks, forms, differs, given);
  const { palette } = shared;
  const pieces = writtenPieces(words.length, i => writtenForms({ forms }, i, words[i], shared.paths?.lit).length > 1);
  const braided = pieces.some(piece => piece.kind === 'braid');
  const part = usePart(sceneWords({ words, ayahKeys, at, shared, size, marks, color, forms, differs, tones: given }));
  if (!braided) {
    return (
      <TreeText ref={part} center look={{ color: color ?? palette.ink }}>
        {pieces.map((piece, n) => piece.kind === 'word' && (
          <Text key={n} style={tones[piece.index] ? { color: tones[piece.index] } : undefined}>{n > 0 ? ' ' : ''}<Written form={writtenForms({ forms }, piece.index, words[piece.index], shared.paths?.lit)[0]} palette={palette} /></Text>
        ))}
      </TreeText>
    );
  }
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', columnGap: size * 0.28 }}>
      {pieces.map((piece, n) => {
        if (piece.kind === 'word') {
          const written = writtenForms({ forms }, piece.index, words[piece.index], shared.paths?.lit);
          return <Word key={n} form={written[0]} color={tones[piece.index] ?? color ?? palette.ink} size={size} palette={palette} />;
        }
        const strands = writtenStrands({ forms }, piece.from, piece.to, shared.paths?.lit);
        return (
          <View key={n} testID="braid" style={{ flexDirection: 'row-reverse', alignItems: 'stretch', marginHorizontal: 2 }}>
            <BraidEdge count={strands.length} palette={palette} />
            <View style={{ gap: 4, paddingVertical: 4 }}>
              {strands.map(strand => (
                <Strand key={strand.words.join(' ')} words={quranText(strand.words.join(' '))} size={size} palette={palette}
                  refs={strand.keys.map(key => { const [surah, ayah] = key.split(':').map(Number); return `${shared.names[surah] ?? num(surah)} ${num(ayah)}`; }).join(' · ')} />
              ))}
            </View>
            <BraidEdge count={strands.length} join palette={palette} />
          </View>
        );
      })}
    </View>
  );
}

const sceneWords = ({ words, ayahKeys, at, shared, size, marks, color, forms, differs, tones: given }: WordsProps) => {
  const tones = tonesOf(words, ayahKeys, at, shared, marks, forms, differs, given);
  return { size, lineHeight: size * FLOW_LINE, words: words.map((word, i) => ({ text: quranText(writtenForms({ forms }, i, word, shared.paths?.lit)[0].word), color: tones[i] ?? color ?? shared.palette.ink })) };
};

function Tool({ label, Icon, onPress, palette, on }: { label: string; Icon: (props: LucideProps) => React.ReactNode; onPress: () => void; palette: Palette; on?: boolean }) {
  return (
    <Pressable onPress={onPress} hitSlop={4} accessibilityRole="button" accessibilityLabel={label} accessibilityState={on === undefined ? undefined : { selected: on }}
      style={{ padding: 5, borderRadius: 8, borderWidth: 1, borderColor: on ? palette.accent : palette.rule }}>
      <Icon size={16} color={on ? palette.accent : palette.muted} />
    </Pressable>
  );
}

function Tools({ shared, subtree, inTree }: { shared: Shared; subtree?: BranchPiece;
  inTree?: string }) {
  const { actions, paths, palette } = shared;
  if (!actions) return null;
  if (!subtree && !inTree) return null;
  const found = !!inTree && !!paths?.pinned.has(pathToggleKey(`t${inTree}`, [inTree]));
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, paddingBottom: 6 }}>
      {subtree && <Tool label="عرض هذا الجزء وحده" Icon={ZoomIn} palette={palette} onPress={() => actions.onSubtree(subtree)} />}
      {inTree && <Tool label="في هذه الشجرة" Icon={TreeIcon} palette={palette} on={found} onPress={() => paths?.pin(`t${inTree}`, [inTree])} />}
    </View>
  );
}

function Box({ id, ayahKeys, leaf, shared, muted, text, tools, width, children }: { id: string; ayahKeys: string[]; leaf: boolean; shared: Shared; muted?: boolean; text: SceneText; tools?: React.ReactNode;
  width?: number; children: React.ReactNode }) {
  const { palette, down, paths } = shared;
  const growth = useContext(Growth);
  const registry = useContext(Boxes);
  const register = (view: Host | null) => { if (registry) registry.set(id, { view, text: { ...text, muted: !!muted, keys: ayahKeys } }); };
  const asked = growth.ask?.id === id ? growth.ask : undefined;
  const onPath = isLit(shared, growth, ayahKeys);
  const selected = !!paths?.pinned.has(pathToggleKey(id, ayahKeys));
  const [pressed, setPressed] = useState(false);
  const tap = () => shared.onTap(ayahKeys, paths ? () => paths.pin(id, ayahKeys) : undefined);
  return (
    <Fade id={id}>
      <View ref={register}
        style={{
          maxWidth: width ?? (down ? (leaf ? 176 : 384) : leaf ? 208 : 192),
          borderWidth: 1,
          borderStyle: muted ? 'dashed' : 'solid',
          borderColor: asked ? palette.accent : growth.now.has(id) || onPath || selected ? palette.path : pressed ? palette.accent : muted ? palette.muted : palette.rule,
          backgroundColor: onPath ? blend(palette.path, palette.paper, selected ? 0.22 : 0.12) : muted ? 'transparent' : palette.card,
          ...CARD,
        }}>
        <Pressable onPress={tap} onPressIn={() => setPressed(true)} onPressOut={() => setPressed(false)} accessibilityRole="button" accessibilityLabel={asked ? 'اكشف الكلمة التالية' : undefined}>
          <View style={{ paddingHorizontal: 12, paddingVertical: 4, opacity: asked ? 0 : 1 }}><BoxId.Provider value={id}>{children}</BoxId.Provider></View>
        </Pressable>
        {tools && <View pointerEvents={asked ? 'none' : 'auto'} style={{ opacity: asked ? 0 : 1 }}>{tools}</View>}
        {asked && <View pointerEvents="none" style={{ position: 'absolute', top: 0, bottom: 0, start: 0, end: 0, alignItems: 'center', justifyContent: 'center' }}>
          {asked.seconds ? <Hourglass left={asked.left} seconds={asked.seconds} color={palette.accent} /> : <Text style={{ color: palette.accent, fontSize: 22, fontWeight: '700' }}>؟</Text>}
        </View>}
      </View>
    </Fade>
  );
}

function Mark({ id, text, shared }: { id: string; text: string; shared: Shared }) {
  const registry = useContext(Boxes);
  const register = (view: Host | null) => { if (registry) registry.set(id, { view, text: { size: shared.size, words: [{ text, color: shared.palette.muted }], bare: true } }); };
  return <View ref={register} style={{ paddingHorizontal: 4 }}><TreeText look={{ color: shared.palette.muted }}>{text}</TreeText></View>;
}

function Elbow({ first, last, color, lit, down, spine: whole = true }: { first: boolean; last: boolean; color: string; lit?: string; down: boolean;
  spine?: boolean }) {
  const only = first && last;
  const into = lit ?? color;
  const spine = whole ? LINE : 0;
  if (down) {
    return (
      <View style={{ height: 16, alignSelf: 'stretch', flexDirection: 'row' }}>
        {last && !only
          ? <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 1, borderTopWidth: spine, borderColor: color }} />
              <View style={{ width: CURVE, borderColor: into, borderTopWidth: LINE, borderTopEndRadius: CURVE, borderEndWidth: LINE }} />
            </View>
          : <View style={{ flex: 1, borderColor: color, ...(only || first ? {} : { borderTopWidth: spine }) }} />}
        {first && !only
          ? <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ width: CURVE, borderColor: into, borderTopWidth: LINE, borderTopStartRadius: CURVE, borderStartWidth: LINE }} />
              <View style={{ flex: 1, borderTopWidth: spine, borderColor: color }} />
            </View>
          : <View style={{ flex: 1, borderColor: color, ...(only || last ? {} : { borderTopWidth: spine }) }} />}
        {(only || (!first && !last)) && <View style={{ position: 'absolute', left: '50%', marginLeft: -LINE / 2, top: 0, bottom: 0, borderStartWidth: LINE, borderColor: into }} />}
      </View>
    );
  }
  return (
    <View style={{ width: 16, alignSelf: 'stretch' }}>
      {last && !only
        ? <View style={{ flex: 1 }}>
            <View style={{ flex: 1, borderStartWidth: spine, borderColor: color }} />
            <View style={{ height: CURVE, borderColor: into, borderStartWidth: LINE, borderBottomWidth: LINE, borderBottomStartRadius: CURVE }} />
          </View>
        : <View style={{ flex: 1, borderColor: color, ...(only || first ? {} : { borderStartWidth: spine }) }} />}
      {first && !only
        ? <View style={{ flex: 1 }}>
            <View style={{ height: CURVE, borderColor: into, borderStartWidth: LINE, borderTopWidth: LINE, borderTopStartRadius: CURVE }} />
            <View style={{ flex: 1, borderStartWidth: spine, borderColor: color }} />
          </View>
        : <View style={{ flex: 1, borderColor: color, ...(only || last ? {} : { borderStartWidth: spine }) }} />}
      {(only || (!first && !last)) && <View style={{ position: 'absolute', top: '50%', marginTop: -LINE / 2, start: 0, end: 0, borderTopWidth: LINE, borderColor: into }} />}
    </View>
  );
}

type Entry = { id: string; keys: string[]; item: React.ReactNode };

function Fan({ entries, shared, join, bare, onSpans }: { entries: Entry[]; shared: Shared;
  join?: boolean;
  bare?: boolean;
  onSpans?: (spans: Span[]) => void }) {
  const { palette, down } = shared;
  const growth = useContext(Growth);
  const lit = entries.map(entry => isLit(shared, growth, entry.keys));
  const shown = entries.map(entry => !growth.hidden.has(lineId(entry.id)));
  const growing = growth.hidden.size > 0;
  const [spans, setSpans] = useState<Span[]>([]);
  const [whole, setWhole] = useState(0);
  const litShown = lit.map((on, i) => on && shown[i]);
  const spine = litShown.some(Boolean) ? litSpine(spans, litShown, whole) : null;
  const drawn = growing && shown.some(Boolean) ? litSpine(spans, shown, whole) : null;
  useEffect(() => { if (onSpans && spans.length === entries.length && spans.every(Boolean)) onSpans(spans); }, [spans]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <View style={{ flexDirection: down ? 'row' : 'column', alignItems: join ? 'stretch' : 'flex-start' }} onLayout={event => setWhole(down ? event.nativeEvent.layout.width : event.nativeEvent.layout.height)}>
      {entries.map((entry, i) => (
        <View key={entry.id} style={{ flexDirection: down ? 'column' : 'row', alignItems: 'center' }}
          onLayout={event => { const { x, y, width, height } = event.nativeEvent.layout; const span = down ? { at: x, size: width } : { at: y, size: height }; setSpans(old => { const next = [...old]; next[i] = span; return next; }); }}>
          {!bare && <Fade id={lineId(entry.id)} delay={growing ? REACH : 0} style={down ? { alignSelf: 'stretch' } : { alignSelf: 'stretch', flexDirection: 'row' }}>
            <Elbow first={i === 0} last={i === entries.length - 1} color={palette.rule} lit={lit[i] ? palette.path : undefined} down={down} spine={!growing} />
          </Fade>}
          <View style={down ? { paddingHorizontal: 5 } : { paddingVertical: 5 }}>{entry.item}</View>
          {join && <Fade id={lineId(entry.id)} style={{ flex: 1, alignSelf: 'center', ...(down ? { width: LINE } : { height: LINE }), backgroundColor: lit[i] ? palette.path : palette.rule }}><View /></Fade>}
        </View>
      ))}
      {!bare && drawn && <Spine key={down ? 'drawn-down' : 'drawn-side'} range={drawn} color={palette.rule} down={down} from={whole / 2} />}
      {!bare && spine && <Spine key={down ? 'lit-down' : 'lit-side'} range={spine} color={palette.path} down={down} from={whole / 2} grow={growing} />}
    </View>
  );
}

function Spine({ range, color, down, from, grow = true }: { range: [number, number]; color: string; down: boolean; from: number; grow?: boolean }) {
  const start = grow && from > range[0] && from < range[1];
  const low = useSharedValue(start ? from : range[0]);
  const high = useSharedValue(start ? from : range[1]);
  useEffect(() => {
    const reach = grow && range[0] <= low.value && range[1] >= high.value;
    low.value = reach ? withTiming(range[0], { duration: REACH }) : range[0];
    high.value = reach ? withTiming(range[1], { duration: REACH }) : range[1];
  }, [range[0], range[1], grow]); // eslint-disable-line react-hooks/exhaustive-deps
  const style = useAnimatedStyle(() => down ? { left: low.value, width: high.value - low.value } : { top: low.value, height: high.value - low.value });
  return <Animated.View pointerEvents="none" style={[down
    ? { position: 'absolute', top: 0, borderTopWidth: LINE, borderColor: color }
    : { position: 'absolute', start: 0, borderStartWidth: LINE, borderColor: color }, style]} />;
}

function Stub({ shared, entries }: { shared: Shared; entries: Entry[] }) {
  const growth = useContext(Growth);
  const { hidden } = growth;
  const visible = entries.some(entry => !hidden.has(lineId(entry.id)));
  const color = entries.some(entry => !hidden.has(lineId(entry.id)) && isLit(shared, growth, entry.keys)) ? shared.palette.path : shared.palette.rule;
  return <View style={[shared.down ? { height: 14, borderStartWidth: LINE } : { width: 14, borderTopWidth: LINE }, { borderColor: color, opacity: visible ? 1 : 0 }]} />;
}

function BackFan({ entries, shared }: { entries: Entry[]; shared: Shared }) {
  const flip = shared.down ? { transform: [{ scaleY: -1 }] } : { transform: [{ scaleX: -1 }] };
  return (
    <View style={flip}>
      <Fan shared={shared} entries={entries.map(entry => ({ ...entry, item: <View style={flip}>{entry.item}</View> }))} />
    </View>
  );
}

function Join({ entries, spans, shared }: { entries: Entry[]; spans: Span[]; shared: Shared }) {
  const flip = shared.down ? { transform: [{ scaleY: -1 }] } : { transform: [{ scaleX: -1 }] };
  if (spans.length !== entries.length) return null;
  const places = entries.map((entry, i) => ({ ...entry, item: <View style={shared.down ? { width: spans[i].size - 10 } : { height: spans[i].size - 10 }} /> }));
  return <View style={flip}><Fan shared={shared} entries={places} /></View>;
}

function NeighbourBox({ id, beside, of, shared }: { id: string; beside: Beside; of: string; shared: Shared }) {
  const [surah, ayah] = beside.key.split(':').map(Number);
  const ref = shared.names[surah] ? `${shared.names[surah]} ${num(ayah)}` : `${num(surah)}:${num(ayah)}`;
  const basmala = beside.basmala ? sceneWords({ words: beside.basmala, ayahKeys: [], at: 0, shared, size: shared.size, marks: NOTHING_SHARED, color: shared.palette.muted }).words : [];
  const closed = [...beside.words, ...closingSign(beside.words, [beside.key])];
  const own = sceneWords({ words: closed, ayahKeys: [], at: 0, shared, size: shared.size, marks: beside });
  const text: SceneText = { size: shared.size, words: id.startsWith('a') ? [...basmala, ...own.words] : [...own.words, ...basmala], footer: ref };
  return (
    <Box id={id} ayahKeys={[of]} leaf shared={shared} text={text} tools={<Tools shared={shared} inTree={shared.inTree.has(beside.key) ? beside.key : undefined} />}>
      {beside.basmala && id.startsWith('a') && <Words words={beside.basmala} ayahKeys={[]} at={0} shared={shared} size={shared.size} marks={NOTHING_SHARED} color={shared.palette.muted} />}
      <Words words={closed} ayahKeys={[]} at={0} shared={shared} size={shared.size} marks={beside} />
      {beside.basmala && !id.startsWith('a') && <Words words={beside.basmala} ayahKeys={[]} at={0} shared={shared} size={shared.size} marks={NOTHING_SHARED} color={shared.palette.muted} />}
      <References text={ref} shared={shared} center />
    </Box>
  );
}

function befores(ayahKeys: string[], shared: Shared): Entry[] {
  const around = shared.around;
  if (!around) return [];
  return ayahKeys.flatMap(key => around.before[key] ? [{ id: `b${key}`, keys: [key], item: <NeighbourBox id={`b${key}`} beside={around.before[key]!} of={key} shared={shared} /> }] : []);
}

function Node({ node, path, shared, starts }: { node: Branch; path: string[]; shared: Shared;
  starts?: string[] }) {
  const root = shared.indices.get(node) === -1;
  const all = keys(node);
  const words = node.words;
  const id = nodeId(shared.indices.get(node)!);
  const own = root ? undefined : shared.render?.(node, shared.indices.get(node)!, path);
  const boundary = node.ayat.length === 0 && words.length > 0 && words.every(isMark);
  const ayatSpans = shownAyat(node, path);
  const runs = node.holds ?? node.ayat.map(key => ayatSpans[key]);
  const singleSurah = runs.length > 0 && runs.every(run => run[0].split(':')[0] === runs[0][0].split(':')[0]);
  const growth = useContext(Growth);
  const through = !root && own === undefined && words.length === 0 && node.ayat.length === 0;
  const shown = !boundary && !through && (!root || words.length > 0 || node.ayat.length > 0);
  const bare = root && words.length === 0 && node.ayat.length === 0;
  const [spans, setSpans] = useState<Span[]>([]);
  const rejoinId = node.rejoin && nodeId(shared.indices.get(node.rejoin)!);
  const { around } = shared;
  const afters: Entry[] = !around ? [] : node.ayat.flatMap(key => {
    const beside = around.after[around.ends[key]];
    return beside ? [{ id: `a${key}`, keys: [key], item: <NeighbourBox id={`a${key}`} beside={beside} of={key} shared={shared} /> }] : [];
  });
  const entries: Entry[] = [...node.children.map(child => {
    const childId = nodeId(shared.indices.get(child)!);
    const item = <Node node={child} path={[...path, ...words]} shared={shared} />;
    const lead = bare ? befores(keys(child), shared) : [];
    lead.forEach(entry => edge(shared, childId, entry.id, true));
    return { id: childId, keys: keys(child), item: lead.length ? <View style={{ flexDirection: shared.down ? 'column' : 'row', alignItems: 'center' }}><BackFan entries={lead} shared={shared} /><Stub shared={shared} entries={lead} />{item}</View> : item };
  }), ...afters];
  if (!bare) entries.forEach(entry => edge(shared, id, entry.id));
  if (rejoinId) node.children.forEach(child => edge(shared, nodeId(shared.indices.get(child)!), rejoinId));
  const references = runs.map(run => ayatLabel(run, shared.names)).join(' · ');
  const shownWords = { words: [...words, ...closingSign(words, endedIn(node, path))], ayahKeys: all, at: path.length, shared, size: shared.size, forms: shared.spellings ? node.forms : undefined, differs: shared.spellings ? node.differs : undefined, tones: node.tones };
  const start = starts && startLabel(shared, starts, node.ayat);
  const text: SceneText = { ...sceneWords(shownWords), ...(runs.length ? singleSurah ? { header: references } : { footer: references } : {}), ...(start ? { header: singleSurah ? `${start} · ${references}` : start } : {}) };
  return (
    <View style={{ flexDirection: shared.down ? 'column' : 'row', alignItems: 'center' }}>
      {boundary && <Fade id={id}><Mark id={id} text={quranText(words.join(' '))} shared={shared} /></Fade>}
      {through && <View testID="through" style={{ [shared.down ? 'height' : 'width']: 24, [shared.down ? 'width' : 'height']: LINE, backgroundColor: isLit(shared, growth, all) ? shared.palette.path : shared.palette.rule }} />}
      {shown && (() => {
        return (
          <Box id={id} ayahKeys={all} leaf={node.children.length === 0} shared={shared} text={text}
            tools={own === undefined && <Tools shared={shared} subtree={!root && node.children.length > 0 && shared.actions ? subtreeOf(all) : undefined} />}>
            {own !== undefined ? own : <>
            <StartReference label={start} shared={shared} />
            {singleSurah && <Ruled label={references} shared={shared}><References text={references} shared={shared} center ruled /></Ruled>}
            <Words {...shownWords} />
            {!singleSurah && runs.length > 0 && <References text={references} shared={shared} />}
            </>}
          </Box>
        );
      })()}
      {entries.length > 0 && <>
        {!bare && <Stub shared={shared} entries={entries} />}
        <Fan shared={shared} entries={entries} bare={bare} join={!!node.rejoin} onSpans={node.rejoin ? setSpans : undefined} />
      </>}
      {node.rejoin && <>
        {entries.length > 0 && <Join shared={shared} entries={entries} spans={spans} />}
        <Stub shared={shared} entries={[{ id: rejoinId!, keys: keys(node.rejoin), item: null }]} />
        <Node node={node.rejoin} path={[...path, ...words]} shared={shared} />
      </>}
    </View>
  );
}

type Props = { presentation: Presentation; matches: Matches; names: Record<number, string>; palette: Palette; onTap: Tap; onLayout?: (event: LayoutChangeEvent) => void;
  paths?: Paths; actions?: NodeActions;
  direction?: Direction; around?: Around; growth?: TreeGrowth;
  sceneRef?: React.MutableRefObject<(() => Promise<TreeScene | null>) | null>;
  renderNode?: RenderNode;
  spellings?: boolean;
};

function BranchTree({ presentation: given, matches, names, palette, onTap, onLayout, direction = 'side', around, growth = NO_GROWTH, sceneRef, renderNode, paths, actions, spellings }: Props) {
  const presentation = { ...given, prefixes: withStarts(given.prefixes, keys(given.tree)) };
  const down = direction === 'down';
  const size = useWordSize();
  const shared: Shared = { size, spellings: spellings ?? !renderNode, palette, names, matches, offsets: presentation.offsets, onTap, down, indices: nodeIndices(presentation.tree), around, edges: [], render: renderNode, paths, actions, inTree: new Set(keys(presentation.tree)), earlier: new Set() };
  const registry = useRef<Registry>(new Map()).current;
  const parts = useRef<Parts>(new Map()).current;
  const rootView = useRef<Host>(null);
  const rootId = nodeId(-1);
  const all = keys(presentation.tree);
  const mixed = mixedBefore(presentation);
  const opensApart = presentation.tree.words.length === 0 && presentation.tree.ayat.length === 0;
  const before: Entry[] = presentation.prefixes.length === 0 ? (opensApart ? [] : befores(all, shared)) : presentation.prefixes.flatMap((prefix, i): Entry[] => {
    if (prefix.word) {
      const lead = befores(prefix.keys, shared);
      const prefixWords = { words: prefix.words ?? prefix.word.split(' '), ayahKeys: prefix.keys, at: 0, shared: { ...shared, offsets: {} }, size: shared.size, forms: shared.spellings ? prefix.forms : undefined, differs: shared.spellings ? prefix.differs : undefined, color: prefix.conj ? toneOf(palette, prefix.conj) : undefined };
      lead.forEach(entry => edge(shared, `p${i}`, entry.id, true));
      const start = startLabel(shared, prefix.keys);
      const box = <Box id={`p${i}`} ayahKeys={prefix.keys} leaf shared={shared} text={{ ...sceneWords(prefixWords), ...(start ? { header: start } : {}) }}>
        <StartReference label={start} shared={shared} />
        <Words {...prefixWords} />
      </Box>;
      return [{ id: `p${i}`, keys: prefix.keys, item: lead.length ? <View style={{ flexDirection: down ? 'column-reverse' : 'row-reverse', alignItems: 'center' }}>{box}<Stub shared={shared} entries={lead} /><BackFan entries={lead} shared={shared} /></View> : box }];
    }
    return mixed ? required(prefix.keys, shared, around ?? aroundOf(presentation)) : befores(prefix.keys, shared);
  });
  before.forEach(entry => edge(shared, rootId, entry.id, true));
  if (sceneRef) sceneRef.current = () => measureScene(rootView.current, registry, parts, shared.edges, down);
  return (
    <Boxes.Provider value={sceneRef ? registry : null}>
    <PartsOf.Provider value={sceneRef ? parts : null}>
    <Growth.Provider value={growth}>
      <View {...({ dir: 'rtl' } as object)} ref={rootView} onLayout={onLayout} style={{ direction: 'rtl', flexDirection: down ? 'column' : 'row', alignItems: 'center', alignSelf: 'flex-start', padding: 12 }}>
        {before.length > 0 && <>
          <BackFan entries={before} shared={shared} />
          <Stub shared={shared} entries={before} />
        </>}
        <Node node={presentation.tree} path={[]} shared={shared} starts={all.filter(key => !presentation.prefixes.some(prefix => prefix.word && prefix.keys.includes(key)))} />
      </View>
    </Growth.Provider>
    </PartsOf.Provider>
    </Boxes.Provider>
  );
}

function measureScene(root: Host | null, registry: Registry, parts: Parts, edges: SceneEdge[], down: boolean): Promise<TreeScene | null> {
  if (!root) return Promise.resolve(null);
  type Rect = { x: number; y: number; w: number; h: number };
  const entries = [...registry].filter(([, item]) => item.view);
  const pieces = [...parts.values()].filter(item => item.view);
  const place = (view: Host) => new Promise<Rect | null>(resolve => {
    try { view.measureLayout(root, (x: number, y: number, w: number, h: number) => resolve({ x, y, w, h }), () => resolve(null)); } catch { resolve(null); }
  });
  return Promise.all([Promise.all(entries.map(([, item]) => place(item.view!))), Promise.all(pieces.map(item => place(item.view!)))]).then(([rects, placed]) => {
    const own = new Map<string, ScenePart[]>();
    pieces.forEach((item, i) => { const rect = placed[i]; if (rect) own.set(item.box, [...own.get(item.box) ?? [], { ...item.spec, ...rect }]); });
    const boxes: SceneBox[] = entries.flatMap(([id, item], i) => {
      const rect = rects[i];
      if (!rect) return [];
      const inside = own.get(id)?.sort((a, b) => a.y - b.y);
      return [{ ...item.text, ...(inside ? { parts: inside } : {}), ...rect, id }];
    });
    const rectsIn = [...boxes, ...boxes.flatMap(box => box.parts ?? [])];
    if (!rectsIn.length) return null;
    const left = Math.min(...rectsIn.map(r => r.x)), top = Math.min(...rectsIn.map(r => r.y));
    const right = Math.max(...rectsIn.map(r => r.x + r.w)), bottom = Math.max(...rectsIn.map(r => r.y + r.h));
    return { width: right + Math.max(0, left), height: bottom + Math.max(0, top), down, boxes, edges };
  });
}

function required(ayahKeys: string[], shared: Shared, context: Around): Entry[] {
  return ayahKeys.flatMap(key => {
    const beside = context.before[key];
    if (!beside) return [];
    const earlier = shared.around?.earlier[key];
    const box = <NeighbourBox id={`b${key}`} beside={beside} of={key} shared={shared} />;
    if (earlier) { edge(shared, `b${key}`, `e${key}`, true); shared.earlier.add(key); }
    return [{ id: `b${key}`, keys: [key], item: earlier ? <View style={{ flexDirection: shared.down ? 'column-reverse' : 'row-reverse', alignItems: 'center' }}>{box}<Stub shared={shared} entries={[{ id: `e${key}`, keys: [key], item: null }]} /><NeighbourBox id={`e${key}`} beside={earlier} of={key} shared={shared} /></View> : box }];
  });
}

export default memo(BranchTree);
