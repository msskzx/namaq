import type { CatalogPerson } from '@/lib/catalog/types';

/**
 * Authored from chapter two of data/history/batches/prophet-muhammad-sira. He
 * stays declared in prisma/personSeedData.ts, so the catalog only adds to him:
 * his own Siyar entry has not been read yet, and taking the seed's authorship
 * away now would put the legacy marker on everything it holds.
 */
const abuBakrAsSiddiq = {
  kind: 'PERSON',
  slug: 'abu-bakr-as-siddiq',
  name: 'أبو بكر الصديق',
  nameTransliterated: 'Abu Bakr as-Siddiq',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['abu-bakr/sex'] },
  },

  // The title is not new, only newly cited for him. The chapter gives the
  // naming outright: he affirmed the Isra' when others turned back, فلذلك سمي
  // أبو بكر الصديق.
  titles: [{ title: 'siddiq-al-ummah', claims: ['abu-bakr/siddiq'] }],

  // Three verses for one occasion: the chapter quotes الروم ٢-٤ whole as what
  // came down over the wager he made, so the link is recorded verse by verse
  // rather than collapsed to the one that carries بضع سنين.
  ayat: [
    { surah: 30, ayah: 2, claims: ['abu-bakr/ayah-ar-rum'] },
    { surah: 30, ayah: 3, claims: ['abu-bakr/ayah-ar-rum'] },
    { surah: 30, ayah: 4, claims: ['abu-bakr/ayah-ar-rum'] },
  ],
  relations: [],
} satisfies CatalogPerson;

export default abuBakrAsSiddiq;
