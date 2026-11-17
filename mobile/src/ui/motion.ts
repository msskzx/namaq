import { useEffect } from 'react';
import { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';

/**
 * The one way a bar hides and comes back (owner, 2026-11-17: the same style and animation everywhere): the top bar, the page
 * progress and the bottom tab bar while a page scrolls, and the mushaf's bars while reading. A bar slides off its own edge
 * and fades; it comes back the same way. Hiding is a little quicker than coming back, so the page clears fast and the bar
 * settles in gently.
 */
export const HIDE = { duration: 200, easing: Easing.in(Easing.cubic) };
export const SHOW = { duration: 260, easing: Easing.out(Easing.cubic) };

/** 0 shown, 1 hidden, moving with HIDE and SHOW. */
export function useHidden(hidden: boolean): SharedValue<number> {
  const away = useSharedValue(hidden ? 1 : 0);
  useEffect(() => { away.value = withTiming(hidden ? 1 : 0, hidden ? HIDE : SHOW); }, [hidden, away]);
  return away;
}

/**
 * A bar's slide and fade off its edge. `size` is how far it travels (its height). `content` goes on the bar itself; a bar in
 * the page's flow also puts `frame` on a box around it (overflow hidden), which gives the room back as the bar goes, so the
 * page follows it up instead of jumping once it is gone.
 */
export function useSlideAway(hidden: boolean, edge: 'top' | 'bottom', size: number) {
  const away = useHidden(hidden);
  const content = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(away.value, [0, 1], [0, edge === 'top' ? -size : size]) }],
    opacity: interpolate(away.value, [0, 0.7], [1, 0], 'clamp'),
  }));
  const frame = useAnimatedStyle(() => ({ height: interpolate(away.value, [0, 1], [size, 0]) }));
  return { content, frame };
}

/** A hidden bar is out of reach for fingers and screen readers alike; `shown` is the pointerEvents it has when shown. */
export const hiddenProps = (hidden: boolean, shown: 'auto' | 'box-none' = 'auto') => ({
  pointerEvents: hidden ? 'none' as const : shown,
  accessibilityElementsHidden: hidden,
  importantForAccessibility: hidden ? 'no-hide-descendants' as const : 'auto' as const,
});
