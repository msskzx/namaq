import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/aqil-ibn-al-bukayr, entry 16, the entry
// immediately after Hamzah ibn Abd al-Muttalib. One of four brothers who
// accepted Islam together at Dar al-Arqam and migrated as one household; the
// Prophet renamed him from Ghafil to Aqil, paired him with Mubashshir ibn
// Abd al-Mundhir, and both were martyred together at Badr.
const aqilIbnAlBukayr = {
  kind: 'PERSON',
  slug: 'aqil-ibn-al-bukayr',
  name: 'عاقل بن البكير',
  nameTransliterated: 'Aqil ibn al-Bukayr',
  hasProfile: true,
  fields: {
    fullName: { value: 'عَاقِلُ بنُ البُكَيْرِ بنِ عَبْدِ يَا لَيْلَ بنِ نَاشِبٍ اللَّيْثِيُّ', claims: ['aqil-bukayr-siyar16/full-name'] },
    virtues: {
      value:
        'كَانَ اسْمُهُ غَافِلاً، فَسَمَّاهُ رَسُوْلُ اللهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ عَاقِلاً. أَسْلَمَ هُوَ وَإِخْوَتُهُ جَمِيْعاً، وَهُمْ أَوَّلُ مَنْ بَايَعَ فِي دَارِ الأَرْقَمِ، وَخَرَجُوا مُهَاجِرِيْنَ رِجَالاً وَنِسَاءً حَتَّى غُلِّقَتْ أَبْوَابُهُمْ.',
      claims: ['aqil-bukayr-siyar16/virtues'],
    },
  },
  titles: [
    // Carried from the retired seed entry; this entry never calls him صحابي outright.
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'PACT_BROTHER', inverse: 'PACT_BROTHER', to: 'mubashshir-ibn-abd-al-mundhir', claims: ['aqil-bukayr-siyar16/pact-brother-mubashshir'] },
  ],
} satisfies CatalogPerson;

export default aqilIbnAlBukayr;
