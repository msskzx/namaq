import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { legacyUnreviewed } from '@/lib/catalog/types';
import { placeUndated } from '@/lib/placement';
import firstToMedina from './first-hijra-to-abyssinia-before-hijra-to-medina';
import islam from './islam-of-az-zubayr-before-first-hijra-to-abyssinia';
import medina from './second-hijra-to-abyssinia-before-hijra-to-medina';

type Claim = { key: string; citations: { excerptArabic: string }[] };
const claims = ['prophet-muhammad-sira', 'az-zubayr-ibn-al-awwam'].flatMap(
  (batch) => (JSON.parse(readFileSync(`data/history/batches/${batch}/batch.json`, 'utf8')) as { claims: Claim[] }).claims,
);
const quoted = (key: string) => claims.find((claim) => claim.key === key)?.citations.map((c) => c.excerptArabic).join(' ');

describe('orderings the owner gave, as far as the text states them', () => {
  it('rests the Islam of al-Zubayr on his Islam and on the Muslims who left for Abyssinia', () => {
    expect(islam.claims).toEqual(['zubayr/islam', 'zubayr/muslims-left-habasha']);
    expect(quoted('zubayr/islam')).toContain('عَلَى يَدِ أَبِي بَكْرٍ: الزُّبَيْرُ');
    expect(quoted('zubayr/muslims-left-habasha')).toContain('فخرج عند ذلك المسلمون');
    expect(quoted('zubayr/muslims-left-habasha')).toContain('والزبير بن العوام');
  });

  it('rests the first hijra before the hijra to Medina on Abu Salamah, who came from Abyssinia and then emigrated', () => {
    expect(firstToMedina.claims).toEqual(['abu-salamah/hijra-habasha-first', 'abu-salamah/hijra-madinah-first']);
    expect(quoted('abu-salamah/hijra-habasha-first')).toContain('فكانوا أول من هاجر إلى الحبشة');
    expect(quoted('abu-salamah/hijra-madinah-first')).toContain('قد كان قدم من الحبشة مكة');
    expect(quoted('abu-salamah/hijra-madinah-first')).toContain('فهاجر إلى المدينة');
  });

  it('keeps the second hijra before the hijra to Medina legacy, since no sentence orders them', () => {
    expect(medina.claims).toBe(legacyUnreviewed);
  });

  it('places the second hijra to Abyssinia before the hijra to Medina', () => {
    const placed = placeUndated(
      [
        { slug: 'second-hijra-to-abyssinia', hijriYear: null },
        { slug: 'hijra-to-medina', hijriYear: 0 },
      ],
      [medina],
    );
    expect(placed.get('second-hijra-to-abyssinia')?.to).toEqual({ slug: 'hijra-to-medina', year: 0 });
  });

  it('places the first hijra to Abyssinia before the hijra to Medina', () => {
    const placed = placeUndated(
      [
        { slug: 'first-hijra-to-abyssinia', hijriYear: null },
        { slug: 'hijra-to-medina', hijriYear: 0 },
      ],
      [firstToMedina],
    );
    expect(placed.get('first-hijra-to-abyssinia')?.to).toEqual({ slug: 'hijra-to-medina', year: 0 });
  });

  it('places the Islam of al-Zubayr before the first hijra to Abyssinia', () => {
    const placed = placeUndated(
      [
        { slug: 'islam-of-az-zubayr', hijriYear: null },
        { slug: 'first-hijra-to-abyssinia', hijriYear: -8 },
      ],
      [islam],
    );
    expect(placed.get('islam-of-az-zubayr')?.to).toEqual({ slug: 'first-hijra-to-abyssinia', year: -8 });
  });
});
