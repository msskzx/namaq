import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Pressable, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Text } from '@/ui/Text';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { ArrowLeftRight, Bookmark, BookMarked, GalleryHorizontal, RotateCwSquare, Send, Tags, UnfoldHorizontal } from 'lucide-react-native';
import TreeIcon from './TreeIcon';
import type { BranchPiece } from '@shared/quran/branchInventory';
import { readBookmarks, subscribeBookmarks } from '@shared/bookmarks';
import { branchesHref } from '@shared/quran/branches';
import { matrixOnly } from '@shared/quran/branchVerdicts';
import TreeCard, { type Lane } from './TreeCard';
import type { NodeActions } from './BranchTree';
import MatrixCard, { MatrixShare } from './MatrixCard';
import { shareCard } from '@/lib/shareImage';
import VideoSheet from './VideoSheet';
import PageProgress from './PageProgress';
import SurahChips from './SurahChips';
import { StudioButton, StudioControls, StudioProgress } from './Studio';
import { aroundOf, cardOf, evidenceOf, growthParts, isSaved, matrixReading, toggleSaved, withPathReading } from '@/lib/branches';
import { WEBSITE } from '@/lib/website';
import { compareTargetsFor, type CompareTarget } from '@/lib/compare';
import { setIntent } from '@/lib/intent';
import EvidenceSheet from './EvidenceSheet';
import { TanasubQuote } from './TanasubQuote';
import { BookAnswers, MutashabihCells } from './MutashabihFace';
import CompareTargetsSheet from './CompareTargetsSheet';
import { TAGS, type Group, type Tag } from '@shared/quran/mutashabih/types';
import { connectionTone, wordConnections } from '@shared/quran/mutashabih/connections';
import { connectors } from '@/lib/settings';
import type { ListState } from '@/lib/branchList';
import type { Camera, Size } from '@/lib/camera';
import { connectionBeats, growthBeats } from '@/lib/growth';
import { answer, claimTarget, closeStudio, growthState, studioOwner, stop, useGrowth, type Growth } from '@/lib/growPlayer';
import type { TreeScene, VideoInput } from '@/lib/scene';
import { treeVideo } from '@/lib/treeVideo';
import type { BranchView } from '@/lib/settings';
import { isNumberIn, isRecord, isString, readJson, writeJson } from '@/lib/storage';
import { toneColor, type Palette } from '@/lib/theme';
import { toTab } from '@/lib/ways';
import { setCompact, useShrinkOnScroll } from '@/lib/chrome';
import IconButton from '@/ui/IconButton';
import DifferenceWords from '@/components/quran/text/DifferenceWords';

const PLACE = 'branches-place';
/** What an embedded pager reads instead of the branches tab's studio: never growing, never asking. */
const IDLE: Growth = { mode: 'watch', speed: 1, timer: 3, status: 'idle', at: 0, total: 0, studio: false, hidden: new Set(), now: new Set(), lit: null, tour: false, kind: 'tree' };
type Place = { id: string; camera?: Camera };
const isCamera = (value: unknown): value is Camera => isRecord(value) && [value.s, value.x, value.y].every(isNumberIn(-Infinity, Infinity));
const isPlace = (value: unknown): value is Place => isRecord(value) && isString(value.id) && (value.camera === undefined || isCamera(value.camera));

/** A second tap within this time is a double tap: it saves the tree instead of opening the ayat. */
const DOUBLE_TAP = 280;
const SWIPE = 0.2;
const FLICK = 500;
/** Room under each tree for the studio's ayah bar and the bookmark row, kept the same so opening the studio does not refit the tree. */
const FOOT = 78;

function useSaved(piece: BranchPiece) {
  return isSaved(piece, useSyncExternalStore(subscribeBookmarks, readBookmarks));
}

