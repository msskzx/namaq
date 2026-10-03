import { type CatalogPerson } from '@/lib/catalog/types';

// data/history/batches/juwayriyah-bint-al-harith/summary.md
const juwayriyahBintAlHarith = {
  kind: 'PERSON',
  slug: 'juwayriyah-bint-al-harith',
  name: 'جُوَيْرِيَةُ بِنْتُ الحَارِثِ',
  nameTransliterated: 'Juwayriyah bint al-Harith',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: ['juwayriyah-siyar39/sex'] },
    fullName: { value: 'جُوَيْرِيَةُ أُمُّ المُؤْمِنِيْنَ بِنْتُ الحَارِثِ بنِ أَبِي ضِرَارٍ المُصْطَلِقِيَّةُ', claims: ['juwayriyah-siyar39/full-name'] },
    appearance: {
      value: 'وَكَانَتْ مِنْ أَجْمَلِ النِّسَاءِ كَانَتْ جُوَيْرِيَةُ امْرَأَةً حُلْوَةً مُلاَّحَةً ، لاَ يَرَاهَا أَحَدٌ إِلاَّ أَخَذَتْ بِنَفْسِهِ',
      claims: ['juwayriyah-siyar39/appearance'],
    },
    deathYearHijri: {
      value: '50',
      claims: ['juwayriyah-siyar39/death-year', 'juwayriyah-siyar39/death-year-alternate'],
    },
  },
  virtues: [
    {
      value:
        'سُبِيَتْ يَوْمَ غَزْوَةِ المُرَيْسِيْعِ، فِي السَّنَةِ الخَامِسَةِ فَأَسْلَمَتْ، وَتَزَوَّجَ بِهَا؛ وَأَطْلَقَ لَهَا الأُسَارَى مِنْ قَوْمِهَا فَلَقَدْ أُعْتِقَ بِهَا مائَةُ أَهْلِ بَيْتٍ، فَمَا أَعْلَمُ امْرَأَةً كَانَتْ أَعْظَمَ بَرَكَةً عَلَى قَوْمِهَا مِنْهَا فَأَتَاهَا أَبُوْهَا، فَقَالَ: إِنَّ هَذَا الرَّجُلَ قَدْ خَيَّرَكِ، فَلاَ تَفْضَحِيْنَا. فَقَالَتْ: فَإِنِّي قَدِ اخْتَرْتُهُ',
      claims: [
        'juwayriyah-siyar39/virtues-captives',
        'juwayriyah-siyar39/virtues-baraka',
        'juwayriyah-siyar39/virtues-chose-prophet',
      ],
    },
  ],

  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: ['juwayriyah-siyar39/titles-companion'] },
    {
      title: 'mother-of-believers',
      name: 'أم المؤمنين',
      nameTransliterated: 'Mother of the Believers',
      claims: ['juwayriyah-siyar39/titles-mother-of-believers'],
    },
  ],
  relations: [
    {
      type: 'DAUGHTER',
      inverse: 'FATHER',
      to: 'al-harith-ibn-abi-dirar-al-mustaliqi',
      claims: ['juwayriyah-siyar39/father'],
    },
    { type: 'WIFE', inverse: 'HUSBAND', to: 'prophet-muhammad', claims: ['juwayriyah-siyar39/wife-prophet'] },
  ],
} satisfies CatalogPerson;

export default juwayriyahBintAlHarith;
