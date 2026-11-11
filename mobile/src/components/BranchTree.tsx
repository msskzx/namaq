import { createContext, memo, useContext, useEffect, useRef, useState, type ComponentRef } from 'react';
import { Pressable, Text, View, type LayoutChangeEvent } from 'react-native';
import { ZoomIn, type LucideProps } from 'lucide-react-native';
import type { BranchPiece } from '@shared/quran/branchInventory';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { keys, type Branch } from '@shared/quran/branches';
import { pathToggleKey } from '@shared/quran/pathHighlight';
import { num } from '@shared/quran/arabicNumber';
import { quranText } from '@/lib/quranText';
import type { Around, Beside, Matches, Presentation } from '@/lib/branches';
import { aroundOf, mixedBefore, subtreeOf } from '@/lib/branches';
import { lineId, nodeIndices, nodeId } from '@/lib/growth';
import { CURVE, litSpine, type Span } from '@/lib/litSpine';
import { QURAN_FONT, type Palette } from '@/lib/theme';
import Hourglass from './Hourglass';
import TreeIcon from './TreeIcon';
import type { SceneBox, SceneEdge, SceneText, TreeScene } from '@/lib/scene';

/** A tap on a box; `lightPath` lights its path, which the host runs unless the tap meant something else (a double tap). */
type Tap = (ayahKeys: string[], lightPath?: () => void) => void;
/** The paths lit on a tree, as on the website: a node's ayat, several at once. */
export type Paths = { lit: Set<string>; pinned: Map<string, string[]>; pin: (id: string, keys: string[]) => void };
/** The button row under each node; when given, every box gets it (the quiz draws none). The matrix shows a node's ayat. */
export type NodeActions = { onSubtree: (piece: BranchPiece) => void };
export type Direction = 'side' | 'down';
/** What a growing tree hides and lights; empty when nothing grows. */
export type TreeGrowth = { hidden: Set<string>; now: Set<string>; ask?: { id: string; left: number; seconds: number }; lit: string | null };
const NO_GROWTH: TreeGrowth = { hidden: new Set(), now: new Set(), lit: null };

/** Draws a node's own content instead of its words, e.g. a quiz input; `index` counts nodes below the root as `branchNodes` does. */
export type RenderNode = (node: Branch, index: number) => React.ReactNode | undefined;
type Shared = { palette: Palette; names: Record<number, string>; matches: Matches; offsets: Record<string, number>; onTap: Tap; down: boolean; indices: Map<Branch, number>; around?: Around; edges: SceneEdge[]; render?: RenderNode; paths?: Paths; actions?: NodeActions; inTree: Set<string> };
const isLit = (shared: Shared, ayahKeys: string[]) => !!shared.paths && ayahKeys.some(key => shared.paths!.lit.has(key));
const Growth = createContext<TreeGrowth>(NO_GROWTH);
/** Where each box registers itself, so a video of the tree can be drawn from where the boxes sit. */
type Host = ComponentRef<typeof View>;
type Registry = Map<string, { view: Host | null; text: SceneText }>;
const Boxes = createContext<Registry | null>(null);
const edge = (shared: Shared, from: string, to: string, back = false) => { if (!shared.edges.some(item => item.from === from && item.to === to)) shared.edges.push({ from, to, back }); };

const LINE = 2;
const isMark = (word: string) => word === '۝' || word.startsWith('﴿');

/** Fades a box or connector in and out as the tree grows. */
function Fade({ id, children, style }: { id: string; children: React.ReactNode; style?: object }) {
  const growth = useContext(Growth);
  // The box waiting for an answer shows, empty, with its timer.
  const hidden = growth.hidden.has(id) && growth.ask?.id !== id;
  const opacity = useSharedValue(hidden ? 0 : 1);
  useEffect(() => { opacity.value = hidden ? 0 : withTiming(1, { duration: 250 }); }, [hidden, opacity]);
  const faded = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[style, faded]} pointerEvents={hidden ? 'none' : 'auto'}>{children}</Animated.View>;
}

