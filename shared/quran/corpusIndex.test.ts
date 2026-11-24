import { afterEach, describe, expect, it, vi } from 'vitest';
import corpus from './quranText/corpus';
import { indexAyat } from './ayahSearch';
import type { BranchAyah } from './branches';

const whole = indexAyat(corpus.ayat as BranchAyah[]);
const fresh = async () => { vi.resetModules(); return import('./corpusIndex'); };

describe('the ayah search index warmed a slice at a time', () => {
  afterEach(() => vi.useRealTimers());

  it('comes out the same as the index built in one piece', async () => {
    vi.useFakeTimers();
    const { corpusIndex, warmCorpusIndex } = await fresh();
    warmCorpusIndex();
    await vi.runAllTimersAsync();
    expect(corpusIndex()).toEqual(whole);
  });

  it('is whole when a search asks before the warm-up ends', async () => {
    vi.useFakeTimers();
    const { corpusIndex, warmCorpusIndex } = await fresh();
    warmCorpusIndex();
    vi.advanceTimersToNextTimer();
    vi.advanceTimersToNextTimer();
    expect(corpusIndex()).toEqual(whole);
  });
});
