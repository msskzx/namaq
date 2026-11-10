import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import type { BranchPiece } from '@shared/quran/branchInventory';
import BranchTree, { type Direction, type TreeGrowth } from './BranchTree';
import type { TreeScene } from '@/lib/scene';
import { aroundOf, cardOf, surahNames } from '@/lib/branches';
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
};

const BIG = 20000;
const PULL = 70;
const PULL_FLICK = 600;
const SETTLE = { duration: 220 };
/** The direction each tree picked for itself, so it is measured once. */
const picked = new Map<string, Direction>();

export default function TreeCard({ piece, list, palette, view, lane, around, rotated = false, growth, sceneRef, initialCamera, onCamera, onTap, onMove, onPull }: Props) {
  const card = useMemo(() => cardOf(piece, list), [piece, list]);
  const surrounding = useMemo(() => around ? aroundOf(card.presentation) : undefined, [around, card]);
  const pickKey = `${piece.id}:${piece.keys.length}:${JSON.stringify([list.filters, list.range])}:${around}:${Math.round(view.width)}x${Math.round(view.height)}`;
  // Each tree is drawn both ways once (unseen), and opens the way it fits bigger, as on the website.
  const [trial, setTrial] = useState<Direction | null>(picked.has(pickKey) ? null : 'side');
  const sides = useRef<Partial<Record<Direction, Size>>>({});
  const own = picked.get(pickKey) ?? 'side';
  const direction: Direction = trial ?? (rotated ? (own === 'side' ? 'down' : 'side') : own);
  const [content, setContent] = useState<Size | null>(null);
  const camera = useSharedValue<Camera>({ s: 1, x: 0, y: 0 });
  const contentSize = useSharedValue<Size>({ width: 1, height: 1 });
  const viewSize = useSharedValue<Size>(view);
  const start = useSharedValue<Camera>({ s: 1, x: 0, y: 0 });
  const focal = useSharedValue({ x: 0, y: 0 });
  const mode = useSharedValue<'idle' | 'pending' | 'move' | 'swipe' | 'none'>('idle');
  const from = useSharedValue(0);
  const restored = useRef(initialCamera);

  // A new size or filter measures again. The trial tree is keyed by pickKey, so it is drawn afresh and reports its
  // size even when it was already measuring the 'side' way (otherwise the card stayed hidden until it was remounted).
  useEffect(() => {
    if (picked.has(pickKey)) return;
    sides.current = {};
    setTrial('side');
  }, [pickKey]);

  useEffect(() => {
    viewSize.value = view;
    if (content) camera.value = settleCamera(camera.value, content, view);
  }, [view]); // eslint-disable-line react-hooks/exhaustive-deps

  const measured = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (!width || !height) return;
    const size = { width, height };
    if (trial) {
      sides.current[trial] = size;
      if (trial === 'side') { setTrial('down'); return; }
      if (!sides.current.side) { setTrial('side'); return; }
      picked.set(pickKey, pickDirection(sides.current.side!, size, view));
      setTrial(null);
      return;
    }
    contentSize.value = size;
    const saved = restored.current;
    restored.current = undefined;
    camera.value = saved ? settleCamera(saved, size, view) : fitCamera(size, view);
    setContent(size);
  }, [camera, contentSize, view, trial, pickKey]);

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
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: camera.value.x }, { translateY: camera.value.y }, { scale: camera.value.s }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <View collapsable={false} style={{ width: view.width, height: view.height, overflow: 'hidden', direction: 'ltr' }} onStartShouldSetResponder={() => true} onResponderRelease={() => onTap(null)}>
        <Animated.View pointerEvents="box-none" style={[{ position: 'absolute', left: 0, top: 0, width: BIG, height: BIG, alignItems: 'flex-start', transformOrigin: 'left top', opacity: content && !trial ? 1 : 0 }, style]}>
          <BranchTree key={trial ? `trial-${trial}-${pickKey}` : direction} presentation={card.presentation} matches={card.matches} names={surahNames} palette={palette} onTap={onTap} onLayout={measured}
            direction={direction} around={surrounding} growth={growth} sceneRef={trial ? undefined : sceneRef} />
        </Animated.View>
      </View>
    </GestureDetector>
  );
}