function References({ ayahKeys, shared, center }: { ayahKeys: string[]; shared: Shared; center?: boolean }) {
  const text = ayahKeys.map(key => {
    const [surah, ayah] = key.split(':').map(Number);
    return shared.names[surah] ? `${shared.names[surah]} ${num(ayah)}` : `${num(surah)}:${num(ayah)}`;
  }).join(' · ');
  return <Text style={{ fontSize: 12, color: shared.palette.muted, textAlign: center ? 'center' : 'right', marginTop: center ? 0 : 4 }}>{text}</Text>;
}

type Marks = { exact: Set<number>; rooted: Set<number> };

/** Indices of the words a node's ayat voice differently: the node shows one spelling, so these words turn amber (as on the website). */
function differing(forms?: Record<string, string[]>) {
  const all = Object.values(forms ?? {});
  return new Set((all[0] ?? []).flatMap((_, i) => new Set(all.map(words => words[i])).size > 1 ? [i] : []));
}

/** A word is coloured when it is the same (accent) or shares its root (purple) in every ayah through this node; amber when voiced differently. */
function tonesOf(words: string[], ayahKeys: string[], at: number, shared: Shared, marks?: Marks, differs?: Set<number>) {
  const { palette, matches, offsets } = shared;
  return words.map((word, i) => {
    const kinds = marks ? [marks.rooted.has(i) ? 'root' : marks.exact.has(i) ? 'exact' : undefined] : ayahKeys.map(key => {
      const index = (offsets[key] ?? 0) + at + i;
      const match = matches[key];
      return match?.rooted.has(index) ? 'root' : match?.exact.has(index) ? 'exact' : undefined;
    });
    const kind = !isMark(word) && kinds.length > 0 && kinds.every(Boolean) ? (kinds.includes('root') ? 'root' : 'exact') : undefined;
    // A root match already says the forms differ, so it keeps its purple.
    return kind === 'root' ? palette.root : differs?.has(i) ? palette.amber : kind === 'exact' ? palette.accent : undefined;
  });
}

type WordsProps = { words: string[]; ayahKeys: string[]; at: number; shared: Shared; size: number; marks?: Marks; color?: string; differs?: Set<number> };
function Words({ words, ayahKeys, at, shared, size, marks, color, differs }: WordsProps) {
  const tones = tonesOf(words, ayahKeys, at, shared, marks, differs);
  return (
    <Text style={{ fontFamily: QURAN_FONT, fontSize: size, lineHeight: size * 1.9, color: color ?? shared.palette.ink, textAlign: 'center', writingDirection: 'rtl' }}>
      {words.map((word, i) => <Text key={i} style={tones[i] ? { color: tones[i] } : undefined}>{i > 0 ? ' ' : ''}{quranText(word)}</Text>)}
    </Text>
  );
}

/** The same words as data, for the video. */
const sceneWords = ({ words, ayahKeys, at, shared, size, marks, color, differs }: WordsProps) => {
  const tones = tonesOf(words, ayahKeys, at, shared, marks, differs);
  return { size, words: words.map((word, i) => ({ text: quranText(word), color: tones[i] ?? color ?? shared.palette.ink })) };
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
  const lit = growth.now.has(id) || !!asked || (growth.lit !== null && ayahKeys.includes(growth.lit)) || isLit(shared, ayahKeys);
  return (
    <Fade id={id}>
      <Pressable
        onPress={() => shared.onTap(ayahKeys, paths ? () => paths.pin(id, ayahKeys) : undefined)}
        accessibilityRole="button"
        accessibilityLabel={asked ? 'اكشف الكلمة التالية' : undefined}
        style={({ pressed }) => ({
          maxWidth: down ? (leaf ? 176 : 384) : leaf ? 208 : 192,
          borderWidth: 1,
          borderStyle: muted ? 'dashed' : 'solid',
          borderColor: pressed || lit ? (growth.now.has(id) ? palette.path : palette.accent) : muted ? palette.muted : palette.rule,
          backgroundColor: muted ? 'transparent' : palette.paperDeep,
          borderTopStartRadius: 14,
          borderBottomEndRadius: 14,
          borderTopEndRadius: 4,
          borderBottomStartRadius: 4,
        })}>
        {/* The video draws the box from this part: the words and references, not the buttons. */}
        <View ref={register} collapsable={false} style={{ paddingHorizontal: 12, paddingVertical: 4, opacity: asked ? 0 : 1 }}>{children}</View>
        {tools && <View style={{ opacity: asked ? 0 : 1 }}>{tools}</View>}
        {asked && <View style={{ position: 'absolute', top: 0, bottom: 0, start: 0, end: 0, alignItems: 'center', justifyContent: 'center' }}>
          {asked.seconds ? <Hourglass left={asked.left} seconds={asked.seconds} color={palette.accent} /> : <Text style={{ color: palette.accent, fontSize: 22, fontWeight: '700' }}>؟</Text>}
        </View>}
      </Pressable>
    </Fade>
  );
}

