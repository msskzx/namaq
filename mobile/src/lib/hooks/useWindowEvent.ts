import { useEffect, useRef } from 'react';

export function useWindowEvent<K extends keyof WindowEventMap>(name: K, listen: (event: WindowEventMap[K]) => void) {
  const latest = useRef(listen);
  useEffect(() => { latest.current = listen; });
  useEffect(() => {
    const call = (event: WindowEventMap[K]) => latest.current(event);
    window.addEventListener(name, call);
    return () => window.removeEventListener(name, call);
  }, [name]);
}
