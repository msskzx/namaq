import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * One line of chapter six is his: وفيها في شعبان ولد الحسين بن علي. The rest
 * of what his rows hold was there before this module and is carried on the
 * marker, since a module makes him catalog-owned and a value it does not
 * declare would be removed from the stores.
 */
const alHusaynIbnAli = {
  kind: 'PERSON',
  slug: 'al-husayn-ibn-ali',
  name: 'الحسين بن علي',
  nameTransliterated: 'Al-Husayn ibn Ali',
  hasProfile: true,
  fields: {
    // شعبان is the month; the year is the chapter's heading. The model holds
    // the year, so the month stays in the page.
    birthYearHijri: { value: '4 AH', claims: ['husayn/birth-year'] },
    // Carried from the seed rows.
    fullName: { value: 'الحسين بن علي بن أبي طالب الهاشمي القرشي', claims: legacyUnreviewed },
  },
  titles: [
    // Carried from the seed rows; this chapter records only his birth.
    { title: 'grandson-of-prophet', claims: legacyUnreviewed },
    { title: 'sayyid-shabab-ahl-al-jannah', claims: legacyUnreviewed },
    { title: 'martyr', claims: legacyUnreviewed },
  ],
  relations: [
    // Carried from the graph seed.
    { type: 'SON', inverse: 'FATHER', to: 'ali-ibn-abi-talib', claims: legacyUnreviewed },
    { type: 'SON', inverse: 'MOTHER', to: 'fatimah-bint-muhammad', claims: legacyUnreviewed },
    { type: 'GRANDSON', inverse: 'GRANDFATHER', to: 'prophet-muhammad', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alHusaynIbnAli;
