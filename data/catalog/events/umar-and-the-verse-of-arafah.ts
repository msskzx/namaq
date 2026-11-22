import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Some of the Jews told Umar that had «اليوم أكملت لكم دينكم» come down to them they would have taken that day as a feast; Umar
 * said he knew where it came down: «أنزلت ورسول الله ﷺ واقف بعرفة». Told from Sahih al-Bukhari 4407 (al-Maghazi, the
 * chapter on the farewell hajj), whole.
 */
const umarAndTheVerseOfArafah = {
  kind: 'EVENT',
  slug: 'umar-and-the-verse-of-arafah',
  name: "عمر وآية عرفة",
  nameTransliterated: "Umar and the verse of Arafah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'umar-ibn-al-khattab' }, { person: 'prophet-muhammad' }],
  tags: ['REVEALED_ABOUT'],
  ayat: [
    {
      kind: 'REVEALED_ABOUT',
      from: '5:3',
      to: '5:3',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 4407, url: 'https://sunnah.com/bukhari:4407', quote: "﴿الْيَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ وَأَتْمَمْتُ عَلَيْكُمْ نِعْمَتِي﴾ فَقَالَ عُمَرُ: إِنِّي لَأَعْلَمُ أَيَّ مَكَانٍ أُنْزِلَتْ، أُنْزِلَتْ وَرَسُولُ اللهِ ﷺ وَاقِفٌ بِعَرَفَةَ" }],
    },
  ],
  reports: [
    {
      isnad: "حَدَّثَنَا مُحَمَّدُ بْنُ يُوسُفَ: حَدَّثَنَا سُفْيَانُ الثَّوْرِيُّ، عَنْ قَيْسِ بْنِ مُسْلِمٍ، عَنْ طَارِقِ بْنِ شِهَابٍ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4407, url: 'https://sunnah.com/bukhari:4407' },
      moments: [
        { title: "«لاتخذنا ذلك اليوم عيدا»", text: "«أَنَّ أُنَاسًا مِنَ الْيَهُودِ قَالُوا: لَوْ نَزَلَتْ هَذِهِ الْآيَةُ فِينَا لَاتَّخَذْنَا ذَلِكَ الْيَوْمَ عِيدًا، فَقَالَ عُمَرُ: أَيَّةُ آيَةٍ؟ فَقَالُوا: ﴿الْيَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ وَأَتْمَمْتُ عَلَيْكُمْ نِعْمَتِي﴾", people: ['umar-ibn-al-khattab'] },
        { title: "«أنزلت ورسول الله ﷺ واقف بعرفة»", text: "فَقَالَ عُمَرُ: إِنِّي لَأَعْلَمُ أَيَّ مَكَانٍ أُنْزِلَتْ، أُنْزِلَتْ وَرَسُولُ اللهِ ﷺ وَاقِفٌ بِعَرَفَةَ.»", people: ['umar-ibn-al-khattab', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default umarAndTheVerseOfArafah;
