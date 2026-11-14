import { createContext, memo, useContext, useEffect, useId, useRef, useState, type ComponentRef } from 'react';
import { Pressable, View, type LayoutChangeEvent } from 'react-native';
import { Text, UI_SCALE } from '@/components/Text';
import { ZoomIn, type LucideProps } from 'lucide-react-native';
import type { BranchPiece } from '@shared/quran/branchInventory';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { ayatLabel, endSign, keys, shownAyat, type Branch } from '@shared/quran/branches';
import { pathToggleKey } from '@shared/quran/pathHighlight';
import { writtenForms } from '@shared/quran/writtenForms';
import { num } from '@shared/quran/arabicNumber';
import { quranText } from '@/lib/quranText';
import type { Around, Beside, Matches, Presentation } from '@/lib/branches';
import { aroundOf, mixedBefore, subtreeOf } from '@/lib/branches';
import { lineId, nodeIndices, nodeId } from '@/lib/growth';
import { CURVE, litSpine, type Span } from '@/lib/litSpine';
import { blend, QURAN_FONT, toneOf, UI_FONT, type Palette, CARD } from '@/lib/theme';
import Hourglass from './Hourglass';
import TreeIcon from './TreeIcon';
import type { SceneBox, SceneEdge, ScenePart, SceneText, TreeScene } from '@/lib/scene';

/** A tap on a box; `lightPath` lights its path, which the host runs unless the tap meant something else (a double tap). */
type Tap = (ayahKeys: string[], lightPath?: () => void) => void;
/** The paths lit on a tree, as on the website: a node's ayat, several at once. */
export type Paths = { lit: Set<string>; pinned: Map<string, string[]>; pin: (id: string, keys: string[]) => void };
/** The button row under each node; when given, every box gets it (the quiz draws none). The matrix shows a node's ayat. */
export type NodeActions = { onSubtree: (piece: BranchPiece) => void };
export type Direction = 'side' | 'down';
/** What a growing tree hides and lights; empty when nothing grows. */
export type TreeGrowth = { hidden: Set<string>; now: Set<string>; ask?: { id: string; left: number; seconds: number }; lit: string | null; tour?: boolean };
const NO_GROWTH: TreeGrowth = { hidden: new Set(), now: new Set(), lit: null };

/** Draws a node's own content instead of its words, e.g. a quiz input; `index` counts nodes below the root as `branchNodes` does. */
/** Draws a node's box in place of its words; `path` is the words above it. */
export type RenderNode = (node: Branch, index: number, path: string[]) => React.ReactNode | undefined;
type Shared = { spellings: boolean; palette: Palette; names: Record<number, string>; matches: Matches; offsets: Record<string, number>; onTap: Tap; down: boolean; indices: Map<Branch, number>; around?: Around; edges: SceneEdge[]; render?: RenderNode; paths?: Paths; actions?: NodeActions; inTree: Set<string>;
  /** The ayat whose ayah before the one before is drawn too (a mixed tree with the surrounding ayat on, see `required`). */
  earlier: Set<string> };
/** A lit path: the ayah growing while the studio is open, else the paths a tap or a search lit. */
const isLit = (shared: Shared, growth: TreeGrowth, ayahKeys: string[]) => growth !== NO_GROWTH
  ? growth.lit !== null && ayahKeys.includes(growth.lit)
  : !!shared.paths && ayahKeys.some(key => shared.paths!.lit.has(key));
/** The ayat whose paths were lit by a tap (not by a search), as the website names them on the box the path starts from. */
const tapped = (shared: Shared, ayahKeys: string[]) => !shared.paths ? [] : ayahKeys.filter(key => [...shared.paths!.pinned].some(([id, lit]) => id !== 'search' && lit.includes(key)));
const Growth = createContext<TreeGrowth>(NO_GROWTH);
/** Where each box registers itself, so a video of the tree can be drawn from where the boxes sit. */
type Host = ComponentRef<typeof View>;
type Registry = Map<string, { view: Host | null; text: SceneText }>;
const Boxes = createContext<Registry | null>(null);
/** Each label and line of words inside a box, where the app laid it out, so the video draws it in the same place. */
type PartSpec = Omit<ScenePart, 'x' | 'y' | 'w' | 'h'>;
type Parts = Map<string, { box: string; view: Host | null; spec: PartSpec }>;
const PartsOf = createContext<Parts | null>(null);
const BoxId = createContext<string | null>(null);
/** The video's label size: the app's interface text at 12 points, as Text scales it. */
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
/** How long a growing spine takes to reach a new child. */
const REACH = 150;
const isMark = (word: string) => word === '۝' || word.startsWith('﴿');

