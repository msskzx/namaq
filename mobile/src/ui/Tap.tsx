import { useRef, useState } from 'react';
import { Pressable, type GestureResponderEvent } from 'react-native';
import { slopFor, type Slop } from './tapSize';

const SLOP = 10;

function point(event: GestureResponderEvent): { x: number; y: number } | null {
  const { pageX, pageY } = event.nativeEvent ?? {};
  return Number.isFinite(pageX) && Number.isFinite(pageY) && (pageX !== 0 || pageY !== 0) ? { x: pageX, y: pageY } : null;
}

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
