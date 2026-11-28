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
const IDLE: Growth = { mode: 'watch', speed: 1, timer: 3, status: 'idle', at: 0, total: 0, studio: false, hidden: new Set(), now: new Set(), lit: null, tour: false, kind: 'tree' };
type Place = { id: string; camera?: Camera };
const isCamera = (value: unknown): value is Camera => isRecord(value) && [value.s, value.x, value.y].every(isNumberIn(-Infinity, Infinity));
const isPlace = (value: unknown): value is Place => isRecord(value) && isString(value.id) && (value.camera === undefined || isCamera(value.camera));

const DOUBLE_TAP = 280;
const SWIPE = 0.2;
const FLICK = 500;
const FOOT = 78;

function useSaved(piece: BranchPiece) {
  return isSaved(piece, useSyncExternalStore(subscribeBookmarks, readBookmarks));
}

function Actions({ piece, palette, pop, current, embedded, extra, onVideo, onShare, onEvidence, onCompare, onRotate, onView, onAround, choice }: { piece: BranchPiece; palette: Palette; pop: number; current: boolean; onVideo?: () => void; onShare: () => void; onEvidence: (group: Group) => void; onCompare: (targets: CompareTarget[]) => void; onRotate?: () => void;
  embedded?: boolean;
  extra?: { lead?: React.ReactNode; aside?: React.ReactNode };
  onView?: { mode: BranchView; toggle: () => void }; onAround: { on: boolean; toggle: () => void };
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
      {embedded && saveButton}
      <IconButton Icon={Send} label="مشاركة" onPress={onShare} tone={tone} />
      {extra?.aside ? <><View style={{ flex: 1 }} />{extra.aside}</> : null}
    </View>
  );
}

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

function ScrollingTree({ view, studio, children }: { view: Size; studio: boolean;
  children: (view: Size, ayatRoom: { height: number; set: (height: number) => void; most: number } | undefined, inScroll: boolean) => React.ReactNode }) {
  const [room, setRoom] = useState(0);
  const ayatRoom = useMemo(() => ({ height: room, set: setRoom, most: Math.round(view.height * 0.9) }), [room, view.height]);
  const added = studio ? 0 : room;
  const scroller = useRef<React.ComponentRef<typeof ScrollView>>(null);
  useEffect(() => { if (!added) scroller.current?.scrollTo({ y: 0, animated: false }); }, [added]);
  return (
    <ScrollView ref={scroller} scrollEnabled={added > 0} showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
      {children({ width: view.width, height: view.height + added }, studio ? undefined : ayatRoom, added > 0)}
    </ScrollView>
  );
}

type Props = { pieces: BranchPiece[]; list: ListState; palette: Palette; around: boolean;
  start?: number; onIndex?: (index: number) => void;
  startMode?: BranchView;
  onPull?: () => void;
  onOpen?: (piece: BranchPiece) => void;
  embedded?: {
    open: (piece: BranchPiece) => void;
    inScroll?: boolean;
    lit?: string;
    onLeave?: () => void;
    ayatRoom?: { height: number; set: (height: number) => void };
    onFit?: (overflow: number | null) => boolean;
    extra?: { lead?: React.ReactNode; aside?: React.ReactNode };
  }; };

const DEFAULT_MODE: BranchView = 'matrix';

