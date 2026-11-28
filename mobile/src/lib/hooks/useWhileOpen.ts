import { useEffect, useRef } from 'react';
import { useOnChange } from './useOnChange';
import { useOnLeave } from './useOnLeave';

export function useWhileOpen(start: () => (() => void) | void, again: readonly unknown[] = []) {
  const latest = useRef(start);
  const stop = useRef<(() => void) | void>(undefined);
  useEffect(() => { latest.current = start; });
  useOnChange(again, () => { stop.current?.(); stop.current = latest.current(); });
  useOnLeave(() => { stop.current?.(); stop.current = undefined; });
}
