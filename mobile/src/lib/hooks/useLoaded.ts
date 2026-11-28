import { useEffect, useState } from 'react';
import { reportError } from '@shared/errors';

type Loaded<T> = { load: number; value: T };

export function useLoaded<T>(key: string | null, load: (key: string) => Promise<T>): T | null {
  const [asked, setAsked] = useState({ key, load: 0 });
  const [loaded, setLoaded] = useState<Loaded<T> | null>(null);
  if (asked.key !== key) {
    setAsked({ key, load: asked.load + 1 });
    setLoaded(null);
  }
  useEffect(() => {
    if (asked.key === null) return;
    let live = true;
    load(asked.key).then(value => { if (live) setLoaded({ load: asked.load, value }); }, error => reportError(`load ${asked.key}`, error));
    return () => { live = false; };
  }, [asked]); // eslint-disable-line react-hooks/exhaustive-deps
  return loaded && loaded.load === asked.load && asked.key === key ? loaded.value : null;
}
