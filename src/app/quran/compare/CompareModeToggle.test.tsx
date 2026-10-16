import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import CompareModeToggle from './CompareModeToggle';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

describe('CompareModeToggle', () => {
  beforeEach(() => push.mockClear());
  afterEach(cleanup);

  it('goes to the themes view when switched on', () => {
    render(<CompareModeToggle themes={false} textHref="/quran/compare?a=1" themesHref="/quran/compare?mode=themes&a=1" />);
    fireEvent.click(screen.getByRole('checkbox', { name: 'المقارنة بالمواضيع' }));
    expect(push).toHaveBeenCalledWith('/quran/compare?mode=themes&a=1');
  });

  it('goes back to the text view when switched off', () => {
    render(<CompareModeToggle themes textHref="/quran/compare?a=1" themesHref="/quran/compare?mode=themes&a=1" />);
    fireEvent.click(screen.getByRole('checkbox', { name: 'المقارنة بالمواضيع' }));
    expect(push).toHaveBeenCalledWith('/quran/compare?a=1');
  });
});
