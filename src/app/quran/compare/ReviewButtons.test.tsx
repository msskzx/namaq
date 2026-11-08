// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import ReviewButtons, { CardReview } from './ReviewButtons';
import type { PairCard } from './pairCards';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
const refresh = vi.hoisted(() => vi.fn());
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));

const side = { surah: 2, ayah: 1, ayat: [] };
const card = (verdict: PairCard['verdict']): PairCard => ({ id: 'x', verdict, sides: [side, side] });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); refresh.mockClear(); });

describe('ReviewButtons', () => {
  it('sends the choice and refreshes the page', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    render(<ReviewButtons a={2} b={3} cards={[card({ keep: true, why: '' })]} />);
    fireEvent.click(screen.getByRole('button', { name: 'حذف' }));
    expect(screen.getByRole('button', { name: 'حذف' }).getAttribute('aria-pressed')).toBe('true');
    await waitFor(() => expect(refresh).toHaveBeenCalled());
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ a: 2, b: 3, action: 'drop' });
    expect(fetchMock.mock.calls[0][1].keepalive).toBe(true);
  });

  it('shows the current choice, and pressing it again restores the draft', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    render(<ReviewButtons a={2} b={3} cards={[card({ keep: false, why: '', checked: true })]} />);
    const drop = screen.getByRole('button', { name: 'حذف' });
    expect(drop.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'موافق' }).getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(drop);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).action).toBe('undo');
    expect(drop.getAttribute('aria-pressed')).toBe('false');
  });

  it('sends a card press with every pair of the card and shows it at once', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    render(<CardReview a={2} b={3} card={{ id: 'r', pairs: [{ id: '2:1|3:1' }, { id: '2:2|3:2' }], sides: [side, side] }} />);
    const discuss = screen.getByRole('button', { name: 'للنقاش' });
    fireEvent.click(discuss);
    expect(discuss.getAttribute('aria-pressed')).toBe('true');
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ a: 2, b: 3, action: 'discuss', card: ['2:1|3:1', '2:2|3:2'] });
    await waitFor(() => expect(refresh).toHaveBeenCalled());
  });

  it('undoes a card choice when it is pressed again', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    render(<CardReview a={2} b={3} card={{ ...card({ keep: true, why: '', checked: true }), id: '2:1|3:1' }} />);
    const keep = screen.getByRole('button', { name: 'إبقاء' });
    expect(keep.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(keep);
    expect(keep.getAttribute('aria-pressed')).toBe('false');
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ a: 2, b: 3, action: 'undo', card: ['2:1|3:1'] });
  });

  it('shows the page choice from the pairs no card press decided', () => {
    vi.stubGlobal('fetch', vi.fn());
    render(<ReviewButtons a={2} b={3} cards={[card({ keep: true, why: '', checked: true, card: true }), card({ keep: false, why: '', checked: true })]} />);
    expect(screen.getByRole('button', { name: 'حذف' }).getAttribute('aria-pressed')).toBe('true');
  });

  it('disables the page choices when every card is decided on its own', () => {
    render(<ReviewButtons a={2} b={3} cards={[card({ keep: true, why: '', checked: true, card: true })]} />);
    expect((screen.getByRole('button', { name: 'موافق' }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole('button', { name: 'حذف' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('links to the next unreviewed page when there is one', () => {
    render(<ReviewButtons a={2} b={3} cards={[card({ keep: true, why: '' })]} nextHref="/quran/compare?a=2&b=4&review=1" />);
    expect(screen.getByRole('link', { name: 'التالية غير المراجَعة' }).getAttribute('href')).toBe('/quran/compare?a=2&b=4&review=1');
  });

  it('sends a press again while the server is recompiling', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce({ ok: false, status: 404 }).mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal('fetch', fetchMock);
    render(<CardReview a={2} b={3} card={card({ keep: true, why: '' })} />);
    fireEvent.click(screen.getByRole('button', { name: 'إبقاء' }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2), { timeout: 2000 });
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('says so when saving fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    render(<ReviewButtons a={2} b={3} cards={[card({ keep: true, why: '' })]} />);
    fireEvent.click(screen.getByRole('button', { name: 'موافق' }));
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('تعذّر'));
  });
});
