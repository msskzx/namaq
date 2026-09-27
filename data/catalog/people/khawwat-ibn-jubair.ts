import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData11.ts entry. Brother of
 * Abdullah ibn Jubayr, who already declares the relation from his own side.
 */
const khawwatIbnJubair = {
  kind: 'PERSON',
  slug: 'khawwat-ibn-jubair',
  name: 'خوات بن جبير',
  nameTransliterated: 'Khawwat ibn Jubair',
  hasProfile: true,
  fields: {
    fullName: { value: 'خوات بن جبير بن النعمان بن أمية بن البرك الأنصاري الأوسي', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default khawwatIbnJubair;
