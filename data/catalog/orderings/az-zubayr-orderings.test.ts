import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { placeUndated } from '@/lib/placement';
import first from './first-hijra-to-abyssinia-before-second-hijra-to-abyssinia';
import medina from './first-hijra-to-abyssinia-before-hijra-to-medina';

type Claim = { key: string; citations: { excerptArabic: string }[] };
const batch = JSON.parse(readFileSync('data/history/batches/prophet-muhammad-sira/batch.json', 'utf8')) as { claims: Claim[] };
const quoted = (key: string) =>
  batch.claims
    .find((claim) => claim.key === key)
    ?.citations.map((c) => c.excerptArabic)
    .join(' ');

describe("al-Zubayr's orderings", () => {
  it('rest on sentences that state the order', () => {
    expect(quoted('jaafar/hijra-habasha-second')).toContain('ثم خرج جعفر بن أبي طالب');
    expect(quoted('uthman/hijra-habasha-first')).toContain('فكانوا أول من هاجر إلى الحبشة');
    expect(quoted('abu-salamah/hijra-madinah-first')).toContain('قدم من الحبشة');
  });

  it('place the first hijra to Abyssinia before the second and before the hijra to Medina', () => {
    const placed = placeUndated(
      [
        { slug: 'first-hijra-to-abyssinia', hijriYear: null },
        { slug: 'second-hijra-to-abyssinia', hijriYear: 0 },
        { slug: 'hijra-to-medina', hijriYear: 1 },
      ],
      [first, medina],
    );
    expect(placed.get('first-hijra-to-abyssinia')?.to).toEqual({ slug: 'second-hijra-to-abyssinia', year: 0 });
  });
});
