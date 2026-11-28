import { useEffect, useMemo, useRef } from 'react';

export type Later = {
  after: (ms: number, run: () => void) => void;
  nextFrame: (run: () => void) => void;
  afterPaint: (run: () => void) => void;
  cancel: () => void;
};

export function useLater(): Later {
  const stop = useRef<() => void>(() => {});
  const later = useMemo((): Later => {
    const cancel = () => { stop.current(); stop.current = () => {}; };
    const after = (ms: number, run: () => void) => {
      cancel();
      const timer = setTimeout(() => { stop.current = () => {}; run(); }, ms);
      stop.current = () => clearTimeout(timer);
    };
    const nextFrame = (run: () => void) => {
      cancel();
      const frame = requestAnimationFrame(() => { stop.current = () => {}; run(); });
      stop.current = () => cancelAnimationFrame(frame);
    };
    const afterPaint = (run: () => void) => nextFrame(() => after(0, run));
    return { after, nextFrame, afterPaint, cancel };
  }, []);
  useEffect(() => later.cancel, [later]);
  return later;
}
