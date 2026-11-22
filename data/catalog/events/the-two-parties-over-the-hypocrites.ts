import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * When the Prophet ﷺ went out to Uhud some who had gone with him turned back, and his companions split over them, some saying
 * fight them and some not, and «فما لكم في المنافقين فئتين» came down. Told from Sahih al-Bukhari 4050 (al-Maghazi, the
 * chapter on Uhud), whole, with the line on Medina that ends it; the text does not say who says it, so no one is linked.
 */
const theTwoPartiesOverTheHypocrites = {
  kind: 'EVENT',
  slug: 'the-two-parties-over-the-hypocrites',
  name: "فئتان في المنافقين",
  nameTransliterated: "Two parties over the hypocrites",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['REVEALED_ABOUT'],
  ayat: [
    {
      kind: 'REVEALED_ABOUT',
      from: '4:88',
      to: '4:88',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 4050, url: 'https://sunnah.com/bukhari:4050', quote: "فَنَزَلَتْ: ﴿فَمَا لَكُمْ فِي الْمُنَافِقِينَ فِئَتَيْنِ وَاللهُ أَرْكَسَهُمْ بِمَا كَسَبُوا﴾" }],
    },
  ],
  reports: [
    {
      isnad: "حَدَّثَنَا أَبُو الْوَلِيدِ حَدَّثَنَا شُعْبَةُ، عَنْ عَدِيِّ بْنِ ثَابِتٍ سَمِعْتُ عَبْدَ اللهِ بْنَ يَزِيدَ يُحَدِّثُ عَنْ زَيْدِ بْنِ ثَابِتٍ  رضي الله عنه قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4050, url: 'https://sunnah.com/bukhari:4050' },
      moments: [
        { title: "رجع ناس ممن خرج معه", text: "«لَمَّا خَرَجَ النَّبِيُّ ﷺ إِلَى أُحُدٍ، رَجَعَ نَاسٌ مِمَّنْ خَرَجَ مَعَهُ، وَكَانَ أَصْحَابُ النَّبِيِّ ﷺ فِرْقَتَيْنِ: فِرْقَةً تَقُولُ: نُقَاتِلُهُمْ، وَفِرْقَةً تَقُولُ: لَا نُقَاتِلُهُمْ،", people: ['prophet-muhammad'] },
        { title: "«فما لكم في المنافقين فئتين»", text: "فَنَزَلَتْ: ﴿فَمَا لَكُمْ فِي الْمُنَافِقِينَ فِئَتَيْنِ وَاللهُ أَرْكَسَهُمْ بِمَا كَسَبُوا﴾", people: [] },
        { title: "«إنها طيبة»", text: "وَقَالَ: إِنَّهَا طَيْبَةُ، تَنْفِي الذُّنُوبَ، كَمَا تَنْفِي النَّارُ خَبَثَ الْفِضَّةِ.»", people: [] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theTwoPartiesOverTheHypocrites;
