import { useLayoutEffect, useRef } from 'react';
import { sameDeps } from './sameDeps';

export function useBeforePaint(deps: readonly unknown[], run: () => void) {
  const latest = useRef(run);
  const seen = useRef<readonly unknown[] | null>(null);
  useLayoutEffect(() => { latest.current = run; });
  useLayoutEffect(() => {
    if (seen.current !== null && sameDeps(seen.current, deps)) return;
    seen.current = deps;
    latest.current();
  });
  useLayoutEffect(() => () => { seen.current = null; }, []);
}