/** Fades a box or connector in and out as the tree grows. */
function Fade({ id, children, style, delay = 0 }: { id: string; children: React.ReactNode; style?: object;
  /** A connector waits for the spine to reach it. */
  delay?: number }) {
  const growth = useContext(Growth);
  // The box waiting for an answer shows, empty, with its timer.
  const hidden = growth.hidden.has(id) && growth.ask?.id !== id;
  const opacity = useSharedValue(hidden ? 0 : 1);
  useEffect(() => { opacity.value = hidden ? 0 : withDelay(delay, withTiming(1, { duration: FADE })); }, [hidden, opacity, delay]);
  const faded = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[style, faded]} pointerEvents={hidden ? 'none' : 'auto'}>{children}</Animated.View>;
}

function References({ text, shared, center, ruled }: { text: string; shared: Shared; center?: boolean;
  /** Inside a Ruled header, which hands the video its place. */
  ruled?: boolean }) {
  const part = usePart({ label: text, size: LABEL, align: center ? 'center' : 'right' });
  return <Text ref={ruled ? undefined : part} style={{ fontSize: 12, color: shared.palette.muted, textAlign: center ? 'center' : 'right', marginTop: center ? 0 : 4 }}>{text}</Text>;
}

/**
 * Above the box a lit path starts from: which ayah it is, or how many, as on the website. Not when the box itself ends
 * that one ayah, since its own reference already says so.
 */
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

/** A label over a thin rule, at the top of a box. */
function Ruled({ label, shared, children }: { label: string; shared: Shared; children: React.ReactNode }) {
  const part = usePart({ label, size: LABEL, align: 'center', rule: true });
  return (
    <View ref={part} collapsable={false} style={{ borderBottomWidth: 1, borderColor: shared.palette.rule, paddingVertical: 2, marginBottom: 2 }}>
      {children}
    </View>
  );
}

type Marks = { exact: Set<number>; rooted: Set<number> };

/** A word is coloured when it is the same (accent) or shares its root (purple) in every ayah through this node; amber when voiced differently. */
function tonesOf(words: string[], ayahKeys: string[], at: number, shared: Shared, marks?: Marks, forms?: Branch['forms']) {
  const { palette, matches, offsets } = shared;
  return words.map((word, i) => {
    const kinds = marks ? [marks.rooted.has(i) ? 'root' : marks.exact.has(i) ? 'exact' : undefined] : ayahKeys.map(key => {
      const index = (offsets[key] ?? 0) + at + i;
      const match = matches[key];
      return match?.rooted.has(index) ? 'root' : match?.exact.has(index) ? 'exact' : undefined;
    });
    const kind = !isMark(word) && kinds.length > 0 && kinds.every(Boolean) ? (kinds.includes('root') ? 'root' : 'exact') : undefined;
    // A root match already says the forms differ, so it keeps its purple.
    const written = writtenForms({ forms }, i, word, shared.paths?.lit);
    return kind === 'root' && written.length === 1 ? palette.root : written.length > 1 || (written[0].word !== word && !isMark(word)) ? palette.amber : kind === 'exact' ? palette.accent : undefined;
  });
}

