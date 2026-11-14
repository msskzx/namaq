import { useCallback, useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { landingPage, MAX_ZOOM, settleZoom } from '@/lib/pageZoom';

const PULL = 70;
const PULL_FLICK = 600;
const TURN = 220;

type Props = {
  /** Current page, from 1. */
  page: number;
  count: number;
  width: number;
  /** The row's height: the screen's, or the current page's when its text is bigger and it runs longer. */
  height: number;
  /** Called when a swipe lands on another page. */
  onPage: (page: number) => void;
  /** Told when a finger starts moving the pages, so the lifted finger is not read as a tap. */
  onMove: () => void;
  render: (page: number) => ReactNode;
  /** A downward swipe on the page: the reader's main action (the index and search). Off while the page scrolls. */
  onPull?: () => void;
  /** The text size: 1 is the printed page. */
  zoom: number;
  /** A pinch's new text size, and where the fingers were (from the row's top), so the reader keeps those words in sight. */
  onZoom: (zoom: number, focalY: number) => void;
  /** How far the reader scrolled down the current page: a neighbour sliding in shows its top there. */
  scrollTop?: number;
};

/**
 * The mushaf as a row of pages, the next page on the left as in a printed mushaf: a finger moving right turns forward.
 * The neighbour follows the finger; the current page and both neighbours stay mounted.
 * A pinch changes the text size. While the fingers are down the page is only stretched as a preview; when they lift
 * the page is set again at the new size, sharp.
 */
export default function ReaderPager({ page, count, width, height, onPage, onMove, render, onPull, zoom, onZoom, scrollTop = 0 }: Props) {
  const offset = useSharedValue((page - 1) * width);
  const from = useSharedValue(0);
  const settled = useRef(page);
  const pinching = useSharedValue(false);
  /** The pinch preview: how much bigger than the drawn size, around the point between the fingers. */
  const stretch = useSharedValue(1);
  const focal = useSharedValue({ x: 0, y: 0 });

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

  // The page set at the new size replaces the preview.
  useLayoutEffect(() => { stretch.value = 1; }, [zoom, stretch]);

  const arrive = useCallback((next: number) => {
    settled.current = next;
    onPage(next);
  }, [onPage]);

  const last = (count - 1) * width;
  const pan = Gesture.Pan()
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

  const pinch = Gesture.Pinch()
    .onStart(event => {
      pinching.value = true;
      focal.value = { x: event.focalX, y: event.focalY };
      scheduleOnRN(onMove);
    })
    .onUpdate(event => {
      stretch.value = Math.min(MAX_ZOOM, Math.max(0.9, zoom * event.scale)) / zoom;
    })
    .onFinalize(() => {
      pinching.value = false;
    })
    .onEnd(() => {
      scheduleOnRN(onMove);
      const next = settleZoom(zoom * stretch.value);
      if (next === zoom) stretch.value = withTiming(1, { duration: 150 });
      else scheduleOnRN(onZoom, next, focal.value.y);
    });

  const track = useAnimatedStyle(() => ({ transform: [{ translateX: offset.value }] }));
  const preview = useAnimatedStyle(() => {
    const k = stretch.value;
    return { transform: [{ translateX: focal.value.x * (1 - k) }, { translateY: focal.value.y * (1 - k) }, { scale: k }] };
  });
  const shown = [page - 1, page, page + 1].filter(at => at >= 1 && at <= count);
  return (
    <GestureDetector gesture={Gesture.Simultaneous(pinch, Gesture.Race(pan, pull))}>
      <View style={{ width, height, overflow: 'hidden' }}>
        <Animated.View style={[{ position: 'absolute', left: 0, top: 0, width, height, direction: 'ltr' }, track]}>
          {shown.map(at => (
            // A neighbour shows its top where the reader is on the current page, so it slides in from its start.
            <View key={at} style={{ position: 'absolute', top: at === page ? 0 : scrollTop, left: -(at - 1) * width, width, height: at === page ? height : height - scrollTop, overflow: 'hidden' }}>
              <Animated.View style={[{ width, transformOrigin: 'left top', direction: 'rtl' }, at === page ? preview : null]}>
                {render(at)}
              </Animated.View>
            </View>
          ))}
        </Animated.View>
      </View>
    </GestureDetector>
  );
}
