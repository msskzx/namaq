import { useCallback, useEffect, useRef, useState } from 'react';
import { useWindowDimensions, type LayoutChangeEvent } from 'react-native';

export const FIT_SHARE = 0.8;

export type OnFit = (overflow: number) => boolean;

export function useFitReport(onFit?: OnFit) {
  const sizes = useRef<{ frame: number; content: number; waiting: boolean; timer?: ReturnType<typeof setTimeout> }>({ frame: 0, content: 0, waiting: false });
  const report = () => {
    const { frame, content, waiting } = sizes.current;
    if (!onFit || !frame || !content || waiting) return;
    const overflow = Math.round(content - frame);
    if (Math.abs(overflow) > 1 && onFit(overflow)) {
      sizes.current.waiting = true;
      clearTimeout(sizes.current.timer);
      sizes.current.timer = setTimeout(() => { sizes.current.waiting = false; report(); }, 400);
    }
  };
  useEffect(() => () => clearTimeout(sizes.current.timer), []);
  if (!onFit) return {};
  return {
    onLayout: (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      if (height !== sizes.current.frame) sizes.current.waiting = false;
      sizes.current.frame = height;
      report();
    },
    onContentSizeChange: (_width: number, height: number) => { sizes.current.content = height; report(); },
  };
}

export function useFitHeight(start: number) {
  const { height: screen } = useWindowDimensions();
  const most = Math.round(screen * FIT_SHARE);
  const [fitted, setFitted] = useState<number | null>(null);
  const height = Math.min(fitted ?? start, most);
  const shown = useRef(height);
  shown.current = height;
  const onFit = useCallback((overflow: number | null) => {
    if (overflow === null) { setFitted(null); return false; }
    const wanted = Math.max(1, shown.current + overflow);
    setFitted(wanted);
    const next = Math.min(most, wanted);
    if (next === shown.current) return false;
    shown.current = next;
    return true;
  }, [most]);
  return [height, onFit] as const;
}
