import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/saad-ibn-khaythamah, entry 52. The entry
// never states his sex outright, so it stays on the legacy marker. The father
// chain's النحاط is disputed by Ibn al-Kalbi, which the batch reports rather
// than resolves.
const saadIbnKhaythamah = {
  kind: 'PERSON',
  slug: 'saad-ibn-khaythamah',
  name: 'سَعْدُ بنُ خَيْثَمَةَ',
  nameTransliterated: 'Saad ibn Khaythamah',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'سَعْدُ بنُ خَيْثَمَةَ بنِ الحَارِثِ الأَنْصَارِيُّ الأَوْسِيُّ بنِ مَالِكِ بنِ كَعْبِ بنِ النَّحَّاطِ بنِ كَعْبِ بنِ حَارِثَةَ بنِ غَنْمِ بنِ السَّلْمِ',
      claims: ['saad-ibn-khaythamah-siyar52/full-name'],
    },
    kunya: { value: 'أَبُو عَبْدِ اللهِ', claims: ['saad-ibn-khaythamah-siyar52/kunya'] },
    tribalAffiliation: {
      value: 'الأَنْصَارِيُّ، الأَوْسِيُّ، البَدْرِيُّ',
      claims: ['saad-ibn-khaythamah-siyar52/tribal-affiliation'],
    },
    placeOfDeathArabic: { value: 'بَدْرٍ', claims: ['saad-ibn-khaythamah-siyar52/death-place'] },
  },
  virtues: [
    {
      value:
        'قَالُوا: وَكَانَ أَحَدَ النُّقَبَاءِ الاثْنَيْ عَشَرَ. آخَى النَّبِيُّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- بَيْنَهُ وَبَيْنَ أَبِي سَلَمَةَ بنِ عَبْدِ الأَسَدِ. وَلَمَّا نَدَبَ النَّبِيُّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- المُسْلِمِيْنَ يَوْمَ بَدْرٍ، فَأَسْرَعُوا، قَالَ خَيْثَمَةُ لابْنِهِ سَعْدٍ: آثِرْنِي بِالخُرُوْجِ، وَأَقِمْ مَعَ نِسَائِكَ. فَأَبَى، وَقَالَ: لَوْ كَانَ غَيْرَ الجَنَّةِ آثَرْتُكَ بِهِ.',
      claims: ['saad-ibn-khaythamah-siyar52/virtues'],
    },
  ],

  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['saad-ibn-khaythamah-siyar52/titles'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'khaythamah-ibn-al-harith',
      claims: ['saad-ibn-khaythamah-siyar52/father'],
    },
  ],
} satisfies CatalogPerson;

export default saadIbnKhaythamah;