function Actions({ piece, palette, pop, current, embedded, extra, onVideo, onShare, onEvidence, onCompare, onRotate, onView, onAround, choice }: { piece: BranchPiece; palette: Palette; pop: number; current: boolean; onVideo?: () => void; onShare: () => void; onEvidence: (group: Group) => void; onCompare: (targets: CompareTarget[]) => void; onRotate?: () => void;
  /** A pager embedded elsewhere (the home feed): no studio. */
  embedded?: boolean;
  /** The feed's: its open button, first in the row, and its «⋯» (ui/MoreMenu), alone at the row's left end (owner, 2026-11-20). */
  extra?: { lead?: React.ReactNode; aside?: React.ReactNode };
  /** Each card's own switches (owner, 2026-11-14): tree or matrix, and the surrounding ayat; the settings only give their defaults. */
  onView?: { mode: BranchView; toggle: () => void }; onAround: { on: boolean; toggle: () => void };
  /** A book matrix's studio plays its connections or the read-along: the switch between them. */
  choice?: { connections: boolean; toggle: () => void } }) {
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
  if (studio && current && !embedded) return <StudioControls palette={palette} onVideo={onVideo} choice={choice} />;
  const save = () => toggleSaved(piece);
  // Embedded in a feed, the buttons look like the compare card's row beside it.
  const tone = embedded ? 'muted' : 'ink';
  const saveButton = <IconButton Icon={Bookmark} label={saved ? 'إزالة من المحفوظات' : 'حفظ الشجرة'} onPress={save} on={saved} fill tone={tone}
    render={shown => <Animated.View style={popped}><Bookmark {...shown} /></Animated.View>} />;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: embedded ? 0 : 4, paddingHorizontal: embedded ? 0 : 8 }}>
      {extra?.lead}
      {!embedded && saveButton}
      {!embedded && <StudioButton palette={palette} />}
      {onView && <IconButton Icon={onView.mode === 'tree' ? GalleryHorizontal : TreeIcon} label={onView.mode === 'tree' ? 'عرض المصفوفة' : 'عرض الشجرة'} onPress={onView.toggle} tone={tone} />}
      <IconButton Icon={UnfoldHorizontal} label="الآيات المحيطة" onPress={onAround.toggle} on={onAround.on} tone={tone} />
      {onRotate && <IconButton Icon={RotateCwSquare} label="تدوير الشجرة" onPress={onRotate} tone={tone} />}
      {evidence && <IconButton Icon={BookMarked} label="المصادر" onPress={() => onEvidence(evidence)} tone={tone} />}
      {targets.length > 0 && <IconButton Icon={ArrowLeftRight} label="في المقارنة" onPress={() => onCompare(targets)} tone={tone} />}
      {/* In the feed, save comes after the card's tools, just before share (owner, 2026-11-20). */}
      {embedded && saveButton}
      {/* Share is always the last of the group. */}
      <IconButton Icon={Send} label="مشاركة" onPress={onShare} tone={tone} />
      {extra?.aside ? <><View style={{ flex: 1 }} />{extra.aside}</> : null}
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
            {example ? <Text style={{ color: palette.ink, fontSize: 14 }}>{example}</Text> : group.words?.[tag] ? <DifferenceWords words={group.words[tag]!} color={palette.ink} fontSize={14} /> : null}
          </View>
        );
      })}
    </View>
  );
}

/**
 * A tree on the branches tab as a page that scrolls (owner, 2026-11-19): the tree keeps its frame, a lit path's ayat are added
 * under it at their whole height, and the page scrolls down to them instead of the tree shrinking for a small box of its own.
 * With nothing lit there is nothing to scroll, so every drag is the tree's (its pull down still opens the search).
 */
function ScrollingTree({ view, studio, children }: { view: Size; studio: boolean;
  children: (view: Size, ayatRoom: { height: number; set: (height: number) => void; most: number } | undefined, inScroll: boolean) => React.ReactNode }) {
  const [room, setRoom] = useState(0);
  // Past a page of cards they scroll inside, so the page never scrolls the tree wholly away.
  const ayatRoom = useMemo(() => ({ height: room, set: setRoom, most: Math.round(view.height * 0.9) }), [room, view.height]);
  // The studio keeps its ayah card in the frame, as before, so the tree it grows stays in sight.
  const added = studio ? 0 : room;
  const scroller = useRef<React.ComponentRef<typeof ScrollView>>(null);
  useEffect(() => { if (!added) scroller.current?.scrollTo({ y: 0, animated: false }); }, [added]);
  return (
    // The page keeps its top bar while it scrolls: hiding it would resize the page, and with it the tree.
    <ScrollView ref={scroller} scrollEnabled={added > 0} showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
      {children({ width: view.width, height: view.height + added }, studio ? undefined : ayatRoom, added > 0)}
    </ScrollView>
  );
}

