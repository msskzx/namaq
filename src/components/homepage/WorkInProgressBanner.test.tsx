import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import WorkInProgressBanner from './WorkInProgressBanner';
import translations from '../language/translations';

const { state } = vi.hoisted(() => ({ state: { language: 'ar' as 'ar' | 'en', languageLoaded: true } }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => state }));
beforeEach(() => { sessionStorage.clear(); vi.useFakeTimers(); state.languageLoaded = true; });
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.useRealTimers(); });
describe('homepage review notice', () => {
  it.each(['ar', 'en'] as const)('shows the existing disclaimer in %s and dismisses after five seconds in Strict Mode', language => {
    state.language = language;
    render(<StrictMode><WorkInProgressBanner /></StrictMode>);
    expect(screen.getByRole('status').textContent).toContain(translations[language].workInProgress);
    act(() => { vi.advanceTimersByTime(4999); });
    expect(screen.getByRole('status')).toBeTruthy();
    act(() => { vi.advanceTimersByTime(1); });
    expect(screen.queryByRole('status')).toBeNull();
  });
  it('closes on demand and stays dismissed when revisiting during the session', () => {
    state.language = 'en';
    const view = render(<WorkInProgressBanner />);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notice' }));
    expect(screen.queryByRole('status')).toBeNull();
    view.unmount();
    render(<WorkInProgressBanner />);
    expect(screen.queryByRole('status')).toBeNull();
  });
  it('waits for language readiness before starting the timer', () => {
    state.languageLoaded = false;
    const view = render(<WorkInProgressBanner />);
    act(() => { vi.advanceTimersByTime(6000); });
    expect(screen.queryByRole('status')).toBeNull();
    state.languageLoaded = true;
    view.rerender(<WorkInProgressBanner />);
    expect(screen.getByRole('status')).toBeTruthy();
  });
  it('still displays and times out when session storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Blocked'); });
    render(<WorkInProgressBanner />);
    expect(screen.getByRole('status')).toBeTruthy();
    act(() => { vi.advanceTimersByTime(5000); });
    expect(screen.queryByRole('status')).toBeNull();
  });
});
