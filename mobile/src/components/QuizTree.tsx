import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Text, TextInput } from '@/components/Text';
import { router } from 'expo-router';
import { Bookmark, GalleryHorizontal, Lightbulb, RotateCwSquare, Send, SquareArrowOutUpLeft, UnfoldHorizontal, type LucideProps } from 'lucide-react-native';
import { readBookmarks, subscribeBookmarks, toggleBookmark } from '@shared/bookmarks';
import { branchesHref, keys, type Branch, type Variant } from '@shared/quran/branches';
import { num } from '@shared/quran/arabicNumber';
import { quranText } from '@/lib/quranText';
import { givenAnswer } from '@shared/quiz/branchAnswers';
import { correctionOf, gradedTree, neededCut, verdict, type Correction } from '@shared/quiz/feedback';
import { emptyBranchAnswers, isAsked, type ScoredQuestion } from '@shared/quiz/score';
import { addHint, hintsOf, type Hints } from '@shared/quiz/hints';
import BranchTree, { type Paths, type RenderNode } from './BranchTree';
import { litPaths, togglePath } from '@shared/quran/pathHighlight';
import MatrixCard, { MatrixShare } from './MatrixCard';
import { shareCard } from '@/lib/shareImage';
import TreeIcon from './TreeIcon';
import VideoSheet from './VideoSheet';
import { StudioButton, StudioControls, StudioProgress } from './Studio';
import type { BranchPiece } from '@shared/quran/branchInventory';
import { ayahOf, aroundOf, growthParts, isSaved, toggleSaved, WEBSITE, type Presentation } from '@/lib/branches';
import { EMPTY_LIST, listShowing } from '@/lib/branchList';
import type { Size } from '@/lib/camera';
import { growthBeats } from '@/lib/growth';
import { answer, claimTarget, closeStudio, growthState, stop, useGrowth, type Target } from '@/lib/growPlayer';
import type { TreeScene, VideoInput } from '@/lib/scene';
import { around as aroundSetting } from '@/lib/settings';
import { treeVideo } from '@/lib/treeVideo';
import { useKeyboardShown } from '@/lib/keyboard';
import { QURAN_FONT, type Palette, CARD } from '@/lib/theme';

export type TreeQuestion = ScoredQuestion & { tree: Branch; prefixes?: Variant[] };

const NO_MATCHES = {};

/** The paths lit on a quiz tree, as on the branches tab: a tap on a node lights its path, several at once. */
function usePaths(): Paths {
  const [pinned, setPinned] = useState(() => new Map<string, string[]>());
  return useMemo(() => ({ lit: litPaths(pinned), pinned, pin: (id, ayahKeys) => setPinned(current => togglePath(current, id, ayahKeys)) }), [pinned]);
}
const lightOnTap = (_: string[], lightPath?: () => void) => lightPath?.();
/** The size BranchTree draws its other nodes in, so leaves look the same. */
const LEAF_SIZE = 20;
/** The smallest a quiz tree is shrunk to fit the phone, so its words and boxes stay easy to read and tap. */
const FIT_MIN = 0.6;

/**
 * Scrolls a tree both ways; quiz trees are small, so they are drawn at full size with no zoom.
 * The root is on the right, so a tree wider than the phone opens scrolled to its right end.
 * `header` (the question strip and prompt) scrolls away with the tree instead of staying pinned.
 */
