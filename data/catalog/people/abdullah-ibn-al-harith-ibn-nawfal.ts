import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const abdullahIbnAlHarithIbnNawfal = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-al-harith-ibn-nawfal',
  name: 'عبد الله بن الحارث',
  nameTransliterated: 'Abdullah ibn al-Harith (Babbah)',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'عَبْدُ اللهِ بنُ الحَارِثِ بنِ نَوْفَلٍ الهَاشِمِيُّ',
      claims: ['abdullah-ibn-al-harith-ibn-nawfal-siyar29/full-name'],
    },
    virtues: {
      value:
        'اجْتَمَعَ أَهْلُ البَصْرَةِ عِنْدَ مَوْتِ يَزِيْدَ عَلَى تَأْمِيْرِهِ عَلَيْهِم اصْطَلَحَ أَهْلُ البَصْرَةِ، فَأَمَّرُوْهُ عِنْدَ هُرُوْبِ عُبَيْدِ اللهِ بنِ زِيَادٍ، وَكَتَبُوا إِلَى ابْنِ الزُّبَيْرِ بِالبَيْعَةِ لَهُ قَالَ: فَأَقَرَّهُ عَلَيْهِم',
      claims: ['abdullah-ibn-al-harith-ibn-nawfal-siyar29/virtues'],
    },
    deathYearHijri: { value: '84', claims: ['abdullah-ibn-al-harith-ibn-nawfal-siyar29/death-year'] },
    placeOfDeathArabic: {
      value: 'فَمَاتَ بِعُمَانَ فِي سَنَةِ أَرْبَعٍ وَثَمَانِيْنَ',
      claims: ['abdullah-ibn-al-harith-ibn-nawfal-siyar29/death-place'],
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'al-harith-ibn-nawfal',
      claims: ['abdullah-ibn-al-harith-ibn-nawfal-siyar29/father'],
    },
  ],
} satisfies CatalogPerson;

export default abdullahIbnAlHarithIbnNawfal;
