import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Pressable, ScrollView, Share, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Bookmark, GalleryHorizontal, RotateCwSquare, Send, SquareArrowOutUpLeft, UnfoldHorizontal, type LucideProps } from 'lucide-react-native';
import { readBookmarks, subscribeBookmarks, toggleBookmark } from '@shared/bookmarks';
import { branchesHref, keys, type Branch, type Variant } from '@shared/quran/branches';
import { num } from '@shared/quran/arabicNumber';
import { quranText } from '@/lib/quranText';
import { givenAnswer } from '@shared/quiz/branchAnswers';
import { gradedTree, neededCut, verdict, type Correction } from '@shared/quiz/feedback';
import { emptyBranchAnswers, isAsked, type ScoredQuestion } from '@shared/quiz/score';
import BranchTree, { type RenderNode } from './BranchTree';
import MatrixCard from './MatrixCard';
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
import { QURAN_FONT, type Palette } from '@/lib/theme';

export type TreeQuestion = ScoredQuestion & { tree: Branch; prefixes?: Variant[] };

const NO_MATCHES = {};

/**
 * Scrolls a tree both ways; quiz trees are small, so they are drawn at full size with no zoom.
 * The root is on the right, so a tree wider than the phone opens scrolled to its right end.
 */
function Scroller({ children }: { children: React.ReactNode }) {
  const sideways = useRef<{ scrollToEnd: (options?: { animated?: boolean }) => void } | null>(null);
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
      <ScrollView ref={sideways as never} horizontal style={{ direction: 'ltr' }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => sideways.current?.scrollToEnd({ animated: false })}>
        {children}
      </ScrollView>
    </ScrollView>
  );
}

function Tree({ question, tree, palette, names, renderNode, onTap }: { question: TreeQuestion; tree: Branch; palette: Palette; names: Record<number, string>; renderNode: RenderNode; onTap?: (keys: string[]) => void }) {
  const presentation = useMemo(() => ({ tree, prefixes: question.prefixes ?? [], offsets: {}, ayat: [] }), [tree, question.prefixes]);
  return <BranchTree presentation={presentation} matches={NO_MATCHES} names={names} palette={palette} onTap={onTap ?? (() => {})} renderNode={renderNode} />;
}

/** The tree with an empty box in each asked node; the other nodes are given. */
export function QuizInputs({ question, typed, onType, palette, names }: { question: TreeQuestion; typed: string[]; onType: (node: number, text: string) => void; palette: Palette; names: Record<number, string> }) {
  const values = emptyBranchAnswers(question).map((given, index) => isAsked(question, index) ? typed[index] ?? '' : given);
  const asked = question.asked ?? [];
  const renderNode: RenderNode = (node, index) => !isAsked(question, index)
    ? <Text style={{ fontFamily: QURAN_FONT, fontSize: 19, lineHeight: 36, color: palette.muted, textAlign: 'center' }}>{quranText(givenAnswer(node))}</Text>
    : <TextInput value={values[index]} onChangeText={text => onType(index, text)}
        accessibilityLabel={`الطرف ${num(asked.indexOf(index) + 1)}`}
        autoCorrect={false} autoCapitalize="none" spellCheck={false} autoComplete="off"
        style={{ width: 150, minHeight: 40, fontSize: 18, color: palette.ink, textAlign: 'right', writingDirection: 'rtl', paddingVertical: 6, borderBottomWidth: 1.5, borderColor: palette.accent }} />;
  return <Scroller><Tree question={question} tree={question.tree} palette={palette} names={names} renderNode={renderNode} /></Scroller>;
}

function Badge({ row, palette }: { row: Correction; palette: Palette }) {
  return (
    <View style={{ width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: row.correct ? 'transparent' : palette.accent, borderWidth: row.correct ? 1.5 : 0, borderColor: palette.green }}>
      <Text style={{ fontSize: 13, fontWeight: '700', color: row.correct ? palette.green : palette.onAccent }}>{num(row.number)}</Text>
    </View>
  );
}

