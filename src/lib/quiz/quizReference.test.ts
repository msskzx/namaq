import { describe, expect, it } from 'vitest';
import { selectQuizReference } from './quizReference';

const citation = (over: Record<string, unknown> = {}) => ({
  subjectKind: 'PERSON',
  subjectSlug: 'zaynab-bint-jahsh',
  excerptArabic: 'نص الشاهد',
  pageReference: '5',
  source: { title: 'سير أعلام النبلاء' },
  passage: { anchor: '5-p3', page: { accountId: 'account-1', sequence: 3 } },
  ...over,
});

const claim = (key: string, citations: ReturnType<typeof citation>[]) => ({ authoringKey: key, citations });

describe('selectQuizReference', () => {
  it('returns the first usable passage in stable claim and citation order', () => {
    const reference = selectQuizReference(
      ['zaynab/second', 'zaynab/first'],
      [
        claim('zaynab/second', [citation({ excerptArabic: 'الثاني', passage: { anchor: '6-p1', page: { accountId: 'account-1', sequence: 6 } } })]),
        claim('zaynab/first', [
          citation({ excerptArabic: 'الأول متأخر', passage: { anchor: '7-p1', page: { accountId: 'account-1', sequence: 7 } } }),
          citation({ excerptArabic: 'الأول', passage: { anchor: '5-p3', page: { accountId: 'account-1', sequence: 3 } } }),
        ]),
      ],
    );
    expect(reference).toEqual({
      excerptArabic: 'الأول',
      sourceTitle: 'سير أعلام النبلاء',
      pageReference: '5',
      readerUrl: '/people/zaynab-bint-jahsh?book=account-1&page=3&passage=5-p3',
    });
  });

  it('skips citations without a passage page and claims without usable citations', () => {
    expect(selectQuizReference(
      ['zaynab/empty', 'zaynab/pageless'],
      [
        claim('zaynab/empty', []),
        claim('zaynab/pageless', [citation({ passage: null }), citation({ subjectKind: 'EVENT', subjectSlug: 'badr' })]),
      ],
    )).toBeNull();
  });

  it('returns null when no claim key resolves', () => {
    expect(selectQuizReference(['zaynab/missing'], [])).toBeNull();
  });
});
