// @vitest-environment jsdom
import { useRef } from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { groups } from '@shared/quran/mutashabih/data';
import { ConnectionLines, GroupConnections } from './GroupConnections';
import { GroupDetails } from './GroupDetails';
import { CardActions } from './Filters';
import { play, setPrefs } from './Grow';

let language = 'ar';
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language }) }));
const group = groups.find(group => group.citations.some(citation => citation.id === 'K02'))!;

function Matrix({ column = 0, defaultOn = false }: { column?: number; defaultOn?: boolean }) {
  const lane = useRef<HTMLDivElement>(null);
  return <GroupConnections group={group} defaultOn={defaultOn}>
    <div ref={lane} data-matrix-content>
      {(['2:48', '2:123'] as const).map(key => <div data-col="0" data-current={column === 0 || undefined} key={key}>
        <article>{[11, 13, 14, 15].map(index => <span key={index} data-word-position={`${key}:${index}`}>word</span>)}</article>
      </div>)}
      <div data-col="1" data-current={column === 1 || undefined}>Surrounding ayah</div>
      <ConnectionLines lane={lane} column={column} ready />
    </div>
    <CardActions id="matrix" text="matrix" details={<GroupDetails group={group} />} />
  </GroupConnections>;
}

let errors: ReturnType<typeof vi.spyOn>;
beforeEach(() => { errors = vi.spyOn(console, 'error'); language = 'ar'; localStorage.clear(); vi.useFakeTimers(); });
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); expect(errors).not.toHaveBeenCalled(); errors.mockRestore(); });
const advance = (ms: number) => act(async () => { await vi.advanceTimersByTimeAsync(ms); });
const open = () => fireEvent.click(screen.getByRole('button', { name: 'استوديو الروابط' }));
const start = () => { open(); fireEvent.click(screen.getByRole('button', { name: 'شاهد الروابط' })); };
const paths = () => [...document.querySelectorAll<SVGPathElement>('[data-connection] path')];

it('opens from connectors off, draws one connection at a time, pauses, replays, and resets', async () => {
  render(<Matrix />);
  expect(paths()).toHaveLength(0);
  start();
  expect(screen.queryByRole('button', { name: 'حفظ' })).toBeNull();
  expect(paths()).toHaveLength(3);
  expect(paths().map(path => path.style.strokeDashoffset)).toEqual(['1', '1', '1']);
  await advance(350);
  expect(Number(paths()[0].style.strokeDashoffset)).toBeGreaterThan(0);
  expect(Number(paths()[0].style.strokeDashoffset)).toBeLessThan(1);
  expect(paths()[1].style.strokeDashoffset).toBe('1');
  fireEvent.click(screen.getByRole('button', { name: 'إيقاف مؤقت' }));
  const paused = paths()[0].style.strokeDashoffset;
  await advance(3000);
  expect(paths()[0].style.strokeDashoffset).toBe(paused);
  fireEvent.click(screen.getByRole('button', { name: 'متابعة' }));
  await advance(1000);
  expect(paths()[0].style.strokeDashoffset).toBe('0');
  expect(Number(paths()[1].style.strokeDashoffset)).toBeLessThan(1);
  await advance(2500);
  fireEvent.click(screen.getByRole('button', { name: 'إعادة' }));
  expect(paths()[0].style.strokeDashoffset).toBe('1');
  fireEvent.click(screen.getByRole('button', { name: 'إعادة ضبط' }));
  expect(paths().every(path => !path.style.strokeDashoffset && !path.style.strokeDasharray)).toBe(true);
  expect(screen.getByRole('button', { name: 'شاهد الروابط' })).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'إغلاق الاستوديو' }));
  expect(screen.getByRole('button', { name: 'حفظ' })).toBeTruthy();
});

