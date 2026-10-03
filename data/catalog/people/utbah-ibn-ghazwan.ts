import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const utbahIbnGhazwan = {
  kind: 'PERSON',
  slug: 'utbah-ibn-ghazwan',
  name: 'عتبة بن غزوان',
  nameTransliterated: 'Utbah ibn Ghazwan',
  hasProfile: true,
  fields: {
    // The entry never states his sex outright.
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'عُتْبَةُ بنُ غَزْوَانَ بنِ جَابِرِ بنِ وُهَيْبٍ',
      claims: ['utbah-ibn-ghazwan-siyar59/full-name'],
    },
    kunya: { value: 'أَبُو غَزْوَانَ', claims: ['utbah-ibn-ghazwan-siyar59/kunya'] },
    tribalAffiliation: {
      value: 'المَازنِيُّ، حَلِيْفُ بَنِي عَبْدِ شَمْسٍ',
      claims: ['utbah-ibn-ghazwan-siyar59/tribal-affiliation'],
    },
    virtues: {
      value:
        'السَّيِّدُ، الأَمِيْرُ، المُجَاهِدُ أَسْلَمَ سَابِعَ سَبْعَةٍ فِي الإِسْلاَمِ، وَهَاجَرَ إِلَى الحَبَشَةِ، ثُمَّ شَهِدَ بَدْراً وَالمَشَاهِدَ، وَكَانَ أَحَدَ الرُّمَاةِ المَذْكُوْرِيْنَ، وَمِنْ أُمَرَاءِ الغَزَاةِ، وَهُوَ الَّذِي اخْتَطَ البَصْرَةَ وَأَنْشَأَهَا اسْتَعْمَلَ عُمَرُ عُتْبَةَ بنَ غَزْوَانَ عَلَى البَصْرَةِ، فَهُوَ الَّذِي مَصَّرَ البَصْرَةَ وَاخْتَطَّهَا، وَكَانَتْ قَبْلَهَا الأُبُلَّةُ، وَبَنَى المَسْجِدَ بِقَصَبٍ، وَلَمْ يَبْنِ بِهَا دَاراً وَقِيْلَ: كَانَتِ البَصْرَةُ قَبْلُ تُسَمَّى أَرْضَ الهِنْدِ، فَأَوَّلُ مَنْ نَزَلَهَا عُتْبَةُ، كَانَ فِي ثَمَانِ مَائَةٍ خَطَبَنَا عُتْبَةُ بنُ غَزْوَانَ، فَقَالَ: أَلاَ إِنَّ الدُّنْيَا قَدْ آذَنَتْ بِصَرْمٍ، وَوَلَّتْ حِذَاءً ، وَلَمْ يَبْقَ مِنْهَا إِلاَّ صُبَابَةٌ كَصُبَابَةِ الإِنَاءِ، وَإِنَّكُمْ فِي دَارٍ تَنْتَقِلُوْنَ عَنْهَا، فَانْتَقِلُوا بِخَيْرِ مَا بِحَضْرَتِكُم لَهُ حَدِيْثٌ فِي (صَحِيْحِ مُسْلِمٍ)',
      claims: [
        'utbah-ibn-ghazwan-siyar59/virtues',
        'utbah-ibn-ghazwan-siyar59/virtues-basra',
        'utbah-ibn-ghazwan-siyar59/virtues-khutbah',
      ],
    },
    deathYearHijri: { value: '17', claims: ['utbah-ibn-ghazwan-siyar59/death-year'] },
    placeOfDeathArabic: { value: 'بِطَرِيْقِ البَصْرَةِ', claims: ['utbah-ibn-ghazwan-siyar59/death-place'] },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['utbah-ibn-ghazwan-siyar59/titles'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'ghazwan-ibn-jabir',
      claims: ['utbah-ibn-ghazwan-siyar59/father'],
    },
  ],
} satisfies CatalogPerson;

export default utbahIbnGhazwan;
