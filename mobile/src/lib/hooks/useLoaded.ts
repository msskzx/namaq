import { useEffect, useState } from 'react';
import { reportError } from '@shared/errors';

export function useLoaded<T>(key: string | null, load: (key: string) => Promise<T>): T | null {
  const [loaded, setLoaded] = useState<{ key: string; value: T } | null>(null);
  useEffect(() => {
    if (key === null) return;
    let live = true;
    load(key).then(value => { if (live) setLoaded({ key, value }); }, error => reportError(`load ${key}`, error));
    return () => { live = false; };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return loaded && key !== null && loaded.key === key ? loaded.value : null;
}
