import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/Text';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { ArrowLeftRight, Bookmark, BookOpen, Maximize2, RotateCwSquare, Send, Tags } from 'lucide-react-native';
import { router } from 'expo-router';
import type { BranchPiece } from '@shared/quran/branchInventory';
import { readBookmarks, subscribeBookmarks } from '@shared/bookmarks';
import { branchesHref } from '@shared/quran/branches';
import TreeCard, { type Lane } from './TreeCard';
import type { NodeActions } from './BranchTree';
import MatrixCard, { MatrixShare } from './MatrixCard';
import { shareCard } from '@/lib/shareImage';
import VideoSheet from './VideoSheet';
import PageProgress from './PageProgress';
import SurahChips from './SurahChips';
import { StudioButton, StudioControls, StudioProgress } from './Studio';
import { aroundOf, cardOf, evidenceOf, growthParts, isSaved, toggleSaved, WEBSITE } from '@/lib/branches';
import { compareTargetsFor, type CompareTarget } from '@/lib/compare';
import { setIntent } from '@/lib/intent';
import EvidenceSheet from './EvidenceSheet';
import CompareTargetsSheet from './CompareTargetsSheet';
import { TAGS, type Group, type Tag } from '@shared/quran/mutashabih/types';
import { connectionTone } from '@shared/quran/mutashabih/connections';
import { connectors } from '@/lib/settings';
import type { ListState } from '@/lib/branchList';
import type { Camera, Size } from '@/lib/camera';
import { connectionBeats, growthBeats } from '@/lib/growth';
import { wordConnections } from '@shared/quran/mutashabih/connections';
import { answer, claimTarget, growthState, stop, useGrowth, type Growth } from '@/lib/growPlayer';
import type { TreeScene, VideoInput } from '@/lib/scene';
import { treeVideo } from '@/lib/treeVideo';
import type { BranchView } from '@/lib/settings';
import { readJson, writeJson } from '@/lib/storage';
import { toneColor, type Palette } from '@/lib/theme';

const PLACE = 'branches-place';
/** What an embedded pager reads instead of the branches tab's studio: never growing, never asking. */
const IDLE: Growth = { mode: 'watch', speed: 1, timer: 3, status: 'idle', at: 0, total: 0, studio: false, hidden: new Set(), now: new Set(), lit: null, kind: 'tree' };
type Place = { id: string; camera?: Camera };

/** A second tap within this time is a double tap: it saves the tree instead of opening the ayat. */
const DOUBLE_TAP = 280;
const SWIPE = 0.2;
const FLICK = 500;
/** Room under each tree for the studio's ayah bar and the bookmark row, kept the same so opening the studio does not refit the tree. */
const FOOT = 78;

function useSaved(piece: BranchPiece) {
  return isSaved(piece, useSyncExternalStore(subscribeBookmarks, readBookmarks));
}