/** An ayah's end mark between two parts of a branch, drawn without a box. */
function Mark({ id, text, shared }: { id: string; text: string; shared: Shared }) {
  const registry = useContext(Boxes);
  const register = (view: Host | null) => { if (registry) registry.set(id, { view, text: { size: 18, words: [{ text, color: shared.palette.muted }], bare: true } }); };
  return <View ref={register}><Text style={{ fontFamily: QURAN_FONT, fontSize: 18, color: shared.palette.muted, paddingHorizontal: 4 }}>{text}</Text></View>;
}

/**
 * One child's elbow: the spine from its siblings and the line into it, curved at the two ends. A lit child lights only its own
 * line and curve; the stretch of spine up to the parent is drawn by the fan, so a lit path is exactly the lines it runs along.
 */
function Elbow({ first, last, color, lit, down }: { first: boolean; last: boolean; color: string; lit?: string; down: boolean }) {
  const only = first && last;
  const into = lit ?? color;
  if (down) {
    // Children sit in a row under the parent: a bus along the top, a drop into each child.
    return (
      <View style={{ height: 16, alignSelf: 'stretch', flexDirection: 'row' }}>
        <View style={{ flex: 1, borderColor: last ? into : color, ...(only || first ? {} : { borderTopWidth: LINE }), ...(last && !only ? { borderTopWidth: LINE, borderTopEndRadius: CURVE, borderEndWidth: LINE } : {}) }} />
        <View style={{ flex: 1, borderColor: first ? into : color, ...(only || last ? {} : { borderTopWidth: LINE }), ...(first && !only ? { borderTopWidth: LINE, borderTopStartRadius: CURVE, borderStartWidth: LINE } : {}) }} />
        {(only || (!first && !last)) && <View style={{ position: 'absolute', left: '50%', marginLeft: -LINE / 2, top: 0, bottom: 0, borderStartWidth: LINE, borderColor: into }} />}
      </View>
    );
  }
  return (
    <View style={{ width: 16, alignSelf: 'stretch' }}>
      <View style={{ flex: 1, borderColor: last ? into : color, ...(only || first ? {} : last ? { borderStartWidth: LINE, borderBottomWidth: LINE, borderBottomStartRadius: CURVE } : { borderStartWidth: LINE }) }} />
      <View style={{ flex: 1, borderColor: first ? into : color, ...(only || last ? {} : first ? { borderStartWidth: LINE, borderTopWidth: LINE, borderTopStartRadius: CURVE } : { borderStartWidth: LINE }) }} />
      {(only || (!first && !last)) && <View style={{ position: 'absolute', top: '50%', marginTop: -LINE / 2, start: 0, end: 0, borderTopWidth: LINE, borderColor: into }} />}
    </View>
  );
}

type Entry = { id: string; keys: string[]; item: React.ReactNode };

