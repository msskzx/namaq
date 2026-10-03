import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/abu-jandal, entry 23, immediately after
// Abu al-Haytham ibn at-Tayyihan. The sibling tie to Abdullah ibn Suhail
// (entry 24, opening on the same shared page) names only their shared
// father, so it stays HALF_BROTHER rather than BROTHER until a source
// states their mother.
const abuJandal = {
  kind: 'PERSON',
  slug: 'abu-jandal',
  name: 'أبو جندل',
  nameTransliterated: 'Abu Jandal',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'العَاصُ بنُ سُهَيْلِ بنِ عَمْرٍو العَامِرِيُّ بنِ عَبْدِ شَمْسٍ بنِ عَبْدِ وُدٍّ بنِ نَصْرِ بنِ حِسْلِ بنِ عَامِرِ بنِ لُؤَيِّ بنِ غَالِبِ بنِ فِهْرٍ العَامِرِيُّ، القُرَشِيّ',
      claims: ['abu-jandal-siyar23/full-name'],
    },
    kunya: { value: 'أَبُو جَنْدَلٍ', claims: ['abu-jandal-siyar23/kunya'] },
    virtues: { value: 'كَانَ مِنْ خِيَارِ الصَّحَابَةِ', claims: ['abu-jandal-siyar23/virtues'] },
    deathYearHijri: { value: '18', claims: ['abu-jandal-siyar23/death'] },
    placeOfDeathArabic: { value: 'طَاعُوْنِ عَمَوَاسَ بِالأُرْدُنِّ', claims: ['abu-jandal-siyar23/death-place'] },
  },
  titles: [
    // Carried from the retired seed.
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'suhail-ibn-amr', claims: ['abu-jandal-siyar23/father'] },
    {
      type: 'HALF_BROTHER',
      inverse: 'HALF_BROTHER',
      to: 'abdullah-ibn-suhail',
      claims: ['abu-jandal-siyar23/half-brother-abdullah'],
    },
  ],
} satisfies CatalogPerson;

export default abuJandal;
