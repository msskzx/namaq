import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Passing al-Hijr on the way to Tabuk the Prophet ﷺ said «لا تدخلوا مساكن الذين ظلموا أنفسهم… إلا أن تكونوا باكين»,
 * covered his head and hurried until he had crossed the valley. Told from Sahih al-Bukhari 4419 (al-Maghazi, his stopping
 * at al-Hijr), whole. 4420 is the saying alone.
 */
const passingAlHijr = {
  kind: 'EVENT',
  slug: 'passing-al-hijr',
  name: "المرور بالحجر",
  nameTransliterated: "Passing al-Hijr",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا عَبْدُ اللهِ بْنُ مُحَمَّدٍ الْجُعْفِيُّ، حَدَّثَنَا عَبْدُ الرَّزَّاقِ، أَخْبَرَنَا مَعْمَرٌ، عَنِ الزُّهْرِيِّ، عَنْ سَالِمٍ، عَنِ ابْنِ عُمَرَ - رضي الله عنهما قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4419, url: 'https://sunnah.com/bukhari:4419' },
      moments: [
        { title: "«لا تدخلوا مساكن الذين ظلموا أنفسهم»", text: "«لَمَّا مَرَّ النَّبِيُّ ﷺ بِالْحِجْرِ قَالَ: لَا تَدْخُلُوا مَسَاكِنَ الَّذِينَ ظَلَمُوا أَنْفُسَهُمْ، أَنْ يُصِيبَكُمْ مَا أَصَابَهُمْ، إِلَّا أَنْ تَكُونُوا بَاكِينَ، ثُمَّ قَنَّعَ رَأْسَهُ، وَأَسْرَعَ السَّيْرَ، حَتَّى أَجَازَ الْوَادِيَ.»", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default passingAlHijr;
