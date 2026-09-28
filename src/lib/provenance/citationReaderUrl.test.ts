import { describe, expect, it } from 'vitest';
import { citationReaderUrl } from './citationReaderUrl';

describe('citationReaderUrl', () => {
  it('points at the cited page when the citation has no passage anchor', () => {
    expect(citationReaderUrl({ subjectSlug: 'zaynab-bint-jahsh', accountId: 'account-1', sequence: 3 })).toBe(
      '/people/zaynab-bint-jahsh?book=account-1&page=3',
    );
  });

  it('targets the exact passage when the citation names one', () => {
    expect(citationReaderUrl({ subjectSlug: 'zaynab-bint-jahsh', accountId: 'account-1', sequence: 3, anchor: '5-p3' })).toBe(
      '/people/zaynab-bint-jahsh?book=account-1&page=3&passage=5-p3',
    );
  });
});
