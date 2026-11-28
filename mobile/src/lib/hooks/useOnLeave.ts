import { useEffect, useRef } from 'react';

export function useOnLeave(leave: () => void) {
  const latest = useRef(leave);
  useEffect(() => { latest.current = leave; });
  useEffect(() => () => latest.current(), []);
}
