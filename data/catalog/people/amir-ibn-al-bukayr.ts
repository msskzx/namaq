import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/amir-ibn-al-bukayr, entry 19, the
// fourth and last of the al-Bukayr brothers, immediately after Iyas. Their
// shared history was told once under Aqil; this entry only adds what is
// Amir's own.
const amirIbnAlBukayr = {
  kind: 'PERSON',
  slug: 'amir-ibn-al-bukayr',
  name: 'عامر بن أبي البكير',
  nameTransliterated: 'Amir ibn Abi al-Bukayr',
  hasProfile: true,
  fields: {
    fullName: { value: 'عَامِرُ بنُ أَبِي البُكَيْرِ اللَّيْثِيُّ', claims: ['amir-bukayr-siyar19/full-name'] },
    placeOfDeathArabic: { value: 'اليمامة', claims: ['amir-bukayr-siyar19/death-place'] },
  },
  titles: [
    // Carried from the retired seed entry; this entry never calls him صحابي outright.
    { title: 'companion', claims: legacyUnreviewed },
    { title: 'martyr', claims: ['amir-bukayr-siyar19/martyr-title'] },
  ],
  relations: [
    // Thabit still has only a seed row (personSeedData6.ts), not a catalog
    // file, so this stays a one-sided reference to his existing slug.
    { type: 'PACT_BROTHER', inverse: 'PACT_BROTHER', to: 'thabit-ibn-qais', claims: ['amir-bukayr-siyar19/pact-brother-thabit'] },
  ],
} satisfies CatalogPerson;

export default amirIbnAlBukayr;
