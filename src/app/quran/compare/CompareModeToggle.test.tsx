import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import CompareModeToggle from './CompareModeToggle';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

describe('CompareModeToggle', () => {
  beforeEach(() => push.mockClear());
  afterEach(cleanup);

  it('goes to the themes view when switched on', () => {
    render(<CompareModeToggle on={false} offHref="/quran/compare?a=1" onHref="/quran/compare?mode=themes&a=1" />);
    fireEvent.click(screen.getByRole('switch', { name: 'المقارنة بالمواضيع' }));
    expect(push).toHaveBeenCalledWith('/quran/compare?mode=themes&a=1');
  });

  it('goes back to the text view when switched off', () => {
    render(<CompareModeToggle on offHref="/quran/compare?a=1" onHref="/quran/compare?mode=themes&a=1" />);
    fireEvent.click(screen.getByRole('switch', { name: 'المقارنة بالمواضيع' }));
    expect(push).toHaveBeenCalledWith('/quran/compare?a=1');
  });
});