/** One asked node after checking: verdict, the node's words with the ones enough to type underlined, and what was typed when wrong. */
function Graded({ row, palette }: { row: Correction; palette: Palette }) {
  const cut = neededCut(row.node.words, row.needed);
  const typed = row.typed ? row.typed.split(/\s+/) : [];
  return (
    <View style={{ maxWidth: 220, gap: 2 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Badge row={row} palette={palette} />
        <Text style={{ fontSize: 14, fontWeight: '600', color: palette.ink }}>{verdict(row, true)}</Text>
      </View>
      <Text style={{ fontFamily: QURAN_FONT, fontSize: 19, lineHeight: 36, color: palette.ink, textAlign: 'right', writingDirection: 'rtl' }}>
        <Text style={{ textDecorationLine: 'underline', textDecorationColor: palette.accent }}>{quranText(row.node.words.slice(0, cut).join(' '))}</Text>
        {cut < row.node.words.length ? ` ${quranText(row.node.words.slice(cut).join(' '))}` : ''}
      </Text>
      {!row.correct && (
        <Text style={{ fontSize: 15, color: palette.muted, textAlign: 'right' }}>
          {'كتبتَ: '}
          {typed.length === 0 ? 'لا شيء' : typed.map((word, i) => (
            <Text key={i} style={i < row.right ? { color: palette.green } : { color: palette.accent, textDecorationLine: 'line-through' }}>{i > 0 ? ' ' : ''}{word}</Text>
          ))}
        </Text>
      )}
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
function TreeActions({ phrase, text, palette }: { phrase: string; text: string; palette: Palette }) {
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
  const share = () => void Share.share({ message: `${text}\n${WEBSITE}${branchesHref(piece?.id ?? phrase)}` });
  return <>
    <Bar label={saved ? 'إزالة من المحفوظات' : 'حفظ الشجرة'} onPress={save} Icon={Bookmark} palette={palette} fill={saved} />
    <Bar label="مشاركة" onPress={share} Icon={Send} palette={palette} />
    {piece && <Bar label="افتح في متشابهات القرآن" onPress={() => router.navigate({ pathname: '/branches', params: { tree: piece.id } })} Icon={SquareArrowOutUpLeft} palette={palette} />}
  </>;
}

/**
 * The answer tree: each asked node shows how it was graded; tapping a node opens its ayat.
 * As on the website, it can turn to the matrix, rotate, show the surrounding ayat, grow in the studio, and be saved, shared or opened.
 */
export function QuizFeedback({ question, typed, palette, names, onTap }: { question: TreeQuestion; typed: string[]; palette: Palette; names: Record<number, string>; onTap?: (keys: string[]) => void }) {
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
  const [down, setDown] = useState(false);
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
  const tap = (ayahKeys: string[] | null) => {
    const state = growthState();
    if (state.ask) { answer(); return; }
    if (state.studio || !ayahKeys) return;
    onTap?.(ayahKeys);
  };
  const openVideo = async () => {
    stop();
    const scene = await sceneRef.current?.();
    if (scene && beats.current) setVideo(treeVideo(scene, beats.current, palette));
  };
  const renderNode: RenderNode = (_, index) => {
    const row = rows.get(index);
    return row ? <Graded row={row} palette={palette} /> : undefined;
  };
  const studio = growth.studio && !matrix;
  const treeGrowth = studio ? { hidden: growth.hidden, now: growth.now, ask: growth.ask, lit: growth.lit } : undefined;
  const switchView = (next: () => void) => { closeStudio(); next(); };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }} onLayout={event => setSize({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })}>
        {matrix
          ? size && <MatrixCard presentation={presentation} palette={palette} view={size} around={around} onTap={ayahKeys => ayahKeys && onTap?.(ayahKeys)} onMove={() => {}} />
          : <Scroller><BranchTree presentation={presentation} matches={NO_MATCHES} names={names} palette={palette} onTap={tap} renderNode={renderNode}
            direction={down ? 'down' : 'side'} around={surrounding} growth={treeGrowth} sceneRef={sceneRef} /></Scroller>}
      </View>
      {studio ? (
        <View style={{ direction: 'rtl' }}>
          <StudioProgress palette={palette} />
          <StudioControls palette={palette} onVideo={() => void openVideo()} />
        </View>
      ) : (
        <View style={{ direction: 'rtl', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, gap: 2 }}>
          {question.phrase && <TreeActions phrase={question.phrase} text={question.tree.words.join(' ')} palette={palette} />}
          {!matrix && <StudioButton palette={palette} />}
          <View style={{ flex: 1 }} />
          <Bar label={matrix ? 'عرض الشجرة' : 'عرض المصفوفة'} onPress={() => switchView(() => setMatrix(!matrix))} Icon={matrix ? TreeIcon : GalleryHorizontal} palette={palette} />
          {!matrix && <Bar label="تدوير الشجرة" onPress={() => switchView(() => setDown(!down))} Icon={RotateCwSquare} palette={palette} />}
          <Bar label="الآيات المحيطة" onPress={() => switchView(() => setAround(!around))} Icon={UnfoldHorizontal} palette={palette} on={around} />
        </View>
      )}
      <VideoSheet input={video} onClose={() => setVideo(null)} palette={palette} />
    </View>
  );
}
