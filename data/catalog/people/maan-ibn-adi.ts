import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const maanIbnAdi = {
  kind: 'PERSON',
  slug: 'maan-ibn-adi',
  name: 'مَعْنُ بنُ عَدِيِّ',
  nameTransliterated: 'Maan ibn Adi',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'مَعْنُ بنُ عَدِيِّ بنِ الجدِّ بنِ العَجْلاَنِ الأَنْصَارِيُّ العَجْلاَنِيُّ، العَقَبِيُّ، البَدْرِيُّ، مِنْ حُلَفَاءِ بَنِي مَالِكِ بنِ عَوْفٍ',
      claims: ['maan-ibn-adi-siyar64/full-name'],
    },
    virtues: {
      value:
        'مِنْ سَادَةِ الأَنْصَارِ، كَانَ يَكْتُبُ العَرَبِيَّةَ قَبْلَ الإِسْلاَمِ. أَنَّ مَعْنَ بنَ عَدِيٍّ أَحَدُ الرَّجُلَيْنِ اللَّذَيْنِ لَقِيَا أَبَا بَكْرٍ وَعُمَرَ وَهُمَا يُرِيْدَانِ سَقِيْفَةَ بَنِي سَاعِدَةَ، فَقَالاَ لأَبِي بَكْرٍ وَعُمَرَ: لاَ عَلَيْكُم أَنْ لاَ تَقْرَبُوْهُم، وَاقْضُوا أَمْرَكُم. فَقَالَ مَعْنٌ: لَكِنِّي -وَاللهِ- مَا أُحِبُّ أَنِّي مُتُّ قَبْلَهُ حَتَّى أُصَدِّقَهُ مَيْتاً، كَمَا صَدَّقْتُهُ حَيّاً.',
      claims: ['maan-ibn-adi-siyar64/virtues'],
    },
    deathYearHijri: { value: '12', claims: ['maan-ibn-adi-siyar64/death-year'] },
    placeOfDeathArabic: { value: 'اليَمَامَةِ', claims: ['maan-ibn-adi-siyar64/death-place'] },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['maan-ibn-adi-siyar64/titles'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'adi-ibn-al-jidd',
      claims: ['maan-ibn-adi-siyar64/father'],
    },
  ],
} satisfies CatalogPerson;

export default maanIbnAdi;
