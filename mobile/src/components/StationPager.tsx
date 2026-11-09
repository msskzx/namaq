import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';
import type { EventView } from '@shared/quran/prophets/story';
import StationCard from './StationCard';
import type { Palette } from '@/lib/theme';

const GAP = 12;
const PEEK = 20;
const SWIPE = 0.2;
const FLICK = 500;

export type StationPagerHandle = { step: (dir: 1 | -1) => void };

/**
 * The timeline's stations as a row of cards, first on the right as on the website.
 * The neighbours peek at the sides and follow the finger; dragging right brings the next station in.
 */
const StationPager = forwardRef<StationPagerHandle, {
  events: EventView[];
  phases: readonly string[];
  index: number;
  onIndex: (index: number) => void;
  marked?: number;
  isOpen: (event: number, segment: number) => boolean;
  onToggle: (event: number, segment: number) => void;
  palette: Palette;
}>(function StationPager({ events, phases, index, onIndex, marked, isOpen, onToggle, palette }, ref) {
  const [width, setWidth] = useState(0);
  const [heights, setHeights] = useState<Record<number, number>>({});
  const card = Math.max(0, width - 2 * PEEK);
  const step = card + GAP;
  const count = events.length;
  const offset = useSharedValue(0);
  const start = useSharedValue(0);

  // The station the row itself slid to; any other index (a jump from the index, a restored place, a new width) is set at once.
  const slid = useRef<{ index: number; step: number }>(undefined);
  useEffect(() => {
    if (step <= 0 || (slid.current?.index === index && slid.current.step === step)) return;
    offset.value = index * step;
    slid.current = { index, step };
  }, [index, step]); // eslint-disable-line react-hooks/exhaustive-deps

  const arrive = useCallback((next: number) => {
    slid.current = { index: next, step };
    onIndex(next);
  }, [onIndex, step]);

  const go = useCallback((target: number) => {
    const next = Math.max(0, Math.min(count - 1, target));
    offset.value = withTiming(next * step, { duration: 250 });
    if (next !== index) arrive(next);
  }, [count, step, index, arrive, offset]);

  useImperativeHandle(ref, () => ({ step: dir => go(index + dir) }), [go, index]);

  const pan = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .failOffsetY([-12, 12])
    .onBegin(() => { start.value = offset.value; })
    .onUpdate(e => {
      const raw = start.value + e.translationX;
      const max = (count - 1) * step;
      // Past either end the row gives a little, then stops.
      offset.value = raw < 0 ? raw / 3 : raw > max ? max + (raw - max) / 3 : raw;
    })
    .onEnd(e => {
      const from = Math.round(start.value / step);
      const far = Math.abs(e.translationX) > card * SWIPE || Math.abs(e.velocityX) > FLICK;
      const forward = e.translationX > 0;
      const target = far && (forward ? from + 1 < count : from > 0) ? from + (forward ? 1 : -1) : from;
      offset.value = withTiming(target * step, { duration: 250 });
      if (target !== from) scheduleOnRN(arrive, target);
    });

  const row = useAnimatedStyle(() => ({ transform: [{ translateX: offset.value }] }));
  const shown = [index - 1, index, index + 1].filter(at => at >= 0 && at < count);

  return (
    <GestureDetector gesture={pan}>
      <View onLayout={e => setWidth(e.nativeEvent.layout.width)} style={{ overflow: 'hidden', height: heights[index] ?? 320 }}>
        {width > 0 && (
          <Animated.View style={[{ position: 'absolute', left: 0, top: 0, width, direction: 'ltr' }, row]}>
            {shown.map(at => (
              <View key={events[at].n} accessibilityElementsHidden={at !== index} importantForAccessibility={at === index ? 'auto' : 'no-hide-descendants'}
                onLayout={e => { const h = e.nativeEvent.layout.height; setHeights(old => old[at] === h ? old : { ...old, [at]: h }); }}
                style={{ position: 'absolute', top: 0, left: PEEK - at * step, width: card, direction: 'rtl', opacity: at === index ? 1 : 0.55 }}>
                <StationCard event={events[at]} phase={phases[events[at].phase]} palette={palette} marked={marked === at}
                  open={segment => isOpen(at, segment)} onToggle={segment => onToggle(at, segment)} />
              </View>
            ))}
          </Animated.View>
        )}
      </View>
    </GestureDetector>
  );
});

export default StationPager;
