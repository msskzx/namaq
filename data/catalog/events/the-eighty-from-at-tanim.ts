import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Eighty armed men of Makkah came down on the Prophet ﷺ and his companions from the hill of al-Tan'im to take them by
 * surprise; he took them without a fight and let them live, and Allah sent down «وهو الذي كف أيديهم عنكم». Told from Sahih
 * Muslim 1808 (al-Jihad, the chapter on «وهو الذي كف أيديهم عنكم»), whole.
 */
const theEightyFromAtTanim = {
  kind: 'EVENT',
  slug: 'the-eighty-from-at-tanim',
  name: "الثمانون من جبل التنعيم",
  nameTransliterated: "The eighty from al-Tan'im",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['REVEALED_ABOUT'],
  ayat: [
    {
      kind: 'REVEALED_ABOUT',
      from: '48:24',
      to: '48:24',
      evidence: [{ source: 'sahih-muslim', hadith: 1808, url: 'https://sunnah.com/muslim:1808', quote: "فَأَنْزَلَ اللَّهُ عز وجل: ﴿وَهُوَ الَّذِي كَفَّ أَيْدِيَهُمْ عَنْكُمْ وَأَيْدِيَكُمْ عَنْهُمْ بِبَطْنِ مَكَّةَ مِنْ بعد أن أظفركم عليهم﴾" }],
    },
  ],
  reports: [
    {
      isnad: "حَدَّثَنِي عَمْرُو بْنُ مُحَمَّدٍ النَّاقِدُ. حَدَّثَنَا يَزِيدُ بْنُ هَارُونَ. أَخْبَرَنَا حَمَّادُ بْنُ سَلَمَةَ عَنْ ثَابِتٍ، عَنْ أَنَسِ بْنِ مَالِكٍ؛",
      source: { slug: 'sahih-muslim', hadith: 1808, url: 'https://sunnah.com/muslim:1808' },
      moments: [
        { title: "هبطوا من جبل التنعيم", text: "أن ثَمَانِينَ رَجُلًا مِنْ أَهْلِ مَكَّةَ هَبَطُوا عَلَى رسول الله ﷺ من جَبَلِ التَّنْعِيمِ مُتَسَلِّحِينَ. يُرِيدُونَ غِرَّةَ النَّبِيِّ ﷺ وَأَصْحَابِهِ. فَأَخَذَهُمْ سِلْمًا. فَاسْتَحْيَاهُمْ.", people: ['prophet-muhammad'] },
        { title: "«وهو الذي كف أيديهم عنكم»", text: "فَأَنْزَلَ اللَّهُ عز وجل: ﴿وَهُوَ الَّذِي كَفَّ أَيْدِيَهُمْ عَنْكُمْ وَأَيْدِيَكُمْ عَنْهُمْ بِبَطْنِ مَكَّةَ مِنْ بعد أن أظفركم عليهم﴾ [٤٨ /الفتح /٢٤].", people: [] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theEightyFromAtTanim;