function Fan({ entries, shared }: { entries: Entry[]; shared: Shared }) {
  const { palette, down } = shared;
  const lit = entries.map(entry => isLit(shared, entry.keys));
  const [spans, setSpans] = useState<Span[]>([]);
  const [whole, setWhole] = useState(0);
  const spine = lit.some(Boolean) ? litSpine(spans, lit, whole) : null;
  return (
    <View style={{ flexDirection: down ? 'row' : 'column', alignItems: 'flex-start' }} onLayout={event => setWhole(down ? event.nativeEvent.layout.width : event.nativeEvent.layout.height)}>
      {entries.map((entry, i) => (
        <View key={entry.id} style={{ flexDirection: down ? 'column' : 'row', alignItems: 'center' }}
          onLayout={event => { const { x, y, width, height } = event.nativeEvent.layout; const span = down ? { at: x, size: width } : { at: y, size: height }; setSpans(old => { const next = [...old]; next[i] = span; return next; }); }}>
          <Fade id={lineId(entry.id)} style={down ? { alignSelf: 'stretch' } : { alignSelf: 'stretch', flexDirection: 'row' }}>
            <Elbow first={i === 0} last={i === entries.length - 1} color={palette.rule} lit={lit[i] ? palette.accent : undefined} down={down} />
          </Fade>
          <View style={down ? { paddingHorizontal: 5 } : { paddingVertical: 5 }}>{entry.item}</View>
        </View>
      ))}
      {spine && <View pointerEvents="none" style={down
        ? { position: 'absolute', top: 0, left: spine[0], width: spine[1] - spine[0], borderTopWidth: LINE, borderColor: palette.accent }
        : { position: 'absolute', start: 0, top: spine[0], height: spine[1] - spine[0], borderStartWidth: LINE, borderColor: palette.accent }} />}
    </View>
  );
}

