import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import type { BranchPiece } from '@shared/quran/branchInventory';
import BranchTree from './BranchTree';
import { cardOf, surahNames } from '@/lib/branches';
import { clampCamera, fitCamera, isZoomed, settleCamera, zoomAt, type Camera, type Size } from '@/lib/camera';
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
  palette: Palette;
  view: Size;
  lane?: Lane;
  initialCamera?: Camera;
  onCamera?: (camera: Camera) => void;
  onTap: (ayahKeys: string[] | null) => void;
  /** Told when a finger starts and stops moving the tree or the cards, so the lifted finger is not read as a tap. */
  onMove: () => void;
};

const BIG = 20000;
const SETTLE = { duration: 220 };

export default function TreeCard({ piece, palette, view, lane, initialCamera, onCamera, onTap, onMove }: Props) {
  const card = useMemo(() => cardOf(piece), [piece]);
  const [content, setContent] = useState<Size | null>(null);
  const camera = useSharedValue<Camera>({ s: 1, x: 0, y: 0 });
  const contentSize = useSharedValue<Size>({ width: 1, height: 1 });
  const viewSize = useSharedValue<Size>(view);
  const start = useSharedValue<Camera>({ s: 1, x: 0, y: 0 });
  const focal = useSharedValue({ x: 0, y: 0 });
  const mode = useSharedValue<'idle' | 'move' | 'swipe' | 'none'>('idle');
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
    .onStart(event => {
      start.value = camera.value;
      mode.value = isZoomed(camera.value, contentSize.value, viewSize.value) ? 'move'
        : Math.abs(event.translationX) >= Math.abs(event.translationY) ? 'swipe' : 'none';
      if (mode.value === 'swipe' && lane) {
        // A swipe that starts while the row is still settling carries on from where it is.
        cancelAnimation(lane.offset);
        from.value = Math.round(lane.offset.value / lane.width);
      }
      scheduleOnRN(onMove);
    })
    .onUpdate(event => {
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
        <Animated.View pointerEvents="box-none" style={[{ position: 'absolute', left: 0, top: 0, width: BIG, height: BIG, alignItems: 'flex-start', transformOrigin: 'left top', opacity: content ? 1 : 0 }, style]}>
          <BranchTree presentation={card.presentation} matches={card.matches} names={surahNames} palette={palette} onTap={onTap} onLayout={measured} />
        </Animated.View>
      </View>
    </GestureDetector>
  );
}
