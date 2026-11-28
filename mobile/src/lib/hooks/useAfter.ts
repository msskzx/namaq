import { useEffect, useRef } from 'react';

export function useAfter(ms: number, run: () => void) {
  const latest = useRef(run);
  useEffect(() => { latest.current = run; });
  useEffect(() => {
    const timer = setTimeout(() => latest.current(), ms);
    return () => clearTimeout(timer);
  }, [ms]);
}
