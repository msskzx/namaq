import { useRef, useState } from 'react';
import { Pressable, type GestureResponderEvent } from 'react-native';
import { slopFor, type Slop } from './tapSize';

/** How far (px) the finger may move between down and up and still be a tap: beyond it, it was a scroll or a swipe. */
const SLOP = 10;

/** Where a touch is on the screen, or null for a press with no point (a screen reader, a keyboard, web's Enter). */
function point(event: GestureResponderEvent): { x: number; y: number } | null {
  const { pageX, pageY } = event.nativeEvent ?? {};
  return Number.isFinite(pageX) && Number.isFinite(pageY) && (pageX !== 0 || pageY !== 0) ? { x: pageX, y: pageY } : null;
}

/**
 * The one press: every button and every tappable card goes through it (owner, 2026-11-17: scrolling over the continue
 * reading card opened the reader; a scroll must never count as a tap, as on YouTube). A finger that moved more than a
 * few pixels between touching and lifting was scrolling or swiping, so the press does not fire. Home's scroll view (the
 * gesture handler's, so a pinch on a tree wins) never takes the touch back from a press, so this check does it here.
 * A long press needs none: React Native already cancels it once the finger moves. A press with no point always fires.
 * Screens still use the pieces (Button, IconButton, the cards); a screen that draws its own Tap counts as drawing a
 * control (shared/sharedFirst.test.ts).
 *
 * Every press reaches at least 44 × 44 points (owner, 2026-11-19, ui/tapSize.ts): once drawn, its hit slop widens on its
 * own around a smaller box, so nothing tappable is only as big as its icon.
 */
export function Tap({ onPressIn, onPress, onLayout, hitSlop, ...rest }: React.ComponentProps<typeof Pressable>) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  return (
    <Pressable {...rest}
      hitSlop={slopFor(size, hitSlop as number | Partial<Slop> | null | undefined)}
      onLayout={event => {
        const { width, height } = event.nativeEvent.layout;
        setSize(prev => (prev && Math.abs(prev.width - width) < 1 && Math.abs(prev.height - height) < 1 ? prev : { width, height }));
        onLayout?.(event);
      }}
      onPressIn={event => { start.current = point(event); onPressIn?.(event); }}
      onPress={onPress ? event => {
        const from = start.current, to = point(event);
        start.current = null;
        if (!from || !to || Math.hypot(to.x - from.x, to.y - from.y) <= SLOP) onPress(event);
      } : undefined} />
  );
}
