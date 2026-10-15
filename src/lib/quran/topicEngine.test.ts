import { describe, expect, it } from 'vitest';
import { sharedTopicsFromInstances } from './topicEngine';
import type { TopicInstance } from './topicTypes';

function instance(overrides: Partial<TopicInstance>): TopicInstance {
  return {
    slug: 'topic',
    labelAr: 'موضوع',
    themeId: null,
    surah: 1,
    ayahFrom: 1,
    ayahTo: 1,
    excerptAr: 'نص',
    alternativeOf: null,
    ...overrides,
  };
}

describe('sharedTopicsFromInstances', () => {
  it('joins topics present in both surahs by slug', () => {
    const a = [instance({ slug: 'wahy', surah: 16, ayahFrom: 2, ayahTo: 2, labelAr: 'الوحي' })];
    const b = [instance({ slug: 'wahy', surah: 43, ayahFrom: 2, ayahTo: 5, labelAr: 'الوحي' })];

    expect(sharedTopicsFromInstances(a, b)).toEqual([
      { slug: 'wahy', labelAr: 'الوحي', a: { from: 2, to: 2 }, b: { from: 2, to: 5 } },
    ]);
  });

  it('skips topics that only appear on one side', () => {
    const a = [instance({ slug: 'only-a' })];
    const b = [instance({ slug: 'only-b' })];

    expect(sharedTopicsFromInstances(a, b)).toEqual([]);
  });

  it('preserves the order topics appear in on side a', () => {
    const a = [
      instance({ slug: 'second', ayahFrom: 5 }),
      instance({ slug: 'first', ayahFrom: 1 }),
    ];
    const b = [instance({ slug: 'first' }), instance({ slug: 'second' })];

    expect(sharedTopicsFromInstances(a, b).map((t) => t.slug)).toEqual(['second', 'first']);
  });

  it('uses side a\'s label when the same slug has different wording on each side', () => {
    const a = [instance({ slug: 'x', labelAr: 'تسمية أ' })];
    const b = [instance({ slug: 'x', labelAr: 'تسمية ب' })];

    expect(sharedTopicsFromInstances(a, b)[0].labelAr).toBe('تسمية أ');
  });
});
