import { useCallback, useMemo, useRef, useState } from 'react';
import { useWindowDimensions, View, type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector, type GestureType } from 'react-native-gesture-handler';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import type { BranchPiece } from '@shared/quran/branchInventory';
import BranchTree, { type Direction, type NodeActions, type Paths, type TreeGrowth } from './BranchTree';
import { litPaths, pathToggleKey, togglePath } from '@shared/quran/pathHighlight';
import type { TreeScene } from '@/lib/scene';
import { aroundOf, cardOf, searchLit, surahNames } from '@/lib/branches';
import { saveSizes, sizesOf, type Sized } from '@/lib/treeSizes';
import type { ListState } from '@/lib/branchList';
import { clampCamera, fitCamera, isZoomed, pickDirection, settleCamera, zoomAt, type Camera, type Size } from '@/lib/camera';
import { CARD, type Palette } from '@/lib/theme';
import PathAyat from './PathAyat';
import SurahChips, { CHIPS_HEIGHT, TUCK } from './SurahChips';
import { BACK_EDGE_SLOP } from '@/lib/stackOptions';
import { useOnChange } from '@/lib/hooks/useOnChange';

export type Lane = {
  offset: SharedValue<number>;
  width: number;
  count: number;
  settle: (from: number, dx: number, velocity: number) => void;
};

type Props = {
  piece: BranchPiece;
  list: ListState;
  palette: Palette;
  view: Size;
  lane?: Lane;
  around: boolean;
  rotated?: boolean;
  growth?: TreeGrowth;
  sceneRef?: React.MutableRefObject<(() => Promise<TreeScene | null>) | null>;
  shareRef?: React.MutableRefObject<(() => React.ReactNode) | null>;
  initialCamera?: Camera;
  onCamera?: (camera: Camera) => void;
  onTap: (ayahKeys: string[] | null, lightPath?: () => void) => void;
  actions?: NodeActions;
  onMove: () => void;
  onPull?: () => void;
  footer?: React.ReactNode;
  footHeight?: number;
  chips?: boolean;
  alongside?: GestureType;
  inScroll?: boolean;
  fixed?: boolean;
  lit?: string[];
  ayatRoom?: { height: number; set: (height: number) => void;
    most?: number };
  framed?: boolean;
};

export const AYAH_SPACE = 184;
const AYAH_SCREEN = 0.85;
const AYAH_GAP = 8;

const BIG = 20000;
const PULL = 70;
const PULL_FLICK = 600;
const SETTLE = { duration: 220 };
const HIDDEN = { position: 'absolute', left: 0, top: 0, opacity: 0 } as const;