function Actions({ piece, palette, pop, current, onVideo, onShare, onEvidence, onCompare, onRotate, onOpen }: { piece: BranchPiece; palette: Palette; pop: number; current: boolean; onVideo?: () => void; onShare: () => void; onEvidence: (group: Group) => void; onCompare: (targets: CompareTarget[]) => void; onRotate?: () => void;
  /** Set on a pager embedded elsewhere (the home feed): no studio, and a button that opens the tree on the branches tab. */
  onOpen?: () => void }) {
  const evidence = useMemo(() => evidenceOf(piece), [piece]);
  const targets = useMemo(() => compareTargetsFor(piece.keys), [piece]);
  const saved = useSaved(piece);
  const studio = useGrowth().studio;
  const scale = useSharedValue(1);
  const seen = useRef(pop);
  useEffect(() => {
    if (pop === seen.current) return;
    seen.current = pop;
    if (current) scale.value = withSequence(withTiming(1.35, { duration: 120 }), withTiming(1, { duration: 160 }));
  }, [pop, current, scale]);
  const popped = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  if (studio && current && !onOpen) return <StudioControls palette={palette} onVideo={onVideo} />;
  const save = () => toggleSaved(piece);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8 }}>
      <Pressable onPress={save} hitSlop={8} accessibilityRole="button" accessibilityLabel={saved ? 'إزالة من المحفوظات' : 'حفظ الشجرة'} style={{ padding: 8 }}>
        <Animated.View style={popped}><Bookmark size={26} color={saved ? palette.accent : palette.ink} fill={saved ? palette.accent : 'transparent'} /></Animated.View>
      </Pressable>
      {!onOpen && <StudioButton palette={palette} />}
      {onOpen && <Pressable onPress={onOpen} hitSlop={8} accessibilityRole="button" accessibilityLabel="افتح الشجرة في متشابهات القرآن" style={{ padding: 8 }}>
        <Maximize2 size={24} color={palette.ink} />
      </Pressable>}
      {onRotate && <Pressable onPress={onRotate} hitSlop={8} accessibilityRole="button" accessibilityLabel="تدوير الشجرة" style={{ padding: 8 }}>
        <RotateCwSquare size={24} color={palette.ink} />
      </Pressable>}
      {evidence && <Pressable onPress={() => onEvidence(evidence)} hitSlop={8} accessibilityRole="button" accessibilityLabel="المصادر" style={{ padding: 8 }}>
        <BookOpen size={24} color={palette.ink} />
      </Pressable>}
      {targets.length > 0 && <Pressable onPress={() => onCompare(targets)} hitSlop={8} accessibilityRole="button" accessibilityLabel="في المقارنة" style={{ padding: 8 }}>
        <ArrowLeftRight size={24} color={palette.ink} />
      </Pressable>}
      {/* Share is always the last button (the left end). */}
      <Pressable onPress={onShare} hitSlop={8} accessibilityRole="button" accessibilityLabel="مشاركة" style={{ padding: 8 }}>
        <Send size={24} color={palette.ink} />
      </Pressable>
    </View>
  );
}

/** The website's chips under a book group's card: each kind of difference turns its word connections on and off, its example words beside it. */
function ConnectionChips({ group, selected, onToggle, palette }: { group: Group; selected: Tag[]; onToggle: (tag: Tag) => void; palette: Palette }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, paddingBottom: 12 }}>
      {group.tags.map(tag => {
        const on = selected.includes(tag);
        const tone = toneColor(palette, connectionTone(tag));
        const example = group.examples?.[tag] ?? (group.tags.length === 1 ? group.detail : undefined);
        return (
          <View key={tag} style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
            <Pressable onPress={() => onToggle(tag)} hitSlop={4} accessibilityRole="button" accessibilityState={{ selected: on }} accessibilityLabel={TAGS[tag].ar}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: tone, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: on ? tone : 'transparent' }}>
              <Tags size={13} color={on ? palette.paper : tone} />
              <Text style={{ color: on ? palette.paper : tone, fontSize: 13 }}>{TAGS[tag].ar}</Text>
            </Pressable>
            {example ? <Text style={{ color: palette.ink, fontSize: 14 }}>{example}</Text> : null}
          </View>
        );
      })}
    </View>
  );
}

type Props = { pieces: BranchPiece[]; list: ListState; palette: Palette; mode: BranchView; around: boolean;
  /** The tree a search opens on; otherwise the one left open last time. */
  start?: number; onIndex?: (index: number) => void;
  /** A downward swipe on the open tree. */
  onPull?: () => void;
  /** A node's «show only this part»: the tree of its own that holds the node's ayat. */
  onOpen?: (piece: BranchPiece) => void;
  /**
   * The pager embedded in another page (the home feed's tree card): it keeps no place or zoom for the branches tab, has no
   * studio, lets vertical drags on an unzoomed tree scroll the page, and `open` takes the tree to the branches tab.
   */
  embedded?: { open: (piece: BranchPiece) => void } };