/** Every card opens as its matrix, and `around` is the settings' default; each card can switch both for itself. */
type Props = { pieces: BranchPiece[]; list: ListState; palette: Palette; around: boolean;
  /** The tree a search opens on; otherwise the one left open last time. */
  start?: number; onIndex?: (index: number) => void;
  /** How the `start` card opens when not as its matrix (a saved tree's «الشجرة»). */
  startMode?: BranchView;
  /** A downward swipe on the open tree. */
  onPull?: () => void;
  /** A node's «show only this part»: the tree of its own that holds the node's ayat. */
  onOpen?: (piece: BranchPiece) => void;
  /**
   * The pager embedded in another page (the home feed's tree card): it keeps no place or zoom for the branches tab, has no
   * studio, lets vertical drags on an unzoomed tree scroll the page, and `open` takes the tree to the branches tab.
   */
  embedded?: {
    open: (piece: BranchPiece) => void;
    /** Off when the pager does not sit in a page that scrolls (the reader's trees sheet): every drag moves the tree. */
    inScroll?: boolean;
    /** An ayah whose path opens lit on every tree (the reader's ayah). */
    lit?: string;
    /** Called before the pager takes the reader to another tab (compare), so a sheet holding it closes first. */
    onLeave?: () => void;
    /** In a feed: the tree in a card's frame, and the room for a lit path's ayat added by the page below (TreeCard `ayatRoom`). */
    ayatRoom?: { height: number; set: (height: number) => void };
    /** In a feed card that follows its content: the matrix's overflow, or null when the card shows the tree (lib/useFit.ts). */
    onFit?: (overflow: number | null) => boolean;
    /** The feed's own buttons for this card: its open button first, its «⋯» at the left end. */
    extra?: { lead?: React.ReactNode; aside?: React.ReactNode };
  }; };

/** The branches trees as a row of cards: the neighbour follows the finger, the place and zoom are kept for next time. */
const DEFAULT_MODE: BranchView = 'matrix';

