import { describe, expect, it } from 'vitest';
import { ayahPlaces } from './ayahPlaces';

describe('ayahPlaces', () => {
  it('names each surah once, in the mushaf order, with its ayat in order', () => {
    expect(ayahPlaces(['3:112', '2:61', '3:21', '3:21'], { 2: 'البقرة', 3: 'آل عمران' })).toBe('البقرة ٦١ · آل عمران ٢١، ١١٢');
  });
});
