// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { branchesHref } from '@/lib/quran/branches';
import { LanguageProvider } from '@/components/language/LanguageContext';
import OpeningList, { PER_PAGE } from './OpeningList';

afterEach(cleanup);

const openings = Array.from({ length: PER_PAGE + 2 }, (_, i) => ({ id: `قال رب${i}`, text: `قال رب${i}`, count: 2, ayat: [{ key: '20:25', page: 313 }, { key: '26:83', page: 370 }] }));

describe('OpeningList', () => {
  it('lists each opening with a link to its tree in the chosen juz\' and its ayat', () => {
    render(<LanguageProvider><OpeningList openings={openings} names={{ 20: 'طه' }} juz={{ from: 16, to: 19 }} /></LanguageProvider>);
    const rows = within(screen.getByRole('list', { name: 'الفواتح المشتركة' })).getAllByRole('listitem');
    expect(rows).toHaveLength(PER_PAGE);
    expect(within(rows[0]).getByRole('link', { name: 'قال رب0' }).getAttribute('href')).toBe(branchesHref('قال رب0', { from: 16, to: 19 }));
    expect(within(rows[0]).getByRole('link', { name: 'طه ٢٥' }).getAttribute('href')).toBe('/quran/read/313');
    expect(within(rows[0]).getByRole('link', { name: '٢٦ ٨٣' })).toBeTruthy();
  });

  it('pages through the openings', () => {
    render(<LanguageProvider><OpeningList openings={openings} names={{}} juz={null} /></LanguageProvider>);
    fireEvent.click(screen.getAllByRole('button').at(-1)!);
    expect(within(screen.getByRole('list', { name: 'الفواتح المشتركة' })).getAllByRole('listitem')).toHaveLength(2);
  });
});
