import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/al-baraa-ibn-malik, entry 26, the tenth
// and final chapter of this run (immediately after Suhail ibn Amr, entry
// 25). His own entry names him brother of Anas ibn Malik by name only, with
// no shared mother stated, so the tie is HALF_BROTHER against a stub node
// (neo4j/graphSeedData4.ts) — Anas has no profile of his own yet.
const alBaraaIbnMalik = {
  kind: 'PERSON',
  slug: 'al-baraa-ibn-malik',
  name: 'البراء بن مالك',
  nameTransliterated: 'Al-Baraa ibn Malik',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'البَرَاءُ بنُ مَالِكِ بنِ النَّضْرِ بنِ ضَمْضَمٍ الأَنْصَارِيُّ بنِ زَيْدِ بنِ حَرَامِ بنِ جُنْدَبِ بنِ عَامِرِ بنِ غَنْمِ بنِ عَدِيِّ بنِ النَّجَّارِ الأَنْصَارِيُّ، النَّجَّارِيُّ، المَدَنِيُّ',
      claims: ['al-baraa-ibn-malik-siyar26/full-name'],
    },
    deathYearHijri: { value: '20', claims: ['al-baraa-ibn-malik-siyar26/death-year'] },
    placeOfDeathArabic: { value: 'تُسْتَرَ', claims: ['al-baraa-ibn-malik-siyar26/death-place'] },
  },
  virtues: [
    {
      value:
        'البَطَلُ الكَرَّارُ، صَاحِبُ رَسُوْلِ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- لاَ تَسْتَعْمِلُوا البَرَاءَ عَلَى جَيْشٍ، فَإِنَّهُ مَهْلَكَةٌ مِنَ المَهَالِكِ يَقْدَمُ بِهِم اشْتُهِرَ أَنَّ البَرَاءَ قَتَلَ فِي حُرُوْبِهِ مَائَةَ نَفْسٍ مِنَ الشُّجْعَانِ مُبَارَزَةً لَوْ أَقْسَمَ عَلَى اللهِ لأَبَرَّهُ، مِنْهُم: البَرَاءُ بنُ مَالِكٍ أَتَخْشَى عَلَيَّ أَنْ أَمُوْتَ عَلَى فِرَاشِي وَقَدْ قَتَلْتُ تِسْعَةً وَتِسْعِيْنَ نَفَساً مِنَ المُشْرِكِيْنَ مُبَارَزَةً',
      claims: ['al-baraa-ibn-malik-siyar26/virtues'],
    },
  ],

  titles: [
    // Carried from the retired seed.
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'malik-ibn-an-nadr-al-najjari',
      claims: ['al-baraa-ibn-malik-siyar26/father'],
    },
    {
      type: 'HALF_BROTHER',
      inverse: 'HALF_BROTHER',
      to: 'anas-ibn-malik',
      claims: ['al-baraa-ibn-malik-siyar26/half-brother'],
    },
  ],
} satisfies CatalogPerson;

export default alBaraaIbnMalik;
