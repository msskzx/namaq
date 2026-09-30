import { describe, expect, it } from 'vitest';
import { selectQuizReference } from './quizReference';

const citation = (over: Record<string, unknown> = {}) => ({
  subjectKind: 'PERSON',
  subjectSlug: 'zaynab-bint-jahsh',
  excerptArabic: 'نص الشاهد',
  pageReference: '5',
  source: { title: 'سير أعلام النبلاء' },
  passage: { anchor: '4/5-p3', page: { printedPage: 3, volume: { number: 4 } } },
  ...over,
});

const claim = (key: string, citations: ReturnType<typeof citation>[]) => ({ authoringKey: key, citations });

describe('selectQuizReference', () => {
  it('returns the first usable passage in stable claim and citation order', () => {
    const reference = selectQuizReference(
      ['zaynab/second', 'zaynab/first'],
      [
        claim('zaynab/second', [
          citation({ excerptArabic: 'الثاني', passage: { anchor: '4/6-p1', page: { printedPage: 6, volume: { number: 4 } } } }),
        ]),
        claim('zaynab/first', [
          citation({ excerptArabic: 'الأول متأخر', passage: { anchor: '4/7-p1', page: { printedPage: 7, volume: { number: 4 } } } }),
          citation({ excerptArabic: 'الأول', passage: { anchor: '4/5-p3', page: { printedPage: 3, volume: { number: 4 } } } }),
        ]),
      ],
    );
    expect(reference).toEqual({
      excerptArabic: 'الأول',
      sourceTitle: 'سير أعلام النبلاء',
      pageReference: '5',
      readerUrl: '/people/zaynab-bint-jahsh?volume=4&page=3&passage=4%2F5-p3',
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
