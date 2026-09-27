import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData7.ts entry, unambiguously
 * framed as a companion ("صحب النبي وخدمه"). A Persian convert and
 * freedman with no recorded Arab nasab (his father was a Zoroastrian
 * dihqan in Isfahan, never named on the page), so no fullName and no
 * ancestor relation -- same precedent as salim-mawla-abi-hudhayfah.
 */
const salmanAlFarisi = {
  kind: 'PERSON',
  slug: 'salman-al-farisi',
  name: 'سلمان الفارسي',
  nameTransliterated: 'Salman al-Farisi',
  hasProfile: true,
  fields: {},
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default salmanAlFarisi;
