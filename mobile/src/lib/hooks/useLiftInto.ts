import { useId, useLayoutEffect } from 'react';

export type LiftSlot<T> = { set: (id: string, value: T | null) => void };

export function useLiftInto<T>(slot: LiftSlot<T> | null, value: T) {
  const id = useId();
  useLayoutEffect(() => { slot?.set(id, value); });
  useLayoutEffect(() => () => slot?.set(id, null), [slot, id]);
}
