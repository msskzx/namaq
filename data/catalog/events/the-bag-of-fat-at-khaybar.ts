import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * During the siege of Khaybar someone threw down a bag of fat; Abd Allah ibn Mughaffal leapt to take it, turned, saw the
 * Prophet ﷺ, and was ashamed. Told from Sahih al-Bukhari 4214 (al-Maghazi, the chapter on Khaybar), whole.
 *
 * Then Sahih Muslim 1772 (al-Jihad, food taken in enemy land), whole.
 */
const theBagOfFatAtKhaybar = {
  kind: 'EVENT',
  slug: 'the-bag-of-fat-at-khaybar',
  name: "جراب الشحم يوم خيبر",
  nameTransliterated: "The bag of fat at Khaybar",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abdullah-ibn-mughaffal' }, { person: 'prophet-muhammad' }],
  reports: [
    {
      isnad: "حَدَّثَنَا أَبُو الْوَلِيدِ: حَدَّثَنَا شُعْبَةُ وَحَدَّثَنِي عَبْدُ اللهِ بْنُ مُحَمَّدٍ: حَدَّثَنَا وَهْبٌ: حَدَّثَنَا شُعْبَةُ، عَنْ حُمَيْدِ بْنِ هِلَالٍ، عَنْ عَبْدِ اللهِ بْنِ مُغَفَّلٍ  رضي الله عنه قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4214, url: 'https://sunnah.com/bukhari:4214' },
      moments: [
        { title: "جراب فيه شحم", text: "«كُنَّا مُحَاصِرِي خَيْبَرَ، فَرَمَى إِنْسَانٌ بِجِرَابٍ فِيهِ شَحْمٌ، فَنَزَوْتُ لِآخُذَهُ، فَالْتَفَتُّ فَإِذَا النَّبِيُّ ﷺ فَاسْتَحْيَيْتُ».", people: ['abdullah-ibn-mughaffal', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا شَيْبَانُ بْنُ فَرُّوخَ. حَدَّثَنَا سُلَيْمَانُ (يَعْنِي ابْنَ الْمُغِيرَةِ). حَدَّثَنَا حُمَيْدُ بْنُ هِلَالٍ عَنْ عَبْدِ اللَّهِ بْنِ مُغَفَّلٍ، قَالَ:",
      source: { slug: 'sahih-muslim', hadith: 1772, url: 'https://sunnah.com/muslim:1772' },
      moments: [
        { title: "«لا أعطي اليوم أحدا من هذا شيئا»", text: "أَصَبْتُ جِرَابًا مِنْ شَحْمٍ، يَوْمَ خَيْبَرَ. قَالَ: فَالْتَزَمْتُهُ. فَقُلْتُ: لَا أُعْطِي الْيَوْمَ أَحَدًا مِنْ هَذَا شَيْئًا. قَالَ: فَالْتَفَتُّ فَإِذَا رَسُولُ اللَّهِ ﷺ متبسما.", people: ['abdullah-ibn-mughaffal', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theBagOfFatAtKhaybar;
