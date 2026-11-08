// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import BranchTree from './BranchTree';
import { GrowControls, GrowProgress, setPrefs } from './Grow';
import { PathScope } from './Paths';
import { CardActions } from './Filters';

vi.mock('@/components/common/MushafText', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
vi.mock('@/components/common/NavigationLoader', () => ({ useNavigatingRouter: () => ({ push: () => {} }) }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: () => {} }) }));
vi.mock('@/lib/quran/quranText', () => ({ quranContexts: vi.fn().mockResolvedValue([]), quranSurrounding: vi.fn().mockResolvedValue({ before: {}, after: {} }) }));

beforeEach(() => { localStorage.clear(); vi.useFakeTimers(); });
afterEach(() => { cleanup(); vi.useRealTimers(); });

const tree = {
  words: ['إِنَّ', 'ٱلْمُتَّقِينَ', 'فِى'],
  ayat: [],
  children: [
    { words: ['جَنَّـٰتٍ', 'وَعُيُونٍ'], ayat: ['51:15', '15:45'], children: [] },
    { words: ['مَقَامٍ', 'أَمِينٍ'], ayat: ['44:51'], children: [] },
  ],
};

const page = () => render(<>
  <BranchTree tree={tree} names={{}} growable />
  <GrowProgress />
  <GrowControls />
</>);
const box = (text: string) => screen.getByText(text).closest('[data-node]')!;
const studio = () => fireEvent.click(screen.getByRole('button', { name: 'استوديو النمو' }));
const grow = () => { studio(); fireEvent.click(screen.getByRole('button', { name: 'شاهد الشجرة تنمو' })); };
const advance = (ms: number) => act(async () => { await vi.advanceTimersByTimeAsync(ms); });

