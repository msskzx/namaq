// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import BranchTree from './BranchTree';
import { GrowControls, GrowProgress } from './Grow';
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
const advance = (ms: number) => act(async () => { await vi.advanceTimersByTimeAsync(ms); });

describe('growing a tree', () => {
  it('hides the branches, grows them one ayah at a time, then shows the whole tree', async () => {
    page();
    fireEvent.click(screen.getByRole('button', { name: 'شاهد الشجرة تنمو' }));
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
    expect(screen.queryByRole('group', { name: 'تقدّم الشجرة' })).toBeNull();
  });

  it('pauses the clock', async () => {
    page();
    fireEvent.click(screen.getByRole('button', { name: 'شاهد الشجرة تنمو' }));
    fireEvent.click(screen.getByRole('button', { name: 'إيقاف مؤقت' }));
    await advance(5000);
    expect(box('جَنَّـٰتٍ وَعُيُونٍ').hasAttribute('data-hide')).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'متابعة' }));
    await advance(1200);
    expect(box('جَنَّـٰتٍ وَعُيُونٍ').hasAttribute('data-hide')).toBe(false);
  });

  it('asks for the box where each ayah splits off, revealing it after the timer or a tap', async () => {
    page();
    fireEvent.click(screen.getByRole('button', { name: 'وضع السؤال' }));
    fireEvent.click(screen.getByRole('button', { name: 'شاهد الشجرة تنمو' }));
    await advance(400);
    const first = box('جَنَّـٰتٍ وَعُيُونٍ');
    expect(first.hasAttribute('data-ask')).toBe(true);
    await advance(2000);
    expect(first.hasAttribute('data-ask')).toBe(true);
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
    fireEvent.click(screen.getByRole('button', { name: 'وضع السؤال' }));
    expect(JSON.parse(localStorage.getItem('branches-grow')!).mode).toBe('ask');
    fireEvent.click(screen.getByRole('button', { name: 'وضع السؤال: يتوقف عند كل تفرّع' }));
    fireEvent.click(screen.getByRole('button', { name: 'شاهد الشجرة تنمو' }));
    fireEvent.click(screen.getByRole('button', { name: 'من الآية 2' }));
    expect(box('جَنَّـٰتٍ وَعُيُونٍ').hasAttribute('data-hide')).toBe(false);
    expect(box('مَقَامٍ أَمِينٍ').hasAttribute('data-hide')).toBe(true);
  });

  it('grows only the open tree, not the neighbouring card drawn beside it', async () => {
    render(<>
      <BranchTree tree={tree} names={{}} growable steppable={{ next: false, previous: true, previousCard: <BranchTree tree={tree} names={{}} /> }} />
      <GrowControls />
    </>);
    fireEvent.click(screen.getByRole('button', { name: 'شاهد الشجرة تنمو' }));
    const boxes = screen.getAllByText('مَقَامٍ أَمِينٍ').map(text => text.closest('[data-node]')!);
    expect(boxes.map(box => [!!box.closest('[data-tree-neighbour]'), box.hasAttribute('data-hide')])).toEqual(expect.arrayContaining([[true, false], [false, true]]));
  });

  it('stops and shows the tree when the tree goes away', async () => {
    const { unmount } = render(<BranchTree tree={tree} names={{}} growable />);
    render(<GrowControls />);
    fireEvent.click(screen.getByRole('button', { name: 'شاهد الشجرة تنمو' }));
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
