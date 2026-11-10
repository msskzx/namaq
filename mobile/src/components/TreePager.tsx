import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Pressable, Share, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { Bookmark, Send } from 'lucide-react-native';
import { router } from 'expo-router';
import type { BranchPiece } from '@shared/quran/branchInventory';
import { readBookmarks, subscribeBookmarks } from '@shared/bookmarks';
import { branchesHref } from '@shared/quran/branches';
import { num } from '@shared/quran/arabicNumber';
import TreeCard, { type Lane } from './TreeCard';
import MatrixCard from './MatrixCard';
import VideoSheet from './VideoSheet';
import { StudioButton, StudioControls, StudioProgress } from './Studio';
import { aroundOf, cardOf, growthParts, isSaved, toggleSaved, WEBSITE } from '@/lib/branches';
import type { ListState } from '@/lib/branchList';
import type { Camera, Size } from '@/lib/camera';
import { growthBeats } from '@/lib/growth';
import { answer, growthState, setTarget, stop, useGrowth } from '@/lib/growPlayer';
import { VIDEO_TYPES, type TreeScene, type VideoInput } from '@/lib/scene';
import type { BranchView } from '@/lib/settings';
import { readJson, writeJson } from '@/lib/storage';
import type { Palette } from '@/lib/theme';

const PLACE = 'branches-place';
type Place = { id: string; camera?: Camera };

/** A second tap within this time is a double tap: it saves the tree instead of opening the ayat. */
const DOUBLE_TAP = 280;
const SWIPE = 0.2;
const FLICK = 500;

function useSaved(piece: BranchPiece) {
  return isSaved(piece, useSyncExternalStore(subscribeBookmarks, readBookmarks));
}

function Actions({ piece, palette, position, total, pop, onVideo }: { piece: BranchPiece; palette: Palette; position: number; total: number; pop: number; onVideo?: () => void }) {
  const saved = useSaved(piece);
  const studio = useGrowth().studio;
  const scale = useSharedValue(1);
  useEffect(() => {
    if (pop) scale.value = withSequence(withTiming(1.35, { duration: 120 }), withTiming(1, { duration: 160 }));
  }, [pop, scale]);
  const popped = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  if (studio) return <StudioControls palette={palette} onVideo={onVideo} />;
  const save = () => toggleSaved(piece);
  const share = () => void Share.share({ message: `${piece.text}\n${WEBSITE}${branchesHref(piece.id)}` });
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8 }}>
      <Pressable onPress={save} hitSlop={8} accessibilityRole="button" accessibilityLabel={saved ? 'إزالة من المحفوظات' : 'حفظ الشجرة'} style={{ padding: 8 }}>
        <Animated.View style={popped}><Bookmark size={26} color={saved ? palette.accent : palette.ink} fill={saved ? palette.accent : 'transparent'} /></Animated.View>
      </Pressable>
      <Pressable onPress={share} hitSlop={8} accessibilityRole="button" accessibilityLabel="مشاركة" style={{ padding: 8 }}>
        <Send size={24} color={palette.ink} />
      </Pressable>
      <StudioButton palette={palette} />
      <Text style={{ marginStart: 'auto', color: palette.muted, fontSize: 13 }}>{num(position)} / {num(total)}</Text>
    </View>
  );
}

type Props = { pieces: BranchPiece[]; list: ListState; palette: Palette; mode: BranchView; around: boolean; rotated: boolean;
  /** The tree a search opens on; otherwise the one left open last time. */
  start?: number; onIndex?: (index: number) => void;
  /** A downward swipe on the open tree. */
  onPull?: () => void };

