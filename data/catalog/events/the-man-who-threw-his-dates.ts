import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * A man asked the Prophet ﷺ at Uhud where he would be if he were killed, and was told «في الجنة»; he threw down the dates in
 * his hand and fought until he was killed. Told from Sahih al-Bukhari 4046 (al-Maghazi, the chapter on Uhud), whole. The
 * man is not named.
 */
const theManWhoThrewHisDates = {
  kind: 'EVENT',
  slug: 'the-man-who-threw-his-dates',
  name: "تمرات في يده يوم أحد",
  nameTransliterated: "The man who threw down his dates at Uhud",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا عَبْدُ اللهِ بْنُ مُحَمَّدٍ: حَدَّثَنَا سُفْيَانُ، عَنْ عَمْرٍو: سَمِعَ جَابِرَ بْنَ عَبْدِ اللهِ  رضي الله عنهما قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4046, url: 'https://sunnah.com/bukhari:4046' },
      moments: [
        { title: "«أرأيت إن قتلت، فأين أنا؟»", text: "«قَالَ رَجُلٌ لِلنَّبِيِّ ﷺ يَوْمَ أُحُدٍ: أَرَأَيْتَ إِنْ قُتِلْتُ، فَأَيْنَ أَنَا؟ قَالَ: فِي الْجَنَّةِ.", people: ['prophet-muhammad'] },
        { title: "فألقى تمرات في يده", text: "فَأَلْقَى تَمَرَاتٍ فِي يَدِهِ، ثُمَّ قَاتَلَ حَتَّى قُتِلَ.»", people: [] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theManWhoThrewHisDates;
