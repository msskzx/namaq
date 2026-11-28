import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAfter } from './useAfter';
import { useDebounced } from './useDebounced';
import { useDelayedFlag } from './useDelayedFlag';
import { useNow } from './useNow';
import { SCROLL_QUIET_MS, useWebScrollEnd } from './useWebScrollEnd';

const platform = vi.hoisted(() => ({ OS: 'web' }));
vi.mock('react-native', () => ({ Platform: platform }));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function mount<P, R>(hook: (props: P) => R, props: P) {
  const seen: { current: R } = { current: undefined as R };
  const Probe = (input: P) => { seen.current = hook(input); return null; };
  const root: Root = createRoot(document.createElement('div'));
  act(() => root.render(<Probe {...(props as P & object)} />));
  return {
    seen,
    rerender: (next: P) => act(() => root.render(<Probe {...(next as P & object)} />)),
    unmount: () => act(() => root.unmount()),
  };
}

const wait = (ms: number) => act(() => { vi.advanceTimersByTime(ms); });

beforeEach(() => { vi.useFakeTimers(); platform.OS = 'web'; });
afterEach(() => { vi.useRealTimers(); });

describe('useDebounced', () => {
  it('keeps the old value until the new one has held still', () => {
    const view = mount(({ value }: { value: string }) => useDebounced(value, 150), { value: 'a' });
    view.rerender({ value: 'ab' });
    wait(100);
    view.rerender({ value: 'abc' });
    wait(100);
    expect(view.seen.current).toBe('a');
    wait(50);
    expect(view.seen.current).toBe('abc');
  });

  it('leaves no timer behind after unmount', () => {
    const view = mount(({ value }: { value: string }) => useDebounced(value, 150), { value: 'a' });
    view.rerender({ value: 'ab' });
    view.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe('useDelayedFlag', () => {
  type Props = { on: boolean; key: string };
  const useFlag = ({ on, key }: Props) => useDelayedFlag(on, 800, key);

  it('stays off until the state has lasted the whole delay', () => {
    const view = mount(useFlag, { on: true, key: 'a' });
    expect(view.seen.current).toBe(false);
    wait(799);
    expect(view.seen.current).toBe(false);
    wait(1);
    expect(view.seen.current).toBe(true);
  });

  it('starts the wait again when the state stops and starts for the same key', () => {
    const view = mount(useFlag, { on: true, key: 'a' });
    wait(800);
    view.rerender({ on: false, key: 'a' });
    view.rerender({ on: true, key: 'a' });
    expect(view.seen.current).toBe(false);
    wait(800);
    expect(view.seen.current).toBe(true);
  });

  it('starts the wait again for a new key', () => {
    const view = mount(useFlag, { on: true, key: 'a' });
    wait(800);
    view.rerender({ on: true, key: 'b' });
    expect(view.seen.current).toBe(false);
  });
});

describe('useNow', () => {
  it('moves forward on each tick and stops after unmount', () => {
    const view = mount(() => useNow(1000), {});
    const first = view.seen.current;
    wait(1000);
    expect(view.seen.current).toBeGreaterThan(first);
    view.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe('useAfter', () => {
  it('runs the latest callback once, after the delay', () => {
    const early = vi.fn();
    const late = vi.fn();
    const view = mount(({ run }: { run: () => void }) => useAfter(400, run), { run: early });
    view.rerender({ run: late });
    wait(400);
    expect(early).not.toHaveBeenCalled();
    expect(late).toHaveBeenCalledTimes(1);
  });

  it('does not run after unmount', () => {
    const run = vi.fn();
    const view = mount(() => useAfter(400, run), {});
    view.unmount();
    wait(400);
    expect(run).not.toHaveBeenCalled();
  });
});

describe('useWebScrollEnd', () => {
  const scroll = (x: number) => ({ nativeEvent: { contentOffset: { x, y: 0 } } }) as never;

  it('settles once on the last position after scrolling stops', () => {
    const settle = vi.fn();
    const view = mount(() => useWebScrollEnd(settle), {});
    view.seen.current(scroll(10));
    view.seen.current(scroll(20));
    wait(SCROLL_QUIET_MS);
    expect(settle).toHaveBeenCalledTimes(1);
    expect(settle.mock.calls[0][0].nativeEvent.contentOffset.x).toBe(20);
  });

  it('does not settle after unmount', () => {
    const settle = vi.fn();
    const view = mount(() => useWebScrollEnd(settle), {});
    view.seen.current(scroll(10));
    view.unmount();
    wait(SCROLL_QUIET_MS);
    expect(settle).not.toHaveBeenCalled();
  });

  it('leaves native scrolling to onMomentumScrollEnd', () => {
    platform.OS = 'ios';
    const settle = vi.fn();
    const view = mount(() => useWebScrollEnd(settle), {});
    view.seen.current(scroll(10));
    wait(SCROLL_QUIET_MS);
    expect(settle).not.toHaveBeenCalled();
  });
});
