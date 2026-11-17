import { useRef } from 'react';
import { Pressable, type GestureResponderEvent } from 'react-native';

/** How far (px) the finger may move between down and up and still be a tap: beyond it, it was a scroll or a swipe. */
const SLOP = 10;

/**
 * The one press: every button and every tappable card goes through it (owner, 2026-11-17: scrolling over the continue
 * reading card opened the reader; a scroll must never count as a tap, as on YouTube). A finger that moved more than a
 * few pixels between touching and lifting was scrolling or swiping, so neither the press nor the long press fires. The
 * gesture handler's scroll view (home) does not always cancel a press the way the plain one does, so this does it here.
 * Screens still use the pieces (Button, IconButton, the cards); a screen that draws its own Tap counts as drawing a
 * control (shared/sharedFirst.test.ts).
 */
export function Tap({ onPressIn, onPress, onLongPress, ...rest }: React.ComponentProps<typeof Pressable>) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const still = (event: GestureResponderEvent) => {
    const from = start.current;
    if (!from) return true;
    return Math.hypot(event.nativeEvent.pageX - from.x, event.nativeEvent.pageY - from.y) <= SLOP;
  };
  return (
    <Pressable {...rest}
      onPressIn={event => { start.current = { x: event.nativeEvent.pageX, y: event.nativeEvent.pageY }; onPressIn?.(event); }}
      onPress={onPress ? event => { if (still(event)) onPress(event); } : undefined}
      onLongPress={onLongPress ? event => { if (still(event)) onLongPress(event); } : undefined} />
  );
}
