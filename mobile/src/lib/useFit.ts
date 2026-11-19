import { useCallback, useEffect, useRef, useState } from 'react';
import { useWindowDimensions, type LayoutChangeEvent } from 'react-native';

/** How much of the screen's height a feed card may grow to before what is in it scrolls inside (owner, 2026-11-18). */
export const FIT_SHARE = 0.8;

/** Takes how much taller a card's content is than its frame; true when the card changes height for it. */
export type OnFit = (overflow: number) => boolean;

/**
 * What a scrolling part of a card reports to the card holding it: how much taller its content is than its frame (less than
 * zero when there is room to spare). Spread the result on the ScrollView. With no `onFit` it does nothing. After a report
 * that resizes the card it waits for the new frame before reporting again, so one overflow is never counted twice.
 */
export function useFitReport(onFit?: OnFit) {
  const sizes = useRef<{ frame: number; content: number; waiting: boolean; timer?: ReturnType<typeof setTimeout> }>({ frame: 0, content: 0, waiting: false });
  const report = () => {
    const { frame, content, waiting } = sizes.current;
    if (!onFit || !frame || !content || waiting) return;
    const overflow = Math.round(content - frame);
    if (Math.abs(overflow) > 1 && onFit(overflow)) {
      sizes.current.waiting = true;
      // A frame that never reports its new height (seen on the phone: a card left with empty room under its last ayah, owner
      // 2026-11-19) would hold the wait for good, and later sizes would be dropped: measure again after a moment.
      clearTimeout(sizes.current.timer);
      sizes.current.timer = setTimeout(() => { sizes.current.waiting = false; report(); }, 400);
    }
  };
  useEffect(() => () => clearTimeout(sizes.current.timer), []);
  if (!onFit) return {};
  return {
    // Only a new frame height ends the wait: a layout that moves or widens the frame still measures the old height.
    onLayout: (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      if (height !== sizes.current.frame) sizes.current.waiting = false;
      sizes.current.frame = height;
      report();
    },
    onContentSizeChange: (_width: number, height: number) => { sizes.current.content = height; report(); },
  };
}

/**
 * A feed card's height that follows its content (owner, 2026-11-18: a card with a lot in it is built bigger, not scrolled
 * inside): `start` until the scrolling part reports, then grown or shrunk by what it reports, never past FIT_SHARE of the
 * screen. `onFit(null)` goes back to `start` (the card's view changed to one that does not report).
 */
export function useFitHeight(start: number) {
  const { height: screen } = useWindowDimensions();
  const most = Math.round(screen * FIT_SHARE);
  const [fitted, setFitted] = useState<number | null>(null);
  const height = Math.min(fitted ?? start, most);
  const shown = useRef(height);
  shown.current = height;
  const onFit = useCallback((overflow: number | null) => {
    if (overflow === null) { setFitted(null); return false; }
    // The height the content asks for is kept whole, so a taller screen later shows more of it; what is drawn stops at `most`.
    const wanted = Math.max(1, shown.current + overflow);
    setFitted(wanted);
    const next = Math.min(most, wanted);
    if (next === shown.current) return false;
    shown.current = next;
    return true;
  }, [most]);
  return [height, onFit] as const;
}
