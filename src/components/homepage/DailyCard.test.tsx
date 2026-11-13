import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import DailyCard from './DailyCard';

afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('homepage daily card', () => {
  it('links today\'s juz to its first ayah in the reader', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 10, 13, 12)); // 3 Jumada II 1448
    render(<DailyCard pair={null} names={new Map()} ar />);
    const link = screen.getByRole('link', { name: 'اقرأ الجزء ٣، جزء اليوم' });
    expect(link.getAttribute('href')).toBe('/quran/read/ayah/2/253');
  });

  it('gives the last day of a 29-day month both last juz', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 11, 9, 12)); // 29 Jumada II 1448, the month's last day
    render(<DailyCard pair={null} names={new Map()} ar />);
    const link = screen.getByRole('link', { name: 'اقرأ الجزءان ٢٩ و٣٠، جزء اليوم' });
    expect(link.getAttribute('href')).toBe('/quran/read/ayah/67/1');
  });
});
