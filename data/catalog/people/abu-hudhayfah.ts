import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/abu-hudhayfah, entry 13, the entry
// immediately after as-saib-ibn-uthman. Utbah ibn Rabiah's son, twice a
// migrant to Abyssinia, half-brother of Musab ibn Umayr, present at Badr,
// and martyred at Yamamah.
const abuHudhayfah = {
  kind: 'PERSON',
  slug: 'abu-hudhayfah',
  name: 'أبو حذيفة',
  nameTransliterated: 'Abu Hudhayfah',
  hasProfile: true,
  fields: {
    virtues: { value: 'السَّيِّدُ الكَبِيْرُ، الشَّهِيْدُ', claims: ['abu-hudhayfah-siyar13/virtues'] },
    deathYearHijri: { value: '12', claims: ['abu-hudhayfah-siyar13/death-year'] },
  },
  titles: [
    // Carried from the seed. This entry never calls him صحابي outright.
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'utbah-ibn-rabiah', claims: ['abu-hudhayfah-siyar13/father'] },
    { type: 'BROTHER', inverse: 'BROTHER', to: 'musab-ibn-umayr', claims: ['abu-hudhayfah-siyar13/brother-musab'] },
  ],
} satisfies CatalogPerson;

export default abuHudhayfah;
