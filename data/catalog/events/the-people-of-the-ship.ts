import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Abu Musa and his people heard in Yemen that the Prophet ﷺ had come out, took ship, and were cast up at the Najashi's
 * in Abyssinia, where they found Ja'far ibn Abi Talib and stayed with him until they came to the Prophet ﷺ as he took
 * Khaybar: «لكم أنتم يا أهل السفينة هجرتان». Told from Sahih al-Bukhari 3876 (the chapter on the hijra to Abyssinia),
 * whole.
 */
const thePeopleOfTheShip = {
  kind: 'EVENT',
  slug: 'the-people-of-the-ship',
  name: "أهل السفينة",
  nameTransliterated: "The people of the ship",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abu-musa-al-ashari' }, { person: 'prophet-muhammad' }, { person: 'an-najashi' }, { person: 'jaafar-ibn-abi-talib' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا مُحَمَّدُ بْنُ الْعَلَاءِ: حَدَّثَنَا أَبُو أُسَامَةَ: حَدَّثَنَا بُرَيْدُ بْنُ عَبْدِ اللهِ، عَنْ أَبِي بُرْدَةَ، عَنْ أَبِي مُوسَى  رضي الله عنه:",
      source: { slug: 'sahih-al-bukhari', hadith: 3876, url: 'https://sunnah.com/bukhari:3876' },
      moments: [
        {
          title: "بلغهم مخرجه وهم باليمن",
          text: "«بَلَغَنَا مَخْرَجُ النَّبِيِّ ﷺ وَنَحْنُ بِالْيَمَنِ فَرَكِبْنَا سَفِينَةً فَأَلْقَتْنَا سَفِينَتُنَا، إِلَى النَّجَاشِيِّ بِالْحَبَشَةِ،",
          people: ['abu-musa-al-ashari', 'prophet-muhammad', 'an-najashi'],
          turns: [
            { text: "«بَلَغَنَا مَخْرَجُ النَّبِيِّ ﷺ وَنَحْنُ بِالْيَمَنِ فَرَكِبْنَا سَفِينَةً فَأَلْقَتْنَا سَفِينَتُنَا، إِلَى النَّجَاشِيِّ بِالْحَبَشَةِ،" },
          ],
        },
        {
          title: "مع جعفر عند النجاشي",
          text: "فَوَافَقْنَا جَعْفَرَ بْنَ أَبِي طَالِبٍ، فَأَقَمْنَا مَعَهُ حَتَّى قَدِمْنَا،",
          people: ['abu-musa-al-ashari', 'jaafar-ibn-abi-talib'],
          turns: [
            { text: "فَوَافَقْنَا جَعْفَرَ بْنَ أَبِي طَالِبٍ، فَأَقَمْنَا مَعَهُ حَتَّى قَدِمْنَا،" },
          ],
        },
        {
          title: "«لكم أنتم يا أهل السفينة هجرتان»",
          text: "فَوَافَقْنَا النَّبِيَّ ﷺ حِينَ افْتَتَحَ خَيْبَرَ، فَقَالَ النَّبِيُّ ﷺ: لَكُمْ أَنْتُمْ يَا أَهْلَ السَّفِينَةِ هِجْرَتَانِ.»",
          people: ['abu-musa-al-ashari', 'prophet-muhammad'],
          turns: [
            { text: "فَوَافَقْنَا النَّبِيَّ ﷺ حِينَ افْتَتَحَ خَيْبَرَ،" },
            { text: "فَقَالَ النَّبِيُّ ﷺ: لَكُمْ أَنْتُمْ يَا أَهْلَ السَّفِينَةِ هِجْرَتَانِ.»", speaker: { person: 'prophet-muhammad', name: "النبي ﷺ" }, lead: "فَقَالَ النَّبِيُّ ﷺ:" },
          ],
        },
      ],
    },
  ],
} satisfies CatalogEvent;

export default thePeopleOfTheShip;
