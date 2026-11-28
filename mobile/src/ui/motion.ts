import { useEffect } from 'react';
import { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';

export const HIDE = { duration: 200, easing: Easing.in(Easing.cubic) };
export const SHOW = { duration: 260, easing: Easing.out(Easing.cubic) };

export function useHidden(hidden: boolean): SharedValue<number> {
  const away = useSharedValue(hidden ? 1 : 0);
  useEffect(() => { away.value = withTiming(hidden ? 1 : 0, hidden ? HIDE : SHOW); }, [hidden, away]);
  return away;
}

export function useSlideAway(hidden: boolean, edge: 'top' | 'bottom', size: number) {
  const away = useHidden(hidden);
  const content = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(away.value, [0, 1], [0, edge === 'top' ? -size : size]) }],
    opacity: interpolate(away.value, [0, 0.7], [1, 0], 'clamp'),
  }));
  const frame = useAnimatedStyle(() => ({ height: interpolate(away.value, [0, 1], [size, 0]) }));
  return { content, frame };
}

export const hiddenProps = (hidden: boolean, shown: 'auto' | 'box-none' = 'auto') => ({
  pointerEvents: hidden ? 'none' as const : shown,
  accessibilityElementsHidden: hidden,
  importantForAccessibility: hidden ? 'no-hide-descendants' as const : 'auto' as const,
});
