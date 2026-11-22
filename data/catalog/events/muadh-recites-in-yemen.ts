import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * When Mu'adh came to Yemen he led them in the dawn prayer and recited «واتخذ الله إبراهيم خليلا», and a man behind him
 * said «لقد قرت عين أم إبراهيم». Told from Sahih al-Bukhari 4348 (al-Maghazi, the sending of Mu'adh to Yemen), whole, with
 * Mu'adh ibn Mu'adh's addition that it was Surat al-Nisa'. The man is not named.
 */
const muadhRecitesInYemen = {
  kind: 'EVENT',
  slug: 'muadh-recites-in-yemen',
  name: "قراءة معاذ باليمن",
  nameTransliterated: "Mu'adh recites in Yemen",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'muadh-ibn-jabal' }, { person: 'prophet-muhammad' }],
  ayat: [
    {
      kind: 'RECITED',
      from: '4:125',
      to: '4:125',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 4348, url: 'https://sunnah.com/bukhari:4348', quote: "فَقَرَأَ: ﴿وَاتَّخَذَ اللهُ إِبْرَاهِيمَ خَلِيلا﴾" }],
    },
  ],
  reports: [
    {
      isnad: "حَدَّثَنَا سُلَيْمَانُ بْنُ حَرْبٍ: حَدَّثَنَا شُعْبَةُ، عَنْ حَبِيبِ بْنِ أَبِي ثَابِتٍ، عَنْ سَعِيدِ بْنِ جُبَيْرٍ، عَنْ عَمْرِو بْنِ مَيْمُونٍ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4348, url: 'https://sunnah.com/bukhari:4348' },
      moments: [
        {
          title: "«لقد قرت عين أم إبراهيم»",
          text: "«أَنَّ مُعَاذًا رضي الله عنه لَمَّا قَدِمَ الْيَمَنَ، صَلَّى بِهِمُ الصُّبْحَ، فَقَرَأَ: ﴿وَاتَّخَذَ اللهُ إِبْرَاهِيمَ خَلِيلا﴾ فَقَالَ رَجُلٌ مِنَ الْقَوْمِ: لَقَدْ قَرَّتْ عَيْنُ أُمِّ إِبْرَاهِيمَ،»",
          people: ['muadh-ibn-jabal'],
          turns: [
            { text: "«أَنَّ مُعَاذًا رضي الله عنه لَمَّا قَدِمَ الْيَمَنَ، صَلَّى بِهِمُ الصُّبْحَ، فَقَرَأَ: ﴿وَاتَّخَذَ اللهُ إِبْرَاهِيمَ خَلِيلا﴾" },
            { text: "فَقَالَ رَجُلٌ مِنَ الْقَوْمِ: لَقَدْ قَرَّتْ عَيْنُ أُمِّ إِبْرَاهِيمَ،»", speaker: { name: "رجل من القوم" }, lead: "فَقَالَ رَجُلٌ مِنَ الْقَوْمِ:" },
          ],
        },
        {
          title: "قرأ في الصبح سورة النساء",
          text: "زَادَ مُعَاذٌ، عَنْ شُعْبَةَ، عَنْ حَبِيبٍ، عَنْ سَعِيدٍ، عَنْ عَمْرٍو: أَنَّ النَّبِيَّ ﷺ بَعَثَ مُعَاذًا إِلَى الْيَمَنِ، فَقَرَأَ مُعَاذٌ فِي صَلَاةِ الصُّبْحِ سُورَةَ النِّسَاءِ، فَلَمَّا قَالَ: ﴿وَاتَّخَذَ اللهُ إِبْرَاهِيمَ خَلِيلا﴾ قَالَ رَجُلٌ خَلْفَهُ: قَرَّتْ عَيْنُ أُمِّ إِبْرَاهِيمَ.",
          people: ['prophet-muhammad', 'muadh-ibn-jabal'],
          turns: [
            { text: "زَادَ مُعَاذٌ، عَنْ شُعْبَةَ، عَنْ حَبِيبٍ، عَنْ سَعِيدٍ، عَنْ عَمْرٍو: أَنَّ النَّبِيَّ ﷺ بَعَثَ مُعَاذًا إِلَى الْيَمَنِ، فَقَرَأَ مُعَاذٌ فِي صَلَاةِ الصُّبْحِ سُورَةَ النِّسَاءِ، فَلَمَّا قَالَ: ﴿وَاتَّخَذَ اللهُ إِبْرَاهِيمَ خَلِيلا﴾" },
            { text: "قَالَ رَجُلٌ خَلْفَهُ: قَرَّتْ عَيْنُ أُمِّ إِبْرَاهِيمَ.", speaker: { name: "رجل خلفه" }, lead: "قَالَ رَجُلٌ خَلْفَهُ:" },
          ],
        },
      ],
    },
  ],
} satisfies CatalogEvent;

export default muadhRecitesInYemen;
