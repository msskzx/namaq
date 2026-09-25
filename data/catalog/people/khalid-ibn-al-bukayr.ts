import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/khalid-ibn-al-bukayr, entry 17, the
// brother immediately after Aqil ibn al-Bukayr. Their shared history (the
// conversion at Dar al-Arqam, the household migration) was told once under
// Aqil; this entry only adds what is Khalid's own.
const khalidIbnAlBukayr = {
  kind: 'PERSON',
  slug: 'khalid-ibn-al-bukayr',
  name: 'خالد بن البكير',
  nameTransliterated: 'Khalid ibn al-Bukayr',
  hasProfile: true,
  fields: {
    fullName: { value: 'خَالِدُ بنُ البُكَيْرِ بنِ عَبْدِ يَا لَيْلَ بنِ نَاشِبٍ اللَّيْثِيُّ', claims: ['khalid-bukayr-siyar17/full-name'] },
    deathYearHijri: { value: '4', claims: ['khalid-bukayr-siyar17/death-year'] },
    placeOfDeathArabic: { value: 'الرجيع', claims: ['khalid-bukayr-siyar17/death-place'] },
  },
  titles: [
    // Carried from the retired seed entry; this entry never calls him صحابي outright.
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'PACT_BROTHER', inverse: 'PACT_BROTHER', to: 'zayd-ibn-al-dathinah', claims: ['khalid-bukayr-siyar17/pact-brother-zayd'] },
  ],
} satisfies CatalogPerson;

export default khalidIbnAlBukayr;
