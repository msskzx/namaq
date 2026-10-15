import { describe, expect, it } from 'vitest';
import type { SharedTopic } from '@/lib/quran/topicTypes';
import { toThemeRows } from './page';

describe('toThemeRows', () => {
  it('maps a SharedTopic to the theme/a/b shape ThemesView renders', () => {
    const shared: SharedTopic[] = [
      { slug: 'revelation-16-2', labelAr: 'الوحي والكتاب', a: { from: 2, to: 2 }, b: { from: 2, to: 5 } },
    ];
    expect(toThemeRows(shared)).toEqual([
      { theme: 'الوحي والكتاب', a: { from: 2, to: 2 }, b: { from: 2, to: 5 } },
    ]);
  });

  it('keeps one row per shared topic, in the input order', () => {
    const shared: SharedTopic[] = [
      { slug: 'a', labelAr: 'أ', a: { from: 1, to: 1 }, b: { from: 1, to: 1 } },
      { slug: 'b', labelAr: 'ب', a: { from: 2, to: 2 }, b: { from: 2, to: 2 } },
    ];
    expect(toThemeRows(shared).map((r) => r.theme)).toEqual(['أ', 'ب']);
  });
});
