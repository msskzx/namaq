// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import ReviewButtons from './ReviewButtons';
import type { PairCard } from './pairCards';

const refresh = vi.hoisted(() => vi.fn());
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));

const side = { surah: 2, ayah: 1, ayat: [] };
const card = (verdict: PairCard['verdict']): PairCard => ({ id: 'x', verdict, sides: [side, side] });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); refresh.mockClear(); });

describe('ReviewButtons', () => {
  it('sends the choice and refreshes the page', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    render(<ReviewButtons a={2} b={3} cards={[card({ keep: true, why: '' })]} />);
    fireEvent.click(screen.getByRole('button', { name: 'حذف' }));
    await waitFor(() => expect(refresh).toHaveBeenCalled());
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ a: 2, b: 3, action: 'drop' });
  });

  it('shows the current choice, and pressing it again restores the draft', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    render(<ReviewButtons a={2} b={3} cards={[card({ keep: false, why: '', checked: true })]} />);
    const drop = screen.getByRole('button', { name: 'حذف' });
    expect(drop.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'موافق' }).getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(drop);
    await waitFor(() => expect(refresh).toHaveBeenCalled());
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).action).toBe('undo');
  });

  it('links to the next unreviewed page when there is one', () => {
    render(<ReviewButtons a={2} b={3} cards={[card({ keep: true, why: '' })]} nextHref="/quran/compare?a=2&b=4&review=1" />);
    expect(screen.getByRole('link', { name: 'التالية غير المراجَعة' }).getAttribute('href')).toBe('/quran/compare?a=2&b=4&review=1');
  });

  it('says so when saving fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    render(<ReviewButtons a={2} b={3} cards={[card({ keep: true, why: '' })]} />);
    fireEvent.click(screen.getByRole('button', { name: 'موافق' }));
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('تعذّر'));
    expect(refresh).not.toHaveBeenCalled();
  });
});
