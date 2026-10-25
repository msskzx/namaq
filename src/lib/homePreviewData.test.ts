import { describe, expect, it, vi } from 'vitest';
import { getHomePreviews } from './homePreviewData';
import { keys, size } from './quran/branches';

vi.mock('@/lib/modelUnits', () => ({ loadUnitView: async (id: string) => {
  const { hadithView } = await import('./model/hadithView');
  return hadithView(id);
} }));

describe('homepage preview data', () => {
  it('keeps all six branches and the exact requested comparison ranges', async () => {
    const data = await getHomePreviews();
    expect(size(data.branches.tree)).toBe(6);
    expect(keys(data.branches.tree).sort()).toEqual(['15:45', '44:51', '51:15', '52:17', '54:54', '77:41']);
    expect(data.comparisons.map(pair => [pair.a.number, pair.b.number])).toEqual([[41, 113], [42, 114], [43, 115], [44, 116], [45, 117]]);
    expect(data.comparisons.every(pair => pair.a.display.length > 0 && pair.b.display.length > 0)).toBe(true);
    expect(data.comparisons.some(pair => pair.different.a.length > 0)).toBe(true);
  });

  it('matches words by root and out of order, so جاء meets وجاء and قالوا counts after فرعون', async () => {
    const { comparisons } = await getHomePreviews();
    expect(comparisons[0].rooted).toEqual({ a: [1, 4, 5], b: [0, 2, 4] });
    expect(comparisons[0].different).toEqual({ a: [0], b: [] });
    expect(comparisons[3].rooted).toEqual({ a: [0, 3], b: [1, 0] });
    expect(comparisons[4].different).toEqual({ a: [], b: [0, 1, 3] });
  });

  it('keeps timeline milestones without verse reference labels', async () => {
    const data = await getHomePreviews();
    expect(data.timeline).toHaveLength(25);
    expect(data.timeline[0].surahCount).toBe(3);
    expect(data.timeline[3].surahCount).toBe(6);
    expect(data.timeline[24].surahCount).toBe(19);
    expect(data.timeline.every(event => event.title && event.titleEn && event.phase && event.phaseEn)).toBe(true);
    expect(data.timeline[0]).not.toHaveProperty('references');
    expect(data.timeline[0]).not.toHaveProperty('lines');
  });

  it('provides the complete hadith model used by the source page', async () => {
    const { hadith } = await getHomePreviews();
    const { hadithView } = await import('./model/hadithView');
    expect(hadith).toEqual(hadithView('muslim-jibril'));
    expect(hadith?.reports[0].scenes).toHaveLength(2);
    expect(hadith?.reports[0].scenes[1].lines.length).toBeGreaterThan(10);
  });

  it('uses an existing approved question and retains a link to its biography and sources', async () => {
    const { question } = await getHomePreviews();
    expect(question?.prompt).toBe('من وقى النبي ﷺ بيده يوم أُحد حتى شُلّت؟');
    expect(question?.answer).toBe('talhah-ibn-ubaydullah');
    expect(question?.choices.some(choice => choice.value === question.answer)).toBe(true);
    expect(question?.profile).toBe('/people/talhah-ibn-ubaydullah');
  });
});
