import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * After Khaybar the Prophet's slave Mid'am was killed by a stray arrow at Wadi al-Qura as he unloaded his saddle; the
 * people said «هنيئا له الشهادة», and the Prophet ﷺ said the cloak he had taken from the spoils before the division would
 * blaze on him; a man brought back a sandal strap. Told from Sahih al-Bukhari 4234 (al-Maghazi, the chapter on Khaybar), whole.
 */
const midamAndTheShamlah = {
  kind: 'EVENT',
  slug: 'midam-and-the-shamlah',
  name: "مدعم والشملة",
  nameTransliterated: "Mid'am and the cloak",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا عَبْدُ اللهِ بْنُ مُحَمَّدٍ: حَدَّثَنَا مُعَاوِيَةُ بْنُ عَمْرٍو: حَدَّثَنَا أَبُو إِسْحَاقَ، عَنْ مَالِكِ بْنِ أَنَسٍ قَالَ: حَدَّثَنِي ثَوْرٌ قَالَ: حَدَّثَنِي سَالِمٌ مَوْلَى ابْنِ مُطِيعٍ: أَنَّهُ سَمِعَ أَبَا هُرَيْرَةَ  رضي الله عنه يَقُولُ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4234, url: 'https://sunnah.com/bukhari:4234' },
      moments: [
        { title: "عبد يقال له مدعم", text: "«افْتَتَحْنَا خَيْبَرَ، وَلَمْ نَغْنَمْ ذَهَبًا وَلَا فِضَّةً، إِنَّمَا غَنِمْنَا الْبَقَرَ وَالْإِبِلَ وَالْمَتَاعَ وَالْحَوَائِطَ، ثُمَّ انْصَرَفْنَا مَعَ رَسُولِ اللهِ ﷺ إِلَى وَادِي الْقُرَى، وَمَعَهُ عَبْدٌ لَهُ يُقَالُ لَهُ مِدْعَمٌ، أَهْدَاهُ لَهُ أَحَدُ بَنِي الضِّبَابِ، فَبَيْنَمَا هُوَ يَحُطُّ رَحْلَ رَسُولِ اللهِ ﷺ إِذْ جَاءَهُ سَهْمٌ عَائِرٌ، حَتَّى أَصَابَ ذَلِكَ الْعَبْدَ،", people: ['prophet-muhammad'] },
        { title: "«لتشتعل عليه نارا»", text: "فَقَالَ النَّاسُ: هَنِيئًا لَهُ الشَّهَادَةُ، فَقَالَ رَسُولُ اللهِ ﷺ: بَلَى، وَالَّذِي نَفْسِي بِيَدِهِ، إِنَّ الشَّمْلَةَ الَّتِي أَصَابَهَا يَوْمَ خَيْبَرَ مِنَ الْمَغَانِمِ، لَمْ تُصِبْهَا الْمَقَاسِمُ، لَتَشْتَعِلُ عَلَيْهِ نَارًا.", people: ['prophet-muhammad'] },
        { title: "جاء رجل بشراك", text: "فَجَاءَ رَجُلٌ حِينَ سَمِعَ ذَلِكَ مِنَ النَّبِيِّ ﷺ بِشِرَاكٍ أَوْ بِشِرَاكَيْنِ، فَقَالَ: هَذَا شَيْءٌ كُنْتُ أَصَبْتُهُ، فَقَالَ رَسُولُ اللهِ ﷺ: شِرَاكٌ أَوْ شِرَاكَانِ مِنْ نَارٍ.»", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default midamAndTheShamlah;
