import { useEffect, useState } from 'react';

export function useDelayedFlag(on: boolean, ms: number, key: unknown): boolean {
  const [shown, setShown] = useState({ on, key });
  const [ready, setReady] = useState(false);
  if (shown.on !== on || !Object.is(shown.key, key)) {
    setShown({ on, key });
    setReady(false);
  }
  useEffect(() => {
    if (!on) return;
    const timer = setTimeout(() => setReady(true), ms);
    return () => clearTimeout(timer);
  }, [on, key, ms]);
  return on && ready;
}
