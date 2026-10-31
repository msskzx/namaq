import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import TreeIntro, { SEEN } from './TreeIntro';

const opened = vi.fn();
let reduced = false;
let surround = false;

const lit = vi.fn();
const PathToggle = () => <button aria-pressed="false" onClick={event => { lit(); event.currentTarget.setAttribute('aria-pressed', String(event.currentTarget.getAttribute('aria-pressed') !== 'true')); }}>path</button>;

function Tree() {
  const root = useRef<HTMLDivElement>(null);
  return <div ref={root}>
    <label><input type="checkbox" role="switch" aria-label="الآيات المحيطة" defaultChecked={surround} /></label>
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

const words = (node: string) => document.querySelector<HTMLElement>(`[data-node="${node}"] .font-quran`)!;
const typed = (node: string) => document.querySelector(`[data-node="${node}"]`)!.querySelectorAll('.font-quran')[1]?.textContent;
const branch = (node: string) => document.querySelector<HTMLElement>(`[data-node="${node}"]`)!.closest('li')!.style.opacity;
const skip = () => screen.queryByRole('button', { name: 'تخطّ' });
const advance = (ms: number) => act(async () => { await vi.advanceTimersByTimeAsync(ms); });

beforeEach(() => {
  vi.useFakeTimers();
  reduced = false;
  surround = false;
  localStorage.clear();
  window.history.replaceState(null, '', '/');
  opened.mockClear();
  lit.mockClear();
  Element.prototype.animate = vi.fn(() => ({ cancel: vi.fn(), finished: Promise.resolve() }) as unknown as Animation);
  window.matchMedia = vi.fn(() => ({ matches: reduced }) as MediaQueryList);
});
afterEach(() => { cleanup(); vi.useRealTimers(); });

it('draws each path with its leaf typed in while the path is lit, then lights every path, points at the ayat button without opening it, and remembers', async () => {
  render(<Tree />);
  expect(skip()).toBeTruthy();
  await advance(100);
  expect([branch('n0'), branch('n1')]).toEqual(['', '0']);
  expect(words('n0').style.visibility).toBe('hidden');
  expect(typed('n0')).toBe('');
  expect(lit).toHaveBeenCalledOnce();
  expect(document.querySelector('[data-node="n0"] [aria-pressed]')!.getAttribute('aria-pressed')).toBe('true');
  await advance(600);
  expect(lit).toHaveBeenCalledTimes(2);
  expect(words('n0').style.visibility).toBe('');
  expect(typed('n0')).toBeUndefined();
  expect(branch('n1')).toBe('0');
  await advance(300);
  expect(branch('n1')).toBe('');
  expect(words('n1').style.visibility).toBe('hidden');
  expect(lit).toHaveBeenCalledTimes(3);
  await advance(1100);
  expect(typed('n1')).toBeUndefined();
  expect(lit).toHaveBeenCalledTimes(5);
  await advance(1900);
  expect(lit).toHaveBeenCalledTimes(8);
  expect(document.querySelectorAll('[aria-pressed="true"]')).toHaveLength(0);
  await advance(3000);
  expect(opened).not.toHaveBeenCalled();
  expect(skip()).toBeNull();
  expect(localStorage.getItem(SEEN)).toBe('1');
});

it('skip while a leaf is being typed shows the whole tree with its words and never points at the overlay', async () => {
  render(<Tree />);
  await advance(100);
  fireEvent.click(skip()!);
  expect(skip()).toBeNull();
  expect(words('n0').style.visibility).toBe('');
  expect(typed('n0')).toBeUndefined();
  expect(document.querySelectorAll('[data-tree-content] [style*="opacity"]')).toHaveLength(0);
  expect(localStorage.getItem(SEEN)).toBe('1');
  expect(lit).toHaveBeenCalledTimes(2);
  expect(document.querySelectorAll('[aria-pressed="true"]')).toHaveLength(0);
  await advance(14000);
  expect(lit).toHaveBeenCalledTimes(2);
  expect(opened).not.toHaveBeenCalled();
});

it('skip while a path is lit turns the light off', async () => {
  render(<Tree />);
  await advance(2100);
  expect(lit).toHaveBeenCalledTimes(5);
  fireEvent.click(skip()!);
  expect(lit).toHaveBeenCalledTimes(6);
  expect(document.querySelectorAll('[aria-pressed="true"]')).toHaveLength(0);
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


it('turns the surrounding ayat off and locks the switch while playing, then gives it back', async () => {
  surround = true;
  render(<Tree />);
  const toggle = screen.getByRole('switch', { name: 'الآيات المحيطة' }) as HTMLInputElement;
  expect(toggle.checked).toBe(false);
  expect(toggle.closest('label')!.inert).toBe(true);
  fireEvent.click(skip()!);
  expect(toggle.checked).toBe(true);
  expect(toggle.closest('label')!.inert).toBe(false);
});
