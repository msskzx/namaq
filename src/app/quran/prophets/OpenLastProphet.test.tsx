import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import OpenLastProphet, { PROPHET_PICKED, rememberProphet } from './OpenLastProphet';

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace }) }));
vi.mock('@/components/common/LoadingDots', () => ({ default: () => null }));

afterEach(() => { cleanup(); localStorage.clear(); replace.mockClear(); });

describe('the prophets tab', () => {
  it('opens Musa’s story until another is picked', () => {
    render(<OpenLastProphet />);
    expect(replace).toHaveBeenCalledWith('/quran/prophets/musa');
  });

  it('opens the story last read on this device, and ignores an unknown one', () => {
    rememberProphet('adam');
    render(<OpenLastProphet />);
    expect(replace).toHaveBeenCalledWith('/quran/prophets/adam');
    cleanup();
    localStorage.setItem(PROPHET_PICKED, 'nobody');
    render(<OpenLastProphet />);
    expect(replace).toHaveBeenLastCalledWith('/quran/prophets/musa');
  });
});
