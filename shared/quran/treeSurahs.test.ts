import { describe, expect, it } from 'vitest';
import { treeSurahs } from './treeSurahs';

describe('treeSurahs', () => {
  it('groups ayat by surah in mushaf order, each surah once', () => {
    expect(treeSurahs(['51:15', '15:45', '52:17', '15:45', '2:10', '2:9'])).toEqual([
      { surah: 2, ayahKeys: ['2:9', '2:10'] },
      { surah: 15, ayahKeys: ['15:45'] },
      { surah: 51, ayahKeys: ['51:15'] },
      { surah: 52, ayahKeys: ['52:17'] },
    ]);
  });
});