type WordsProps = { words: string[]; ayahKeys: string[]; at: number; shared: Shared; size: number; marks?: Marks; color?: string; forms?: Branch['forms'] };
// docs/adr/0035-a-tree-node-shows-words-only-as-the-mushaf-writes-them.md (quiz trees keep one form)
function Words({ words, ayahKeys, at, shared, size, marks, color, forms }: WordsProps) {
  const tones = tonesOf(words, ayahKeys, at, shared, marks, forms);
  const { palette } = shared;
  const bracketed = words.some((word, i) => writtenForms({ forms }, i, word, shared.paths?.lit).length > 1);
  const part = usePart({ ...sceneWords({ words, ayahKeys, at, shared, size, marks, color, forms }), ...(bracketed ? {} : { lineHeight: size * 1.9 }) });
  return (
    <Text ref={part} style={{ fontFamily: QURAN_FONT, fontSize: size, lineHeight: bracketed ? undefined : size * 1.9, color: color ?? palette.ink, textAlign: 'center', writingDirection: 'rtl' }}>
      {words.map((word, i) => {
        const written = writtenForms({ forms }, i, word, shared.paths?.lit);
        if (written.length === 1) return <Text key={i} style={tones[i] ? { color: tones[i] } : undefined}>{i > 0 ? ' ' : ''}{quranText(written[0].word)}</Text>;
        return (
          <Text key={i}>{i > 0 ? ' ' : ''}
            <View testID="forms" style={{ borderLeftWidth: 2, borderRightWidth: 2, borderColor: palette.amber, borderRadius: 6, paddingHorizontal: 6, marginHorizontal: 2 }}>
              {written.map((form, n) => (
                <View key={form.word} style={{ alignItems: 'center', borderTopWidth: n > 0 ? 1 : 0, borderStyle: 'dashed', borderColor: palette.rule }}>
                  <Text style={{ fontFamily: QURAN_FONT, fontSize: size, lineHeight: size * 1.6, color: palette.amber }}>{quranText(form.word)}</Text>
                  <Text style={{ fontFamily: UI_FONT, fontSize: 11, lineHeight: 14, color: palette.muted, marginTop: -4, paddingBottom: 2, maxWidth: 180, textAlign: 'center' }}>{form.keys.map(key => { const [surah, ayah] = key.split(':').map(Number); return `${shared.names[surah] ?? num(surah)} ${num(ayah)}`; }).join(' · ')}</Text>
                </View>
              ))}
            </View>
          </Text>
        );
      })}
    </Text>
  );
}

/** The same words as data, for the video. */
const sceneWords = ({ words, ayahKeys, at, shared, size, marks, color, forms }: WordsProps) => {
  const tones = tonesOf(words, ayahKeys, at, shared, marks, forms);
  return { size, words: words.map((word, i) => ({ text: writtenForms({ forms }, i, word).map(form => quranText(form.word)).join(' / '), color: tones[i] ?? color ?? shared.palette.ink })) };
};

function Tool({ label, Icon, onPress, palette, on }: { label: string; Icon: (props: LucideProps) => React.ReactNode; onPress: () => void; palette: Palette; on?: boolean }) {
  return (
    <Pressable onPress={onPress} hitSlop={4} accessibilityRole="button" accessibilityLabel={label} accessibilityState={on === undefined ? undefined : { selected: on }}
      style={{ padding: 5, borderRadius: 8, borderWidth: 1, borderColor: on ? palette.accent : palette.rule }}>
      <Icon size={16} color={on ? palette.accent : palette.muted} />
    </Pressable>
  );
}

/** The buttons under a node: open the part under it as a tree of its own, or light a neighbour ayah's own place in the tree. */
function Tools({ shared, subtree, inTree }: { shared: Shared; subtree?: BranchPiece;
  /** A neighbour ayah that is itself in the tree: lights its own place there (the website's «في هذه الشجرة»). */
  inTree?: string }) {
  const { actions, paths, palette } = shared;
  if (!actions) return null;
  // Tapping the box lights its path, so it has no path button.
  if (!subtree && !inTree) return null;
  const found = !!inTree && !!paths?.pinned.has(pathToggleKey(`t${inTree}`, [inTree]));
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, paddingBottom: 6 }}>
      {subtree && <Tool label="عرض هذا الجزء وحده" Icon={ZoomIn} palette={palette} onPress={() => actions.onSubtree(subtree)} />}
      {inTree && <Tool label="في هذه الشجرة" Icon={TreeIcon} palette={palette} on={found} onPress={() => paths?.pin(`t${inTree}`, [inTree])} />}
    </View>
  );
}

