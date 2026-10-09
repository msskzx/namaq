import { describe, expect, it } from 'vitest';
import { legacyUnreviewed } from '@/lib/catalog/types';
import { placeUndated } from '@/lib/placement';
import islam from './islam-of-az-zubayr-before-first-hijra-to-abyssinia';
import medina from './second-hijra-to-abyssinia-before-hijra-to-medina';

describe('orderings the owner gave before the text is extracted', () => {
  it('carry the legacy-unreviewed marker', () => {
    expect(islam.claims).toBe(legacyUnreviewed);
    expect(medina.claims).toBe(legacyUnreviewed);
  });

  it('place the second hijra to Abyssinia before the hijra to Medina', () => {
    const placed = placeUndated(
      [
        { slug: 'second-hijra-to-abyssinia', hijriYear: null },
        { slug: 'hijra-to-medina', hijriYear: 0 },
      ],
      [medina],
    );
    expect(placed.get('second-hijra-to-abyssinia')?.to).toEqual({ slug: 'hijra-to-medina', year: 0 });
  });

  it('place the Islam of al-Zubayr before the first hijra to Abyssinia', () => {
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
