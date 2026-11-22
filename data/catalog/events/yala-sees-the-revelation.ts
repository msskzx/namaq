import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Ya'la ibn Umayyah wished to see the Prophet ﷺ as revelation came down; at al-Ji'ranah a bedouin in a perfumed cloak asked
 * about his umrah, Umar beckoned Ya'la, who put his head in and saw him red-faced and breathing heavily, and when it lifted
 * he answered the man. Told from Sahih al-Bukhari 4329 (al-Maghazi, the raid of al-Ta'if), whole. The bedouin is not named.
 */
const yalaSeesTheRevelation = {
  kind: 'EVENT',
  slug: 'yala-sees-the-revelation',
  name: "يعلى يرى الوحي ينزل",
  nameTransliterated: "Ya'la sees the revelation come down",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'yala-ibn-umayyah' }, { person: 'prophet-muhammad' }, { person: 'umar-ibn-al-khattab' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا يَعْقُوبُ بْنُ إِبْرَاهِيمَ: حَدَّثَنَا إِسْمَاعِيلُ: حَدَّثَنَا ابْنُ جُرَيْجٍ قَالَ: أَخْبَرَنِي عَطَاءٌ: أَنَّ صَفْوَانَ بْنَ يَعْلَى بْنِ أُمَيَّةَ أَخْبَرَ: أَنَّ يَعْلَى كَانَ يَقُولُ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4329, url: 'https://sunnah.com/bukhari:4329' },
      moments: [
        { title: "«ليتني أرى رسول الله ﷺ حين ينزل عليه»", text: "«لَيْتَنِي أَرَى رَسُولَ اللهِ ﷺ حِينَ يُنْزَلُ عَلَيْهِ، قَالَ فَبَيْنَا النَّبِيُّ ﷺ بِالْجِعْرَانَةِ، وَعَلَيْهِ ثَوْبٌ قَدْ أُظِلَّ بِهِ، مَعَهُ فِيهِ نَاسٌ مِنْ أَصْحَابِهِ، إِذْ جَاءَهُ أَعْرَابِيٌّ عَلَيْهِ جُبَّةٌ، مُتَضَمِّخٌ بِطِيبٍ، فَقَالَ: يَا رَسُولَ اللهِ، كَيْفَ تَرَى فِي رَجُلٍ أَحْرَمَ بِعُمْرَةٍ فِي جُبَّةٍ بَعْدَمَا تَضَمَّخَ بِالطِّيبِ؟", people: ['yala-ibn-umayyah', 'prophet-muhammad'] },
        { title: "محمر الوجه يغط", text: "فَأَشَارَ عُمَرُ إِلَى يَعْلَى بِيَدِهِ: أَنْ تَعَالَ، فَجَاءَ يَعْلَى فَأَدْخَلَ رَأْسَهُ، فَإِذَا النَّبِيُّ ﷺ مُحْمَرُّ الْوَجْهِ، يَغِطُّ كَذَلِكَ سَاعَةً، ثُمَّ سُرِّيَ عَنْهُ،", people: ['umar-ibn-al-khattab', 'yala-ibn-umayyah', 'prophet-muhammad'] },
        { title: "«أما الطيب الذي بك فاغسله»", text: "فَقَالَ: أَيْنَ الَّذِي يَسْأَلُنِي عَنِ الْعُمْرَةِ آنِفًا. فَالْتُمِسَ الرَّجُلُ فَأُتِيَ بِهِ، فَقَالَ: أَمَّا الطِّيبُ الَّذِي بِكَ فَاغْسِلْهُ ثَلَاثَ مَرَّاتٍ، وَأَمَّا الْجُبَّةُ فَانْزِعْهَا، ثُمَّ اصْنَعْ فِي عُمْرَتِكَ كَمَا تَصْنَعُ فِي حَجِّكَ».", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default yalaSeesTheRevelation;
