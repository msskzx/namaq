import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * On the day of the trench Umar came after sunset cursing the disbelievers of Quraysh, saying he had hardly prayed before
 * the sun set; the Prophet ﷺ said «والله ما صليتها», went down to Buthan, made wudu, and prayed Asr after sunset and then
 * Maghrib. Told from Sahih al-Bukhari 4112 (al-Maghazi, the chapter on al-Khandaq), whole.
 */
const theAsrAtTheTrench = {
  kind: 'EVENT',
  slug: 'the-asr-at-the-trench',
  name: "العصر يوم الخندق",
  nameTransliterated: "The Asr prayer on the day of the trench",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'umar-ibn-al-khattab' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا الْمَكِّيُّ بْنُ إِبْرَاهِيمَ: حَدَّثَنَا هِشَامٌ، عَنْ يَحْيَى، عَنْ أَبِي سَلَمَةَ، عَنْ جَابِرِ بْنِ عَبْدِ اللهِ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4112, url: 'https://sunnah.com/bukhari:4112' },
      moments: [
        { title: "«ما كدت أن أصلي»", text: "«أَنَّ عُمَرَ بْنَ الْخَطَّابِ رضي الله عنه جَاءَ يَوْمَ الْخَنْدَقِ بَعْدَمَا غَرَبَتِ الشَّمْسُ، جَعَلَ يَسُبُّ كُفَّارَ قُرَيْشٍ، وَقَالَ: يَا رَسُولَ اللهِ، مَا كِدْتُ أَنْ أُصَلِّيَ، حَتَّى كَادَتِ الشَّمْسُ أَنْ تَغْرُبَ.", people: ['umar-ibn-al-khattab', 'prophet-muhammad'] },
        { title: "«والله ما صليتها»", text: "قَالَ النَّبِيُّ ﷺ: وَاللهِ مَا صَلَّيْتُهَا.", people: ['prophet-muhammad'] },
        { title: "صلى العصر بعدما غربت الشمس", text: "فَنَزَلْنَا مَعَ النَّبِيِّ ﷺ بُطْحَانَ، فَتَوَضَّأَ لِلصَّلَاةِ وَتَوَضَّأْنَا لَهَا، فَصَلَّى الْعَصْرَ بَعْدَمَا غَرَبَتِ الشَّمْسُ، ثُمَّ صَلَّى بَعْدَهَا الْمَغْرِبَ».", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theAsrAtTheTrench;
