import { useState } from 'react';
import { reportError } from '@shared/errors';
import { alertsAllowed } from './adhan';
import { useOnChange } from './hooks/useOnChange';
import { useLatestRun } from './hooks/useLatestRun';

export function useAlertsBlocked(asking: boolean, again: readonly unknown[]) {
  const [blocked, setBlocked] = useState(false);
  const begin = useLatestRun();
  useOnChange([asking, ...again], () => {
    const live = begin();
    if (!asking) { setBlocked(false); return; }
    alertsAllowed().then(ok => { if (live()) setBlocked(!ok); }, error => reportError('alerts: read permission', error));
  });
  return [blocked, setBlocked] as const;
}
