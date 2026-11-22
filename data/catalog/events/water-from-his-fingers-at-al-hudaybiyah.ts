import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The people were thirsty at al-Hudaybiyah with no water but what was in his small vessel; he put his hand in it and the
 * water gushed from between his fingers like springs, and fifteen hundred drank and made wudu. Told from Sahih al-Bukhari
 * 4152 (al-Maghazi, the chapter on al-Hudaybiyah), whole.
 */
const waterFromHisFingersAtAlHudaybiyah = {
  kind: 'EVENT',
  slug: 'water-from-his-fingers-at-al-hudaybiyah',
  name: "الماء يفور من بين أصابعه يوم الحديبية",
  nameTransliterated: "Water from his fingers at al-Hudaybiyah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'jabir-ibn-abdullah' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا يُوسُفُ بْنُ عِيسَى: حَدَّثَنَا ابْنُ فُضَيْلٍ: حَدَّثَنَا حُصَيْنٌ، عَنْ سَالِمٍ، عَنْ جَابِرٍ  رضي الله عنه قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4152, url: 'https://sunnah.com/bukhari:4152' },
      moments: [
        { title: "«ما لكم؟»", text: "«عَطِشَ النَّاسُ يَوْمَ الْحُدَيْبِيَةِ، وَرَسُولُ اللهِ ﷺ بَيْنَ يَدَيْهِ رَكْوَةٌ فَتَوَضَّأَ مِنْهَا، ثُمَّ أَقْبَلَ النَّاسُ نَحْوَهُ، فَقَالَ رَسُولُ اللهِ ﷺ: مَا لَكُمْ؟ قَالُوا: يَا رَسُولَ اللهِ، لَيْسَ عِنْدَنَا مَاءٌ نَتَوَضَّأُ بِهِ وَلَا نَشْرَبُ إِلَّا مَا فِي رَكْوَتِكَ،", people: ['prophet-muhammad'] },
        { title: "يفور من بين أصابعه", text: "قَالَ: فَوَضَعَ النَّبِيُّ ﷺ يَدَهُ فِي الرَّكْوَةِ فَجَعَلَ الْمَاءُ يَفُورُ مِنْ بَيْنِ أَصَابِعِهِ كَأَمْثَالِ الْعُيُونِ، قَالَ: فَشَرِبْنَا وَتَوَضَّأْنَا،", people: ['prophet-muhammad'] },
        { title: "«لو كنا مائة ألف لكفانا»", text: "فَقُلْتُ لِجَابِرٍ: كَمْ كُنْتُمْ يَوْمَئِذٍ؟ قَالَ: لَوْ كُنَّا مِائَةَ أَلْفٍ لَكَفَانَا، كُنَّا خَمْسَ عَشْرَةَ مِائَةً.»", people: ['jabir-ibn-abdullah'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default waterFromHisFingersAtAlHudaybiyah;
