import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import TreeIntro, { SEEN } from './TreeIntro';

const opened = vi.fn();
let reduced = false;

const lit = vi.fn();
const PathToggle = () => <button aria-pressed="false" onClick={event => { lit(); event.currentTarget.setAttribute('aria-pressed', String(event.currentTarget.getAttribute('aria-pressed') !== 'true')); }}>path</button>;

function Tree() {
  const root = useRef<HTMLDivElement>(null);
  return <div ref={root}>
    <div data-tree-content>
      <div data-node="n-1" data-keys="1:1 1:2"><button data-context-open onClick={opened}>open</button></div>
      <span data-line />
      <ul>
        <li><div data-node="n0" data-keys="1:1"><PathToggle /><span className="font-quran">جنات</span></div></li>
        <li><div data-node="n1" data-keys="1:2"><PathToggle /><span className="font-quran">عيون</span></div></li>
      </ul>
    </div>
    <TreeIntro target={root} ar />
  </div>;
}

const leaf = () => document.querySelector<HTMLElement>('[data-node="n0"] .font-quran')!;
const typed = () => document.querySelector('[data-node="n0"]')!.querySelectorAll('.font-quran')[1]?.textContent;
const skip = () => screen.queryByRole('button', { name: 'تخطّ' });
const advance = (ms: number) => act(async () => { await vi.advanceTimersByTimeAsync(ms); });

beforeEach(() => {
  vi.useFakeTimers();
  reduced = false;
  localStorage.clear();
  window.history.replaceState(null, '', '/');
  opened.mockClear();
  lit.mockClear();
  Element.prototype.animate = vi.fn(() => ({ cancel: vi.fn(), finished: Promise.resolve() }) as unknown as Animation);
  window.matchMedia = vi.fn(() => ({ matches: reduced }) as MediaQueryList);
});
afterEach(() => { cleanup(); vi.useRealTimers(); });

it('plays once on a first visit: draws every path, then lights each one, opens the root, retypes a leaf, then remembers', async () => {
  render(<Tree />);
  expect(skip()).toBeTruthy();
  const branch = (node: string) => document.querySelector<HTMLElement>(`[data-node="${node}"]`)!.closest('li')!.style.opacity;
  await advance(100);
  expect([branch('n0'), branch('n1')]).toEqual(['', '0']);
  expect(lit).not.toHaveBeenCalled();
  await advance(500);
  expect([branch('n0'), branch('n1')]).toEqual(['', '']);
  expect(lit).toHaveBeenCalledOnce();
  expect(opened).not.toHaveBeenCalled();
  await advance(2300);
  expect(lit).toHaveBeenCalledTimes(4);
  expect(opened).toHaveBeenCalledOnce();
  await advance(4400);
  expect(leaf().style.visibility).toBe('hidden');
  await advance(500);
  expect(typed()?.length).toBeGreaterThan(0);
  expect(typed()?.length).toBeLessThan(5);
  await advance(4000);
  expect(skip()).toBeNull();
  expect(leaf().style.visibility).toBe('');
  expect(typed()).toBeUndefined();
  expect(localStorage.getItem(SEEN)).toBe('1');
});

it('skip restores the tree mid-play and stops the remaining scenes', async () => {
  render(<Tree />);
  await advance(7000);
  expect(leaf().style.visibility).toBe('hidden');
  fireEvent.click(skip()!);
  expect(skip()).toBeNull();
  expect(leaf().style.visibility).toBe('');
  expect(typed()).toBeUndefined();
  expect(localStorage.getItem(SEEN)).toBe('1');
  await advance(5000);
  expect(typed()).toBeUndefined();
});

it('skip during the growth shows the whole tree and never opens the overlay', async () => {
  render(<Tree />);
  await advance(100);
  fireEvent.click(skip()!);
  expect(document.querySelectorAll('[data-tree-content] [style*="opacity"]')).toHaveLength(0);
  expect(lit).not.toHaveBeenCalled();
  await advance(14000);
  expect(opened).not.toHaveBeenCalled();
});

it('does not play again after a visit, or when the reader prefers reduced motion', () => {
  localStorage.setItem(SEEN, '1');
  render(<Tree />);
  expect(skip()).toBeNull();
  cleanup();
  localStorage.clear();
  reduced = true;
  render(<Tree />);
  expect(skip()).toBeNull();
  expect(Element.prototype.animate).not.toHaveBeenCalled();
});

it('replays with ?intro=1', () => {
  localStorage.setItem(SEEN, '1');
  window.history.replaceState(null, '', '/?intro=1');
  render(<Tree />);
  expect(skip()).toBeTruthy();
});

it('skip while a path is lit turns the light off', async () => {
  render(<Tree />);
  await advance(600);
  expect(lit).toHaveBeenCalledOnce();
  fireEvent.click(skip()!);
  expect(lit).toHaveBeenCalledTimes(2);
  expect(document.querySelectorAll('[aria-pressed="true"]')).toHaveLength(0);
});
