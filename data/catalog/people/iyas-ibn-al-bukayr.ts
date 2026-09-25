import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/iyas-ibn-al-bukayr, entry 18, the
// third of the four al-Bukayr brothers, immediately after Khalid. Their
// shared history was told once under Aqil; this entry only adds what is
// Iyas's own.
const iyasIbnAlBukayr = {
  kind: 'PERSON',
  slug: 'iyas-ibn-al-bukayr',
  name: 'إياس بن أبي البكير',
  nameTransliterated: 'Iyas ibn Abi al-Bukayr',
  hasProfile: true,
  fields: {
    fullName: { value: 'إِيَاسُ بنُ أَبِي البُكَيْرِ بنِ عَبْدِ يَا لَيْلَ اللَّيْثِيُّ', claims: ['iyas-bukayr-siyar18/full-name'] },
    deathYearHijri: { value: '34', claims: ['iyas-bukayr-siyar18/death-year'] },
  },
  titles: [
    // Carried from the retired seed entry; this entry never calls him صحابي outright.
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'PACT_BROTHER', inverse: 'PACT_BROTHER', to: 'al-harith-ibn-khazamah', claims: ['iyas-bukayr-siyar18/pact-brother-harith'] },
  ],
} satisfies CatalogPerson;

export default iyasIbnAlBukayr;