/** The connector between a box and its fan; shown once anything in the fan is, lit when a path runs through it. */
function Stub({ shared, entries }: { shared: Shared; entries: Entry[] }) {
  const { hidden } = useContext(Growth);
  const visible = entries.some(entry => !hidden.has(lineId(entry.id)));
  const color = entries.some(entry => isLit(shared, entry.keys)) ? shared.palette.accent : shared.palette.rule;
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

function NeighbourBox({ id, beside, of, shared }: { id: string; beside: Beside; of: string; shared: Shared }) {
  const [surah, ayah] = beside.key.split(':').map(Number);
  const ref = shared.names[surah] ? `${shared.names[surah]} ${num(ayah)}` : `${num(surah)}:${num(ayah)}`;
  const basmala = beside.basmala ? sceneWords({ words: beside.basmala, ayahKeys: [], at: 0, shared, size: 17, marks: { exact: new Set(), rooted: new Set() }, color: shared.palette.muted }).words : [];
  const own = sceneWords({ words: beside.words, ayahKeys: [], at: 0, shared, size: 17, marks: beside, color: shared.palette.muted });
  const text: SceneText = { size: 17, words: id.startsWith('a') ? [...basmala, ...own.words] : [...own.words, ...basmala], footer: ref };
  return (
    <Box id={id} ayahKeys={[of]} leaf shared={shared} muted text={text} tools={<Tools shared={shared} inTree={shared.inTree.has(beside.key) ? beside.key : undefined} />}>
      {beside.basmala && id.startsWith('a') && <Words words={beside.basmala} ayahKeys={[]} at={0} shared={shared} size={17} marks={{ exact: new Set(), rooted: new Set() }} color={shared.palette.muted} />}
      <Words words={beside.words} ayahKeys={[]} at={0} shared={shared} size={17} marks={beside} color={shared.palette.muted} />
      {beside.basmala && !id.startsWith('a') && <Words words={beside.basmala} ayahKeys={[]} at={0} shared={shared} size={17} marks={{ exact: new Set(), rooted: new Set() }} color={shared.palette.muted} />}
      <Text style={{ fontSize: 12, color: shared.palette.muted, textAlign: 'center' }}>{ref}</Text>
    </Box>
  );
}

/** The ayat before the given ones, opening to the right of what they lead into (or above it, top down). */
function befores(ayahKeys: string[], shared: Shared): Entry[] {
  const around = shared.around;
  if (!around) return [];
  return ayahKeys.flatMap(key => around.before[key] ? [{ id: `b${key}`, keys: [key], item: <NeighbourBox id={`b${key}`} beside={around.before[key]!} of={key} shared={shared} /> }] : []);
}

function Node({ node, path, shared }: { node: Branch; path: string[]; shared: Shared }) {
  const root = path.length === 0;
  const all = keys(node);
  const words = node.words;
  const id = nodeId(shared.indices.get(node)!);
  const own = root ? undefined : shared.render?.(node, shared.indices.get(node)!);
  const boundary = node.ayat.length === 0 && words.length > 0 && words.every(isMark);
  const singleSurah = node.ayat.length > 0 && node.ayat.every(key => key.split(':')[0] === node.ayat[0].split(':')[0]);
  const shown = !boundary && (!root || words.length > 0 || node.ayat.length > 0);
  const { around } = shared;
  const afters: Entry[] = !around ? [] : node.ayat.flatMap(key => {
    const beside = around.after[around.ends[key]];
    return beside ? [{ id: `a${key}`, keys: [key], item: <NeighbourBox id={`a${key}`} beside={beside} of={key} shared={shared} /> }] : [];
  });
  const entries: Entry[] = [...node.children.map(child => ({ id: nodeId(shared.indices.get(child)!), keys: keys(child), item: <Node node={child} path={[...path, ...words]} shared={shared} /> })), ...afters];
  entries.forEach(entry => edge(shared, id, entry.id));
  const references = node.ayat.map(key => { const [surah, ayah] = key.split(':').map(Number); return `${shared.names[surah] ?? num(surah)} ${num(ayah)}`; }).join(' · ');
  const shownWords = { words, ayahKeys: all, at: path.length, shared, size: root ? 22 : 20, differs: differing(node.forms) };
  const text: SceneText = { ...sceneWords(shownWords), ...(node.ayat.length ? singleSurah ? { header: references } : { footer: references } : {}) };
  return (
    <View style={{ flexDirection: shared.down ? 'column' : 'row', alignItems: 'center' }}>
      {boundary && <Fade id={id}><Mark id={id} text={quranText(words.join(' '))} shared={shared} /></Fade>}
      {shown && (
        <Box id={id} ayahKeys={all} leaf={node.children.length === 0} shared={shared} text={text}
          tools={own === undefined && <Tools shared={shared} subtree={!root && node.children.length > 0 && shared.actions ? subtreeOf(all) : undefined} />}>
          {own !== undefined ? own : <>
          {singleSurah && <View style={{ borderBottomWidth: 1, borderColor: shared.palette.rule, paddingVertical: 2, marginBottom: 2 }}><References ayahKeys={node.ayat} shared={shared} center /></View>}
          <Words {...shownWords} />
          {!singleSurah && node.ayat.length > 0 && <References ayahKeys={node.ayat} shared={shared} />}
          </>}
        </Box>
      )}
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
  const shared: Shared = { palette, names, matches, offsets: presentation.offsets, onTap, down, indices: nodeIndices(presentation.tree), around, edges: [], render: renderNode, paths, actions, inTree: new Set(keys(presentation.tree)) };
  const registry = useRef<Registry>(new Map()).current;
  const rootView = useRef<Host>(null);
  const rootId = nodeId(-1);
  const all = keys(presentation.tree);
  const mixed = mixedBefore(presentation);
  // Words before the phrase, each with the ayat before it; ayat that open with the phrase show the ayah before when the switch is on,
  // or always when other ayat have words before the phrase (with the switch, one more before that).
  const before: Entry[] = presentation.prefixes.length === 0 ? befores(all, shared) : presentation.prefixes.flatMap((prefix, i): Entry[] => {
    if (prefix.word) {
      const lead = befores(prefix.keys, shared);
      const prefixWords = { words: prefix.words ?? prefix.word.split(' '), ayahKeys: prefix.keys, at: 0, shared: { ...shared, offsets: {} }, size: 20, differs: differing(prefix.forms) };
      lead.forEach(entry => edge(shared, `p${i}`, entry.id, true));
      const box = <Box id={`p${i}`} ayahKeys={prefix.keys} leaf shared={shared} text={sceneWords(prefixWords)}>
        <Words {...prefixWords} />
      </Box>;
      return [{ id: `p${i}`, keys: prefix.keys, item: lead.length ? <View style={{ flexDirection: down ? 'column-reverse' : 'row-reverse', alignItems: 'center' }}>{box}<Stub shared={shared} entries={lead} /><BackFan entries={lead} shared={shared} /></View> : box }];
    }
    return mixed ? required(prefix.keys, shared, around ?? aroundOf(presentation)) : befores(prefix.keys, shared);
  });
  before.forEach(entry => edge(shared, rootId, entry.id, true));
  if (sceneRef) sceneRef.current = () => measureScene(rootView.current, registry, shared.edges, down);
  return (
    <Boxes.Provider value={sceneRef ? registry : null}>
    <Growth.Provider value={growth}>
      <View ref={rootView} onLayout={onLayout} style={{ direction: 'rtl', flexDirection: down ? 'column' : 'row', alignItems: 'center', alignSelf: 'flex-start', padding: 12 }}>
        {before.length > 0 && <>
          <BackFan entries={before} shared={shared} />
          <Stub shared={shared} entries={before} />
        </>}
        <Node node={presentation.tree} path={[]} shared={shared} />
      </View>
    </Growth.Provider>
    </Boxes.Provider>
  );
}

/** Where every box sits in the tree, in the tree's own points, with its words: what the video draws. */
function measureScene(root: Host | null, registry: Registry, edges: SceneEdge[], down: boolean): Promise<TreeScene | null> {
  if (!root) return Promise.resolve(null);
  const entries = [...registry].filter(([, item]) => item.view);
  const place = (view: Host) => new Promise<{ x: number; y: number; w: number; h: number } | null>(resolve => {
    try { view.measureLayout(root, (x: number, y: number, w: number, h: number) => resolve({ x, y, w, h }), () => resolve(null)); } catch { resolve(null); }
  });
  const size = new Promise<{ w: number; h: number }>(resolve => root.measure((_x: number, _y: number, w: number, h: number) => resolve({ w, h })));
  return Promise.all([size, ...entries.map(([, item]) => place(item.view!))]).then(([whole, ...rects]) => {
    const { w, h } = whole as { w: number; h: number };
    const boxes: SceneBox[] = entries.flatMap(([id, item], i) => { const rect = rects[i] as { x: number; y: number; w: number; h: number } | null; return rect ? [{ ...item.text, ...rect, id }] : []; });
    return { width: w, height: h, down, boxes, edges };
  });
}

/** The ayah before each ayah that opens with the phrase, always drawn in a mixed tree; the switch adds the one before that. */
function required(ayahKeys: string[], shared: Shared, context: Around): Entry[] {
  return ayahKeys.flatMap(key => {
    const beside = context.before[key];
    if (!beside) return [];
    const earlier = shared.around?.earlier[key];
    const box = <NeighbourBox id={`b${key}`} beside={beside} of={key} shared={shared} />;
    if (earlier) edge(shared, `b${key}`, `e${key}`, true);
    return [{ id: `b${key}`, keys: [key], item: earlier ? <View style={{ flexDirection: shared.down ? 'column-reverse' : 'row-reverse', alignItems: 'center' }}>{box}<Stub shared={shared} entries={[{ id: `e${key}`, keys: [key], item: null }]} /><NeighbourBox id={`e${key}`} beside={earlier} of={key} shared={shared} /></View> : box }];
  });
}

export default memo(BranchTree);