export default function TreeCard({ piece, list, palette, view: full, lane, around, rotated = false, growth, sceneRef, shareRef, initialCamera, onCamera, onTap, onMove, onPull, footer, footHeight: rowHeight = 0, actions, chips = false, alongside, inScroll = false, fixed = false, lit, ayatRoom, framed = false }: Props) {
  const card = useMemo(() => cardOf(piece, list), [piece, list]);
  const [pinned, setPinned] = useState(() => {
    const found = lit?.length ? lit : searchLit(card.presentation, list.query);
    return new Map<string, string[]>(found.length ? [['search', found]] : []);
  });
  const paths = useMemo<Paths>(() => ({ lit: litPaths(pinned), pinned, pin: (id, ayahKeys) => setPinned(current => togglePath(current, id, ayahKeys)) }), [pinned]);
  const tappedKeys = useMemo(() => {
    const lit = new Set([...pinned].flatMap(([id, ayahKeys]) => id === 'search' ? [] : ayahKeys));
    return card.presentation.ayat.map(ayah => ayah.key).filter(key => lit.has(key));
  }, [pinned, card]);
  const ayahKeys = useMemo(() => card.presentation.ayat.map(ayah => ayah.key), [card]);
  const touring = !!growth?.tour && !!growth.lit;
  const growing = !!growth?.lit && (touring || fixed);
  const showChips = chips && (!growth || growing);
  const shownWords = growth && !touring ? growth.words : undefined;
  const rise = fixed && !growth ? TUCK : 0;
  const footHeight = rowHeight + (fixed ? (chips ? CHIPS_HEIGHT : 0) : showChips ? CHIPS_HEIGHT - TUCK : 0);
  const [stripHeight, setStripHeight] = useState(0);
  const readKeys = growth ? (growing ? [growth.lit!] : []) : tappedKeys;
  const [ayatHeight, setAyatHeight] = useState(0);
  const { height: screen } = useWindowDimensions();
  const grown = Math.round(ayatHeight ? Math.min(ayatHeight + AYAH_GAP + 8, ayatRoom?.most ?? screen * AYAH_SCREEN) : AYAH_SPACE);
  const fitted = ayatRoom ? grown : Math.round(Math.min(Math.max(AYAH_SPACE, ayatHeight + AYAH_GAP + 8), Math.max(AYAH_SPACE, full.height * 0.5)));
  const room = growth || !readKeys.length ? AYAH_SPACE : fitted;
  const strip = fixed ? ayatRoom?.height ?? room : readKeys.length ? stripHeight : 0;
  const askRoom = ayatRoom?.set;
  useOnChange([askRoom, readKeys.length > 0, room], () => { askRoom?.(readKeys.length ? room : 0); });
  const view = useMemo(() => ({ width: full.width, height: Math.max(1, full.height - footHeight - strip) }), [full.width, full.height, footHeight, strip]);
  const surrounding = useMemo(() => around ? aroundOf(card.presentation) : undefined, [around, card]);
  const [measuredSizes, setMeasuredSizes] = useState<Sized | undefined>(undefined);
  const sizes = useMemo(() => sizesOf(piece.id, card.presentation, around), [piece, card, around, measuredSizes]); // eslint-disable-line react-hooks/exhaustive-deps
  const own: Direction = sizes ? pickDirection({ width: sizes[0], height: sizes[1] }, { width: sizes[2], height: sizes[3] }, view) : 'side';
  const direction: Direction = rotated ? (own === 'side' ? 'down' : 'side') : own;
  if (shareRef) shareRef.current = () => (
    <BranchTree presentation={card.presentation} matches={card.matches} names={surahNames} palette={palette} onTap={() => {}} paths={paths} direction={direction} around={surrounding} />
  );
  const probeTag = `${around}:${card.presentation.ayat.length}`;
  const probe = useRef<{ tag?: string } & Partial<Record<Direction, Size>>>({});
  const probed = useCallback((side: Direction) => (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (!width || !height) return;
    if (probe.current.tag !== probeTag) probe.current = { tag: probeTag };
    probe.current[side] = { width: Math.round(width), height: Math.round(height) };
    const { side: a, down: b } = probe.current;
    if (!a || !b) return;
    const next: Sized = [a.width, a.height, b.width, b.height];
    saveSizes(piece.id, card.presentation, around, next);
    probe.current = {};
    setMeasuredSizes(next);
  }, [piece, card, around, probeTag]);
  const [content, setContent] = useState<Size | null>(null);
  const camera = useSharedValue<Camera>({ s: 1, x: 0, y: 0 });
  const contentSize = useSharedValue<Size>({ width: 1, height: 1 });
  const viewSize = useSharedValue<Size>(view);
  const start = useSharedValue<Camera>({ s: 1, x: 0, y: 0 });
  const focal = useSharedValue({ x: 0, y: 0 });
  const mode = useSharedValue<'idle' | 'pending' | 'move' | 'swipe' | 'none'>('idle');
  const from = useSharedValue(0);
  const restored = useRef(initialCamera);
  const [zoomed, setZoomed] = useState(false);

  useOnChange([view], () => {
    viewSize.value = view;
    if (content) camera.value = settleCamera(camera.value, content, view);
  });

  const measured = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (!width || !height) return;
    const size = { width, height };
    contentSize.value = size;
    const saved = restored.current;
    restored.current = undefined;
    camera.value = saved ? settleCamera(saved, size, view) : fitCamera(size, view);
    setZoomed(false);
    setContent(size);
  }, [camera, contentSize, view]);

  const report = onCamera;
  const pinch = Gesture.Pinch()
    .onStart(event => {
      start.value = camera.value;
      focal.value = { x: event.focalX, y: event.focalY };
      scheduleOnRN(onMove);
    })
    .onUpdate(event => {
      const zoomed = zoomAt(start.value, event.scale, focal.value.x, focal.value.y, fitCamera(contentSize.value, viewSize.value).s);
      camera.value = { s: zoomed.s, x: zoomed.x + event.focalX - focal.value.x, y: zoomed.y + event.focalY - focal.value.y };
    })
    .onEnd(() => {
      scheduleOnRN(onMove);
      const settled = settleCamera(camera.value, contentSize.value, viewSize.value);
      camera.value = withTiming(settled, SETTLE);
      if (report) scheduleOnRN(report, settled);
      scheduleOnRN(setZoomed, isZoomed(settled, contentSize.value, viewSize.value));
    });

  const pan = Gesture.Pan()
    .hitSlop(BACK_EDGE_SLOP)
    .maxPointers(1)
    .onStart(() => {
      start.value = camera.value;
      mode.value = isZoomed(camera.value, contentSize.value, viewSize.value) ? 'move' : 'pending';
      scheduleOnRN(onMove);
    })
    .onUpdate(event => {
      if (mode.value === 'pending') {
        if (Math.max(Math.abs(event.translationX), Math.abs(event.translationY)) < 8) return;
        mode.value = Math.abs(event.translationX) >= Math.abs(event.translationY) ? 'swipe' : 'none';
        if (mode.value === 'swipe' && lane) {
          cancelAnimation(lane.offset);
          from.value = Math.round(lane.offset.value / lane.width);
        }
      }
      if (mode.value === 'move') {
        camera.value = clampCamera({ s: start.value.s, x: start.value.x + event.translationX, y: start.value.y + event.translationY }, contentSize.value, viewSize.value);
      } else if (mode.value === 'swipe' && lane) {
        const forward = event.translationX > 0;
        const open = forward ? from.value + 1 < lane.count : from.value > 0;
        lane.offset.value = from.value * lane.width + (open ? event.translationX : event.translationX / 4);
      }
    })
    .onEnd(event => {
      scheduleOnRN(onMove);
      if (mode.value === 'move') {
        if (report) scheduleOnRN(report, camera.value);
      } else if (mode.value === 'swipe' && lane) {
        lane.settle(from.value, event.translationX, event.velocityX);
      } else if (mode.value === 'none' && onPull && event.translationY > Math.abs(event.translationX)
        && (event.translationY > PULL || event.velocityY > PULL_FLICK)) {
        scheduleOnRN(onPull);
      }
      mode.value = 'idle';
    });

  const cardSwipe = Gesture.Pan()
    .activeOffsetX([-10, 10]).failOffsetY([-10, 10])
    .onStart(() => {
      if (!lane) return;
      cancelAnimation(lane.offset);
      from.value = Math.round(lane.offset.value / lane.width);
      scheduleOnRN(onMove);
    })
    .onUpdate(event => {
      if (!lane) return;
      const forward = event.translationX > 0;
      const open = forward ? from.value + 1 < lane.count : from.value > 0;
      lane.offset.value = from.value * lane.width + (open ? event.translationX : event.translationX / 4);
    })
    .onEnd(event => {
      if (!lane) return;
      scheduleOnRN(onMove);
      lane.settle(from.value, event.translationX, event.velocityX);
    });
  if (alongside) cardSwipe.simultaneousWithExternalGesture(alongside);

  if (inScroll && !zoomed) pan.activeOffsetX([-10, 10]).failOffsetY([-10, 10]);
  else pan.minDistance(8);
  if (alongside) pan.simultaneousWithExternalGesture(alongside);
  const gesture = Gesture.Simultaneous(pinch, pan);
  const foot = useAnimatedStyle(() => ({ transform: [{ translateY: camera.value.y + contentSize.value.height * camera.value.s }] }));
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: camera.value.x }, { translateY: camera.value.y }, { scale: camera.value.s }],
  }));

  const ayahCard = fixed && (
    <GestureDetector gesture={cardSwipe} touchAction="pan-y">
    <View style={{ position: 'absolute', left: 0, right: 0, top: view.height + footHeight + AYAH_GAP - rise, direction: 'ltr', opacity: content ? 1 : 0 }}>
      <PathAyat ayahKeys={readKeys} presentation={card.presentation} width={full.width} palette={palette} maxHeight={(ayatRoom?.height ?? room) - AYAH_GAP - 8} onContent={setAyatHeight} shown={shownWords} around={around} reading={touring ? growth!.now : undefined} />
    </View>
    </GestureDetector>
  );
  return (
    <View style={{ width: full.width, height: full.height }}>
    <GestureDetector gesture={gesture}>
      <View collapsable={false} style={{ width: full.width, height: full.height, overflow: 'hidden', direction: 'ltr' }} onStartShouldSetResponder={() => true} onResponderRelease={() => onTap(null)}>
        <View pointerEvents="box-none" style={[{ position: 'absolute', left: 0, top: 0, width: full.width, height: fixed ? view.height : full.height, overflow: 'hidden' },
          framed && { borderWidth: 1, borderColor: palette.rule, borderRadius: CARD.borderRadius, backgroundColor: palette.card }]}>
        <Animated.View pointerEvents="box-none" style={[{ position: 'absolute', left: 0, top: 0, width: BIG, height: BIG, alignItems: 'flex-start', transformOrigin: 'left top', opacity: content ? 1 : 0 }, style]}>
          <BranchTree key={direction} presentation={card.presentation} matches={card.matches} names={surahNames} palette={palette} onTap={onTap} onLayout={measured} paths={paths} actions={actions}
            direction={direction} around={surrounding} growth={growth} sceneRef={sceneRef} />
        </Animated.View>
        </View>
        {(footer || showChips || readKeys.length > 0) && <Animated.View style={[{ position: 'absolute', left: 0, right: 0, top: 0, opacity: content ? 1 : 0 }, fixed ? { transform: [{ translateY: view.height }] } : foot]}>
          {footer && <View style={{ height: rowHeight }}>{footer}</View>}
          {showChips && (growth
            ? <SurahChips tuck={!fixed || rise > 0} ayahKeys={ayahKeys} palette={palette} lit={surah => growth.lit?.split(':')[0] === String(surah)} />
            : <SurahChips tuck={!fixed || rise > 0} ayahKeys={ayahKeys} palette={palette} lit={(surah, keys) => pinned.has(pathToggleKey(`surah:${surah}`, keys))} onToggle={(surah, keys) => paths.pin(`surah:${surah}`, keys)} />)}
          {fixed && chips && !showChips && <View style={{ height: CHIPS_HEIGHT }} />}
          {!fixed && <PathAyat ayahKeys={readKeys} presentation={card.presentation} width={full.width} palette={palette} onLayout={setStripHeight} shown={shownWords} around={around} reading={touring ? growth!.now : undefined} />}
        </Animated.View>}
        {!sizes && (['side', 'down'] as const).map(side => (
          <View key={`probe-${side}-${probeTag}`} pointerEvents="none" style={[HIDDEN, { width: BIG, alignItems: 'flex-start' }]}>
            <BranchTree presentation={card.presentation} matches={card.matches} names={surahNames} palette={palette} onTap={onTap} onLayout={probed(side)} direction={side} around={surrounding} actions={actions} />
          </View>
        ))}
      </View>
    </GestureDetector>
    {ayahCard}
    </View>
  );
}
