import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Al-Rubayyi' bint Mu'awwidh: the Prophet ﷺ came in on the morning of her wedding and sat on her bed while girls beat the
 * duff and mourned their fathers killed at Badr, until one sang «وفينا نبي يعلم ما في غد», and he said «لا تقولي هكذا وقولي
 * ما كنت تقولين». Told from Sahih al-Bukhari 4001 (al-Maghazi, in the chapters on Badr), whole, drawn by speaker: each
 * lead names who speaks. Al-Rubayyi' has no catalog subject and is not linked.
 */
const theGirlsWithTheDuff = {
  kind: 'EVENT',
  slug: 'the-girls-with-the-duff',
  name: "الجويريات يضربن بالدف",
  nameTransliterated: "The girls beating the duff",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا عَلِيٌّ: حَدَّثَنَا بِشْرُ بْنُ الْمُفَضَّلِ: حَدَّثَنَا خَالِدُ بْنُ ذَكْوَانَ، عَنِ الرُّبَيِّعِ بِنْتِ مُعَوِّذٍ قَالَتْ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4001, url: 'https://sunnah.com/bukhari:4001' },
      moments: [
        {
          title: "يندبن من قتل من آبائهن يوم بدر",
          text: "«دَخَلَ عَلَيَّ النَّبِيُّ ﷺ غَدَاةَ بُنِيَ عَلَيَّ، فَجَلَسَ عَلَى فِرَاشِي كَمَجْلِسِكَ مِنِّي، وَجُوَيْرِيَاتٌ يَضْرِبْنَ بِالدُّفِّ، يَنْدُبْنَ مَنْ قُتِلَ مِنْ آبَائِهِنَّ يَوْمَ بَدْرٍ، حَتَّى قَالَتْ جَارِيَةٌ: وَفِينَا نَبِيٌّ يَعْلَمُ مَا فِي غَدٍ،",
          people: ['prophet-muhammad'],
          turns: [
            { text: "«دَخَلَ عَلَيَّ النَّبِيُّ ﷺ غَدَاةَ بُنِيَ عَلَيَّ، فَجَلَسَ عَلَى فِرَاشِي كَمَجْلِسِكَ مِنِّي، وَجُوَيْرِيَاتٌ يَضْرِبْنَ بِالدُّفِّ، يَنْدُبْنَ مَنْ قُتِلَ مِنْ آبَائِهِنَّ يَوْمَ بَدْرٍ،" },
            { text: "حَتَّى قَالَتْ جَارِيَةٌ: وَفِينَا نَبِيٌّ يَعْلَمُ مَا فِي غَدٍ،", speaker: { name: "جارية" }, lead: "حَتَّى قَالَتْ جَارِيَةٌ:" },
          ],
        },
        {
          title: "«لا تقولي هكذا»",
          text: "فَقَالَ النَّبِيُّ ﷺ: لَا تَقُولِي هَكَذَا وَقُولِي مَا كُنْتِ تَقُولِينَ.»",
          people: ['prophet-muhammad'],
          turns: [
            { text: "فَقَالَ النَّبِيُّ ﷺ: لَا تَقُولِي هَكَذَا وَقُولِي مَا كُنْتِ تَقُولِينَ.»", speaker: { person: 'prophet-muhammad', name: "النبي ﷺ" }, lead: "فَقَالَ النَّبِيُّ ﷺ:" },
          ],
        },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theGirlsWithTheDuff;
