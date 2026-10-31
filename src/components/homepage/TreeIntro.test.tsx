import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import TreeIntro, { SEEN } from './TreeIntro';

const opened = vi.fn();
let reduced = false;

function Tree() {
  const root = useRef<HTMLDivElement>(null);
  return <div ref={root}>
    <div data-tree-content>
      <div data-node="n-1"><button data-context-open onClick={opened}>open</button></div>
      <div data-node="n0"><span className="font-quran">جنات</span></div>
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
  Element.prototype.animate = vi.fn(() => ({ cancel: vi.fn(), finished: Promise.resolve() }) as unknown as Animation);
  window.matchMedia = vi.fn(() => ({ matches: reduced }) as MediaQueryList);
});
afterEach(() => { cleanup(); vi.useRealTimers(); });

it('plays once on a first visit: grows the tree, opens an inner node, retypes a leaf, then remembers', async () => {
  render(<Tree />);
  expect(skip()).toBeTruthy();
  await advance(2200);
  expect(Element.prototype.animate).toHaveBeenCalled();
  expect(opened).toHaveBeenCalledOnce();
  await advance(2800);
  expect(leaf().style.visibility).toBe('hidden');
  await advance(400);
  expect(typed()?.length).toBeGreaterThan(0);
  expect(typed()?.length).toBeLessThan(5);
  await advance(3000);
  expect(skip()).toBeNull();
  expect(leaf().style.visibility).toBe('');
  expect(typed()).toBeUndefined();
  expect(localStorage.getItem(SEEN)).toBe('1');
});

it('skip restores the tree mid-play and stops the remaining scenes', async () => {
  render(<Tree />);
  await advance(5400);
  expect(leaf().style.visibility).toBe('hidden');
  fireEvent.click(skip()!);
  expect(skip()).toBeNull();
  expect(leaf().style.visibility).toBe('');
  expect(typed()).toBeUndefined();
  expect(localStorage.getItem(SEEN)).toBe('1');
  await advance(5000);
  expect(typed()).toBeUndefined();
});

it('skip during the growth never opens the overlay', async () => {
  render(<Tree />);
  await advance(500);
  fireEvent.click(skip()!);
  await advance(8000);
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
