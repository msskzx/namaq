// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SWRConfig } from 'swr';
import SourceContents from './SourceContents';
import type { VolumeContents } from '@/types/provenance';

vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: 'ar' }),
}));

const { fetchJson } = vi.hoisted(() => ({ fetchJson: vi.fn() }));
vi.mock('@/lib/swr', () => ({ fetcher: (url: string) => fetchJson(url) }));

function volumeContents(overrides: Partial<VolumeContents> = {}): VolumeContents {
  return {
    number: 1,
    name: null,
    firstPrintedPage: 29,
    lastPrintedPage: 34,
    skippedPrintedPages: [],
    items: [
      { printedPage: '29', entries: [], headings: ['السيرة النبوية', 'ذكر نسب سيد البشر'] },
      { printedPage: '30', entries: [], headings: [] },
      { printedPage: '31', entries: [], headings: [] },
      {
        printedPage: '32',
        entries: [{ accountId: 'a1', subjectKind: 'PERSON', subjectSlug: 'prophet-muhammad', label: 'محمد ﷺ' }],
        headings: ['مولده المبارك'],
      },
      {
        printedPage: '34',
        entries: [{ accountId: 'a2', subjectKind: 'PERSON', subjectSlug: 'al-kilabiyyah', label: 'الكلابية' }],
        headings: [],
      },
    ],
    ...overrides,
  };
}

afterEach(() => {
  cleanup();
  fetchJson.mockReset();
});

describe('SourceContents', () => {
  it('lists the book\'s own headings, not every page and not an entry\'s person name', async () => {
    fetchJson.mockResolvedValue(volumeContents());

    render(
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        <SourceContents
          slug="siyar-alam-al-nubala-risalah"
          volumes={[{ number: 1, name: null }]}
          accounts={[{ id: 'a1', volumes: [{ number: 1 }] } as never]}
        />
      </SWRConfig>,
    );

    fireEvent.click(screen.getByRole('button', { name: /الجزء 1/ }));

    await waitFor(() => expect(screen.getByText('السيرة النبوية')).toBeTruthy());

    expect(screen.getByText('السيرة النبوية').tagName).toBe('A');
    expect(screen.getByText('ذكر نسب سيد البشر')).toBeTruthy();
    expect(screen.getByText('مولده المبارك')).toBeTruthy();
    expect(screen.queryByText('محمد ﷺ')).toBeNull();
    expect(screen.getByText('الكلابية').tagName).toBe('A');
    expect(screen.queryByText('ص 30')).toBeNull();
    expect(screen.queryByText('ص 31')).toBeNull();
  });
});
