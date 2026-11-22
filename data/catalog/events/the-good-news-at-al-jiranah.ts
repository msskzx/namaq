import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * At al-Ji'ranah a bedouin said «ألا تنجز لي ما وعدتني؟» and refused his «أبشر»; the Prophet ﷺ turned to Abu Musa and
 * Bilal, «رد البشرى، فاقبلا أنتما», washed his hands and face in a cup and spat in it for them to drink and pour over
 * themselves, and Umm Salamah called from behind the curtain to leave some for their mother. Told from Sahih al-Bukhari
 * 4328 (al-Maghazi, the raid of al-Ta'if), whole. The bedouin is not named.
 */
const theGoodNewsAtAlJiranah = {
  kind: 'EVENT',
  slug: 'the-good-news-at-al-jiranah',
  name: "البشرى بالجعرانة",
  nameTransliterated: "The good news at al-Ji'ranah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abu-musa-al-ashari' }, { person: 'bilal-ibn-rabah' }, { person: 'umm-salamah' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا مُحَمَّدُ بْنُ الْعَلَاءِ: حَدَّثَنَا أَبُو أُسَامَةَ، عَنْ بُرَيْدِ بْنِ عَبْدِ اللهِ، عَنْ أَبِي بُرْدَةَ، عَنْ أَبِي مُوسَى  رضي الله عنه قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4328, url: 'https://sunnah.com/bukhari:4328' },
      moments: [
        { title: "«رد البشرى، فاقبلا أنتما»", text: "«كُنْتُ عِنْدَ النَّبِيِّ ﷺ وَهُوَ نَازِلٌ بِالْجِعْرَانَةِ بَيْنَ مَكَّةَ وَالْمَدِينَةِ، وَمَعَهُ بِلَالٌ، فَأَتَى النَّبِيَّ ﷺ أَعْرَابِيٌّ فَقَالَ: أَلَا تُنْجِزُ لِي مَا وَعَدْتَنِي؟ فَقَالَ لَهُ: أَبْشِرْ. فَقَالَ: قَدْ أَكْثَرْتَ عَلَيَّ مِنْ أَبْشِرْ، فَأَقْبَلَ عَلَى أَبِي مُوسَى وَبِلَالٍ كَهَيْئَةِ الْغَضْبَانِ، فَقَالَ: رَدَّ الْبُشْرَى، فَاقْبَلَا أَنْتُمَا. قَالَا: قَبِلْنَا،", people: ['prophet-muhammad', 'abu-musa-al-ashari', 'bilal-ibn-rabah'] },
        { title: "«اشربا منه»", text: "ثُمَّ دَعَا بِقَدَحٍ فِيهِ مَاءٌ، فَغَسَلَ يَدَيْهِ وَوَجْهَهُ فِيهِ وَمَجَّ فِيهِ، ثُمَّ قَالَ: اشْرَبَا مِنْهُ، وَأَفْرِغَا عَلَى وُجُوهِكُمَا وَنُحُورِكُمَا وَأَبْشِرَا.", people: ['prophet-muhammad', 'abu-musa-al-ashari', 'bilal-ibn-rabah'] },
        { title: "«أن أفضلا لأمكما»", text: "فَأَخَذَا الْقَدَحَ فَفَعَلَا، فَنَادَتْ أُمُّ سَلَمَةَ مِنْ وَرَاءِ السِّتْرِ، أَنْ أَفْضِلَا لِأُمِّكُمَا، فَأَفْضَلَا لَهَا مِنْهُ طَائِفَةً».", people: ['abu-musa-al-ashari', 'bilal-ibn-rabah', 'umm-salamah'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theGoodNewsAtAlJiranah;
