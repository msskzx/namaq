import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData.ts entry, uncited. His
 * FATHER edge (prophet-muhammad.ts) is already declared from the other side.
 */
const ibrahimIbnMuhammad = {
  kind: 'PERSON',
  slug: 'ibrahim-ibn-muhammad',
  name: 'إبراهيم بن محمد',
  nameTransliterated: 'Ibrahim ibn Muhammad',
  hasProfile: true,
  fields: {
    fullName: { value: 'إبراهيم بن محمد بن عبد الله الهاشمي القرشي', claims: legacyUnreviewed },
    virtues: { value: 'ابن النبي من مارية القبطية، توفي صغيراً.', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default ibrahimIbnMuhammad;
