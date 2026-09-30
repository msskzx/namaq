import { describe, expect, it } from 'vitest';
import { citationReaderUrl } from './citationReaderUrl';

describe('citationReaderUrl', () => {
  it('points at the cited page when the citation has no passage anchor', () => {
    expect(citationReaderUrl({ subjectSlug: 'zaynab-bint-jahsh', volumeNumber: 4, printedPage: 3 })).toBe(
      '/people/zaynab-bint-jahsh?volume=4&page=3',
    );
  });

  it('targets the exact passage when the citation names one', () => {
    expect(
      citationReaderUrl({ subjectSlug: 'zaynab-bint-jahsh', volumeNumber: 4, printedPage: 3, anchor: '4/5-p3' }),
    ).toBe('/people/zaynab-bint-jahsh?volume=4&page=3&passage=4%2F5-p3');
  });
});
