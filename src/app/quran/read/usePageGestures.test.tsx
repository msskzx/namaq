import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { useRef } from 'react';
import { LONG_PRESS, usePageGestures } from './usePageGestures';

afterEach(() => { cleanup(); vi.useRealTimers(); });

/** jsdom has no PointerEvent: a mouse event carrying a touch pointer's fields. */
const pointer = (element: Element, type: string, x = 0, y = 0) => fireEvent(element, Object.defineProperties(new MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y }), {
  pointerId: { value: 1 }, pointerType: { value: 'touch' }, isPrimary: { value: true },
}));

function Page({ onGesture, onDrag }: { onGesture: () => void; onDrag: (x: number, y: number, done: boolean) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  usePageGestures(ref, { onGesture, onDrag, waitForDouble: () => false });
  return <div ref={ref} data-testid="page" />;
}

describe('the reader page\'s gestures', () => {
  it('after a long press, follows the finger as a drag until it lifts, and never takes it as a tap', () => {
    vi.useFakeTimers();
    const onGesture = vi.fn(), onDrag = vi.fn();
    const { getByTestId } = render(<Page onGesture={onGesture} onDrag={onDrag} />);
    const page = getByTestId('page');
    pointer(page, 'pointerdown', 100, 50);
    vi.advanceTimersByTime(LONG_PRESS + 10);
    expect(onGesture).toHaveBeenCalledWith('long', page, false);
    pointer(page, 'pointermove', 60, 52);
    expect(onDrag).toHaveBeenLastCalledWith(60, 52, false);
    // The page does not scroll under a selecting finger.
    const move = new TouchEvent('touchmove', { cancelable: true, bubbles: true });
    page.dispatchEvent(move);
    expect(move.defaultPrevented).toBe(true);
    pointer(page, 'pointerup', 20, 52);
    expect(onDrag).toHaveBeenLastCalledWith(20, 52, true);
    expect(onGesture).toHaveBeenCalledTimes(1);
  });

  it('ends the drag where the finger was when the browser takes the touch', () => {
    vi.useFakeTimers();
    const onDrag = vi.fn();
    const { getByTestId } = render(<Page onGesture={vi.fn()} onDrag={onDrag} />);
    const page = getByTestId('page');
    pointer(page, 'pointerdown', 100, 50);
    vi.advanceTimersByTime(LONG_PRESS + 10);
    pointer(page, 'pointermove', 70, 50);
    pointer(page, 'pointercancel');
    expect(onDrag).toHaveBeenLastCalledWith(70, 50, true);
  });

  it('lets a move before the long press cancel it, as before', () => {
    vi.useFakeTimers();
    const onGesture = vi.fn(), onDrag = vi.fn();
    const { getByTestId } = render(<Page onGesture={onGesture} onDrag={onDrag} />);
    const page = getByTestId('page');
    pointer(page, 'pointerdown', 100, 50);
    pointer(page, 'pointermove', 60, 50);
    vi.advanceTimersByTime(LONG_PRESS + 10);
    expect(onGesture).not.toHaveBeenCalled();
    expect(onDrag).not.toHaveBeenCalled();
  });
});