function Scroller({ header, children, onOverflow, fit = false }: { header?: React.ReactNode; children: React.ReactNode;
  /** Told when the tree is wider than the phone, so the quiz can turn it top down. */
  onOverflow?: () => void;
  /** Shrinks a tree still wider than the phone (down to FIT_MIN) so all of it shows; the rest scrolls sideways. */
  fit?: boolean }) {
  const sideways = useRef<{ scrollToEnd: (options?: { animated?: boolean }) => void } | null>(null);
  const [view, setView] = useState(0);
  const [natural, setNatural] = useState<Size | null>(null);
  useEffect(() => { if (onOverflow && view && natural && natural.width > view) onOverflow(); }, [onOverflow, view, natural]);
  const scale = fit && view && natural && natural.width > view ? Math.max(FIT_MIN, view / natural.width) : 1;
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
      {header}
      <View style={{ flexGrow: 1, justifyContent: 'center' }}>
        <ScrollView ref={sideways as never} horizontal style={{ direction: 'ltr' }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled"
          onLayout={event => setView(event.nativeEvent.layout.width)}
          onContentSizeChange={() => sideways.current?.scrollToEnd({ animated: false })}>
          {/* The tree laid out at its own size (so it is always measured whole), scaled from its top right corner, its
              footprint shrunk to the scaled size with negative margins. */}
          <View onLayout={event => { const { width, height } = event.nativeEvent.layout; setNatural(old => old && old.width === width && old.height === height ? old : { width, height }); }}
            style={{ alignSelf: 'flex-start', transform: [{ scale }], transformOrigin: 'top right',
              marginLeft: natural ? -natural.width * (1 - scale) : 0, marginBottom: natural ? -natural.height * (1 - scale) : 0 }}>
            {children}
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
}

function Tree({ question, tree, palette, names, renderNode, down }: { question: TreeQuestion; tree: Branch; palette: Palette; names: Record<number, string>; renderNode: RenderNode; down?: boolean }) {
  const paths = usePaths();
  const presentation = useMemo(() => ({ tree, prefixes: question.prefixes ?? [], offsets: {}, ayat: [] }), [tree, question.prefixes]);
  return <BranchTree presentation={presentation} matches={NO_MATCHES} names={names} palette={palette} onTap={lightOnTap} paths={paths} renderNode={renderNode} direction={down ? 'down' : 'side'} />;
}

/** The input for one asked node: the same box in the tree and in the matrix, so an answer typed in one shows in the other. */
function blank(question: TreeQuestion, index: number, value: string, onType: (node: number, text: string) => void, palette: Palette, width = 150, hint = '') {
  const asked = question.asked ?? [];
  return <TextInput value={value} onChangeText={text => onType(index, text)} placeholder={hint} placeholderTextColor={palette.muted}
    accessibilityLabel={`الطرف ${num(asked.indexOf(index) + 1)}`}
    autoCorrect={false} autoCapitalize="none" spellCheck={false} autoComplete="off"
    style={{ width, minHeight: 40, fontFamily: QURAN_FONT, fontSize: LEAF_SIZE, color: palette.ink, textAlign: 'right', writingDirection: 'rtl', paddingVertical: 6, borderBottomWidth: 1.5, borderColor: palette.accent }} />;
}

/** The question's nodes in branchNodes order (each child, then its own children), each with the nodes above it. */
function rowsOf(tree: Branch): { leaf: Branch; path: number[] }[] {
  const rows: { leaf: Branch; path: number[] }[] = [];
  let next = 0;
  const walk = (node: Branch, path: number[]) => node.children.forEach(child => {
    const index = next++;
    const here = [...path, index];
    if (!child.children.length) rows.push({ leaf: child, path: here });
    walk(child, here);
  });
  walk(tree, []);
  return rows;
}

/** The matrix view of a question: one row per ayah, the shared start in colour, an empty box where a node is asked. */
function MatrixInputs({ question, values, hints, onType, palette, names }: { question: TreeQuestion; values: string[]; hints: string[]; onType: (node: number, text: string) => void; palette: Palette; names: Record<number, string> }) {
  const rows = useMemo(() => rowsOf(question.tree), [question.tree]);
  const text = { fontFamily: QURAN_FONT, fontSize: LEAF_SIZE, lineHeight: LEAF_SIZE * 1.9, color: palette.ink, writingDirection: 'rtl' as const };
  return (
    <View style={{ gap: 10, paddingHorizontal: 12, paddingVertical: 8 }}>
      {rows.map(({ leaf, path }) => {
        const [surah, ayah] = (leaf.ayat[0] ?? '').split(':').map(Number);
        return (
          <View key={path.join('-')} style={{ gap: 2, padding: 10, borderWidth: 1, borderColor: palette.rule, ...CARD, backgroundColor: palette.card }}>
            {surah ? <Text style={{ color: palette.muted, fontSize: 13 }}>{`${names[surah] ?? num(surah)} ${num(ayah)}`}</Text> : null}
            <View style={{ direction: 'rtl', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 8 }}>
              <Text style={[text, { color: palette.accent, fontWeight: '700' }]}>{quranText(givenAnswer(question.tree))}</Text>
              {path.map(index => isAsked(question, index)
                ? <View key={index}>{blank(question, index, values[index], onType, palette, 130, hints[index])}</View>
                : <Text key={index} style={text}>{quranText(values[index])}</Text>)}
            </View>
          </View>
        );
      })}
    </View>
  );
}

/**
 * The question with an empty box in each asked node; the other nodes are given. Shown as a tree (it can rotate, and turns
 * top down by itself when it is wider than the phone, so no box starts off the screen) or, per question, as the matrix.
 */
export function QuizInputs({ question, typed, onType, palette, names, header, hints: kept, onHints }: { question: TreeQuestion; typed: string[]; onType: (node: number, text: string) => void; palette: Palette; names: Record<number, string>; header?: React.ReactNode;
  /** The hints shown so far, when the quiz keeps them (solo, so the review can mark them); otherwise they live here. */
  hints?: Hints; onHints?: (hints: Hints) => void }) {
  const values = emptyBranchAnswers(question).map((given, index) => isAsked(question, index) ? typed[index] ?? '' : given);
  const [own, setOwn] = useState<Hints>({});
  const hints = kept ?? own;
  const shown = useMemo(() => hintsOf(question, hints), [question, hints]);
  const hint = () => (onHints ?? setOwn)(addHint(question, values, hints));
  const renderNode: RenderNode = (node, index) => !isAsked(question, index)
    ? <Text style={{ fontFamily: QURAN_FONT, fontSize: LEAF_SIZE, lineHeight: LEAF_SIZE * 1.9, color: palette.ink, textAlign: 'center', writingDirection: 'rtl' }}>{quranText(givenAnswer(node))}</Text>
    : blank(question, index, values[index], onType, palette, 150, shown[index]);
  // null until the user rotates: then the tree is drawn the way that fits, sideways first.
  const [chosen, setChosen] = useState<boolean | null>(null);
  const [fits, setFits] = useState(true);
  const down = chosen ?? !fits;
  const overflow = useCallback(() => setFits(false), []);
  const [matrix, setMatrix] = useState(false);
  const typing = useKeyboardShown();
  return (
    <View style={{ flex: 1 }}>
      {matrix
        ? <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">{header}<MatrixInputs question={question} values={values} hints={shown} onType={onType} palette={palette} names={names} /></ScrollView>
        : <Scroller header={header} fit onOverflow={!down && chosen === null ? overflow : undefined}>
          <Tree question={question} tree={question.tree} palette={palette} names={names} renderNode={renderNode} down={down} />
        </Scroller>}
      {!typing && <View style={{ direction: 'rtl', flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 8 }}>
        <Bar label={matrix ? 'عرض الشجرة' : 'عرض المصفوفة'} onPress={() => setMatrix(!matrix)} Icon={matrix ? TreeIcon : GalleryHorizontal} palette={palette} />
        {!matrix && <Bar label="تدوير الشجرة" onPress={() => setChosen(!down)} Icon={RotateCwSquare} palette={palette} />}
        <Bar label="تلميح: حرف آخر من كل طرف فارغ" onPress={hint} Icon={Lightbulb} palette={palette} />
      </View>}
    </View>
  );
}

function Badge({ row, palette }: { row: Correction; palette: Palette }) {
  return (
    <View style={{ width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: row.correct ? 'transparent' : palette.accent, borderWidth: row.correct ? 1.5 : 0, borderColor: palette.green }}>
      <Text style={{ fontSize: 13, fontWeight: '700', color: row.correct ? palette.green : palette.onAccent }}>{num(row.number)}</Text>
    </View>
  );
}

/** What was typed for a wrong answer: the right words green, the rest struck through. */
function Typed({ row, palette }: { row: Correction; palette: Palette }) {
  const typed = row.typed ? row.typed.split(/\s+/) : [];
  return (
    <Text style={{ fontSize: 15, color: palette.muted, textAlign: 'right' }}>
      {'كتبتَ: '}
      {typed.length === 0 ? 'لا شيء' : <Text style={{ fontFamily: QURAN_FONT, fontSize: 17 }}>{typed.map((word, i) => (
        <Text key={i} style={i < row.right ? { color: palette.green } : { color: palette.accent, textDecorationLine: 'line-through' }}>{i > 0 ? ' ' : ''}{word}</Text>
      ))}</Text>}
    </Text>
  );
}

/** A checked answer under its ayah in the matrix: the same mark and verdict as in the tree, and what was typed when wrong. */
function MatrixMark({ row, palette }: { row: Correction; palette: Palette }) {
  return (
    <View style={{ direction: 'rtl', gap: 2, marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderColor: palette.rule }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Badge row={row} palette={palette} />
        <Text style={{ fontSize: 14, fontWeight: '600', color: palette.ink }}>{verdict(row, true)}</Text>
      </View>
      {!row.correct && <Typed row={row} palette={palette} />}
    </View>
  );
}

/** One asked node after checking: verdict, the node's words with the ones enough to type underlined, what was typed when wrong, and its ayat. */
function Graded({ row, palette, names, hinted }: { row: Correction; palette: Palette; names: Record<number, string>; hinted?: boolean }) {
  const references = row.node.ayat.map(key => { const [surah, ayah] = key.split(':').map(Number); return names[surah] ? `${names[surah]} ${num(ayah)}` : `${num(surah)}:${num(ayah)}`; }).join(' · ');
  const cut = neededCut(row.node.words, row.needed);
  return (
    <View style={{ maxWidth: 220, gap: 2 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Badge row={row} palette={palette} />
        <Text style={{ fontSize: 14, fontWeight: '600', color: palette.ink }}>{verdict(row, true)}</Text>
        {hinted && <Lightbulb size={15} color={palette.muted} accessibilityLabel="بتلميح" />}
      </View>
      <Text style={{ fontFamily: QURAN_FONT, fontSize: LEAF_SIZE, lineHeight: LEAF_SIZE * 1.9, color: palette.ink, textAlign: 'right', writingDirection: 'rtl' }}>
        <Text style={{ textDecorationLine: 'underline', textDecorationColor: palette.accent }}>{quranText(row.node.words.slice(0, cut).join(' '))}</Text>
        {cut < row.node.words.length ? ` ${quranText(row.node.words.slice(cut).join(' '))}` : ''}
      </Text>
      {!row.correct && <Typed row={row} palette={palette} />}
      {references !== '' && <Text style={{ fontSize: 12, color: palette.muted, textAlign: 'right' }}>{references}</Text>}
    </View>
  );
}

function Bar({ label, onPress, Icon, palette, on, fill }: { label: string; onPress: () => void; Icon: (props: LucideProps) => React.ReactNode; palette: Palette; on?: boolean; fill?: boolean }) {
  return (
    <Pressable onPress={onPress} hitSlop={4} accessibilityRole="button" accessibilityLabel={label} accessibilityState={on === undefined ? undefined : { selected: on }}
      style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: on ? 1 : 0, borderColor: palette.accent }}>
      <Icon size={22} color={on || fill ? palette.accent : palette.ink} {...(fill ? { fill: palette.accent } : {})} />
    </Pressable>
  );
}

/** Save, share and open the tree, as under a branches card; by its phrase, or the branches tree that carries it. */
function TreeActions({ phrase, text, palette, onShare }: { phrase: string; text: string; palette: Palette; onShare: (link: string) => void }) {
  // Finding the branches tree can take a moment, so the answer shows first.
  const [piece, setPiece] = useState<BranchPiece | undefined>(undefined);
  useEffect(() => {
    setPiece(undefined);
    const timer = setTimeout(() => setPiece(listShowing(EMPTY_LIST, phrase)?.piece), 0);
    return () => clearTimeout(timer);
  }, [phrase]);
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks);
  const saved = piece ? isSaved(piece, bookmarks) : bookmarks.some(bookmark => bookmark.id === phrase);
  const save = () => piece ? toggleSaved(piece) : toggleBookmark({ id: phrase, text, href: branchesHref(phrase) });
  const share = () => onShare(`${text}\n${WEBSITE}${branchesHref(piece?.id ?? phrase)}`);
  return <>
    <Bar label={saved ? 'إزالة من المحفوظات' : 'حفظ الشجرة'} onPress={save} Icon={Bookmark} palette={palette} fill={saved} />
    <Bar label="مشاركة" onPress={share} Icon={Send} palette={palette} />
    {piece && <Bar label="افتح في متشابهات القرآن" onPress={() => router.navigate({ pathname: '/branches', params: { tree: piece.id } })} Icon={SquareArrowOutUpLeft} palette={palette} />}
  </>;
}

/**
 * The answer tree: each asked node shows how it was graded; tapping a node lights its path (the matrix opens its ayat).
 * As on the website, it can turn to the matrix, rotate, show the surrounding ayat, grow in the studio, and be saved, shared or opened.
 */
export function QuizFeedback({ question, typed, palette, names, onTap, header, hints }: { question: TreeQuestion; typed: string[]; palette: Palette; names: Record<number, string>; onTap?: (keys: string[]) => void; header?: React.ReactNode;
  /** The hints used on this question, marked with a small bulb. */
  hints?: Hints }) {
  // Graded once per question and answer: a party sends a new copy of the same question with every update, and an
  // unanswered question comes with a new empty answer each render, which must not rebuild the tree (and stop the studio).
  const snapshot = JSON.stringify({ question, typed });
  const { graded, presentation } = useMemo(() => {
    const given = JSON.parse(snapshot) as { question: TreeQuestion; typed: string[] };
    const graded = gradedTree(given.question, given.typed);
    const presentation: Presentation = { tree: graded.tree, prefixes: given.question.prefixes ?? [], offsets: {}, ayat: keys(graded.tree).flatMap(key => ayahOf(key) ?? []) };
    return { graded, presentation };
  }, [snapshot]);
  const rows = useMemo(() => new Map(graded.rows.map(row => [row.index, row])), [graded]);
  const [matrix, setMatrix] = useState(false);
  // As while answering: turned top down and shrunk when wider than the phone, so the graded answers are on screen.
  const [chosen, setChosen] = useState<boolean | null>(null);
  const [fits, setFits] = useState(true);
  const down = chosen ?? !fits;
  const overflow = useCallback(() => setFits(false), []);
  const [around, setAround] = aroundSetting.use();
  const surrounding = useMemo(() => around ? aroundOf(presentation) : undefined, [around, presentation]);
  const [size, setSize] = useState<Size | null>(null);
  const growth = useGrowth();
  const beats = useRef<Target | null>(null);
  const sceneRef = useRef<(() => Promise<TreeScene | null>) | null>(null);
  const [video, setVideo] = useState<VideoInput | null>(null);
  // The studio grows this tree while it shows; a branches card under the quiz gets it back after.
  useEffect(() => {
    if (matrix) return;
    const options = { ...growthParts(presentation, surrounding), prefixes: presentation.prefixes };
    beats.current = { watch: growthBeats(presentation.tree, options), ask: growthBeats(presentation.tree, { ...options, ask: true }) };
    claimTarget('quiz', beats.current);
    return () => claimTarget('quiz', null);
  }, [presentation, surrounding, matrix]);
  const paths = usePaths();
  // As on the branches tab, a tap on a node lights its path.
  const tap = (ayahKeys: string[] | null, lightPath?: () => void) => {
    const state = growthState();
    if (state.ask) { answer(); return; }
    if (state.studio || !ayahKeys) return;
    lightPath?.();
  };
  const openVideo = async () => {
    stop();
    const scene = await sceneRef.current?.();
    if (scene && beats.current) setVideo(treeVideo(scene, beats.current, palette));
  };
  const renderNode: RenderNode = (_, index) => {
    const row = rows.get(index);
    return row ? <Graded row={row} palette={palette} names={names} hinted={!!hints?.[index]} /> : undefined;
  };
  // Share as image: the graded answer as it shows, tree or matrix; the tree's video from the share sheet too.
  const share = (link: string) => shareCard(matrix
    ? { content: width => <MatrixShare presentation={presentation} palette={palette} width={width} />, link }
    : { content: () => <BranchTree presentation={presentation} matches={NO_MATCHES} names={names} palette={palette} onTap={() => {}} paths={paths} renderNode={renderNode} direction={down ? 'down' : 'side'} around={surrounding} />,
      link, onVideo: () => void openVideo() });
  const studio = growth.studio && !matrix;
  const treeGrowth = studio ? { hidden: growth.hidden, now: growth.now, ask: growth.ask, lit: growth.lit } : undefined;
  const switchView = (next: () => void) => { closeStudio(); next(); };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {matrix
          ? <>{header}<View style={{ flex: 1 }} onLayout={event => setSize({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })}>
            {size && <MatrixCard presentation={presentation} palette={palette} view={size} around={around} onTap={ayahKeys => ayahKeys && onTap?.(ayahKeys)} onMove={() => {}}
              note={key => { const row = correctionOf(graded.rows, key); return row ? <MatrixMark row={row} palette={palette} /> : null; }} />}
          </View></>
          : <Scroller header={header} fit onOverflow={!down && chosen === null ? overflow : undefined}><BranchTree presentation={presentation} matches={NO_MATCHES} names={names} palette={palette} onTap={tap} paths={paths} renderNode={renderNode}
            direction={down ? 'down' : 'side'} around={surrounding} growth={treeGrowth} sceneRef={sceneRef} /></Scroller>}
      </View>
      {studio ? (
        <View style={{ direction: 'rtl' }}>
          <StudioProgress palette={palette} />
          <StudioControls palette={palette} onVideo={() => void openVideo()} />
        </View>
      ) : (
        <View style={{ direction: 'rtl', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, gap: 2 }}>
          {question.phrase && <TreeActions phrase={question.phrase} text={question.tree.words.join(' ')} palette={palette} onShare={share} />}
          {!matrix && <StudioButton palette={palette} />}
          <View style={{ flex: 1 }} />
          <Bar label={matrix ? 'عرض الشجرة' : 'عرض المصفوفة'} onPress={() => switchView(() => setMatrix(!matrix))} Icon={matrix ? TreeIcon : GalleryHorizontal} palette={palette} />
          {!matrix && <Bar label="تدوير الشجرة" onPress={() => switchView(() => setChosen(!down))} Icon={RotateCwSquare} palette={palette} />}
          <Bar label="الآيات المحيطة" onPress={() => switchView(() => setAround(!around))} Icon={UnfoldHorizontal} palette={palette} on={around} />
        </View>
      )}
      <VideoSheet input={video} onClose={() => setVideo(null)} palette={palette} />
    </View>
  );
}
