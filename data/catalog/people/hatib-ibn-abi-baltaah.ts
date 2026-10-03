import type { CatalogPerson } from '@/lib/catalog/types';

const hatibIbnAbiBaltaah = {
  kind: 'PERSON',
  slug: 'hatib-ibn-abi-baltaah',
  name: 'حَاطِبُ بنُ أَبِي بَلْتَعَةَ',
  nameTransliterated: 'Hatib ibn Abi Baltaah',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['hatib-ibn-abi-baltaah-siyar9/sex'] },
    fullName: {
      value: 'حَاطِبُ بنُ أَبِي بَلْتَعَةَ عَمْرِو بنِ عُمَيْرِ بنِ سَلَمَةَ اللَّخْمِيُّ',
      claims: ['hatib-ibn-abi-baltaah-siyar9/full-name'],
    },
    kunya: { value: 'أَبِي بَلْتَعَةَ', claims: ['hatib-ibn-abi-baltaah-siyar9/kunya'] },
    tribalAffiliation: {
      value: 'المَكِّيُّ، حَلِيْفُ بَنِي أَسَدِ بنِ عَبْدِ العُزَّى بنِ قُصَيٍّ',
      claims: ['hatib-ibn-abi-baltaah-siyar9/tribal-affiliation'],
    },
    appearance: {
      value: 'كَانَ حَسَنَ الجِسْمِ، خَفِيْفَ اللِّحْيَةِ، أَجْنَى ، إِلَى القِصَرِ مَا هُوَ، شَثْنَ الأَصَابِعِ. قَالَهُ الوَاقِدِيُّ',
      claims: ['hatib-ibn-abi-baltaah-siyar9/appearance'],
    },
    deathYearHijri: { value: '30', claims: ['hatib-ibn-abi-baltaah-siyar9/death-year'] },
  },
  virtues: [
    {
      value:
        'وَكَانَ رَسُوْلَ النَّبِيِّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- إِلَى المُقَوْقسِ، صَاحِبِ مِصْرَ. وَكَانَ تَاجِراً فِي الطَّعَامِ، لَهُ عَبِيْدٌ. وَكَانَ مِنَ الرُّمَاةِ المَوْصُوْفِيْنَ. وَدَعَا لِي، فَقَالَ: (رَضِيَ اللهُ عَنْكَ) ، مَرَّتَيْنِ قَالَ: كَذَبْتَ، لاَ يَدْخُلُهَا أَبَداً كَتَبَ إِلَى كُفَّارِ قُرَيْشٍ كِتَاباً. فَقَالَ عُمَرُ: ائْذَنْ لِي يَا رَسُوْلَ اللهِ فِي قَتْلِهِ. (لاَ، إِنَّهُ قَدْ شَهِدَ بَدْراً، وَإِنَّكَ لاَ تَدْرِي، لَعَلَّ اللهَ قَدِ اطَّلَعَ عَلَى أَهْلِ بَدْرٍ، فَقَالَ: اعْمَلُوا مَا شِئْتُم، فَإِنِّي غَافِرٌ لَكُم',
      claims: [
        'hatib-ibn-abi-baltaah-siyar9/virtues-messenger',
        'hatib-ibn-abi-baltaah-siyar9/virtues-trade',
        'hatib-ibn-abi-baltaah-siyar9/virtues-archer',
        'hatib-ibn-abi-baltaah-siyar9/virtues-uhud',
        'hatib-ibn-abi-baltaah-siyar9/virtues-fire',
        'hatib-ibn-abi-baltaah-siyar9/virtues-letter',
      ],
    },
  ],

  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['hatib-ibn-abi-baltaah-siyar9/titles'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'amr-ibn-umayr-al-lakhmi',
      claims: ['hatib-ibn-abi-baltaah-siyar9/father'],
    },
  ],
} satisfies CatalogPerson;

export default hatibIbnAbiBaltaah;