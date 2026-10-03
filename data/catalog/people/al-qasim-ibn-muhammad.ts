import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData.ts entry, uncited. His
 * FATHER edge (prophet-muhammad.ts) is already declared from the other side.
 */
const alQasimIbnMuhammad = {
  kind: 'PERSON',
  slug: 'al-qasim-ibn-muhammad',
  name: 'القاسم بن محمد',
  nameTransliterated: 'Al-Qasim ibn Muhammad',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: { value: 'القاسم بن محمد بن عبد الله الهاشمي القرشي', claims: legacyUnreviewed },
  },
  virtues: [{ value: 'أول أبناء النبي، توفي صغيراً.', claims: legacyUnreviewed }],

  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default alQasimIbnMuhammad;
