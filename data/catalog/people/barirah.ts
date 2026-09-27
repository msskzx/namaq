import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData10.ts entry. A freedwoman
 * with no Arab nasab (mawla of Aisha bint Abi Bakr, who purchased and freed
 * her -- same precedent as salman-al-farisi, abu-rafi). Her husband Mughith
 * ibn Jahsh is not created here.
 */
const barirah = {
  kind: 'PERSON',
  slug: 'barirah',
  name: 'بريرة',
  nameTransliterated: 'Barirah',
  hasProfile: true,
  fields: {},
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default barirah;
