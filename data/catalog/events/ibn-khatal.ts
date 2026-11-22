import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ entered Makkah on the day of the conquest with the helmet on his head; when he took it off a man told him
 * Ibn Khatal was clinging to the curtains of the Ka'bah and he said «اقتله». Told from Sahih al-Bukhari 4286 (al-Maghazi,
 * the chapter on the conquest), whole, with Malik's note that he was not in ihram that day. Ibn Khatal has no catalog
 * subject and is not linked.
 */
const ibnKhatal = {
  kind: 'EVENT',
  slug: 'ibn-khatal',
  name: "ابن خطل",
  nameTransliterated: "Ibn Khatal",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا يَحْيَى بْنُ قَزَعَةَ: حَدَّثَنَا مَالِكٌ، عَنِ ابْنِ شِهَابٍ، عَنْ أَنَسِ بْنِ مَالِكٍ  رضي الله عنه:",
      source: { slug: 'sahih-al-bukhari', hadith: 4286, url: 'https://sunnah.com/bukhari:4286' },
      moments: [
        { title: "ابن خطل متعلق بأستار الكعبة", text: "«أَنَّ النَّبِيَّ ﷺ دَخَلَ مَكَّةَ يَوْمَ الْفَتْحِ وَعَلَى رَأْسِهِ الْمِغْفَرُ، فَلَمَّا نَزَعَهُ جَاءَ رَجُلٌ فَقَالَ: ابْنُ خَطَلٍ مُتَعَلِّقٌ بِأَسْتَارِ الْكَعْبَةِ، فَقَالَ: اقْتُلْهُ.» قَالَ مَالِكٌ: وَلَمْ يَكُنِ النَّبِيُّ ﷺ فِيمَا نُرَى وَاللهُ أَعْلَمُ يَوْمَئِذٍ مُحْرِمًا.", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default ibnKhatal;