/** The branches trees as a row of cards: the neighbour follows the finger, the place and zoom are kept for next time. */
export default function TreePager({ pieces, list, palette, mode, around, start, onIndex, onPull, onOpen, embedded }: Props) {
  /** The one tree drawn the other way, by its id: rotating belongs to that tree, not to the page. */
  const [rotatedId, setRotatedId] = useState<string | null>(null);
  const actions = useMemo<NodeActions>(() => ({ onSubtree: piece => onOpen?.(piece) }), [onOpen]);
  const place = useMemo(() => (embedded ? undefined : readJson<Place>(PLACE)), []); // eslint-disable-line react-hooks/exhaustive-deps
  const first = start ?? Math.max(0, pieces.findIndex(piece => piece.id === place?.id));
  const [index, setIndex] = useState(first);
  const [view, setView] = useState<Size | null>(null);
  const [pop, setPop] = useState(0);
  const offset = useSharedValue(0);
  const lastTap = useRef(0);
  const moved = useRef(0);
  const pending = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const move = useCallback(() => {
    moved.current = Date.now();
    clearTimeout(pending.current);
  }, []);
  useEffect(() => () => clearTimeout(pending.current), []);
  const restore = useRef(place?.id === pieces[first]?.id ? place?.camera : undefined);
  const width = view?.width ?? 0;
  const shared = useGrowth();
  const growth = embedded ? IDLE : shared;
  const sceneRef = useRef<(() => Promise<TreeScene | null>) | null>(null);
  const shareRef = useRef<(() => React.ReactNode) | null>(null);
  const beatsRef = useRef<{ watch: ReturnType<typeof growthBeats>; ask: ReturnType<typeof growthBeats> } | null>(null);
  const [video, setVideo] = useState<VideoInput | null>(null);
  const [evidence, setEvidence] = useState<Group | null>(null);
  // The open card's word connections: all its kinds when the setting says so, else none until a chip turns one on.
  const [connectorsOn] = connectors.use();
  const [picked, setPicked] = useState<{ id: string; tags: Tag[] } | null>(null);
  const tagsOf = (at: BranchPiece, group: Group) => picked?.id === at.id ? picked.tags : connectorsOn ? group.tags : [];
  const toggleTag = (at: BranchPiece, group: Group, tag: Tag) => {
    const current = tagsOf(at, group);
    setPicked({ id: at.id, tags: current.includes(tag) ? current.filter(value => value !== tag) : [...current, tag] });
  };
  // A tree across two surahs opens its compare page at once; across more, a sheet lists the pairs to pick from.
  const [choosing, setChoosing] = useState<CompareTarget[] | null>(null);
  const openCompare = (target: CompareTarget) => { setIntent({ tab: 'compare', lead: target.lead, other: target.other }); router.navigate('/compare'); };
  const compare = (targets: CompareTarget[]) => (targets.length === 1 ? openCompare(targets[0]) : setChoosing(targets));

  useEffect(() => { if (width) offset.value = index * width; }, [width]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { onIndex?.(index); }, [index, onIndex]);
  // A saved-only list shrinks when the open tree is unsaved: stay where it was, or on the new last tree.
  useEffect(() => {
    if (index < pieces.length || !pieces.length) return;
    setIndex(pieces.length - 1);
    if (width) offset.value = (pieces.length - 1) * width;
  }, [pieces.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // The open tree is the one the studio grows; a matrix has nothing to grow.
  const piece = pieces[Math.min(index, pieces.length - 1)];
  // A book group's matrix grows its word connections instead (the website's connections studio).
  const matrixGroup = useMemo(() => (mode === 'matrix' && piece ? evidenceOf(piece) : null), [mode, piece]);
  const studioTags = matrixGroup?.tags.length ? (tagsOf(piece, matrixGroup).length ? tagsOf(piece, matrixGroup) : matrixGroup.tags) : [];
  const studioKey = studioTags.join(' ');
  // Opening the studio on a matrix with no kind chosen turns them all on, as on the website; they stay on after it closes.
  useEffect(() => {
    if (growth.studio && growth.kind === 'matrix' && matrixGroup?.tags.length && piece && !tagsOf(piece, matrixGroup).length) setPicked({ id: piece.id, tags: matrixGroup.tags });
  }, [growth.studio, growth.kind, matrixGroup, piece]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (embedded) return;
    if (mode === 'matrix' && matrixGroup && studioTags.length) {
      const count = studioTags.reduce((sum, tag) => sum + wordConnections(matrixGroup, tag).length, 0);
      claimTarget('branches', { kind: 'matrix', watch: connectionBeats(count), ask: connectionBeats(count, true) });
      return () => claimTarget('branches', null);
    }
    if (mode !== 'tree' || !piece) { claimTarget('branches', null); return; }
    const { presentation } = cardOf(piece, list);
    const parts = growthParts(presentation, around ? aroundOf(presentation) : undefined);
    const options = { ...parts, prefixes: presentation.prefixes };
    beatsRef.current = { watch: growthBeats(presentation.tree, options), ask: growthBeats(presentation.tree, { ...options, ask: true }) };
    claimTarget('branches', beatsRef.current);
    return () => claimTarget('branches', null);
  }, [piece, list, mode, around, studioKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const arrive = useCallback((next: number) => {
    restore.current = undefined;
    setIndex(next);
    if (!embedded) writeJson(PLACE, { id: pieces[next].id });
  }, [pieces, embedded]);

  const remember = useCallback((camera: Camera) => { if (!embedded) writeJson(PLACE, { id: pieces[index].id, camera }); }, [pieces, index, embedded]);

  const count = pieces.length;
  const settle = (from: number, dx: number, velocity: number) => {
    'worklet';
    const far = Math.abs(dx) > width * SWIPE || Math.abs(velocity) > FLICK;
    const forward = dx > 0;
    const target = far && (forward ? from + 1 < count : from > 0) ? from + (forward ? 1 : -1) : from;
    offset.value = withTiming(target * width, { duration: 250 });
    // The neighbours of the new card mount while the row is still sliding.
    if (target !== index) scheduleOnRN(arrive, target);
  };
  // While the tree grows the studio holds the card: no swiping away mid-growth.
  const growing = growth.status === 'playing' || growth.status === 'paused';
  const lane: Lane | undefined = growing ? undefined : { offset, width, count, settle };

  const tap = useCallback((ayahKeys: string[] | null, lightPath?: () => void) => {
    const now = Date.now();
    if (now - moved.current < 350) return;
    clearTimeout(pending.current);
    const state = embedded ? IDLE : growthState();
    if (state.ask) { answer(); return; }
    if (state.studio && ayahKeys) return;
    if (now - lastTap.current < DOUBLE_TAP) {
      lastTap.current = 0;
      if (!isSaved(pieces[index])) toggleSaved(pieces[index]);
      setPop(value => value + 1);
      return;
    }
    lastTap.current = now;
    // As on the website, a tap on a node lights its path (after the wait that tells it from a double tap).
    if (lightPath) pending.current = setTimeout(lightPath, DOUBLE_TAP);
  }, [pieces, index]);

  const openVideo = async () => {
    stop();
    const scene = await sceneRef.current?.();
    const beats = beatsRef.current;
    if (!scene || !beats) return;
    setVideo(treeVideo(scene, beats, palette));
  };

  // Share as image: the open tree as it is drawn, or the matrix's ayah column; the tree's video from here too.
  const share = (at: BranchPiece) => {
    const link = `${at.text}\n${WEBSITE}${branchesHref(at.id)}`;
    if (mode === 'matrix') {
      const { presentation } = cardOf(at, list);
      shareCard({ content: width => <MatrixShare presentation={presentation} palette={palette} width={width} />, link });
      return;
    }
    const draw = shareRef.current;
    if (draw) shareCard({ content: () => draw(), link, onVideo: embedded ? undefined : () => void openVideo() });
  };

  const track = useAnimatedStyle(() => ({ transform: [{ translateX: offset.value }] }));
  const shown = [index - 1, index, index + 1].filter(at => at >= 0 && at < count);
  const treeGrowth = growth.studio ? { hidden: growth.hidden, now: growth.now, ask: growth.ask, lit: growth.lit } : undefined;

  return (
    <View style={{ flex: 1 }}>
      <PageProgress at={index + 1} count={count} label="الشجرة" palette={palette} />
      <View style={{ flex: 1, overflow: 'hidden' }} onLayout={event => setView({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })}>
        {view && <Animated.View style={[{ position: 'absolute', left: 0, top: 0, width: view.width, height: view.height, direction: 'ltr' }, track]}>
          {shown.map(at => {
            const current = at === index;
            const group = mode === 'matrix' ? evidenceOf(pieces[at]) : null;
            const linked = group?.tags.length ? group : null;
            const footer = (
              // Taps between the buttons stay here, so they are not read as taps on the tree.
              <View style={{ direction: 'rtl' }} onStartShouldSetResponder={() => true}>
                <View style={{ height: FOOT }}>
                  {current && <StudioProgress palette={palette} />}
                  <Actions piece={pieces[at]} palette={palette} pop={pop} current={current}
                    onVideo={mode === 'tree' && current ? () => void openVideo() : undefined} onShare={() => share(pieces[at])} onEvidence={setEvidence} onCompare={compare}
                    onRotate={mode === 'tree' ? () => setRotatedId(rotatedId === pieces[at].id ? null : pieces[at].id) : undefined}
                    onOpen={embedded ? () => embedded.open(pieces[at]) : undefined} />
                </View>
                {mode === 'matrix' && <SurahChips ayahKeys={cardOf(pieces[at], list).presentation.ayat.map(ayah => ayah.key)} palette={palette} />}
                {linked && <ConnectionChips group={linked} selected={tagsOf(pieces[at], linked)} onToggle={tag => toggleTag(pieces[at], linked, tag)} palette={palette} />}
              </View>
            );
            return (
            <View key={pieces[at].id} style={{ position: 'absolute', top: 0, left: -at * view.width, width: view.width, height: view.height, backgroundColor: palette.paper }}>
              {mode === 'matrix'
                ? <MatrixCard key={String(around)} presentation={cardOf(pieces[at], list).presentation} palette={palette} view={view} lane={at === index ? lane : undefined} around={around} onTap={tap} onMove={move} footer={footer}
                  connections={linked ? { group: linked, tags: current && growth.studio ? studioTags : tagsOf(pieces[at], linked) } : undefined}
                  growth={current && growth.studio && growth.kind === 'matrix' ? { hidden: growth.hidden, now: growth.now, ask: growth.ask } : undefined} />
                : <TreeCard piece={pieces[at]} list={list} palette={palette} view={view} lane={at === index ? lane : undefined} around={around}
                  rotated={rotatedId === pieces[at].id} growth={at === index ? treeGrowth : undefined} sceneRef={at === index ? sceneRef : undefined} shareRef={at === index ? shareRef : undefined}
                  initialCamera={at === index ? restore.current : undefined}
                  onCamera={at === index ? remember : undefined} onTap={tap} onMove={move} onPull={at === index && !growth.studio ? onPull : undefined} footer={footer} footHeight={FOOT} actions={actions} chips inScroll={!!embedded} />}
            </View>
            );
          })}
        </Animated.View>}
      </View>
      <VideoSheet input={video} onClose={() => setVideo(null)} palette={palette} />
      <EvidenceSheet group={evidence} onClose={() => setEvidence(null)} palette={palette} />
      <CompareTargetsSheet targets={choosing} onPick={target => { setChoosing(null); openCompare(target); }} onClose={() => setChoosing(null)} palette={palette} />
    </View>
  );
}
