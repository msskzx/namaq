import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * At Khaybar the Prophet ﷺ said of a man who claimed Islam that he was of the people of the Fire; he fought hard, then, in
 * pain from his wounds, killed himself with his own arrows, and the Prophet ﷺ had it called out that only a believer enters
 * Paradise, «وإن الله يؤيد الدين بالرجل الفاجر». Told from Sahih al-Bukhari 4203 (al-Maghazi, the chapter on Khaybar), whole.
 * 4204 gives only other chains for it. Sahl's report of the man who fell on his sword is a story of its own
 * (the-man-of-the-fire).
 */
const theDinAndTheWickedMan = {
  kind: 'EVENT',
  slug: 'the-din-and-the-wicked-man',
  name: "«إن الله يؤيد الدين بالرجل الفاجر»",
  nameTransliterated: "Allah supports the religion with the wicked man",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا أَبُو الْيَمَانِ: أَخْبَرَنَا شُعَيْبٌ، عَنِ الزُّهْرِيِّ قَالَ: أَخْبَرَنِي سَعِيدُ بْنُ الْمُسَيَّبِ: أَنَّ أَبَا هُرَيْرَةَ  رضي الله عنه قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4203, url: 'https://sunnah.com/bukhari:4203' },
      moments: [
        { title: "«هذا من أهل النار»", text: "«شَهِدْنَا خَيْبَرَ، فَقَالَ رَسُولُ اللهِ ﷺ لِرَجُلٍ مِمَّنْ مَعَهُ يَدَّعِي الْإِسْلَامَ: هَذَا مِنْ أَهْلِ النَّارِ.", people: ['prophet-muhammad'] },
        { title: "فنحر بها نفسه", text: "فَلَمَّا حَضَرَ الْقِتَالُ قَاتَلَ الرَّجُلُ أَشَدَّ الْقِتَالِ حَتَّى كَثُرَتْ بِهِ الْجِرَاحَةُ، فَكَادَ بَعْضُ النَّاسِ يَرْتَابُ، فَوَجَدَ الرَّجُلُ أَلَمَ الْجِرَاحَةِ، فَأَهْوَى بِيَدِهِ إِلَى كِنَانَتِهِ، فَاسْتَخْرَجَ مِنْهَا أَسْهُمًا فَنَحَرَ بِهَا نَفْسَهُ،", people: [] },
        { title: "«إن الله يؤيد الدين بالرجل الفاجر»", text: "فَاشْتَدَّ رِجَالٌ مِنَ الْمُسْلِمِينَ فَقَالُوا: يَا رَسُولَ اللهِ، صَدَّقَ اللهُ حَدِيثَكَ، انْتَحَرَ فُلَانٌ فَقَتَلَ نَفْسَهُ، فَقَالَ: قُمْ يَا فُلَانُ، فَأَذِّنْ أَنَّهُ لَا يَدْخُلُ الْجَنَّةَ إِلَّا مُؤْمِنٌ، إِنَّ اللهَ يُؤَيِّدُ الدِّينَ بِالرَّجُلِ الْفَاجِرِ،» تَابَعَهُ مَعْمَرٌ، عَنِ الزُّهْرِيِّ.", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theDinAndTheWickedMan;
