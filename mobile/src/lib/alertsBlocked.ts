import { useRef, useState } from 'react';
import { reportError } from '@shared/errors';
import { alertsAllowed } from './adhan';
import { useOnChange } from './hooks/useOnChange';
import { useOnLeave } from './hooks/useOnLeave';

export function useAlertsBlocked(asking: boolean, again: readonly unknown[]) {
  const [blocked, setBlocked] = useState(false);
  const run = useRef(0);
  useOnLeave(() => { run.current++; });
  useOnChange([asking, ...again], () => {
    const mine = ++run.current;
    if (!asking) { setBlocked(false); return; }
    alertsAllowed().then(ok => { if (run.current === mine) setBlocked(!ok); }, error => reportError('alerts: read permission', error));
  });
  return [blocked, setBlocked] as const;
}
