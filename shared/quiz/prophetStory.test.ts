import { describe, expect, it } from 'vitest';
import { STORIES } from '../quran/prophets/stories';
import { prophetAyat, prophetStoryQuiz } from './prophetStory';

const items = prophetAyat();

describe('«في قصة مَن هذه الآية؟»', () => {
  it('asks only ayat whose passage has an ayah naming the prophet, and that ayah is the reference', () => {
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(item.passage).toContain(item.key);
      expect(item.passage).toContain(item.named);
      expect(item.named).not.toBe(item.key);
    }
    const [question] = prophetStoryQuiz.questions({ range: null, filters: {} }, 'easy', () => 0.5, 1);
    expect(question.sources[0].quote).toBeTruthy();
  });

  it('never asks an ayah two stories tell, so no wrong choice is also right', () => {
    const told = new Map<string, Set<string>>();
    for (const [slug, story] of Object.entries(STORIES)) {
      for (const event of story.events) for (const { surah, range: [lo, hi] } of event.segments) {
        for (let ayah = lo; ayah <= hi; ayah++) told.set(`${surah}:${ayah}`, (told.get(`${surah}:${ayah}`) ?? new Set()).add(slug));
      }
    }
    expect(items.filter(item => told.get(item.key)!.size > 1)).toEqual([]);
  });
});
