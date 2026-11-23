import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ said «لا يصلين أحد العصر إلا في بني قريظة»; the time came on the road, some would not pray until they got
 * there and some prayed, and he blamed neither. Told from Sahih al-Bukhari 4119 (al-Maghazi, the chapter on the march on
 * Banu Qurayzah), whole.
 *
 * Then Ibn Umar's same hadith in Sahih Muslim 1770 (al-Jihad, hastening to the raid), whole. It says «الظهر» where 4119
 * says «العصر»; both are kept as printed.
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
        {
          title: "«لا يصلين أحد العصر إلا في بني قريظة»",
          text: "«قَالَ النَّبِيُّ ﷺ يَوْمَ الْأَحْزَابِ: لَا يُصَلِّيَنَّ أَحَدٌ الْعَصْرَ إِلَّا فِي بَنِي قُرَيْظَةَ",
          people: ['prophet-muhammad'],
          turns: [
            { text: "«قَالَ النَّبِيُّ ﷺ يَوْمَ الْأَحْزَابِ: لَا يُصَلِّيَنَّ أَحَدٌ الْعَصْرَ إِلَّا فِي بَنِي قُرَيْظَةَ", speaker: { person: "prophet-muhammad", name: "النبي ﷺ" }, lead: "«قَالَ النَّبِيُّ ﷺ يَوْمَ الْأَحْزَابِ:" },
          ],
        },
        {
          title: "فلم يعنف واحدا منهم",
          text: "فَأَدْرَكَ بَعْضُهُمُ العَصْرَ فِي الطَّرِيقِ، فَقَالَ بَعْضُهُمْ: لَا نُصَلِّي حَتَّى نَأْتِيَهَا، وَقَالَ بَعْضُهُمْ: بَلْ نُصَلِّي، لَمْ يُرِدْ مِنَّا ذَلِكَ. فَذُكِرَ ذَلِكَ لِلنَّبِيِّ ﷺ فَلَمْ يُعَنِّفْ وَاحِدًا مِنْهُمْ».",
          people: ['prophet-muhammad'],
          turns: [
            { text: "فَأَدْرَكَ بَعْضُهُمُ العَصْرَ فِي الطَّرِيقِ،" },
            { text: "فَقَالَ بَعْضُهُمْ: لَا نُصَلِّي حَتَّى نَأْتِيَهَا،", speaker: { name: "بعضهم" }, lead: "فَقَالَ بَعْضُهُمْ:" },
            { text: "وَقَالَ بَعْضُهُمْ: بَلْ نُصَلِّي، لَمْ يُرِدْ مِنَّا ذَلِكَ.", speaker: { name: "بعضهم" }, lead: "وَقَالَ بَعْضُهُمْ:" },
            { text: "فَذُكِرَ ذَلِكَ لِلنَّبِيِّ ﷺ فَلَمْ يُعَنِّفْ وَاحِدًا مِنْهُمْ»." },
          ],
        },
      ],
    },
    {
      isnad: "وحَدَّثَنِي عَبْدُ اللَّهِ بْنُ مُحَمَّدِ بْنِ أَسْمَاءَ الضُّبَعِيُّ. حَدَّثَنَا جُوَيْرِيَةُ بْنُ أَسْمَاءَ عَنْ نَافِعٍ، عَنْ عَبْدِ اللَّهِ. قَالَ:",
      source: { slug: 'sahih-muslim', hadith: 1770, url: 'https://sunnah.com/muslim:1770' },
      moments: [
        { title: "«أن لا يصلين أحد الظهر إلا في بني قريظة»", text: "نَادَى فِينَا رَسُولُ اللَّهِ ﷺ يَوْمَ انْصَرَفَ عَنْ الْأَحْزَابِ (أَنْ لَا يُصَلِّيَنَّ أَحَدٌ الظُّهْرَ إِلَّا فِي بَنِي قُرَيْظَةَ) فَتَخَوَّفَ نَاسٌ فَوْتَ الْوَقْتِ. فَصَلَّوْا دُونَ بَنِي قُرَيْظَةَ. وَقَالَ آخَرُونَ: لَا نُصَلِّي إِلَّا حَيْثُ أَمَرَنَا رَسُولُ اللَّهِ ﷺ، وَإِنْ فَاتَنَا الْوَقْتُ.", people: ['prophet-muhammad'] },
        { title: "فما عنف واحدا من الفريقين", text: "قَالَ: فَمَا عَنَّفَ وَاحِدًا مِنَ الْفَرِيقَيْنِ.", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theAsrAtBanuQurayzah;