export default function TreePager({ pieces, list, palette, around: defaultAround, start, startMode, onIndex, onPull, onOpen, embedded }: Props) {
  const [rotatedId, setRotatedId] = useState<string | null>(null);
  const [own, setOwn] = useState<Record<string, { mode?: BranchView; around?: boolean }>>(() => {
    const opened = start === undefined ? undefined : pieces[start];
    return opened && startMode ? { [opened.id]: { mode: startMode } } : {};
  });
  const modeOf = (at: BranchPiece): BranchView => matrixOnly(at) ? 'matrix' : own[at.id]?.mode ?? DEFAULT_MODE;
  const surroundOf = (at: BranchPiece) => own[at.id]?.around ?? defaultAround;
  const switchCard = (at: BranchPiece, change: { mode?: BranchView; around?: boolean }) => {
    if (!embedded) closeStudio();
    setOwn(current => ({ ...current, [at.id]: { ...current[at.id], ...change } }));
  };
  const actions = useMemo<NodeActions>(() => ({ onSubtree: piece => (embedded ? embedded.open(piece) : onOpen?.(piece)) }), [onOpen, embedded]);
  const place = useMemo(() => (embedded ? undefined : readJson(PLACE, isPlace)), []); // eslint-disable-line react-hooks/exhaustive-deps
  const first = start ?? Math.max(0, pieces.findIndex(piece => piece.id === place?.id));
  const [index, setIndex] = useState(first);
  const currentMode = pieces[index] ? modeOf(pieces[index]) : DEFAULT_MODE;
  useEffect(() => { if (currentMode === 'tree') embedded?.onFit?.(null); }, [currentMode]); // eslint-disable-line react-hooks/exhaustive-deps
  const [view, setView] = useState<Size | null>(null);
  const [pop, setPop] = useState(0);
  const offset = useSharedValue(0);
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
  const [connectorsOn] = connectors.use();
  const [picked, setPicked] = useState<{ id: string; tags: Tag[] } | null>(null);
  const tagsOf = (at: BranchPiece, group: Group) => picked?.id === at.id ? picked.tags : connectorsOn ? group.tags : [];
  const toggleTag = (at: BranchPiece, group: Group, tag: Tag) => {
    const current = tagsOf(at, group);
    setPicked({ id: at.id, tags: current.includes(tag) ? current.filter(value => value !== tag) : [...current, tag] });
  };
  const [choosing, setChoosing] = useState<CompareTarget[] | null>(null);
  const openCompare = (target: CompareTarget) => { embedded?.onLeave?.(); setIntent({ tab: 'compare', lead: target.lead, other: target.other }); toTab('/compare'); };
  const compare = (targets: CompareTarget[]) => (targets.length === 1 ? openCompare(targets[0]) : setChoosing(targets));

  useEffect(() => { if (width) offset.value = index * width; }, [width]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { onIndex?.(index); }, [index, onIndex]);
  useEffect(() => {
    if (index < pieces.length || !pieces.length) return;
    setIndex(pieces.length - 1);
    if (width) offset.value = (pieces.length - 1) * width;
  }, [pieces.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const piece = pieces[Math.min(index, pieces.length - 1)];
  const mode = piece ? modeOf(piece) : DEFAULT_MODE;
  const shrink = useShrinkOnScroll();
  useEffect(() => { if (!embedded) setCompact(false); }, [index, mode]); // eslint-disable-line react-hooks/exhaustive-deps
  const around = piece ? surroundOf(piece) : defaultAround;
  const matrixGroup = useMemo(() => (mode === 'matrix' && piece ? evidenceOf(piece) : null), [mode, piece]);
  const studioTags = matrixGroup?.tags.length ? (tagsOf(piece, matrixGroup).length ? tagsOf(piece, matrixGroup) : matrixGroup.tags) : [];
  const studioKey = studioTags.join(' ');
  useEffect(() => {
    if (growth.studio && growth.kind === 'matrix' && matrixGroup?.tags.length && piece && !tagsOf(piece, matrixGroup).length) setPicked({ id: piece.id, tags: matrixGroup.tags });
  }, [growth.studio, growth.kind, matrixGroup, piece]); // eslint-disable-line react-hooks/exhaustive-deps
  const reading = useMemo(() => (mode === 'matrix' && piece ? matrixReading(cardOf(piece, list).presentation) : null), [mode, piece, list]);
  const [play, setPlay] = useState<'connections' | 'read'>('connections');
  const lines = useMemo(() => (matrixGroup ? studioTags.reduce((sum, tag) => sum + wordConnections(matrixGroup, tag).length, 0) : 0), [matrixGroup, studioKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const connecting = lines > 0 && play === 'connections';
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
    if (target !== index) scheduleOnRN(arrive, target);
  };
  const growing = growth.status === 'playing' || growth.status === 'paused';
  const lane: Lane | undefined = growing ? undefined : { offset, width, count, settle };

  const tap = useCallback((ayahKeys: string[] | null, lightPath?: () => void) => {
    const now = Date.now();
    if (now - moved.current < 350) return;
    clearTimeout(pending.current);
    const on = ayahKeys?.join(' ') ?? '';
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
