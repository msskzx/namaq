import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Abu Bakr came in on Aisha, with the Prophet ﷺ there, on a day of Fitr or Adha, when two girls were singing what the
 * Ansar had said on the day of Bu'ath; he said «مزمار الشيطان» twice, and the Prophet ﷺ said «دعهما يا أبا بكر، إن لكل قوم
 * عيدا، وإن عيدنا هذا اليوم». Told from Sahih al-Bukhari 3931 (Manaqib al-Ansar, the chapter on the Prophet's arrival
 * in Medina), whole, drawn by speaker: each lead names who speaks.
 */
const theTwoSingersOnEid = {
  kind: 'EVENT',
  slug: 'the-two-singers-on-eid',
  name: "القينتان يوم العيد",
  nameTransliterated: "The two singing girls on the day of Eid",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abu-bakr-as-siddiq' }, { person: 'aisha-bint-abi-bakr' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنِي مُحَمَّدُ بْنُ الْمُثَنَّى: حَدَّثَنَا غُنْدَرٌ: حَدَّثَنَا شُعْبَةُ، عَنْ هِشَامٍ، عَنْ أَبِيهِ، عَنْ عَائِشَةَ",
      source: { slug: 'sahih-al-bukhari', hadith: 3931, url: 'https://sunnah.com/bukhari:3931' },
      moments: [
        {
          title: "قينتان يوم عيد",
          text: "«أَنَّ أَبَا بَكْرٍ دَخَلَ عَلَيْهَا، وَالنَّبِيُّ ﷺ عِنْدَهَا، يَوْمَ فِطْرٍ أَوْ أَضْحًى، وَعِنْدَهَا قَيْنَتَانِ بِمَا تَقَاذَفَتِ الْأَنْصَارُ يَوْمَ بُعَاثٍ،",
          people: ['abu-bakr-as-siddiq', 'aisha-bint-abi-bakr', 'prophet-muhammad'],
          turns: [
            { text: "«أَنَّ أَبَا بَكْرٍ دَخَلَ عَلَيْهَا، وَالنَّبِيُّ ﷺ عِنْدَهَا، يَوْمَ فِطْرٍ أَوْ أَضْحًى، وَعِنْدَهَا قَيْنَتَانِ بِمَا تَقَاذَفَتِ الْأَنْصَارُ يَوْمَ بُعَاثٍ،" },
          ],
        },
        {
          title: "«مزمار الشيطان»",
          text: "فَقَالَ أَبُو بَكْرٍ: مِزْمَارُ الشَّيْطَانِ مَرَّتَيْنِ،",
          people: ['abu-bakr-as-siddiq'],
          turns: [
            { text: "فَقَالَ أَبُو بَكْرٍ: مِزْمَارُ الشَّيْطَانِ مَرَّتَيْنِ،", speaker: { person: 'abu-bakr-as-siddiq', name: "أبو بكر" }, lead: "فَقَالَ أَبُو بَكْرٍ:" },
          ],
        },
        {
          title: "«إن لكل قوم عيدا»",
          text: "فَقَالَ النَّبِيُّ ﷺ: دَعْهُمَا يَا أَبَا بَكْرٍ، إِنَّ لِكُلِّ قَوْمٍ عِيدًا، وَإِنَّ عِيدَنَا هَذَا الْيَوْمُ.»",
          people: ['prophet-muhammad', 'abu-bakr-as-siddiq'],
          turns: [
            { text: "فَقَالَ النَّبِيُّ ﷺ: دَعْهُمَا يَا أَبَا بَكْرٍ، إِنَّ لِكُلِّ قَوْمٍ عِيدًا، وَإِنَّ عِيدَنَا هَذَا الْيَوْمُ.»", speaker: { person: 'prophet-muhammad', name: "النبي ﷺ" }, lead: "فَقَالَ النَّبِيُّ ﷺ:" },
          ],
        },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theTwoSingersOnEid;
