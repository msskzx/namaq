import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useRef, useState } from 'react';
import TreeIntro, { SEEN } from './TreeIntro';

const opened = vi.fn();
let reduced = false;
let surround = false;

const lit = vi.fn();
const PathToggle = () => <button aria-pressed="false" onClick={event => { lit(); event.currentTarget.setAttribute('aria-pressed', String(event.currentTarget.getAttribute('aria-pressed') !== 'true')); }}>path</button>;

function Tree() {
  const root = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(surround);
  return <div ref={root}>
    <label><input type="checkbox" role="switch" aria-label="الآيات المحيطة" checked={on} onChange={event => setOn(event.currentTarget.checked)} /></label>
    <div data-tree-content>
      <div data-node="n-1" data-keys="1:1 1:2"><span className="font-quran">إن</span><button data-context-open onClick={opened}>open</button></div>
      <span data-line />
      <ul>
        <li><div data-node="n0" data-keys="1:1"><PathToggle /><span className="font-quran">جنات</span></div></li>
        <li><div data-node="n1" data-keys="1:2"><PathToggle /><span className="font-quran">عيون</span></div></li>
        {on && <li data-testid="around"><div data-node="after1:1" data-ctx="1:1" data-keys="1:1"><span>بعدها</span></div></li>}
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
const elementFromPoint = document.elementFromPoint;
const answer = (ok: boolean) => vi.fn(async () => ({ ok, json: async () => [context] }));

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
  vi.stubGlobal('fetch', answer(false));
});
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); document.elementFromPoint = elementFromPoint; });

const context = { ayah: { key: '1:2', words: ['عيون', 'ثانية'], page: 1 }, before: { key: '1:1', words: ['جنات', 'أولى'], page: 1 }, after: null };
const showAll = () => { document.elementFromPoint = () => document.querySelector('[data-tree-content]'); };

it('grows the tree level by level with every node typed, then fades in the surrounding ayat, lights one path and shows a small ayah card, and remembers', async () => {
  const fetched = answer(true);
  vi.stubGlobal('fetch', fetched);
  showAll();
  render(<Tree />);
  expect(skip()).toBeTruthy();
  const toggle = screen.getByRole('switch', { name: 'الآيات المحيطة' }) as HTMLInputElement;
  const pressed = (node: string) => document.querySelector(`[data-node="${node}"] [aria-pressed]`)!.getAttribute('aria-pressed');
  await advance(100);
  expect(words('n-1').style.visibility).toBe('hidden');
  expect([branch('n0'), branch('n1')]).toEqual(['0', '0']);
  await advance(700);
  expect(words('n-1').style.visibility).toBe('');
  expect([branch('n0'), branch('n1')]).toEqual(['', '']);
  expect([words('n0').style.visibility, words('n1').style.visibility]).toEqual(['hidden', 'hidden']);
  expect(document.querySelector('[data-node="n0"] .font-quran')!.className).toBe('font-quran');
  await advance(500);
  expect([typed('n0'), typed('n1')]).toEqual([undefined, undefined]);
  expect([words('n0').style.visibility, words('n1').style.visibility]).toEqual(['', '']);
  expect(lit).not.toHaveBeenCalled();
  expect(toggle.checked).toBe(false);
  await advance(1300);
  expect(toggle.checked).toBe(true);
  const around = screen.getByTestId('around');
  expect(vi.mocked(Element.prototype.animate).mock.contexts).toContain(around);
  expect(around.style.opacity).toBe('');
  expect(fetched).not.toHaveBeenCalled();
  await advance(1900);
  expect(lit).toHaveBeenCalledOnce();
  expect(pressed('n0')).toBe('true');
  expect(fetched).toHaveBeenCalledWith('/api/quran/context?q=1%3A1', expect.objectContaining({ signal: expect.any(AbortSignal) }));
  await advance(2600);
  expect(lit).toHaveBeenCalledTimes(2);
  expect(pressed('n0')).toBe('false');
  await advance(600);
  expect(document.body.textContent).toContain('الآيات في سياقها');
  expect(document.body.textContent).toContain('عيون ثانية');
  expect(opened).not.toHaveBeenCalled();
  await advance(5300);
  expect(document.body.textContent).not.toContain('عيون ثانية');
  expect(skip()).toBeNull();
  expect(toggle.checked).toBe(false);
  expect(screen.queryByTestId('around')).toBeNull();
  expect(document.querySelectorAll('[data-tree-content] [style*="opacity"]')).toHaveLength(0);
  expect(localStorage.getItem(SEEN)).toBe('1');
});

