import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData.ts entry, uncited. His
 * FATHER edge (prophet-muhammad.ts) is already declared from the other side.
 */
const abdullahIbnMuhammad = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-muhammad',
  name: 'عبد الله بن محمد',
  nameTransliterated: 'Abdullah ibn Muhammad',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'عبد الله بن محمد بن عبد الله الهاشمي القرشي (الطيب الطاهر)',
      claims: legacyUnreviewed,
    },
    virtues: { value: 'ابن النبي، توفي صغيراً، لقب بالطيب والطاهر.', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default abdullahIbnMuhammad;
