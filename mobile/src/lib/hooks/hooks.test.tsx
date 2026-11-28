import { act, StrictMode, useEffect, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAdjustOn } from './useAdjustOn';
import { useAfter } from './useAfter';
import { useDebounced } from './useDebounced';
import { useDelayedFlag } from './useDelayedFlag';
import { useLater } from './useLater';
import { useLoaded } from './useLoaded';
import { useNow } from './useNow';
import { useOnChange } from './useOnChange';
import { SCROLL_QUIET_MS, useWebScrollEnd } from './useWebScrollEnd';

const platform = vi.hoisted(() => ({ OS: 'web' }));
vi.mock('react-native', () => ({ Platform: platform }));
const reported = vi.hoisted(() => [] as string[]);
vi.mock('@shared/errors', () => ({ reportError: (where: string) => { reported.push(where); } }));

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

describe('useAdjustOn', () => {
  it('sets state in the same render the key changes, so no frame shows the old state', () => {
    const committed: string[] = [];
    const useLinked = ({ link }: { link: string }) => {
      const [lit, setLit] = useState('none');
      useAdjustOn([link], () => setLit(link));
      useEffect(() => { committed.push(lit); });
      return lit;
    };
    const view = mount(useLinked, { link: 'a' });
    view.rerender({ link: 'b' });
    expect(committed).toEqual(['a', 'b']);
  });

  it('leaves state the person changed alone while the key holds', () => {
    let set: (value: string) => void = () => {};
    const view = mount(({ link }: { link: string }) => {
      const [lit, setLit] = useState('none');
      set = setLit;
      useAdjustOn([link], () => setLit(link));
      return lit;
    }, { link: 'a' });
    act(() => set('tapped'));
    view.rerender({ link: 'a' });
    expect(view.seen.current).toBe('tapped');
  });
});

describe('useOnChange', () => {
  it('runs once on the first draw and again only when a dependency changes', () => {
    const run = vi.fn();
    const view = mount(({ at }: { at: number }) => useOnChange([at], () => run(at)), { at: 1 });
    view.rerender({ at: 1 });
    view.rerender({ at: 2 });
    expect(run.mock.calls).toEqual([[1], [2]]);
  });

  it('calls the callback of the latest render, not a stale one', () => {
    const seen: string[] = [];
    const view = mount(({ at, label }: { at: number; label: string }) => useOnChange([at], () => seen.push(label)), { at: 1, label: 'first' });
    view.rerender({ at: 1, label: 'second' });
    view.rerender({ at: 2, label: 'third' });
    expect(seen).toEqual(['first', 'third']);
  });
});

describe('useOnChange under StrictMode', () => {
  it('runs again after React unmounts and remounts the effects, so a job started on mount is not lost', () => {
    const run = vi.fn();
    const Probe = () => { useOnChange([], run); return null; };
    const root = createRoot(document.createElement('div'));
    act(() => root.render(<StrictMode><Probe /></StrictMode>));
    expect(run).toHaveBeenCalledTimes(2);
    act(() => root.unmount());
  });
});

describe('useLater', () => {
  it('runs only the newest job when a second one is asked before the first', () => {
    const first = vi.fn();
    const second = vi.fn();
    const view = mount(() => useLater(), {});
    view.seen.current.after(300, first);
    view.seen.current.after(300, second);
    wait(300);
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('waits for a frame and then a turn before afterPaint runs', () => {
    const run = vi.fn();
    const view = mount(() => useLater(), {});
    view.seen.current.afterPaint(run);
    wait(1);
    expect(run).not.toHaveBeenCalled();
    wait(100);
    expect(run).toHaveBeenCalledTimes(1);
  });

  it('drops the waiting job on cancel', () => {
    const run = vi.fn();
    const view = mount(() => useLater(), {});
    view.seen.current.after(300, run);
    view.seen.current.cancel();
    wait(300);
    expect(run).not.toHaveBeenCalled();
  });

  it('keeps a job asked from inside a job, and still clears it on unmount', () => {
    const run = vi.fn();
    const view = mount(() => useLater(), {});
    const later = view.seen.current;
    later.nextFrame(() => later.nextFrame(run));
    wait(20);
    expect(run).not.toHaveBeenCalled();
    view.unmount();
    wait(100);
    expect(run).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('leaves no timer or frame behind after unmount', () => {
    const run = vi.fn();
    const view = mount(() => useLater(), {});
    view.seen.current.afterPaint(run);
    view.unmount();
    wait(100);
    expect(run).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe('useLoaded', () => {
  it('shows nothing for a key until that key has loaded, and never an older key\'s value', async () => {
    const waiting = new Map<string, (value: string) => void>();
    const load = (key: string) => new Promise<string>(resolve => waiting.set(key, resolve));
    const view = mount(({ id }: { id: string | null }) => useLoaded(id, load), { id: 'a' as string | null });
    expect(view.seen.current).toBeNull();
    view.rerender({ id: 'b' });
    await act(async () => { waiting.get('a')!('A'); });
    expect(view.seen.current).toBeNull();
    await act(async () => { waiting.get('b')!('B'); });
    expect(view.seen.current).toBe('B');
    view.rerender({ id: null });
    expect(view.seen.current).toBeNull();
  });

  it('shows nothing for a key turned off and on again until the new read arrives', async () => {
    const waiting: ((value: string) => void)[] = [];
    const load = () => new Promise<string>(resolve => waiting.push(resolve));
    const view = mount(({ id }: { id: string | null }) => useLoaded(id, load), { id: 'a' as string | null });
    await act(async () => { waiting[0]('old'); });
    view.rerender({ id: null });
    view.rerender({ id: 'a' });
    expect(view.seen.current).toBeNull();
    await act(async () => { waiting[1]('new'); });
    expect(view.seen.current).toBe('new');
  });

  it('reports a failed read with its key', async () => {
    reported.length = 0;
    const view = mount(({ id }: { id: string }) => useLoaded(id, () => Promise.reject(new Error('gone'))), { id: 'kashshaf' });
    await act(async () => {});
    expect(reported).toEqual(['load kashshaf']);
    view.unmount();
  });
});
