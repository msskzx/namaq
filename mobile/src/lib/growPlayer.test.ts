import { afterEach, describe, expect, it, vi } from 'vitest';
import { answer, growthState, pause, play, setPrefs, setTarget } from './growPlayer';
import type { Beat } from './growth';

const beats = (ask: boolean): Beat[] => [
  { step: 0, key: '1:1', ms: 100, reveal: ['n-1'], now: ['n-1'] },
  ...(ask ? [{ step: 0, key: '1:1', ms: 0, reveal: [], now: [], ask: 'n0' }] : []),
  { step: 0, key: '1:1', ms: 100, reveal: ['n0'], now: ['n0'] },
  { step: 1, key: '1:2', ms: 100, reveal: ['n1'], now: ['n1'] },
];

describe('the growth player', () => {
  afterEach(() => { setTarget(null); vi.useRealTimers(); });

  it('hides the tree, then reveals it beat by beat, and pauses without losing its place', async () => {
    vi.useFakeTimers();
    setPrefs({ mode: 'watch', speed: 1 });
    setTarget({ watch: beats(false), ask: beats(true) });
    const done = play();
    expect(growthState().hidden).toEqual(new Set(['n0', 'n1']));
    await vi.advanceTimersByTimeAsync(150);
    expect(growthState().hidden.has('n0')).toBe(false);
    pause(true);
    await vi.advanceTimersByTimeAsync(1000);
    expect(growthState().hidden.has('n1')).toBe(true);
    pause(false);
    await vi.advanceTimersByTimeAsync(300);
    await done;
    expect(growthState().status).toBe('done');
    expect(growthState().hidden.size).toBe(0);
  });

  it('waits on the asked box with no timer until it is tapped', async () => {
    vi.useFakeTimers();
    setPrefs({ mode: 'ask', timer: 0 });
    setTarget({ watch: beats(false), ask: beats(true) });
    const done = play();
    await vi.advanceTimersByTimeAsync(5000);
    expect(growthState().ask?.id).toBe('n0');
    expect(growthState().hidden.has('n0')).toBe(true);
    answer();
    await vi.advanceTimersByTimeAsync(500);
    await done;
    expect(growthState().status).toBe('done');
  });
});
