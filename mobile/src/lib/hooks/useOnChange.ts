import { useEffect, useRef } from 'react';
import { sameDeps } from './sameDeps';

export function useOnChange(deps: readonly unknown[], run: () => void) {
  const latest = useRef(run);
  const seen = useRef<readonly unknown[] | null>(null);
  useEffect(() => { latest.current = run; });
  useEffect(() => {
    if (seen.current !== null && sameDeps(seen.current, deps)) return;
    seen.current = deps;
    latest.current();
  });
  useEffect(() => () => { seen.current = null; }, []);
}