export default function TreePager({ pieces, list, palette, around: defaultAround, start, startMode, onIndex, onPull, onOpen, embedded }: Props) {
  /** The one tree drawn the other way, by its id: rotating belongs to that tree, not to the page. */
  const [rotatedId, setRotatedId] = useState<string | null>(null);
  /** What each card switched for itself, by its id; a card it does not name opens as its matrix with the settings' surrounding. */
  const [own, setOwn] = useState<Record<string, { mode?: BranchView; around?: boolean }>>(() => {
    const opened = start === undefined ? undefined : pieces[start];
    return opened && startMode ? { [opened.id]: { mode: startMode } } : {};
  });
  // A card the owner keeps as its matrix only has no tree to switch to.
  const modeOf = (at: BranchPiece): BranchView => matrixOnly(at) ? 'matrix' : own[at.id]?.mode ?? DEFAULT_MODE;
  const surroundOf = (at: BranchPiece) => own[at.id]?.around ?? defaultAround;
  const switchCard = (at: BranchPiece, change: { mode?: BranchView; around?: boolean }) => {
    if (!embedded) closeStudio();
    setOwn(current => ({ ...current, [at.id]: { ...current[at.id], ...change } }));
  };
  // Embedded, «show only this part» opens that part on the branches tab.
  const actions = useMemo<NodeActions>(() => ({ onSubtree: piece => (embedded ? embedded.open(piece) : onOpen?.(piece)) }), [onOpen, embedded]);
  const place = useMemo(() => (embedded ? undefined : readJson(PLACE, isPlace)), []); // eslint-disable-line react-hooks/exhaustive-deps
  const first = start ?? Math.max(0, pieces.findIndex(piece => piece.id === place?.id));
  const [index, setIndex] = useState(first);
  // A feed card that follows the matrix's rows goes back to its own height when the tree is shown.
  const currentMode = pieces[index] ? modeOf(pieces[index]) : DEFAULT_MODE;
  useEffect(() => { if (currentMode === 'tree') embedded?.onFit?.(null); }, [currentMode]); // eslint-disable-line react-hooks/exhaustive-deps
  const [view, setView] = useState<Size | null>(null);
  const [pop, setPop] = useState(0);
  const offset = useSharedValue(0);
  // When and where the last tap landed: a double tap is two quick taps on the same box (or both on the card), so quick taps on
  // two boxes of one path still light it and clear it.
  const lastTap = useRef({ at: 0, on: '' });
  const moved = useRef(0);
  const pending = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const waiting = useRef<(() => void) | undefined>(undefined);
  const move = useCallback(() => {
    moved.current = Date.now();
    clearTimeout(pending.current);
    waiting.current = undefined;
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
  const openCompare = (target: CompareTarget) => { embedded?.onLeave?.(); setIntent({ tab: 'compare', lead: target.lead, other: target.other }); toTab('/compare'); };
  const compare = (targets: CompareTarget[]) => (targets.length === 1 ? openCompare(targets[0]) : setChoosing(targets));

  useEffect(() => { if (width) offset.value = index * width; }, [width]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { onIndex?.(index); }, [index, onIndex]);
  // A saved-only list shrinks when the open tree is unsaved: stay where it was, or on the new last tree.
  useEffect(() => {
    if (index < pieces.length || !pieces.length) return;
    setIndex(pieces.length - 1);
    if (width) offset.value = (pieces.length - 1) * width;
  }, [pieces.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // The open tree is the one the studio grows.
  const piece = pieces[Math.min(index, pieces.length - 1)];
  const mode = piece ? modeOf(piece) : DEFAULT_MODE;
  // A matrix's rows scroll, and the top bar slides away while they scroll down (owner, 2026-11-15). A tree sits in a fixed
  // frame that does not scroll, so another card, or the tree view, brings the bar back.
  const shrink = useShrinkOnScroll();
  useEffect(() => { if (!embedded) setCompact(false); }, [index, mode]); // eslint-disable-line react-hooks/exhaustive-deps
  const around = piece ? surroundOf(piece) : defaultAround;
  // A book group's matrix grows its word connections instead (the website's connections studio).
  const matrixGroup = useMemo(() => (mode === 'matrix' && piece ? evidenceOf(piece) : null), [mode, piece]);
  const studioTags = matrixGroup?.tags.length ? (tagsOf(piece, matrixGroup).length ? tagsOf(piece, matrixGroup) : matrixGroup.tags) : [];
  const studioKey = studioTags.join(' ');
  // Opening the studio on a matrix with no kind chosen turns them all on, as on the website; they stay on after it closes.
  useEffect(() => {
    if (growth.studio && growth.kind === 'matrix' && matrixGroup?.tags.length && piece && !tagsOf(piece, matrixGroup).length) setPicked({ id: piece.id, tags: matrixGroup.tags });
  }, [growth.studio, growth.kind, matrixGroup, piece]); // eslint-disable-line react-hooks/exhaustive-deps
  // Every matrix reads along word by word, as the compare tab does; a book matrix's studio switches between that and its connections.
  const reading = useMemo(() => (mode === 'matrix' && piece ? matrixReading(cardOf(piece, list).presentation) : null), [mode, piece, list]);
  const [play, setPlay] = useState<'connections' | 'read'>('connections');
  // A book matrix whose tags draw no lines has only the read-along.
  const lines = useMemo(() => (matrixGroup ? studioTags.reduce((sum, tag) => sum + wordConnections(matrixGroup, tag).length, 0) : 0), [matrixGroup, studioKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const connecting = lines > 0 && play === 'connections';
  // The studio's target is swapped in place (no letting go in between), so switching what a matrix plays keeps the studio open.
  useEffect(() => {
    if (embedded) return;
    if (mode === 'matrix' && matrixGroup && connecting) {
      claimTarget('branches', { kind: 'matrix', watch: connectionBeats(lines), ask: connectionBeats(lines, true) });
      return;
    }
    if (mode === 'matrix' && reading?.length) { claimTarget('branches', { kind: 'read', watch: reading, ask: reading }); return; }
    if (mode !== 'tree' || !piece) { claimTarget('branches', null); return; }
    const { presentation } = cardOf(piece, list);
    const parts = growthParts(presentation, around ? aroundOf(presentation) : undefined);
    const options = { ...parts, prefixes: presentation.prefixes, offsets: presentation.offsets, paths: true };
    beatsRef.current = { watch: withPathReading(presentation, growthBeats(presentation.tree, options)), ask: withPathReading(presentation, growthBeats(presentation.tree, { ...options, ask: true })) };
    claimTarget('branches', beatsRef.current);
  }, [piece, list, mode, around, studioKey, reading, connecting, lines]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => { if (!embedded) claimTarget('branches', null); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // Another tree closes the studio, as it always has, unless another screen (a quiz) owns it; a book matrix opens on its connections again.
  useEffect(() => {
    setPlay('connections');
    if (!embedded && growthState().studio && studioOwner() === 'branches') closeStudio();
  }, [piece]); // eslint-disable-line react-hooks/exhaustive-deps

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
    const on = ayahKeys?.join(' ') ?? '';
    // A quick tap on another box doesn't cancel the first: its path lights (or clears) now.
    if (waiting.current && lastTap.current.on !== on) waiting.current();
    waiting.current = undefined;
    const state = embedded ? IDLE : growthState();
    if (state.ask) { answer(); return; }
    if (state.studio && ayahKeys) return;
    if (now - lastTap.current.at < DOUBLE_TAP && lastTap.current.on === on) {
      lastTap.current = { at: 0, on: '' };
      if (!isSaved(pieces[index])) toggleSaved(pieces[index]);
      setPop(value => value + 1);
      return;
    }
    lastTap.current = { at: now, on };
    // As on the website, a tap on a node lights its path (after the wait that tells it from a double tap).
    if (lightPath) {
      waiting.current = lightPath;
      pending.current = setTimeout(() => { waiting.current = undefined; lightPath(); }, DOUBLE_TAP);
    }
  }, [pieces, index, embedded]);

  const openVideo = async () => {
    stop();
    const scene = await sceneRef.current?.();
    const beats = beatsRef.current;
    if (!scene || !beats) return;
    setVideo(treeVideo(scene, beats, palette, piece ? cardOf(piece, list).presentation : undefined));
  };

  // Share as image: the open tree as it is drawn, or the matrix's ayah column; the tree's video from here too.
  const share = (at: BranchPiece) => {
    const link = `${at.text}\n${WEBSITE}${branchesHref(at.id)}`;
    if (modeOf(at) === 'matrix') {
      const { presentation } = cardOf(at, list);
      shareCard({ content: width => <MatrixShare presentation={presentation} palette={palette} width={width} />, link });
      return;
    }
    const draw = shareRef.current;
    if (draw) shareCard({ content: () => draw(), link, onVideo: embedded ? undefined : () => void openVideo() });
  };

  const track = useAnimatedStyle(() => ({ transform: [{ translateX: offset.value }] }));
  const shown = [index - 1, index, index + 1].filter(at => at >= 0 && at < count);
  // Only the branches tab's own studio: a quiz playing over it grows its own tree, not this card.
  const treeGrowth = growth.studio && studioOwner() === 'branches' ? { hidden: growth.hidden, now: growth.now, ask: growth.ask, lit: growth.lit, tour: growth.tour, words: growth.words } : undefined;

  return (
    <View style={{ flex: 1 }}>
      {!embedded && <PageProgress at={index + 1} count={count} label="الشجرة" palette={palette} />}
      <View style={{ flex: 1, overflow: 'hidden' }} onLayout={event => setView({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })}>
        {view && <Animated.View style={[{ position: 'absolute', left: 0, top: 0, width: view.width, height: view.height, direction: 'ltr' }, track]}>
          {shown.map(at => {
            const current = at === index;
            const atMode = modeOf(pieces[at]);
            const atAround = surroundOf(pieces[at]);
            const group = atMode === 'matrix' ? evidenceOf(pieces[at]) : null;
            const linked = group?.tags.length ? group : null;
            const footer = (
              // Taps between the buttons stay here, so they are not read as taps on the tree.
              <View style={{ direction: 'rtl' }} onStartShouldSetResponder={() => true}>
                <View style={{ height: FOOT }}>
                  {current && !embedded && <StudioProgress palette={palette} />}
                  <Actions piece={pieces[at]} palette={palette} pop={pop} current={current}
                    embedded={!!embedded} extra={embedded?.extra} onVideo={atMode === 'tree' && current ? () => void openVideo() : undefined} onShare={() => share(pieces[at])} onEvidence={setEvidence} onCompare={compare}
                    onRotate={atMode === 'tree' ? () => setRotatedId(rotatedId === pieces[at].id ? null : pieces[at].id) : undefined}
                    onView={matrixOnly(pieces[at]) ? undefined : { mode: atMode, toggle: () => switchCard(pieces[at], { mode: atMode === 'tree' ? 'matrix' : 'tree' }) }}
                    onAround={{ on: atAround, toggle: () => switchCard(pieces[at], { around: !atAround }) }}
                    choice={current && atMode === 'matrix' && lines > 0 ? { connections: connecting, toggle: () => setPlay(connecting ? 'read' : 'connections') } : undefined} />
                </View>
                {/* With no studio bar in the row (closed, or the home card), the chips rise into its room, as under a tree (#785). */}
                {atMode === 'matrix' && <SurahChips tuck={!(current && growth.studio)} ayahKeys={cardOf(pieces[at], list).presentation.ayat.map(ayah => ayah.key)} palette={palette} />}
                {linked && <ConnectionChips group={linked} selected={tagsOf(pieces[at], linked)} onToggle={tag => toggleTag(pieces[at], linked, tag)} palette={palette} />}
              </View>
            );
            return (
            <View key={pieces[at].id} style={{ position: 'absolute', top: 0, left: -at * view.width, width: view.width, height: view.height, backgroundColor: palette.paper }}>
              {atMode === 'matrix'
                ? <MatrixCard key={String(atAround)} presentation={cardOf(pieces[at], list).presentation} palette={palette} view={view} lane={at === index ? lane : undefined} around={atAround} onTap={tap} onMove={move} footer={footer} pinFooter={!!embedded?.ayatRoom}
                  onFit={at === index ? embedded?.onFit : undefined}
                  connections={linked ? { group: linked, tags: current && growth.studio && growth.kind === 'matrix' ? studioTags : tagsOf(pieces[at], linked) } : undefined}
                  growth={current && growth.studio && growth.kind !== 'tree' ? { hidden: growth.hidden, now: growth.now, ask: growth.ask } : undefined}
                  reading={current && growth.studio && growth.kind === 'read'} onScroll={current && !embedded ? shrink : undefined}
                  below={embedded ? undefined : group?.citations.length ? <MutashabihCells group={group} palette={palette} />
                    : pieces[at].group?.tanasub ? <TanasubQuote link={pieces[at].group!.tanasub!} palette={palette} /> : undefined}
                  after={!embedded && group?.citations.length ? <View style={{ direction: 'rtl', paddingHorizontal: 16, paddingBottom: 24 }}><BookAnswers group={group} palette={palette} /></View> : undefined} />
                : embedded
                  ? <TreeCard piece={pieces[at]} list={list} palette={palette} view={view} lane={at === index ? lane : undefined} around={atAround}
                    rotated={rotatedId === pieces[at].id} shareRef={at === index ? shareRef : undefined}
                    onTap={tap} onMove={move} footer={footer} footHeight={FOOT} actions={actions} chips inScroll={embedded.inScroll !== false} fixed={!!embedded.ayatRoom} lit={embedded.lit ? [embedded.lit] : undefined} ayatRoom={embedded.ayatRoom} framed={!!embedded.ayatRoom} />
                  : <ScrollingTree view={view} studio={at === index && !!treeGrowth}>{(page, ayatRoom, inScroll) => (
                    <TreeCard piece={pieces[at]} list={list} palette={palette} view={page} lane={at === index ? lane : undefined} around={atAround}
                      rotated={rotatedId === pieces[at].id} growth={at === index ? treeGrowth : undefined} sceneRef={at === index ? sceneRef : undefined} shareRef={at === index ? shareRef : undefined}
                      initialCamera={at === index ? restore.current : undefined}
                      onCamera={at === index ? remember : undefined} onTap={tap} onMove={move} onPull={at === index && !growth.studio && !inScroll ? onPull : undefined} footer={footer} footHeight={FOOT} actions={actions} chips inScroll={inScroll} fixed ayatRoom={ayatRoom} />
                  )}</ScrollingTree>}
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
