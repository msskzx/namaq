import { describe, expect, it } from 'vitest';
import { surahOrder } from './compareCards';

describe('surahOrder', () => {
  it('lists each surah\'s pairs under it, in the side pane\'s order', () => {
    const pairs = [{ a: 2, b: 3, count: 1 }, { a: 2, b: 4, count: 1 }, { a: 3, b: 4, count: 1 }, { a: 3, b: 5, count: 1 }];
    expect(surahOrder(pairs).map(visit => `${visit.lead}·${visit.other}`)).toEqual(['2·3', '2·4', '3·2', '3·4', '3·5', '4·2', '4·3', '5·3']);
  });
});