describe('growing a tree', () => {
  it('draws the segment leaving the root before the first branch connector or box', async () => {
    page();
    const root = document.querySelector('[data-grow="n-1"]')!;
    const stub = root.querySelector(':scope > [data-line]')!;
    const branch = box('جَنَّـٰتٍ وَعُيُونٍ').closest('li')!;
    grow();
    await advance(200);
    expect(stub.hasAttribute('data-hide')).toBe(false);
    expect(branch.hasAttribute('data-hide')).toBe(true);
    expect(box('جَنَّـٰتٍ وَعُيُونٍ').hasAttribute('data-hide')).toBe(true);
    await advance(250);
    expect(branch.hasAttribute('data-hide')).toBe(false);
    expect(box('جَنَّـٰتٍ وَعُيُونٍ').hasAttribute('data-hide')).toBe(true);
  });

  it.each(['prefixes', 'variants'] as const)('starts with each rendered %s root before drawing its path into the shared phrase', async kind => {
    render(<>
      <BranchTree tree={{ words: kind === 'variants' ? ['بادئة', 'مشترك'] : ['مشترك'], ayat: ['1:1', '2:1'], children: [] }} names={{}} growable
        {...{ [kind]: [
          { word: 'الثاني', conj: '', keys: ['2:1'], id: 'second' },
          { word: 'الأول', conj: '', keys: ['1:1'], id: 'first' },
        ] }} />
      <GrowControls />
    </>);
    const start = (i: number) => document.querySelector(`[data-node="${kind === 'prefixes' ? 'p' : 'v'}${i}"]`)!;
    grow();
    expect(start(0).hasAttribute('data-hide')).toBe(false);
    expect(start(1).hasAttribute('data-hide')).toBe(true);
    expect(box('مشترك').hasAttribute('data-hide')).toBe(true);
    const content = box('مشترك').closest('[data-tree-content]')!;
    const bridge = content.querySelector(':scope > [data-line]')!;
    expect(bridge.hasAttribute('data-hide')).toBe(true);
    await advance(1200);
    expect(box('مشترك').hasAttribute('data-hide')).toBe(false);
    expect(start(1).hasAttribute('data-hide')).toBe(true);
    await advance(1200);
    expect(start(1).hasAttribute('data-hide')).toBe(false);
    await advance(10000);
    expect(content.querySelectorAll('[data-hide], [data-drawing]')).toHaveLength(0);
  });

  it.each([true, false])('connects preceding ayat to their following start before playback completes (word prefix: %s)', async wordPrefix => {
    render(<>
      <BranchTree tree={{ words: ['مشترك'], ayat: ['62:4', '34:2'], children: [] }} names={{}} growable
        prefixes={[
          { word: wordPrefix ? 'بادئة' : '', conj: '', keys: ['62:4'], id: 'first' },
          { word: 'أخرى', conj: '', keys: ['34:2'], id: 'second' },
        ]}
        surround={{ on: true, data: { before: {
          '62:4': { key: '62:3', page: 553, words: ['سابق'] },
          '62:3': { key: '62:2', page: 553, words: ['أسبق'] },
          '34:2': { key: '34:1', page: 428, words: ['بعيد'] },
        }, after: {} } }} />
      <GrowControls />
    </>);
    const start = document.querySelector(`[data-node="${wordPrefix ? 'p0' : 'before62:4'}"]`)!;
    const connecting = start.previousElementSibling!;
    expect(connecting.hasAttribute('data-line')).toBe(true);
    grow();
    expect(connecting.hasAttribute('data-hide')).toBe(true);
    await advance(1800);
    expect(screen.getByRole('button', { name: 'إيقاف مؤقت' })).toBeTruthy();
    expect(start.hasAttribute('data-hide')).toBe(false);
    expect(connecting.hasAttribute('data-hide')).toBe(false);
  });

  it('hides the branches, grows them one ayah at a time, then shows the whole tree', async () => {
    page();
    grow();
    expect(box('إِنَّ ٱلْمُتَّقِينَ فِى').hasAttribute('data-hide')).toBe(false);
    expect(box('جَنَّـٰتٍ وَعُيُونٍ').hasAttribute('data-hide')).toBe(true);
    expect(box('مَقَامٍ أَمِينٍ').hasAttribute('data-hide')).toBe(true);
    expect(screen.getAllByRole('button', { name: /^من الآية/ })).toHaveLength(3);
    await advance(1200);
    expect(box('جَنَّـٰتٍ وَعُيُونٍ').hasAttribute('data-hide')).toBe(false);
    expect(box('مَقَامٍ أَمِينٍ').hasAttribute('data-hide')).toBe(true);
    await advance(10000);
    expect(document.querySelectorAll('[data-hide]')).toHaveLength(0);
    const replay = screen.getByRole('button', { name: 'إعادة' });
    expect(replay.querySelector('svg.lucide-play')).toBeTruthy();
    expect(document.querySelectorAll('button svg.lucide-rotate-ccw')).toHaveLength(1);
    expect(screen.getByRole('group', { name: 'تقدّم الشجرة' })).toBeTruthy();
    fireEvent.click(replay);
    expect(screen.getByRole('button', { name: 'إيقاف مؤقت' })).toBeTruthy();
    expect(box('مَقَامٍ أَمِينٍ').hasAttribute('data-hide')).toBe(true);
  });

  it('lights the current path, switches it in depth-first order, and restores pinned paths', async () => {
    page();
    const first = box('جَنَّـٰتٍ وَعُيُونٍ');
    const second = box('مَقَامٍ أَمِينٍ');
    fireEvent.click(second);
    grow();
    expect(first.getAttribute('data-lit')).toBe('true');
    expect(second.hasAttribute('data-lit')).toBe(false);
    expect(first.closest('li')?.querySelector(':scope > [data-line]')?.className).toContain('home-accent');
    await advance(1800);
    expect(first.getAttribute('data-lit')).toBe('true');
    await advance(1000);
    expect(second.getAttribute('data-lit')).toBe('true');
    expect(first.hasAttribute('data-lit')).toBe(false);
    await advance(5000);
    expect(second.getAttribute('data-lit')).toBe('true');
    expect(first.hasAttribute('data-lit')).toBe(false);
  });

  it('uses accent for an enabled answer timer and muted for an unlimited wait', () => {
    page();
    studio();
    fireEvent.click(screen.getByRole('button', { name: 'اكمل الايات' }));
    const timer = screen.getByRole('button', { name: /^مهلة السؤال/ });
    expect(timer.getAttribute('data-variant')).toBe('ghost');
    fireEvent.click(timer);
    fireEvent.click(timer);
    fireEvent.click(timer);
    expect(timer.getAttribute('aria-label')).toContain('∞');
    expect(timer.getAttribute('data-variant')).toBe('muted');
  });

  it('resets beside Play, stops a paused countdown, and keeps the studio preferences', async () => {
    page();
    studio();
    act(() => setPrefs({ mode: 'ask', timer: 1 }));
    const reset = screen.getByRole('button', { name: 'إعادة ضبط' });
    expect(reset.previousElementSibling).toBe(screen.getByRole('button', { name: 'شاهد الشجرة تنمو' }));
    fireEvent.click(screen.getByRole('button', { name: 'شاهد الشجرة تنمو' }));
    await advance(600);
    expect(document.querySelector('[data-hourglass]')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'إيقاف مؤقت' }));
    fireEvent.click(reset);
    expect(document.querySelectorAll('[data-hide], [data-ask], [data-hourglass], [data-timer], [data-drawing]')).toHaveLength(0);
    expect(screen.getByRole('button', { name: 'شاهد الشجرة تنمو' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'مهلة السؤال 1s' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'إغلاق الاستوديو' })).toBeTruthy();
    await advance(5000);
    expect(screen.queryByRole('button', { name: 'إعادة' })).toBeNull();
  });

  it('offers and remembers a one-second timer, with flowing sand that pauses with playback', async () => {
    localStorage.setItem('branches-grow', JSON.stringify({ mode: 'ask', speed: 1, timer: 1 }));
    page();
    grow();
    expect(screen.getByRole('button', { name: 'مهلة السؤال 1s' })).toBeTruthy();
    await advance(600);
    const asked = box('جَنَّـٰتٍ وَعُيُونٍ');
    const top = asked.querySelector('[data-sand="top"]')!;
    const full = top.getAttribute('d');
    await advance(300);
    expect(top.getAttribute('d')).not.toBe(full);
    fireEvent.click(screen.getByRole('button', { name: 'إيقاف مؤقت' }));
    const paused = top.getAttribute('d');
    const seconds = asked.querySelector('[data-seconds]')?.textContent;
    await advance(2000);
    expect(top.getAttribute('d')).toBe(paused);
    expect(asked.querySelector('[data-seconds]')?.textContent).toBe(seconds);
    expect(asked.hasAttribute('data-ask')).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'متابعة' }));
    await advance(800);
    expect(asked.querySelector('[data-hourglass]')).toBeNull();
    expect(asked.hasAttribute('data-ask')).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: 'إعادة ضبط' }));
    fireEvent.click(screen.getByRole('button', { name: 'مهلة السؤال 1s' }));
    expect(JSON.parse(localStorage.getItem('branches-grow')!).timer).toBe(3);
  });

  it('shows the complete pilot tree immediately when reduced motion is requested', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    try {
      render(<><PathScope organic><BranchTree tree={tree} names={{}} growable /></PathScope><GrowControls /></>);
      grow();
      expect(document.querySelectorAll('[data-hide], [inert], [data-ask]')).toHaveLength(0);
      expect(screen.getByRole('button', { name: 'إعادة' })).toBeTruthy();
    } finally { vi.unstubAllGlobals(); }
  });

  it('reveals a curved connector before its words, then clears hidden links when stopped', async () => {
    const width = vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(400);
    const height = vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(200);
    try {
      render(<><PathScope organic><BranchTree tree={tree} names={{}} growable /></PathScope><GrowControls /></>);
      grow();
      const first = box('جَنَّـٰتٍ وَعُيُونٍ');
      const link = document.querySelector('[data-tree-links] > [data-entry="0"]')!;
      expect(link.hasAttribute('data-hide')).toBe(true);
      await advance(450);
      expect(link.hasAttribute('data-hide')).toBe(false);
      expect(first.hasAttribute('data-hide')).toBe(true);
      const progress = link.getAttribute('style');
      fireEvent.click(screen.getByRole('button', { name: 'إيقاف مؤقت' }));
      await advance(500);
      expect(link.getAttribute('style')).toBe(progress);
      fireEvent.click(screen.getByRole('button', { name: 'متابعة' }));
      await advance(250);
      expect(first.hasAttribute('data-hide')).toBe(false);
      fireEvent.click(screen.getByRole('button', { name: 'إغلاق الاستوديو' }));
      expect(document.querySelectorAll('[data-hide], [inert]')).toHaveLength(0);
      expect(link.getAttribute('style') ?? '').not.toContain('stroke-dash');
    } finally { width.mockRestore(); height.mockRestore(); }
  });

  it('opens a studio in place of save and share, plays only on play, and stays open until closed', async () => {
    render(<>
      <BranchTree tree={tree} names={{}} growable />
      <CardActions id="t" text="إن المتقين في" />
    </>);
    const save = screen.getByRole('button', { name: 'حفظ' });
    expect(save.nextElementSibling).toBe(screen.getByRole('button', { name: 'استوديو النمو' }));
    expect(screen.queryByRole('button', { name: 'شاهد الشجرة تنمو' })).toBeNull();
    studio();
    expect(screen.queryByRole('button', { name: 'حفظ' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'مشاركة' })).toBeNull();
    expect(screen.getByRole('button', { name: /^السرعة/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'اكمل الايات' }).getAttribute('aria-pressed')).toBe('false');
    expect(screen.queryByRole('button', { name: /^مهلة السؤال/ })).toBeNull();
    expect(screen.getAllByRole('button', { name: /^من الآية/ })).toHaveLength(3);
    await advance(3000);
    expect(document.querySelectorAll('[data-hide]')).toHaveLength(0);
    fireEvent.click(screen.getByRole('button', { name: 'اكمل الايات' }));
    expect(screen.getByRole('button', { name: /^مهلة السؤال/ })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'شاهد الشجرة تنمو' }));
    await advance(600);
    expect(box('جَنَّـٰتٍ وَعُيُونٍ').hasAttribute('data-ask')).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'إغلاق الاستوديو' }));
    expect(document.querySelectorAll('[data-hide], [data-ask]')).toHaveLength(0);
    expect(screen.getByRole('button', { name: 'حفظ' })).toBeTruthy();
    expect(screen.queryByRole('group', { name: 'تقدّم الشجرة' })).toBeNull();
  });

  it('remembers the ask mode for the next visit', async () => {
    localStorage.setItem('branches-grow', JSON.stringify({ mode: 'ask', speed: 1, timer: 0 }));
    page();
    grow();
    await advance(1200);
    expect(box('جَنَّـٰتٍ وَعُيُونٍ').hasAttribute('data-ask')).toBe(true);
    expect(box('جَنَّـٰتٍ وَعُيُونٍ').hasAttribute('data-wait')).toBe(true);
  });

  it('pauses the clock', async () => {
    page();
    grow();
    fireEvent.click(screen.getByRole('button', { name: 'إيقاف مؤقت' }));
    await advance(5000);
    expect(box('جَنَّـٰتٍ وَعُيُونٍ').hasAttribute('data-hide')).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'متابعة' }));
    await advance(1200);
    expect(box('جَنَّـٰتٍ وَعُيُونٍ').hasAttribute('data-hide')).toBe(false);
  });

  it('asks for the box where each ayah splits off, revealing it after the timer or a tap', async () => {
    page();
    act(() => setPrefs({ mode: 'ask' }));
    grow();
    await advance(600);
    const first = box('جَنَّـٰتٍ وَعُيُونٍ');
    expect(first.hasAttribute('data-ask')).toBe(true);
    const sand = first.querySelector('[data-sand="top"]')!;
    const initial = sand.getAttribute('d');
    expect(first.querySelector('[data-seconds]')?.textContent).toBe('٣');
    await advance(2000);
    expect(first.hasAttribute('data-ask')).toBe(true);
    expect(sand.getAttribute('d')).not.toBe(initial);
    expect(first.querySelector('[data-seconds]')?.textContent).toBe('١');
    await advance(1100);
    expect(first.hasAttribute('data-ask')).toBe(false);
    await advance(2500);
    const second = box('مَقَامٍ أَمِينٍ');
    expect(second.hasAttribute('data-ask')).toBe(true);
    expect(second.getAttribute('role')).toBe('button');
    fireEvent.keyDown(second, { key: 'Enter' });
    await advance(50);
    expect(second.hasAttribute('data-ask')).toBe(false);
  });

  it('remembers the ask mode and starts again from a tapped ayah', async () => {
    page();
    act(() => setPrefs({ mode: 'ask' }));
    expect(JSON.parse(localStorage.getItem('branches-grow')!).mode).toBe('ask');
    act(() => setPrefs({ mode: 'watch' }));
    grow();
    fireEvent.click(screen.getByRole('button', { name: 'من الآية 3' }));
    expect(box('جَنَّـٰتٍ وَعُيُونٍ').hasAttribute('data-hide')).toBe(false);
    expect(box('مَقَامٍ أَمِينٍ').hasAttribute('data-hide')).toBe(true);
  });

  it('grows only the open tree, not the neighbouring card drawn beside it', async () => {
    render(<>
      <BranchTree tree={tree} names={{}} growable steppable={{ next: false, previous: true, previousCard: <BranchTree tree={tree} names={{}} /> }} />
      <GrowControls />
    </>);
    grow();
    const boxes = screen.getAllByText('مَقَامٍ أَمِينٍ').map(text => text.closest('[data-node]')!);
    expect(boxes.map(box => [!!box.closest('[data-tree-neighbour]'), box.hasAttribute('data-hide')])).toEqual(expect.arrayContaining([[true, false], [false, true]]));
  });

  it('stops and shows the tree when the tree goes away', async () => {
    const { unmount } = render(<BranchTree tree={tree} names={{}} growable />);
    render(<GrowControls />);
    grow();
    const hidden = box('مَقَامٍ أَمِينٍ');
    expect(hidden.hasAttribute('inert')).toBe(true);
    unmount();
    expect(screen.queryByRole('button', { name: 'إيقاف مؤقت' })).toBeNull();
    expect(hidden.hasAttribute('data-hide') || hidden.hasAttribute('inert')).toBe(false);
  });

  it('offers the link or a video when sharing a tree that can grow', () => {
    vi.stubGlobal('MediaRecorder', { isTypeSupported: () => true });
    HTMLCanvasElement.prototype.captureStream = () => ({}) as MediaStream;
    render(<>
      <BranchTree tree={tree} names={{}} growable />
      <CardActions id="t" text="إن المتقين في" />
    </>);
    fireEvent.click(screen.getByRole('button', { name: 'مشاركة' }));
    expect(screen.getByRole('button', { name: 'مشاركة الرابط' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'مشاركة كفيديو' })).toBeTruthy();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('button', { name: 'مشاركة كفيديو' })).toBeNull();
    vi.unstubAllGlobals();
  });

  it('shares the tree as a video from inside the studio', () => {
    vi.stubGlobal('MediaRecorder', { isTypeSupported: () => true });
    HTMLCanvasElement.prototype.captureStream = () => ({}) as MediaStream;
    render(<>
      <BranchTree tree={tree} names={{}} growable />
      <CardActions id="t" text="إن المتقين في" />
    </>);
    studio();
    const video = screen.getByRole('button', { name: 'مشاركة كفيديو' });
    expect(video.nextElementSibling).toBe(screen.getByRole('button', { name: 'شاهد الشجرة تنمو' }));
    vi.unstubAllGlobals();
  });

  it('links to the compare card only when the tree has one', () => {
    render(<CardActions id="t" text="إن المتقين في" compareHref="/quran/compare?a=2&b=7#c-2-23-7-194" />);
    expect(screen.getByRole('link', { name: 'في المقارنة' }).getAttribute('href')).toBe('/quran/compare?a=2&b=7#c-2-23-7-194');
    cleanup();
    render(<CardActions id="t" text="إن المتقين في" />);
    expect(screen.queryByRole('link', { name: 'في المقارنة' })).toBeNull();
  });

  it('shares the link straight away when no tree is open (the ayah cards)', () => {
    render(<CardActions id="t" text="إن المتقين في" />);
    expect(screen.getByRole('button', { name: 'مشاركة' }).hasAttribute('aria-expanded')).toBe(false);
  });
});
