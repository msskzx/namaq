import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import type { BranchPiece } from '@shared/quran/branchInventory';
import BranchTree, { type Direction, type TreeGrowth } from './BranchTree';
import type { TreeScene } from '@/lib/scene';
import { aroundOf, cardOf, surahNames } from '@/lib/branches';
import { saveSizes, sizesOf, type Sized } from '@/lib/treeSizes';
import type { ListState } from '@/lib/branchList';
import { clampCamera, fitCamera, isZoomed, pickDirection, settleCamera, zoomAt, type Camera, type Size } from '@/lib/camera';
import type { Palette } from '@/lib/theme';

/** What the pager lends the card that has the focus, so one finger either moves the zoomed tree or the row of cards. */
export type Lane = {
  offset: SharedValue<number>;
  width: number;
  count: number;
  /** Called on the UI thread when a sideways swipe ends, with where the row stood when the finger came down. */
  settle: (from: number, dx: number, velocity: number) => void;
};

type Props = {
  piece: BranchPiece;
  list: ListState;
  palette: Palette;
  view: Size;
  lane?: Lane;
  /** The surrounding-ayat switch. */
  around: boolean;
  /** The rotate button: the open tree drawn the other way from the one it picked. */
  rotated?: boolean;
  growth?: TreeGrowth;
  sceneRef?: React.MutableRefObject<(() => Promise<TreeScene | null>) | null>;
  initialCamera?: Camera;
  onCamera?: (camera: Camera) => void;
  onTap: (ayahKeys: string[] | null) => void;
  /** Told when a finger starts and stops moving the tree or the cards, so the lifted finger is not read as a tap. */
  onMove: () => void;
  /** A downward swipe on a tree that is not zoomed in: the page's main action (search). */
  onPull?: () => void;
  /** The bookmark row, drawn right under the tree so it follows it; the tree fits in the space left above it. */
  footer?: React.ReactNode;
  footHeight?: number;
};

const BIG = 20000;
const PULL = 70;
const PULL_FLICK = 600;
const SETTLE = { duration: 220 };
const HIDDEN = { position: 'absolute', left: 0, top: 0, opacity: 0 } as const;

export default function TreeCard({ piece, list, palette, view: full, lane, around, rotated = false, growth, sceneRef, initialCamera, onCamera, onTap, onMove, onPull, footer, footHeight = 0 }: Props) {
  const view = useMemo(() => ({ width: full.width, height: Math.max(1, full.height - footHeight) }), [full.width, full.height, footHeight]); // eslint-disable-line react-hooks/exhaustive-deps
  const card = useMemo(() => cardOf(piece, list), [piece, list]);
  const surrounding = useMemo(() => around ? aroundOf(card.presentation) : undefined, [around, card]);
  // The tree opens the way it fits bigger, as on the website. Its sizes both ways are known ahead (or kept from the
  // first time it opened), so the tree shows at once; a tree with no sizes yet shows sideways while both ways are
  // measured out of sight, then turns if top down fits better.
  const [measuredSizes, setMeasuredSizes] = useState<Sized | undefined>(undefined);
  const sizes = useMemo(() => sizesOf(piece.id, card.presentation, around), [piece, card, around, measuredSizes]); // eslint-disable-line react-hooks/exhaustive-deps
  const own: Direction = sizes ? pickDirection({ width: sizes[0], height: sizes[1] }, { width: sizes[2], height: sizes[3] }, view) : 'side';
  const direction: Direction = rotated ? (own === 'side' ? 'down' : 'side') : own;
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

  useEffect(() => {
    viewSize.value = view;
    if (content) camera.value = settleCamera(camera.value, content, view);
  }, [view]); // eslint-disable-line react-hooks/exhaustive-deps

  const measured = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (!width || !height) return;
    const size = { width, height };
    contentSize.value = size;
    const saved = restored.current;
    restored.current = undefined;
    camera.value = saved ? settleCamera(saved, size, view) : fitCamera(size, view);
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
    });

  const pan = Gesture.Pan()
    .maxPointers(1)
    .minDistance(8)
    .onStart(() => {
      start.value = camera.value;
      mode.value = isZoomed(camera.value, contentSize.value, viewSize.value) ? 'move' : 'pending';
      scheduleOnRN(onMove);
    })
    .onUpdate(event => {
      // The web build starts the pan before the finger has moved, so the way it goes is read from the first move.
      if (mode.value === 'pending') {
        if (Math.max(Math.abs(event.translationX), Math.abs(event.translationY)) < 8) return;
        mode.value = Math.abs(event.translationX) >= Math.abs(event.translationY) ? 'swipe' : 'none';
        if (mode.value === 'swipe' && lane) {
          // A swipe that starts while the row is still settling carries on from where it is.
          cancelAnimation(lane.offset);
          from.value = Math.round(lane.offset.value / lane.width);
        }
      }
      if (mode.value === 'move') {
        camera.value = clampCamera({ s: start.value.s, x: start.value.x + event.translationX, y: start.value.y + event.translationY }, contentSize.value, viewSize.value);
      } else if (mode.value === 'swipe' && lane) {
        // Arabic order: the next tree waits on the left, so a drag to the right brings it in.
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

  const gesture = Gesture.Simultaneous(pinch, pan);
  // Under the tree's last row: it moves with the tree when it is zoomed or moved.
  const foot = useAnimatedStyle(() => ({ transform: [{ translateY: camera.value.y + contentSize.value.height * camera.value.s }] }));
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: camera.value.x }, { translateY: camera.value.y }, { scale: camera.value.s }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <View collapsable={false} style={{ width: full.width, height: full.height, overflow: 'hidden', direction: 'ltr' }} onStartShouldSetResponder={() => true} onResponderRelease={() => onTap(null)}>
        <Animated.View pointerEvents="box-none" style={[{ position: 'absolute', left: 0, top: 0, width: BIG, height: BIG, alignItems: 'flex-start', transformOrigin: 'left top', opacity: content ? 1 : 0 }, style]}>
          <BranchTree key={direction} presentation={card.presentation} matches={card.matches} names={surahNames} palette={palette} onTap={onTap} onLayout={measured}
            direction={direction} around={surrounding} growth={growth} sceneRef={sceneRef} />
        </Animated.View>
        {footer && <Animated.View style={[{ position: 'absolute', left: 0, right: 0, top: 0, height: footHeight, opacity: content ? 1 : 0 }, foot]}>{footer}</Animated.View>}
        {!sizes && (['side', 'down'] as const).map(side => (
          <View key={`probe-${side}-${probeTag}`} pointerEvents="none" style={[HIDDEN, { width: BIG, alignItems: 'flex-start' }]}>
            <BranchTree presentation={card.presentation} matches={card.matches} names={surahNames} palette={palette} onTap={onTap} onLayout={probed(side)} direction={side} around={surrounding} />
          </View>
        ))}
      </View>
    </GestureDetector>
  );
}
