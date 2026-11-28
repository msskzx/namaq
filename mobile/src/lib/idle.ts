import { reportError } from '@shared/errors';

const idle = (next: () => void) => (typeof requestIdleCallback === 'function' ? requestIdleCallback(next, { timeout: 500 }) : setTimeout(next, 16));

export function runWhenIdle(steps: (() => unknown)[], after: number, where: string) {
  const step = () => {
    const work = steps.shift();
    if (!work) return;
    try { work(); } catch (error) { reportError(where, error); }
    idle(step);
  };
  setTimeout(() => idle(step), after);
}
