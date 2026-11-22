import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ asked Jabir whether he had married a virgin or a matron; Jabir said his father was killed at Uhud leaving nine
 * daughters and he wanted a woman to care for them, and the Prophet ﷺ said «أصبت». Told from Sahih al-Bukhari 4052
 * (al-Maghazi, the chapter on Uhud), whole. His wife is not named.
 */
const theMarriageOfJabir = {
  kind: 'EVENT',
  slug: 'the-marriage-of-jabir',
  name: "زواج جابر بن عبد الله",
  nameTransliterated: "The marriage of Jabir ibn Abd Allah",
  type: 'MARRIAGE',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'jabir-ibn-abdullah' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا قُتَيْبَةُ: حَدَّثَنَا سُفْيَانُ: أَخْبَرَنَا عَمْرٌو، عَنْ جَابِرٍ قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4052, url: 'https://sunnah.com/bukhari:4052' },
      moments: [
        { title: "«هل نكحت يا جابر؟»", text: "«قَالَ لِي رَسُولُ اللهِ ﷺ: هَلْ نَكَحْتَ يَا جَابِرُ؟ قُلْتُ: نَعَمْ. قَالَ: مَاذَا أَبِكْرًا أَمْ ثَيِّبًا؟ قُلْتُ: لَا بَلْ ثَيِّبًا، قَالَ: فَهَلَّا جَارِيَةً تُلَاعِبُكَ.", people: ['prophet-muhammad', 'jabir-ibn-abdullah'] },
        { title: "«إن أبي قتل يوم أحد»", text: "قُلْتُ: يَا رَسُولَ اللهِ، إِنَّ أَبِي قُتِلَ يَوْمَ أُحُدٍ، وَتَرَكَ تِسْعَ بَنَاتٍ، كُنَّ لِي تِسْعَ أَخَوَاتٍ، فَكَرِهْتُ أَنْ أَجْمَعَ إِلَيْهِنَّ جَارِيَةً خَرْقَاءَ مِثْلَهُنَّ، وَلَكِنِ امْرَأَةً تَمْشُطُهُنَّ وَتَقُومُ عَلَيْهِنَّ، قَالَ: أَصَبْتَ».", people: ['jabir-ibn-abdullah', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theMarriageOfJabir;