/** The branches trees as a row of cards: the neighbour follows the finger, the place and zoom are kept for next time. */
export default function TreePager({ pieces, list, palette, mode, around, rotated, start, onIndex, onPull }: Props) {
  const place = useMemo(() => readJson<Place>(PLACE), []);
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
  const growth = useGrowth();
  const sceneRef = useRef<(() => Promise<TreeScene | null>) | null>(null);
  const beatsRef = useRef<{ watch: ReturnType<typeof growthBeats>; ask: ReturnType<typeof growthBeats> } | null>(null);
  const [video, setVideo] = useState<VideoInput | null>(null);

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
  useEffect(() => {
    if (mode !== 'tree' || !piece) { setTarget(null); return; }
    const { presentation } = cardOf(piece, list);
    const parts = growthParts(presentation, around ? aroundOf(presentation) : undefined);
    const options = { ...parts, prefixes: presentation.prefixes };
    beatsRef.current = { watch: growthBeats(presentation.tree, options), ask: growthBeats(presentation.tree, { ...options, ask: true }) };
    setTarget(beatsRef.current);
    return () => setTarget(null);
  }, [piece, list, mode, around]);

  const arrive = useCallback((next: number) => {
    restore.current = undefined;
    setIndex(next);
    writeJson(PLACE, { id: pieces[next].id });
  }, [pieces]);

  const remember = useCallback((camera: Camera) => writeJson(PLACE, { id: pieces[index].id, camera }), [pieces, index]);

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

  // The row under the card swipes the cards too, so a thumb near the bottom of the screen still turns the tree.
  const footFrom = useSharedValue(0);
  const footSwipe = Gesture.Pan()
    .enabled(!growing && width > 0)
    .activeOffsetX([-12, 12])
    .failOffsetY([-12, 12])
    .onStart(() => {
      cancelAnimation(offset);
      footFrom.value = Math.round(offset.value / width);
      scheduleOnRN(move);
    })
    .onUpdate(event => {
      const forward = event.translationX > 0;
      const open = forward ? footFrom.value + 1 < count : footFrom.value > 0;
      offset.value = footFrom.value * width + (open ? event.translationX : event.translationX / 4);
    })
    .onEnd(event => {
      scheduleOnRN(move);
      settle(footFrom.value, event.translationX, event.velocityX);
    });

  const tap = useCallback((ayahKeys: string[] | null) => {
    const now = Date.now();
    if (now - moved.current < 350) return;
    clearTimeout(pending.current);
    const state = growthState();
    if (state.ask) { answer(); return; }
    if (state.studio && ayahKeys) return;
    if (now - lastTap.current < DOUBLE_TAP) {
      lastTap.current = 0;
      if (!isSaved(pieces[index])) toggleSaved(pieces[index]);
      setPop(value => value + 1);
      return;
    }
    lastTap.current = now;
    if (ayahKeys?.length) pending.current = setTimeout(() => router.push({ pathname: '/ayah', params: { keys: ayahKeys.join(',') } }), DOUBLE_TAP);
  }, [pieces, index]);

  const openVideo = async () => {
    stop();
    const scene = await sceneRef.current?.();
    const beats = beatsRef.current;
    if (!scene || !beats) return;
    const state = growthState();
    setVideo({ scene, beats: state.mode === 'ask' ? beats.ask : beats.watch, speed: state.speed, ask: state.mode === 'ask', timer: state.timer, types: VIDEO_TYPES,
      look: { paper: palette.paper, ink: palette.ink, muted: palette.muted, rule: palette.rule, accent: palette.accent, path: palette.path, green: palette.green, deep: palette.paperDeep, font: '"KFGQPC Hafs"', title: piece.text, brand: 'نمق · namaq.vercel.app' } });
  };

  const track = useAnimatedStyle(() => ({ transform: [{ translateX: offset.value }] }));
  const shown = [index - 1, index, index + 1].filter(at => at >= 0 && at < count);
  const treeGrowth = growth.studio ? { hidden: growth.hidden, now: growth.now, ask: growth.ask, lit: growth.lit } : undefined;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, overflow: 'hidden' }} onLayout={event => setView({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })}>
        {view && <Animated.View style={[{ position: 'absolute', left: 0, top: 0, width: view.width, height: view.height, direction: 'ltr' }, track]}>
          {shown.map(at => (
            <View key={pieces[at].id} style={{ position: 'absolute', top: 0, left: -at * view.width, width: view.width, height: view.height, backgroundColor: palette.paper }}>
              {mode === 'matrix'
                ? <MatrixCard key={String(around)} piece={pieces[at]} list={list} palette={palette} view={view} lane={at === index ? lane : undefined} around={around} onTap={tap} onMove={move} />
                : <TreeCard piece={pieces[at]} list={list} palette={palette} view={view} lane={at === index ? lane : undefined} around={around}
                  rotated={at === index && rotated} growth={at === index ? treeGrowth : undefined} sceneRef={at === index ? sceneRef : undefined}
                  initialCamera={at === index ? restore.current : undefined}
                  onCamera={at === index ? remember : undefined} onTap={tap} onMove={move} onPull={at === index && !growth.studio ? onPull : undefined} />}
            </View>
          ))}
        </Animated.View>}
        {/* Over the card's foot, so opening the studio does not resize the card. */}
        <View pointerEvents="box-none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: palette.paper }}><StudioProgress palette={palette} /></View>
      </View>
      <GestureDetector gesture={footSwipe}>
        <View collapsable={false} style={{ borderTopWidth: 1, borderColor: palette.rule }}>
          {piece && <Actions piece={piece} palette={palette} position={index + 1} total={count} pop={pop} onVideo={mode === 'tree' ? () => void openVideo() : undefined} />}
        </View>
      </GestureDetector>
      <VideoSheet input={video} onClose={() => setVideo(null)} palette={palette} />
    </View>
  );
}
