import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import PairSwipe from './PairSwipe';

const router = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => router }));

afterEach(() => { cleanup(); router.push.mockClear(); vi.useRealTimers(); });

const steps = { previous: { href: '/prev', label: 'السابقة' }, next: { href: '/next', label: 'التالية' } };
const swipe = (dx: number) => {
  const box = document.querySelector('[data-pair-swipe]')!;
  fireEvent.touchStart(box, { touches: [{ clientX: 200, clientY: 100 }] });
  fireEvent.touchMove(box, { touches: [{ clientX: 200 + dx / 2, clientY: 100 }] });
  fireEvent.touchMove(box, { touches: [{ clientX: 200 + dx, clientY: 100 }] });
};

describe('PairSwipe', () => {
  it.each([
    [true, 120, '/next'], [true, -120, '/prev'],
    [false, -120, '/next'], [false, 120, '/prev'],
  ])('in %s Arabic, a drag of %ipx opens %s', (ar, dx, href) => {
    vi.useFakeTimers();
    render(<PairSwipe {...steps} ar={ar}><p>cards</p></PairSwipe>);
    swipe(dx);
    // While dragging, the neighbour's card shows beside the page.
    expect(screen.getByText(href === '/next' ? 'التالية' : 'السابقة')).toBeTruthy();
    fireEvent.touchEnd(document.querySelector('[data-pair-swipe]')!);
    act(() => { vi.advanceTimersByTime(300); });
    expect(router.push).toHaveBeenCalledWith(href);
  });

  it('draws the neighbouring page itself beside this one while dragging', () => {
    render(<PairSwipe next={{ ...steps.next, preview: <p>first card of the next page</p> }} ar><p>cards</p></PairSwipe>);
    expect(screen.queryByText('first card of the next page')).toBeNull();
    swipe(80);
    expect(screen.getByText('first card of the next page')).toBeTruthy();
    expect(screen.queryByText('التالية')).toBeNull();
  });

  it('slides back when there is no pair that way', () => {
    vi.useFakeTimers();
    render(<PairSwipe next={steps.next} ar><p>cards</p></PairSwipe>);
    swipe(-120);
    fireEvent.touchEnd(document.querySelector('[data-pair-swipe]')!);
    act(() => { vi.advanceTimersByTime(300); });
    expect(router.push).not.toHaveBeenCalled();
  });
});
