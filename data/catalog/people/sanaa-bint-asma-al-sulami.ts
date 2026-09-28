import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData10.ts entry. Her own page
 * gives two candidate identifications for her father ("Asma bint al-Salt
 * al-Sulami", used here, or "bint Sufyan al-Kilabiyyah" as an alternate).
 * She died before her marriage to the Prophet was consummated.
 */
const sanaaBintAsmaAlSulami = {
  kind: 'PERSON',
  slug: 'sanaa-bint-asma-al-sulami',
  name: 'سناء',
  nameTransliterated: 'Sanaa bint Asma al-Sulami',
  hasProfile: true,
  fields: {
    fullName: { value: 'سناء بنت أسماء بن الصلت السلمية', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default sanaaBintAsmaAlSulami;
