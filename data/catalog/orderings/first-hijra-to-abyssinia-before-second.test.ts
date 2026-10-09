import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { placeUndated } from '@/lib/placement';
import first from './first-hijra-to-abyssinia-before-second-hijra-to-abyssinia';

type Claim = { key: string; citations: { excerptArabic: string }[] };
const batch = JSON.parse(readFileSync('data/history/batches/prophet-muhammad-sira/batch.json', 'utf8')) as { claims: Claim[] };
const quoted = (key: string) => batch.claims.find((claim) => claim.key === key)?.citations.map((c) => c.excerptArabic).join(' ');

describe('first hijra to Abyssinia before the second', () => {
  it('rests on the sentence that follows the first party with the second', () => {
    expect(quoted('uthman/hijra-habasha-first')).toContain('فكانوا أول من هاجر إلى الحبشة');
    expect(quoted('jaafar/hijra-habasha-second')).toContain('ثم خرج جعفر بن أبي طالب');
  });

  it('places the first hijra before the year of the second', () => {
    const placed = placeUndated(
      [
        { slug: 'first-hijra-to-abyssinia', hijriYear: null },
        { slug: 'second-hijra-to-abyssinia', hijriYear: 0 },
      ],
      [first],
    );
    expect(placed.get('first-hijra-to-abyssinia')?.to).toEqual({ slug: 'second-hijra-to-abyssinia', year: 0 });
  });

  it('places the second hijra after the year of the first', () => {
    const placed = placeUndated(
      [
        { slug: 'first-hijra-to-abyssinia', hijriYear: -8 },
        { slug: 'second-hijra-to-abyssinia', hijriYear: null },
      ],
      [first],
    );
    expect(placed.get('second-hijra-to-abyssinia')?.from).toEqual({ slug: 'first-hijra-to-abyssinia', year: -8 });
  });
});
