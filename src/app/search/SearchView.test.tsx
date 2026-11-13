import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import SearchView, { hitHref, withNotes } from './SearchView';
import type { SearchGroup } from '@shared/quran/searchAll';

vi.mock('@/components/common/NavBar', () => ({ NavActions: ({ children }: { children: React.ReactNode }) => <>{children}</> }));

const groups: SearchGroup[] = [
  { kind: 'surah', hits: [{ kind: 'surah', number: 2, name: 'البقرة' }] },
  { kind: 'event', hits: [1, 2, 3, 4].map(i => ({ kind: 'event' as const, slug: 'musa', event: i, title: `حدث ${i}`, prophet: 'موسى عليه السلام' })) },
];

afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.useRealTimers(); localStorage.clear(); });

describe('the search page', () => {
  it('links each kind of result to its page', () => {
    expect(hitHref({ kind: 'ayah', key: '2:255', words: [], from: 0, to: 0 })).toBe('/quran/read/ayah/2/255');
    expect(hitHref({ kind: 'compare', a: 26, b: 7, title: '' })).toBe('/quran/compare?a=7&b=26');
    expect(hitHref({ kind: 'event', slug: 'musa', event: 9, title: '', prophet: '' })).toBe('/quran/prophets/musa?event=9');
    expect(hitHref({ kind: 'tuhfa', chapter: 1, verse: 9, first: '', second: '' })).toBe('/quran/tajwid/tuhfat-al-atfal#bayt-9');
    expect(hitHref({ kind: 'word', id: 1, name: 'فِرْعَوْن', count: 74 })).toBe(`/quran/words?w=${encodeURIComponent('فِرْعَوْن')}`);
  });

  it('adds the matching notes in their place in the order', () => {
    const merged = withNotes(groups, [{ key: '2:67', text: 'البقرة والسؤال' }, { key: '1:1', text: 'الحمد' }], 'البقرة');
    expect(merged.map(group => group.kind)).toEqual(['surah', 'event', 'note']);
    expect(merged[2].hits).toEqual([{ kind: 'note', key: '2:67', text: 'البقرة والسؤال' }]);
  });

  it('shows three results per group, the surahs first, and the arrow opens the rest', async () => {
    vi.useFakeTimers();
    const fetch = vi.fn(async () => ({ ok: true, json: async () => ({ groups }) }));
    vi.stubGlobal('fetch', fetch);
    render(<SearchView />);
    const box = screen.getByLabelText('ابحث في كل شيء');
    expect(document.activeElement).not.toBe(box);
    fireEvent.change(box, { target: { value: 'البقرة' } });
    await act(async () => { await vi.advanceTimersByTimeAsync(250); });
    expect(fetch).toHaveBeenCalledWith(`/api/search?q=${encodeURIComponent('البقرة')}`, expect.anything());
    expect(screen.getAllByRole('heading', { level: 2 }).map(heading => heading.textContent)).toEqual(['السور', 'قصص الأنبياء']);
    expect(screen.getAllByRole('link').filter(link => link.getAttribute('href')?.startsWith('/quran/prophets'))).toHaveLength(3);
    fireEvent.click(screen.getByRole('button', { name: 'قصص الأنبياء: عرض الكل' }));
    expect(screen.getAllByRole('link')).toHaveLength(4);
    expect(screen.queryByRole('heading', { name: 'السور' })).toBeNull();
  });
});