it('skip while the ayah card is open removes it and leaves nothing hidden', async () => {
  vi.stubGlobal('fetch', answer(true));
  showAll();
  render(<Tree />);
  await advance(8000);
  expect(document.body.textContent).toContain('عيون ثانية');
  fireEvent.click(skip()!);
  expect(document.body.textContent).not.toContain('عيون ثانية');
  expect(document.querySelectorAll('[data-tree-content] [style*="opacity"]')).toHaveLength(0);
  expect((screen.getByRole('switch', { name: 'الآيات المحيطة' }) as HTMLInputElement).checked).toBe(false);
});

it('finishes without the card when the ayah context fails to load', async () => {
  showAll();
  render(<Tree />);
  await advance(13000);
  expect(document.body.textContent).not.toContain('الآيات في سياقها');
  expect(skip()).toBeNull();
  expect(localStorage.getItem(SEEN)).toBe('1');
});

it('skip while nodes are being typed shows the whole tree with its words and lights nothing', async () => {
  render(<Tree />);
  await advance(700);
  fireEvent.click(skip()!);
  expect(skip()).toBeNull();
  expect(words('n0').style.visibility).toBe('');
  expect(typed('n0')).toBeUndefined();
  expect(document.querySelectorAll('[data-tree-content] [style*="opacity"]')).toHaveLength(0);
  expect(localStorage.getItem(SEEN)).toBe('1');
  await advance(20000);
  expect(lit).not.toHaveBeenCalled();
  expect(opened).not.toHaveBeenCalled();
});

it('skip while the path is lit turns the light off and puts the surrounding ayat back', async () => {
  showAll();
  render(<Tree />);
  const toggle = screen.getByRole('switch', { name: 'الآيات المحيطة' }) as HTMLInputElement;
  await advance(5000);
  expect(lit).toHaveBeenCalledOnce();
  expect(toggle.checked).toBe(true);
  fireEvent.click(skip()!);
  expect(lit).toHaveBeenCalledTimes(2);
  expect(document.querySelectorAll('[aria-pressed="true"]')).toHaveLength(0);
  expect(toggle.checked).toBe(false);
});

it.each([true, false])('preserves a pinned leaf when replay is skipped: %s', async skipped => {
  localStorage.setItem(SEEN, '1');
  render(<Tree />);
  const path = screen.getAllByRole('button', { name: 'path' })[0];
  fireEvent.click(path);
  fireEvent.click(screen.getByRole('button', { name: 'إعادة العرض' }));
  await advance(100);
  expect(path.getAttribute('aria-pressed')).toBe('false');
  if (skipped) fireEvent.click(skip()!);
  else await advance(20000);
  expect(path.getAttribute('aria-pressed')).toBe('true');
});

it('makes the animated content inert and restores it on skip', () => {
  render(<Tree />);
  const content = document.querySelector<HTMLElement>('[data-tree-content]')!;
  expect(content.inert).toBe(true);
  fireEvent.click(skip()!);
  expect(content.inert).not.toBe(true);
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

it('replays from the replay button, which gives way to skip while playing', async () => {
  localStorage.setItem(SEEN, '1');
  render(<Tree />);
  expect(skip()).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'إعادة العرض' }));
  expect(skip()).toBeTruthy();
  expect(screen.queryByRole('button', { name: 'إعادة العرض' })).toBeNull();
  await advance(900);
  expect(words('n0').style.visibility).toBe('hidden');
  fireEvent.click(skip()!);
  expect(screen.getByRole('button', { name: 'إعادة العرض' })).toBeTruthy();
});

it('waits for the tree to come into view, and pauses while it is out of view', async () => {
  let report: (ratio: number) => void = () => {};
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback: IntersectionObserverCallback) { report = ratio => callback([{ intersectionRatio: ratio } as IntersectionObserverEntry], this as unknown as IntersectionObserver); }
    observe() {}
    disconnect() {}
  });
  render(<Tree />);
  await advance(3000);
  expect(branch('n0')).toBe('0');
  act(() => report(0.7));
  await advance(900);
  expect(words('n0').style.visibility).toBe('hidden');
  act(() => report(0.1));
  await advance(5000);
  expect(typed('n0')).not.toBeUndefined();
  act(() => report(0.7));
  await advance(1000);
  expect(typed('n0')).toBeUndefined();
});