function Box({ id, ayahKeys, leaf, shared, muted, text, tools, children }: { id: string; ayahKeys: string[]; leaf: boolean; shared: Shared; muted?: boolean; text: SceneText; tools?: React.ReactNode; children: React.ReactNode }) {
  const { palette, down, paths } = shared;
  const growth = useContext(Growth);
  const registry = useContext(Boxes);
  const register = (view: Host | null) => { if (registry) registry.set(id, { view, text: { ...text, muted: !!muted, keys: ayahKeys } }); };
  const asked = growth.ask?.id === id ? growth.ask : undefined;
  // A lit path tints its boxes blue and outlines them in the colour of its lines; the box tapped (or just grown) is tinted deeper.
  const onPath = isLit(shared, growth, ayahKeys);
  const selected = !!paths?.pinned.has(pathToggleKey(id, ayahKeys));
  return (
    <Fade id={id}>
      <Pressable ref={register}
        onPress={() => shared.onTap(ayahKeys, paths ? () => paths.pin(id, ayahKeys) : undefined)}
        accessibilityRole="button"
        accessibilityLabel={asked ? 'اكشف الكلمة التالية' : undefined}
        style={({ pressed }) => ({
          maxWidth: down ? (leaf ? 176 : 384) : leaf ? 208 : 192,
          borderWidth: 1,
          borderStyle: muted ? 'dashed' : 'solid',
          borderColor: asked ? palette.accent : growth.now.has(id) || onPath || selected ? palette.path : pressed ? palette.accent : muted ? palette.muted : palette.rule,
          backgroundColor: onPath ? blend(palette.path, palette.paper, selected ? 0.22 : 0.12) : muted ? 'transparent' : palette.card,
          ...CARD,
        })}>
        {/* The video draws the whole box, buttons' room included, and in it the words and references, not the buttons. */}
        <View style={{ paddingHorizontal: 12, paddingVertical: 4, opacity: asked ? 0 : 1 }}><BoxId.Provider value={id}>{children}</BoxId.Provider></View>
        {tools && <View style={{ opacity: asked ? 0 : 1 }}>{tools}</View>}
        {asked && <View style={{ position: 'absolute', top: 0, bottom: 0, start: 0, end: 0, alignItems: 'center', justifyContent: 'center' }}>
          {asked.seconds ? <Hourglass left={asked.left} seconds={asked.seconds} color={palette.accent} /> : <Text style={{ color: palette.accent, fontSize: 22, fontWeight: '700' }}>؟</Text>}
        </View>}
      </Pressable>
    </Fade>
  );
}

/** The tab's size: the app's interface text at 10 points, as Text scales it, quieter than the node's words. */
const TAB = Math.round(10 * UI_SCALE);
const TAB_HEIGHT = 16;
/** The tab stands on the node's border, its foot 2 points over it: inside the node's own padding, clear of the words' marks. */
const TAB_RISE = TAB_HEIGHT - 2;

/**
 * The ayah a node ends, on a small tab over its top edge at the start where reading begins (owner, 2026-11-14), so the node holds
 * only its words. It sits in the node's own flow, pulled up over the border with no height of its own: the node is never narrower
 * than its tab, and the tab fades and hides with the node. Side by side only; the node keeps the same room below as above.
 */
function NodeTab({ id, ayahKeys, label, shared, muted }: { id: string; ayahKeys: string[]; label: string; shared: Shared;
  /** On a surrounding ayah's dashed box: dashed too. */
  muted?: boolean }) {
  const growth = useContext(Growth);
  const lit = growth.now.has(id) || isLit(shared, growth, ayahKeys) || !!shared.paths?.pinned.has(pathToggleKey(id, ayahKeys));
  const part = usePart({ label, size: TAB, align: 'center', tab: muted ? 'dashed' : true });
  // The box's border (1) and padding (4) are above its content: the tab rises from there to TAB_RISE over the box.
  return (
    <View ref={part} collapsable={false}
      style={{ alignSelf: 'flex-start', marginStart: -4, marginTop: -(5 + TAB_RISE), marginBottom: 5 + TAB_RISE - TAB_HEIGHT, height: TAB_HEIGHT, paddingHorizontal: 6, justifyContent: 'center', borderRadius: 8, borderWidth: 1, borderStyle: muted ? 'dashed' : 'solid', borderColor: lit ? shared.palette.path : muted ? shared.palette.muted : shared.palette.rule, backgroundColor: muted ? shared.palette.paper : shared.palette.card }}>
      <Text style={{ fontSize: 10, lineHeight: 14, color: shared.palette.muted }} numberOfLines={1}>{label}</Text>
    </View>
  );
}

/** An ayah's end mark between two parts of a branch, drawn without a box. */
function Mark({ id, text, shared }: { id: string; text: string; shared: Shared }) {
  const registry = useContext(Boxes);
  const register = (view: Host | null) => { if (registry) registry.set(id, { view, text: { size: 18, words: [{ text, color: shared.palette.muted }], bare: true } }); };
  return <View ref={register}><Text style={{ fontFamily: QURAN_FONT, fontSize: 18, color: shared.palette.muted, paddingHorizontal: 4 }}>{text}</Text></View>;
}

