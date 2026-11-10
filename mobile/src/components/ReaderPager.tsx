import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const SWIPE = 0.2;
const FLICK = 500;

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
  render: (page: number) => ReactNode;
};

/**
 * The mushaf as a row of pages, the next page on the left as in a printed mushaf: a finger moving right turns forward.
 * The neighbour follows the finger; the current page and both neighbours stay mounted.
 */
export default function ReaderPager({ page, count, width, height, onPage, onMove, render }: Props) {
  const offset = useSharedValue((page - 1) * width);
  const from = useSharedValue(0);
  const settled = useRef(page);

  // A page chosen from outside (index, recite, restore) slides there; one reached by a swipe is already there.
  const laidOut = useRef(width);
  useEffect(() => {
    if (!width) return;
    const target = (page - 1) * width;
    if (laidOut.current !== width) {
      laidOut.current = width;
      offset.value = target;
    } else if (settled.current !== page) {
      offset.value = Math.abs(settled.current - page) === 1 ? withTiming(target, { duration: 220 }) : target;
    }
    settled.current = page;
  }, [page, width, offset]);

  const arrive = useCallback((next: number) => {
    settled.current = next;
    onPage(next);
  }, [onPage]);

  const last = (count - 1) * width;
  const pan = Gesture.Pan()
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
    .onEnd(event => {
      scheduleOnRN(onMove);
      const at = Math.round(from.value / width);
      // A flick turns the way it was flicked; a slow drag turns the way it went far enough.
      const flick = Math.abs(event.velocityX) > FLICK;
      const far = flick || Math.abs(event.translationX) > width * SWIPE;
      const forward = flick ? event.velocityX > 0 : event.translationX > 0;
      const target = far && (forward ? at + 1 < count : at > 0) ? at + (forward ? 1 : -1) : at;
      offset.value = withTiming(target * width, { duration: 220 });
      if (target !== at) scheduleOnRN(arrive, target + 1);
    });

  const track = useAnimatedStyle(() => ({ transform: [{ translateX: offset.value }] }));
  const shown = [page - 1, page, page + 1].filter(at => at >= 1 && at <= count);
  return (
    <GestureDetector gesture={pan}>
      <View style={{ width, height, overflow: 'hidden' }}>
        <Animated.View style={[{ position: 'absolute', left: 0, top: 0, width, height, direction: 'ltr' }, track]}>
          {shown.map(at => (
            <View key={at} style={{ position: 'absolute', top: 0, left: -(at - 1) * width, width, height, direction: 'rtl' }}>
              {render(at)}
            </View>
          ))}
        </Animated.View>
      </View>
    </GestureDetector>
  );
}
