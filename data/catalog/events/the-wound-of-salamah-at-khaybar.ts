import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Yazid ibn Abi Ubayd saw the scar of a blow on Salamah's shin: struck at Khaybar, he came to the Prophet ﷺ, who blew on it
 * three times, and it never troubled him again. Told from Sahih al-Bukhari 4206 (al-Maghazi, the chapter on Khaybar), whole.
 * Salamah has no catalog subject and is not linked.
 */
const theWoundOfSalamahAtKhaybar = {
  kind: 'EVENT',
  slug: 'the-wound-of-salamah-at-khaybar',
  name: "ضربة سلمة يوم خيبر",
  nameTransliterated: "Salamah's wound at Khaybar",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  reports: [
    {
      isnad: "حَدَّثَنَا الْمَكِّيُّ بْنُ إِبْرَاهِيمَ: حَدَّثَنَا يَزِيدُ بْنُ أَبِي عُبَيْدٍ قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4206, url: 'https://sunnah.com/bukhari:4206' },
      moments: [
        { title: "«ما هذه الضربة؟»", text: "«رَأَيْتُ أَثَرَ ضَرْبَةٍ فِي سَاقِ سَلَمَةَ، فَقُلْتُ: يَا أَبَا مُسْلِمٍ، مَا هَذِهِ الضَّرْبَةُ؟ فَقَالَ: هَذِهِ ضَرْبَةٌ أَصَابَتْنِي يَوْمَ خَيْبَرَ، فَقَالَ النَّاسُ: أُصِيبَ سَلَمَةُ،", people: [] },
        { title: "فنفث فيه ثلاث نفثات", text: "فَأَتَيْتُ النَّبِيَّ ﷺ فَنَفَثَ فِيهِ ثَلَاثَ نَفَثَاتٍ، فَمَا اشْتَكَيْتُهَا حَتَّى السَّاعَةِ.»", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theWoundOfSalamahAtKhaybar;
