import { useState } from 'react';
import { sameDeps } from './sameDeps';

export function useAdjustOn(deps: readonly unknown[], adjust: () => void) {
  const [seen, setSeen] = useState<readonly unknown[] | null>(null);
  if (seen === null || !sameDeps(seen, deps)) {
    setSeen(deps);
    adjust();
  }
}