it('uses the shared recall timer and frozen hourglass, reveals with keyboard, and clears on reset', async () => {
  render(<Matrix />);
  open();
  act(() => setPrefs({ mode: 'ask', timer: 1 }));
  fireEvent.click(screen.getByRole('button', { name: 'شاهد الروابط' }));
  expect(screen.getByRole('button', { name: 'اكشف الرابط' })).toBeTruthy();
  expect(document.querySelector('[data-seconds]')?.textContent).toBe('١');
  await advance(400);
  fireEvent.click(screen.getByRole('button', { name: 'إيقاف مؤقت' }));
  const sand = document.querySelector('[data-sand="top"]')!.getAttribute('d');
  await advance(2000);
  expect(document.querySelector('[data-sand="top"]')?.getAttribute('d')).toBe(sand);
  expect(paths()[0].style.strokeDashoffset).toBe('1');
  fireEvent.click(screen.getByRole('button', { name: 'متابعة' }));
  await advance(700);
  expect(document.querySelector('[data-matrix-prompt]')).toBeNull();
  await advance(1300);
  fireEvent.keyDown(screen.getByRole('button', { name: 'اكشف الرابط' }), { key: 'Enter' });
  await advance(32);
  expect(document.querySelector('[data-matrix-prompt]')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'إعادة ضبط' }));
  expect(document.querySelector('[data-ask], [data-timer], [data-hide]')).toBeNull();
});

it('waits for a tap without a timer and uses a finite timer for video', async () => {
  render(<Matrix />);
  open();
  act(() => setPrefs({ mode: 'ask', timer: 0 }));
  fireEvent.click(screen.getByRole('button', { name: 'شاهد الروابط' }));
  await advance(10000);
  expect(document.querySelector('[data-wait]')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'اكشف الرابط' }));
  await advance(32);
  expect(document.querySelector('[data-matrix-prompt]')).toBeNull();
  act(() => { void play(0, { video: true }); });
  expect(document.querySelector('[data-hourglass]')).toBeTruthy();
  await advance(3100);
  expect(document.querySelector('[data-matrix-prompt]')).toBeNull();
});

it('closes and clears playback when comparison, column, or matrix changes', async () => {
  const { rerender, unmount } = render(<Matrix defaultOn />);
  start();
  await advance(200);
  fireEvent.click(screen.getByRole('button', { name: 'تقديم وتأخير' }));
  expect(screen.queryByRole('button', { name: 'إيقاف مؤقت' })).toBeNull();
  expect(paths()).toHaveLength(1);
  expect(paths()[0].style.strokeDashoffset).toBe('');
  start();
  rerender(<Matrix defaultOn column={1} />);
  expect(screen.queryByRole('button', { name: 'استوديو الروابط' })).toBeNull();
  expect(paths()).toHaveLength(0);
  rerender(<Matrix defaultOn column={0} />);
  start();
  const root = document.querySelector('[data-matrix-content]')!;
  unmount();
  await advance(2000);
  expect(root.querySelector('[data-matrix-prompt], [data-hide]')).toBeNull();
});

it('turns connectors off when deselecting the last active comparison during playback', async () => {
  render(<Matrix defaultOn />);
  fireEvent.click(screen.getByRole('button', { name: 'إبدال كلمة' }));
  start();
  await advance(200);
  fireEvent.click(screen.getByRole('button', { name: 'تقديم وتأخير' }));
  expect(screen.queryByRole('button', { name: 'إيقاف مؤقت' })).toBeNull();
  expect(paths()).toHaveLength(0);
  expect(screen.getByRole('button', { name: 'استوديو الروابط' })).toBeTruthy();
});

it('speeds up drawing, seeks to a connection, and honors reduced motion', async () => {
  vi.stubGlobal('matchMedia', () => ({ matches: true }));
  render(<Matrix />);
  open();
  fireEvent.click(screen.getByRole('button', { name: 'السرعة 1×' }));
  expect(screen.getByRole('button', { name: 'السرعة 1.5×' })).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'من الرابط 2' }));
  await advance(32);
  expect(paths()[0].style.strokeDashoffset).toBe('0');
  expect(paths()[1].style.strokeDashoffset).toBe('0');
  await advance(1800);
  expect(screen.getByRole('button', { name: 'إعادة' })).toBeTruthy();
});
