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
    sex: { value: 'MALE', claims: legacyUnreviewed },
    // شعبان is the month; the year is the chapter's heading. The model holds
    // the year, so the month stays in the page.
    birthYearHijri: { value: '4 AH', claims: ['husayn/birth-year'] },
    // Carried from the seed rows.
    fullName: { value: 'الحسين بن علي بن أبي طالب الهاشمي القرشي', claims: legacyUnreviewed },
    // Carried from the retired prisma/personSeedData.ts entry, uncited.
    appearance: { value: 'كان يشبه النبي صلى الله عليه وسلم.', claims: legacyUnreviewed },
  },
  virtues: [
    {
      value: 'سبط النبي وريحانته، سيد شباب أهل الجنة، استشهد في كربلاء دفاعاً عن الحق.',
      claims: legacyUnreviewed,
    },
  ],

  titles: [
    // Carried from the seed rows; this chapter records only his birth.
    { title: 'sayyid-shabab-ahl-al-jannah', name: 'سيد شباب أهل الجنة', nameTransliterated: 'Master of the Youth of Paradise', claims: legacyUnreviewed },
  ],
  // Carried from the retired prisma/personSeedData.ts entry, uncited.
  ayat: [
    // الإنسان 8, carried uncited from the old seed, was dropped (2026-11-18): it rests on
    // the story of three nights of feeding, which al-Qurtubi calls «حديثا لا يصح ولا يثبت»
    // and al-Hakim al-Tirmidhi «حديث مزوق مزيف» (al-Qurtubi on الإنسان 8).
    { surah: 33, ayah: 33, kind: 'DESCRIBES', claims: legacyUnreviewed },
  ],
  relations: [
    // Carried from the graph seed.
    { type: 'SON', inverse: 'FATHER', to: 'ali-ibn-abi-talib', claims: legacyUnreviewed },
    { type: 'SON', inverse: 'MOTHER', to: 'fatimah-bint-muhammad', claims: legacyUnreviewed },
    { type: 'GRANDSON', inverse: 'GRANDFATHER', to: 'prophet-muhammad', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alHusaynIbnAli;
