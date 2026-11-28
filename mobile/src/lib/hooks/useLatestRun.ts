import { useCallback, useRef } from 'react';
import { useOnLeave } from './useOnLeave';

export function useLatestRun() {
  const run = useRef(0);
  useOnLeave(() => { run.current++; });
  return useCallback(() => {
    const mine = ++run.current;
    return () => run.current === mine;
  }, []);
}