/**
 * One child's elbow: the spine from its siblings and the line into it, curved at the two ends. The spine is always drawn plain;
 * a lit child lights only its own line and, at an end, its curve. The lit stretch of spine up to the parent is drawn by the fan
 * on top, so a lit path is exactly the lines it runs along and never the spine past the parent's line.
 */
function Elbow({ first, last, color, lit, down, spine: whole = true }: { first: boolean; last: boolean; color: string; lit?: string; down: boolean;
  /** Off while the tree grows: the fan draws the spine itself, only as far as the children shown. */
  spine?: boolean }) {
  const only = first && last;
  const into = lit ?? color;
  const spine = whole ? LINE : 0;
  if (down) {
    // Children sit in a row under the parent: a bus along the top, a drop into each child.
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

function Fan({ entries, shared }: { entries: Entry[]; shared: Shared }) {
  const { palette, down } = shared;
  const growth = useContext(Growth);
  const lit = entries.map(entry => isLit(shared, growth, entry.keys));
  // While the tree grows, the spine reaches only the children already drawn, not the places the hidden ones keep.
  const shown = entries.map(entry => !growth.hidden.has(lineId(entry.id)));
  const growing = growth.hidden.size > 0;
  const [spans, setSpans] = useState<Span[]>([]);
  const [whole, setWhole] = useState(0);
  // A lit child still hidden lights nothing yet.
  const litShown = lit.map((on, i) => on && shown[i]);
  const spine = litShown.some(Boolean) ? litSpine(spans, litShown, whole) : null;
  const drawn = growing && shown.some(Boolean) ? litSpine(spans, shown, whole) : null;
  return (
    <View style={{ flexDirection: down ? 'row' : 'column', alignItems: 'flex-start' }} onLayout={event => setWhole(down ? event.nativeEvent.layout.width : event.nativeEvent.layout.height)}>
      {entries.map((entry, i) => (
        <View key={entry.id} style={{ flexDirection: down ? 'column' : 'row', alignItems: 'center' }}
          onLayout={event => { const { x, y, width, height } = event.nativeEvent.layout; const span = down ? { at: x, size: width } : { at: y, size: height }; setSpans(old => { const next = [...old]; next[i] = span; return next; }); }}>
          <Fade id={lineId(entry.id)} delay={growing ? REACH : 0} style={down ? { alignSelf: 'stretch' } : { alignSelf: 'stretch', flexDirection: 'row' }}>
            <Elbow first={i === 0} last={i === entries.length - 1} color={palette.rule} lit={lit[i] ? palette.path : undefined} down={down} spine={!growing} />
          </Fade>
          <View style={down ? { paddingHorizontal: 5 } : { paddingVertical: 5 }}>{entry.item}</View>
        </View>
      ))}
      {drawn && <Spine key={down ? 'drawn-down' : 'drawn-side'} range={drawn} color={palette.rule} down={down} from={whole / 2} />}
      {spine && <Spine key={down ? 'lit-down' : 'lit-side'} range={spine} color={palette.path} down={down} from={whole / 2} grow={growing} />}
    </View>
  );
}

/**
 * A stretch of a fan's spine. While the tree grows it runs out from the parent's line toward the new child,
 * in step with the child's connector fading in, so a line never reaches a place before its curve and box.
 */
function Spine({ range, color, down, from, grow = true }: { range: [number, number]; color: string; down: boolean; from: number; grow?: boolean }) {
  const start = grow && from > range[0] && from < range[1];
  const low = useSharedValue(start ? from : range[0]);
  const high = useSharedValue(start ? from : range[1]);
  useEffect(() => {
    // Only a spine that reaches further runs out; one that shrinks (a replay from a later ayah) or moves jumps.
    const reach = grow && range[0] <= low.value && range[1] >= high.value;
    low.value = reach ? withTiming(range[0], { duration: REACH }) : range[0];
    high.value = reach ? withTiming(range[1], { duration: REACH }) : range[1];
  }, [range[0], range[1], grow]); // eslint-disable-line react-hooks/exhaustive-deps
  const style = useAnimatedStyle(() => down ? { left: low.value, width: high.value - low.value } : { top: low.value, height: high.value - low.value });
  return <Animated.View pointerEvents="none" style={[down
    ? { position: 'absolute', top: 0, borderTopWidth: LINE, borderColor: color }
    : { position: 'absolute', start: 0, borderStartWidth: LINE, borderColor: color }, style]} />;
}

/** The connector between a box and its fan; shown once anything in the fan is, lit when a path runs through it. */
function Stub({ shared, entries }: { shared: Shared; entries: Entry[] }) {
  const growth = useContext(Growth);
  const { hidden } = growth;
  const visible = entries.some(entry => !hidden.has(lineId(entry.id)));
  const color = entries.some(entry => !hidden.has(lineId(entry.id)) && isLit(shared, growth, entry.keys)) ? shared.palette.path : shared.palette.rule;
  return <View style={[shared.down ? { height: 14, borderStartWidth: LINE } : { width: 14, borderTopWidth: LINE }, { borderColor: color, opacity: visible ? 1 : 0 }]} />;
}

/** Fans drawn before the root (words before the phrase, the ayat before) open the other way: mirrored, then each item mirrored back. */
function BackFan({ entries, shared }: { entries: Entry[]; shared: Shared }) {
  const flip = shared.down ? { transform: [{ scaleY: -1 }] } : { transform: [{ scaleX: -1 }] };
  return (
    <View style={flip}>
      <Fan shared={shared} entries={entries.map(entry => ({ ...entry, item: <View style={flip}>{entry.item}</View> }))} />
    </View>
  );
}

function NeighbourBox({ id, beside, of, shared, tab }: { id: string; beside: Beside; of: string; shared: Shared;
  /** The last box of its ayah's path carries the path's one tab, naming the whole run it shows. */
  tab?: string }) {
  // With the surrounding ayat on, a path's ayat are named once, on the tab at its end; these boxes hold only their text.
  const quiet = !!shared.around && !shared.down;
  const [surah, ayah] = beside.key.split(':').map(Number);
  const ref = shared.names[surah] ? `${shared.names[surah]} ${num(ayah)}` : `${num(surah)}:${num(ayah)}`;
  const basmala = beside.basmala ? sceneWords({ words: beside.basmala, ayahKeys: [], at: 0, shared, size: 17, marks: { exact: new Set(), rooted: new Set() }, color: shared.palette.muted }).words : [];
  const closed = [...beside.words, ...endSign([beside.key])];
  const own = sceneWords({ words: closed, ayahKeys: [], at: 0, shared, size: 17, marks: beside, color: shared.palette.muted });
  const text: SceneText = { size: 17, words: id.startsWith('a') ? [...basmala, ...own.words] : [...own.words, ...basmala], ...(quiet ? {} : { footer: ref }) };
  const box = (
    <Box id={id} ayahKeys={[of]} leaf shared={shared} muted text={text} tools={<Tools shared={shared} inTree={shared.inTree.has(beside.key) ? beside.key : undefined} />}>
      {quiet && tab && <NodeTab id={id} ayahKeys={[of]} label={tab} shared={shared} muted />}
      {beside.basmala && id.startsWith('a') && <Words words={beside.basmala} ayahKeys={[]} at={0} shared={shared} size={17} marks={{ exact: new Set(), rooted: new Set() }} color={shared.palette.muted} />}
      <Words words={closed} ayahKeys={[]} at={0} shared={shared} size={17} marks={beside} color={shared.palette.muted} />
      {beside.basmala && !id.startsWith('a') && <Words words={beside.basmala} ayahKeys={[]} at={0} shared={shared} size={17} marks={{ exact: new Set(), rooted: new Set() }} color={shared.palette.muted} />}
      {!quiet && <References text={ref} shared={shared} center />}
    </Box>
  );
  return quiet && tab ? <View style={{ paddingVertical: TAB_RISE }}>{box}</View> : box;
}

/** The ayat before the given ones, opening to the right of what they lead into (or above it, top down). */
function befores(ayahKeys: string[], shared: Shared): Entry[] {
  const around = shared.around;
  if (!around) return [];
  return ayahKeys.flatMap(key => around.before[key] ? [{ id: `b${key}`, keys: [key], item: <NeighbourBox id={`b${key}`} beside={around.before[key]!} of={key} shared={shared} /> }] : []);
}

function Node({ node, path, shared, starts }: { node: Branch; path: string[]; shared: Shared;
  /** On the root: the ayat that start here rather than in a box of words before the phrase. */
  starts?: string[] }) {
  const root = path.length === 0;
  const all = keys(node);
  const words = node.words;
  const id = nodeId(shared.indices.get(node)!);
  const own = root ? undefined : shared.render?.(node, shared.indices.get(node)!, path);
  const boundary = node.ayat.length === 0 && words.length > 0 && words.every(isMark);
  const singleSurah = node.ayat.length > 0 && node.ayat.every(key => key.split(':')[0] === node.ayat[0].split(':')[0]);
  const shown = !boundary && (!root || words.length > 0 || node.ayat.length > 0);
  const { around } = shared;
  const spans = shownAyat(node, path);
  // With the surrounding ayat on, each ayah's path is named once, on its last box: the whole run from the ayah before to the one after.
  const runs = !!around && !shared.down;
  const runOf = (key: string) => {
    const first = runs ? ((shared.earlier.has(key) ? around!.earlier[key] : null) ?? around!.before[key])?.key : undefined;
    const after = runs ? around!.after[around!.ends[key]]?.key : undefined;
    return ayatLabel([first ?? spans[key][0], ...(first ? [spans[key][spans[key].length - 1]] : spans[key].slice(1)), ...(after ? [after] : [])], shared.names);
  };
  const afters: Entry[] = !around ? [] : node.ayat.flatMap(key => {
    const beside = around.after[around.ends[key]];
    return beside ? [{ id: `a${key}`, keys: [key], item: <NeighbourBox id={`a${key}`} beside={beside} of={key} shared={shared} tab={runOf(key)} /> }] : [];
  });
  const entries: Entry[] = [...node.children.map(child => ({ id: nodeId(shared.indices.get(child)!), keys: keys(child), item: <Node node={child} path={[...path, ...words]} shared={shared} /> })), ...afters];
  entries.forEach(entry => edge(shared, id, entry.id));
  const references = node.ayat.map(key => ayatLabel(spans[key], shared.names)).join(' · ');
  const shownWords = { words: [...words, ...(isMark(words[words.length - 1] ?? '') ? [] : endSign(node.ayat.map(key => spans[key][spans[key].length - 1])))], ayahKeys: all, at: path.length, shared, size: root ? 22 : 20, forms: shared.spellings ? node.forms : undefined };
  const start = starts && startLabel(shared, starts, node.ayat);
  const text: SceneText = { ...sceneWords(shownWords), ...(node.ayat.length ? singleSurah ? { header: references } : { footer: references } : {}), ...(start ? { header: singleSurah ? `${start} · ${references}` : start } : {}) };
  return (
    <View style={{ flexDirection: shared.down ? 'column' : 'row', alignItems: 'center' }}>
      {boundary && <Fade id={id}><Mark id={id} text={quranText(words.join(' '))} shared={shared} /></Fade>}
      {shown && (() => {
        // A node ending one ayah carries it on a tab over its edge (owner, 2026-11-14); a node ending several, or a tree drawn top
        // down (where the line into a node runs through its top edge), keeps its references inside.
        const tab = own === undefined && node.ayat.length === 1 && !shared.down && !afters.length;
        // Side by side with the switch on, each ayah is named on the tab of its after box; one with none keeps its references here.
        const named = runs && node.ayat.length > 0 && afters.length === node.ayat.length;
        const box = (
          <Box id={id} ayahKeys={all} leaf={node.children.length === 0} shared={shared} text={text}
            tools={own === undefined && <Tools shared={shared} subtree={!root && node.children.length > 0 && shared.actions ? subtreeOf(all) : undefined} />}>
            {own !== undefined ? own : <>
            {tab && <NodeTab id={id} ayahKeys={all} label={runs ? runOf(node.ayat[0]) : references} shared={shared} />}
            <StartReference label={start} shared={shared} />
            {!tab && !named && singleSurah && <Ruled label={references} shared={shared}><References text={references} shared={shared} center ruled /></Ruled>}
            <Words {...shownWords} />
            {!tab && !named && !singleSurah && node.ayat.length > 0 && <References text={references} shared={shared} />}
            </>}
          </Box>
        );
        return tab ? <View style={{ paddingVertical: TAB_RISE }}>{box}</View> : box;
      })()}
      {entries.length > 0 && <>
        <Stub shared={shared} entries={entries} />
        <Fan shared={shared} entries={entries} />
      </>}
    </View>
  );
}

type Props = { presentation: Presentation; matches: Matches; names: Record<number, string>; palette: Palette; onTap: Tap; onLayout?: (event: LayoutChangeEvent) => void;
  /** The lit paths, and the node buttons (the branches tab draws both; the quiz neither). */
  paths?: Paths; actions?: NodeActions;
  direction?: Direction; around?: Around; growth?: TreeGrowth;
  /** Filled with a function that measures the drawn tree for the video. */
  sceneRef?: React.MutableRefObject<(() => Promise<TreeScene | null>) | null>;
  /** Draws a node's own content, e.g. a quiz input or a graded answer. */
  renderNode?: RenderNode };

/**
 * The website's phrase tree, root on the right and branches growing left (or top down); words before the phrase fan out on the right.
 * With the surrounding switch on (`around`), the ayah before each ayah opens before the root and the ayah after closes each branch.
 */
function BranchTree({ presentation, matches, names, palette, onTap, onLayout, direction = 'side', around, growth = NO_GROWTH, sceneRef, renderNode, paths, actions }: Props) {
  const down = direction === 'down';
  const shared: Shared = { spellings: !renderNode, palette, names, matches, offsets: presentation.offsets, onTap, down, indices: nodeIndices(presentation.tree), around, edges: [], render: renderNode, paths, actions, inTree: new Set(keys(presentation.tree)), earlier: new Set() };
  const registry = useRef<Registry>(new Map()).current;
  const parts = useRef<Parts>(new Map()).current;
  const rootView = useRef<Host>(null);
  const rootId = nodeId(-1);
  const all = keys(presentation.tree);
  const mixed = mixedBefore(presentation);
  // Words before the phrase, each with the ayat before it; ayat that open with the phrase show the ayah before when the switch is on,
  // or always when other ayat have words before the phrase (with the switch, one more before that).
  const before: Entry[] = presentation.prefixes.length === 0 ? befores(all, shared) : presentation.prefixes.flatMap((prefix, i): Entry[] => {
    if (prefix.word) {
      const lead = befores(prefix.keys, shared);
      const prefixWords = { words: prefix.words ?? prefix.word.split(' '), ayahKeys: prefix.keys, at: 0, shared: { ...shared, offsets: {} }, size: 20, forms: shared.spellings ? prefix.forms : undefined, color: prefix.conj ? toneOf(palette, prefix.conj) : undefined };
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
      {/* dir: the web build reads start/end from it, not from the direction style, so it draws the tree as the phone does. */}
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

/**
 * Where every box sits in the tree, in the tree's own points, with its words and where each of its labels and lines of words was laid
 * out: what the video draws.
 */
function measureScene(root: Host | null, registry: Registry, parts: Parts, edges: SceneEdge[], down: boolean): Promise<TreeScene | null> {
  if (!root) return Promise.resolve(null);
  type Rect = { x: number; y: number; w: number; h: number };
  const entries = [...registry].filter(([, item]) => item.view);
  const pieces = [...parts.values()].filter(item => item.view);
  const place = (view: Host) => new Promise<Rect | null>(resolve => {
    try { view.measureLayout(root, (x: number, y: number, w: number, h: number) => resolve({ x, y, w, h }), () => resolve(null)); } catch { resolve(null); }
  });
  const size = new Promise<{ w: number; h: number }>(resolve => root.measure((_x: number, _y: number, w: number, h: number) => resolve({ w, h })));
  return Promise.all([size, Promise.all(entries.map(([, item]) => place(item.view!))), Promise.all(pieces.map(item => place(item.view!)))]).then(([whole, rects, placed]) => {
    const own = new Map<string, ScenePart[]>();
    pieces.forEach((item, i) => { const rect = placed[i]; if (rect) own.set(item.box, [...own.get(item.box) ?? [], { ...item.spec, ...rect }]); });
    const boxes: SceneBox[] = entries.flatMap(([id, item], i) => {
      const rect = rects[i];
      if (!rect) return [];
      const inside = own.get(id)?.sort((a, b) => a.y - b.y);
      return [{ ...item.text, ...(inside ? { parts: inside } : {}), ...rect, id }];
    });
    return { width: whole.w, height: whole.h, down, boxes, edges };
  });
}

/** The ayah before each ayah that opens with the phrase, always drawn in a mixed tree; the switch adds the one before that. */
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
