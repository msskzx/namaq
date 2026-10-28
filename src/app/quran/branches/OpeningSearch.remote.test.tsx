// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import OpeningSearch from './OpeningSearch';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }), usePathname: () => '/quran/branches', useSearchParams: () => new URLSearchParams() }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar', languageLoaded: true }) }));
afterEach(() => { cleanup(); vi.unstubAllGlobals(); push.mockClear(); });

describe('remote phrase suggestions', () => {
  it('removes old selectable suggestions while the new juz request is pending', async () => {
    const replies: ((value: unknown) => void)[] = [];
    const urls: string[] = [];
    const fetch = vi.fn((url: string) => { urls.push(url); return new Promise(resolve => replies.push(resolve)); });
    vi.stubGlobal('fetch', fetch);
    const props = { phrases: [], top: [], current: '', remote: true, view: { scope: 'inside' as const } };
    const { rerender } = render(<OpeningSearch {...props} juz={{ from: 1, to: 30 }} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'متنا' } });
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    replies[0]({ ok: true, json: async () => ({ suggestions: [{ id: 'old', text: 'متنا وكنا ترابا', count: 5, kind: 'inside' }] }) });
    await screen.findByRole('option', { name: /متنا وكنا ترابا/ });
    rerender(<OpeningSearch {...props} juz={{ from: 30, to: 30 }} />);
    expect(screen.queryByRole('option', { name: /متنا وكنا ترابا/ })).toBeNull();
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    expect(urls[1]).toContain('juzFrom=30');
    replies[1]({ ok: true, json: async () => ({ suggestions: [] }) });
    await waitFor(() => expect(screen.queryAllByRole('option')).toHaveLength(0));
  });
});
