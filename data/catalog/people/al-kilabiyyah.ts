import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData10.ts entry. The retired
 * entry presented her as a composite/disputed identity in the book itself
 * -- possibly Fatimah bint al-Dahhak ibn Sufyan, Amrah bint Zayd, al-Aliyah
 * bint Zubyan, or Sanaa bint Sufyan -- with no single nasab settled, so no
 * fullName and no ancestor chain. Her marriage to the Prophet was not
 * consummated.
 */
const alKilabiyyah = {
  kind: 'PERSON',
  slug: 'al-kilabiyyah',
  name: 'الكلابية',
  nameTransliterated: 'Al-Kilabiyyah',
  hasProfile: true,
  fields: {},
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default alKilabiyyah;
