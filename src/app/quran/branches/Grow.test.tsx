// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import BranchTree from './BranchTree';
import { GrowControls, GrowProgress, setPrefs } from './Grow';
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
    expect(screen.getByRole('button', { name: 'إعادة' })).toBeTruthy();
    expect(screen.getByRole('group', { name: 'تقدّم الشجرة' })).toBeTruthy();
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
    expect(screen.getByRole('button', { name: /^وضع السؤال/ }).getAttribute('aria-pressed')).toBe('false');
    expect(screen.queryByRole('button', { name: /^مهلة السؤال/ })).toBeNull();
    expect(screen.getAllByRole('button', { name: /^من الآية/ })).toHaveLength(3);
    await advance(3000);
    expect(document.querySelectorAll('[data-hide]')).toHaveLength(0);
    fireEvent.click(screen.getByRole('button', { name: /^وضع السؤال/ }));
    expect(screen.getByRole('button', { name: /^مهلة السؤال/ })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'شاهد الشجرة تنمو' }));
    await advance(400);
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
    await advance(400);
    const first = box('جَنَّـٰتٍ وَعُيُونٍ');
    expect(first.hasAttribute('data-ask')).toBe(true);
    expect(first.getAttribute('data-left')).toBe('٣');
    await advance(2000);
    expect(first.hasAttribute('data-ask')).toBe(true);
    expect(first.getAttribute('data-left')).toBe('١');
    await advance(1100);
    expect(first.hasAttribute('data-ask')).toBe(false);
    await advance(1500);
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
    fireEvent.click(screen.getByRole('button', { name: 'من الآية 2' }));
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

  it('shares the link straight away when no tree is open (the ayah cards)', () => {
    render(<CardActions id="t" text="إن المتقين في" />);
    expect(screen.getByRole('button', { name: 'مشاركة' }).hasAttribute('aria-expanded')).toBe(false);
  });
});
