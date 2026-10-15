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
  it('joins topics present in both surahs by themeId, not slug', () => {
    // Slugs are surah-scoped by annotation convention and never collide across surahs,
    // so themeId is the only key both surahs can share.
    const a = [instance({ slug: 'wahy-16-1', themeId: 'revelation', surah: 16, ayahFrom: 2, ayahTo: 2, labelAr: 'الوحي' })];
    const b = [instance({ slug: 'wahy-43-1', themeId: 'revelation', surah: 43, ayahFrom: 2, ayahTo: 5, labelAr: 'الوحي' })];

    expect(sharedTopicsFromInstances(a, b)).toEqual([
      { slug: 'revelation', labelAr: 'الوحي', a: { from: 2, to: 2 }, b: { from: 2, to: 5 } },
    ]);
  });

  it('skips topics with no themeId', () => {
    const a = [instance({ themeId: null })];
    const b = [instance({ themeId: null })];

    expect(sharedTopicsFromInstances(a, b)).toEqual([]);
  });

  it('skips themes that only appear on one side', () => {
    const a = [instance({ themeId: 'only-a' })];
    const b = [instance({ themeId: 'only-b' })];

    expect(sharedTopicsFromInstances(a, b)).toEqual([]);
  });

  it('merges multiple rows sharing a themeId into one span, from min to max ayah', () => {
    const a = [
      instance({ themeId: 'denial', ayahFrom: 5, ayahTo: 6 }),
      instance({ themeId: 'denial', ayahFrom: 10, ayahTo: 12 }),
    ];
    const b = [instance({ themeId: 'denial', ayahFrom: 1, ayahTo: 3 })];

    expect(sharedTopicsFromInstances(a, b)).toEqual([
      { slug: 'denial', labelAr: 'موضوع', a: { from: 5, to: 12 }, b: { from: 1, to: 3 } },
    ]);
  });

  it('preserves the order themes appear in on side a', () => {
    const a = [
      instance({ themeId: 'second', ayahFrom: 5 }),
      instance({ themeId: 'first', ayahFrom: 1 }),
    ];
    const b = [instance({ themeId: 'first' }), instance({ themeId: 'second' })];

    expect(sharedTopicsFromInstances(a, b).map((t) => t.slug)).toEqual(['second', 'first']);
  });

  it('uses side a\'s label when the same themeId has different wording on each side', () => {
    const a = [instance({ themeId: 'x', labelAr: 'تسمية أ' })];
    const b = [instance({ themeId: 'x', labelAr: 'تسمية ب' })];

    expect(sharedTopicsFromInstances(a, b)[0].labelAr).toBe('تسمية أ');
  });
});
