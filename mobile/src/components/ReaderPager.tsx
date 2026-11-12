import { useCallback, useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withDecay, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { landingPage, MAX_ZOOM, settleZoom, splitDrag } from '@/lib/pageZoom';

const PULL = 70;
const PULL_FLICK = 600;
const TURN = 220;

type Props = {
  /** Current page, from 1. */
  page: number;
  count: number;
  width: number;
  height: number;
  /** Called when a swipe lands on another page. */
  onPage: (page: number) => void;
  /** Told when a finger starts moving the pages, so the lifted finger is not read as a tap. */
  onMove: () => void;
  /** Draws a page at the given size: the page's own size times the zoom. */
  render: (page: number, width: number, height: number) => ReactNode;
  /** A downward swipe on the page: the reader's main action (the index and search). */
  onPull?: () => void;
  /** 1 shows the whole page; more draws the same page bigger, moved by a finger inside the page's frame. */
  zoom: number;
  onZoom: (zoom: number) => void;
};

/**
 * The mushaf as a row of pages, the next page on the left as in a printed mushaf: a finger moving right turns forward.
 * The neighbour follows the finger; the current page and both neighbours stay mounted.
 * Zoomed, a drag first moves the page inside its frame; once the page's edge shows, the rest of the drag turns the page
 * (or, at the top, pulls the index down). A new page opens at its start, the top right corner.
 */
export default function ReaderPager({ page, count, width, height, onPage, onMove, render, onPull, zoom, onZoom }: Props) {
  const offset = useSharedValue((page - 1) * width);
  const from = useSharedValue(0);
  const settled = useRef(page);
  const scale = useSharedValue(zoom);
  /** The page the pan (x, y) and a pinch's scale belong to; every other page shows its start. */
  const panPage = useSharedValue(page);
  const pinching = useSharedValue(false);
  /** Set during a pinch, so a finger that keeps dragging after it carries on from where the pinch left the page. */
  const rebase = useSharedValue(false);
  /** Where the page being left stays while it slides out. */
  const leaving = useSharedValue({ page: 0, x: 0, y: 0, s: 1 });
  const x = useSharedValue(width - width * zoom);
  const y = useSharedValue(0);
  const dragX = useSharedValue(0);
  const dragY = useSharedValue(0);
  const pinchFrom = useSharedValue({ s: 1, x: 0, y: 0, fx: 0, fy: 0 });

  // A page chosen from outside (index, recite, restore) slides there; one reached by a swipe is already there.
  const laidOut = useRef(width);
  useEffect(() => {
    if (!width) return;
    const target = (page - 1) * width;
    if (laidOut.current !== width) {
      laidOut.current = width;
      offset.value = target;
    } else if (settled.current !== page) {
      offset.value = Math.abs(settled.current - page) === 1 ? withTiming(target, { duration: TURN }) : target;
    }
    settled.current = page;
  }, [page, width, offset]);

  // Every page opens at its start.
  useLayoutEffect(() => {
    if (panPage.value === page) return;
    leaving.value = { page: panPage.value, x: x.value, y: y.value, s: scale.value };
    x.value = width - width * zoom;
    y.value = 0;
    panPage.value = page;
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  // A frame that grows or shrinks (recite controls, turning the phone) keeps the page inside it.
  useLayoutEffect(() => {
    x.value = Math.min(0, Math.max(width - width * scale.value, x.value));
    y.value = Math.min(0, Math.max(height - height * scale.value, y.value));
  }, [width, height, zoom, x, y, scale]);

  const arrive = useCallback((next: number) => {
    settled.current = next;
    onPage(next);
  }, [onPage]);

  const last = (count - 1) * width;
  const pan = Gesture.Pan()
    .enabled(zoom === 1)
    .maxPointers(1)
    .activeOffsetX([-12, 12])
    .failOffsetY([-24, 24])
    .onStart(() => {
      from.value = offset.value;
      scheduleOnRN(onMove);
    })
    .onUpdate(event => {
      const next = from.value + event.translationX;
      // Past the first or last page the row only gives a little.
      offset.value = next < 0 ? next / 4 : next > last ? last + (next - last) / 4 : next;
    })
    .onEnd((event, success) => {
      scheduleOnRN(onMove);
      const at = Math.round(from.value / width);
      // A second finger (a pinch) cancels the swipe: the row goes back.
      const target = success && !pinching.value ? landingPage(at, event.translationX, event.velocityX, width, count) : at;
      offset.value = withTiming(target * width, { duration: TURN });
      if (target !== at) scheduleOnRN(arrive, target + 1);
    });

  const pull = Gesture.Pan()
    .enabled(!!onPull && zoom === 1)
    .maxPointers(1)
    .activeOffsetY(24)
    .failOffsetX([-16, 16])
    .onStart(() => scheduleOnRN(onMove))
    .onEnd((event, success) => {
      scheduleOnRN(onMove);
      if (onPull && success && !pinching.value && (event.translationY > PULL || event.velocityY > PULL_FLICK)) scheduleOnRN(onPull);
    });

  // Zoomed: one drag moves the page in its frame, and what goes past the frame's edge moves the row or pulls the index.
  const move = Gesture.Pan()
    .enabled(zoom > 1)
    .maxPointers(1)
    .minDistance(8)
    .onStart(() => {
      from.value = offset.value;
      dragX.value = x.value;
      dragY.value = y.value;
      scheduleOnRN(onMove);
    })
    .onUpdate(event => {
      if (pinching.value) { rebase.value = true; return; }
      if (rebase.value) {
        rebase.value = false;
        dragX.value = x.value - event.translationX;
        dragY.value = y.value - event.translationY;
      }
      const across = splitDrag(dragX.value + event.translationX, width - width * scale.value);
      const down = splitDrag(dragY.value + event.translationY, height - height * scale.value);
      x.value = across.offset;
      y.value = down.offset;
      const next = from.value + across.spill;
      offset.value = next < 0 ? next / 4 : next > last ? last + (next - last) / 4 : next;
    })
    .onEnd((event, success) => {
      scheduleOnRN(onMove);
      const minX = width - width * scale.value;
      const minY = height - height * scale.value;
      if (!success || pinching.value || rebase.value) {
        rebase.value = false;
        offset.value = withTiming(Math.round(from.value / width) * width, { duration: TURN });
        return;
      }
      const spill = splitDrag(dragX.value + event.translationX, minX).spill;
      const pulled = splitDrag(dragY.value + event.translationY, minY).spill;
      if (onPull && pulled > PULL) scheduleOnRN(onPull);
      if (spill === 0) {
        x.value = withDecay({ velocity: event.velocityX, clamp: [minX, 0] });
        y.value = withDecay({ velocity: event.velocityY, clamp: [minY, 0] });
        return;
      }
      const at = Math.round(from.value / width);
      // A flick back towards the page's middle is no turn.
      const target = landingPage(at, spill, Math.sign(event.velocityX) === Math.sign(spill) ? event.velocityX : 0, width, count);
      if (target === at) {
        offset.value = withTiming(at * width, { duration: TURN });
        return;
      }
      // The new page opens at its start; the page it left keeps its place while it slides out.
      leaving.value = { page: panPage.value, x: x.value, y: y.value, s: scale.value };
      x.value = minX;
      y.value = 0;
      panPage.value = target + 1;
      offset.value = withTiming(target * width, { duration: TURN });
      scheduleOnRN(arrive, target + 1);
    });

  const pinch = Gesture.Pinch()
    .onStart(event => {
      pinching.value = true;
      pinchFrom.value = { s: scale.value, x: x.value, y: y.value, fx: event.focalX, fy: event.focalY };
      scheduleOnRN(onMove);
    })
    .onUpdate(event => {
      const start = pinchFrom.value;
      const s = Math.min(MAX_ZOOM, Math.max(0.8, start.s * event.scale));
      // The words under the fingers stay under them, and follow the fingers if they move together.
      const k = s / start.s;
      x.value = event.focalX - (start.fx - start.x) * k;
      y.value = event.focalY - (start.fy - start.y) * k;
      scale.value = s;
    })
    .onFinalize(() => {
      pinching.value = false;
    })
    .onEnd(() => {
      scheduleOnRN(onMove);
      const s = settleZoom(scale.value);
      x.value = Math.min(0, Math.max(width - width * s, x.value));
      y.value = Math.min(0, Math.max(height - height * s, y.value));
      scale.value = s;
      scheduleOnRN(onZoom, s);
    });

  const track = useAnimatedStyle(() => ({ transform: [{ translateX: offset.value }] }));
  // Each page box is the page's own size, scaled up; inside it the page is drawn at the zoomed size and scaled back down
  // in the same render, so a new zoom never shows for a frame at the old scale.
  const rest = { transform: [{ translateX: width - width * zoom }, { translateY: 0 }, { scale: zoom }] };
  type Spot = { page: number; x: number; y: number; s: number };
  const placed = (at: number, own: Spot, left: Spot) => {
    'worklet';
    const spot = own.page === at ? own : left.page === at ? left : null;
    return spot ? { transform: [{ translateX: spot.x }, { translateY: spot.y }, { scale: spot.s }] } : rest;
  };
  const before = useAnimatedStyle(() => placed(page - 1, { page: panPage.value, x: x.value, y: y.value, s: scale.value }, leaving.value));
  const here = useAnimatedStyle(() => placed(page, { page: panPage.value, x: x.value, y: y.value, s: scale.value }, leaving.value));
  const after = useAnimatedStyle(() => placed(page + 1, { page: panPage.value, x: x.value, y: y.value, s: scale.value }, leaving.value));
  const shown = [page - 1, page, page + 1].filter(at => at >= 1 && at <= count);
  return (
    <GestureDetector gesture={Gesture.Simultaneous(pinch, Gesture.Race(pan, pull, move))}>
      <View style={{ width, height, overflow: 'hidden' }}>
        <Animated.View style={[{ position: 'absolute', left: 0, top: 0, width, height, direction: 'ltr' }, track]}>
          {shown.map(at => (
            <View key={at} style={{ position: 'absolute', top: 0, left: -(at - 1) * width, width, height, overflow: 'hidden' }}>
              <Animated.View style={[{ position: 'absolute', left: 0, top: 0, width, height, transformOrigin: 'left top' }, at < page ? before : at > page ? after : here]}>
                <View style={{ width: width * zoom, height: height * zoom, transformOrigin: 'left top', transform: [{ scale: 1 / zoom }], direction: 'rtl' }}>
                  {render(at, width * zoom, height * zoom)}
                </View>
              </Animated.View>
            </View>
          ))}
        </Animated.View>
      </View>
    </GestureDetector>
  );
}
