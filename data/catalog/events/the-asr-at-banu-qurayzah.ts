import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ said «لا يصلين أحد العصر إلا في بني قريظة»; the time came on the road, some would not pray until they got
 * there and some prayed, and he blamed neither. Told from Sahih al-Bukhari 4119 (al-Maghazi, the chapter on the march on
 * Banu Qurayzah), whole.
 */
const theAsrAtBanuQurayzah = {
  kind: 'EVENT',
  slug: 'the-asr-at-banu-qurayzah',
  name: "العصر في بني قريظة",
  nameTransliterated: "The Asr prayer at Banu Qurayzah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا عَبْدُ اللهِ بْنُ مُحَمَّدِ بْنِ أَسْمَاءَ: حَدَّثَنَا جُوَيْرِيَةُ بْنُ أَسْمَاءَ، عَنْ نَافِعٍ، عَنِ ابْنِ عُمَرَ  رضي الله عنهما قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4119, url: 'https://sunnah.com/bukhari:4119' },
      moments: [
        { title: "«لا يصلين أحد العصر إلا في بني قريظة»", text: "«قَالَ النَّبِيُّ ﷺ يَوْمَ الْأَحْزَابِ: لَا يُصَلِّيَنَّ أَحَدٌ الْعَصْرَ إِلَّا فِي بَنِي قُرَيْظَةَ", people: ['prophet-muhammad'] },
        { title: "فلم يعنف واحدا منهم", text: "فَأَدْرَكَ بَعْضُهُمُ العَصْرَ فِي الطَّرِيقِ، فَقَالَ بَعْضُهُمْ: لَا نُصَلِّي حَتَّى نَأْتِيَهَا، وَقَالَ بَعْضُهُمْ: بَلْ نُصَلِّي، لَمْ يُرِدْ مِنَّا ذَلِكَ. فَذُكِرَ ذَلِكَ لِلنَّبِيِّ ﷺ فَلَمْ يُعَنِّفْ وَاحِدًا مِنْهُمْ».", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theAsrAtBanuQurayzah;
