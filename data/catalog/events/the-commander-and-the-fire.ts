import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ sent a sariyyah under a man of the Ansar and told them to obey him; angered, he had them gather wood, light
 * a fire and go into it, and they held each other back, «فررنا إلى النبي ﷺ من النار», until it went out; the Prophet ﷺ
 * said «لو دخلوها ما خرجوا منها إلى يوم القيامة، الطاعة في المعروف». Told from Sahih al-Bukhari 4340 (al-Maghazi, the
 * sariyyah of Abd Allah ibn Hudhafah and Alqamah ibn Mujazziz), whole. The text names the commander only as «رجلا من
 * الأنصار» and he is not linked.
 */
const theCommanderAndTheFire = {
  kind: 'EVENT',
  slug: 'the-commander-and-the-fire',
  name: "الأمير والنار",
  nameTransliterated: "The commander and the fire",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا مُسَدَّدٌ: حَدَّثَنَا عَبْدُ الْوَاحِدِ: حَدَّثَنَا الْأَعْمَشُ قَالَ: حَدَّثَنِي سَعْدُ بْنُ عُبَيْدَةَ، عَنْ أَبِي عَبْدِ الرَّحْمَنِ، عَنْ عَلِيٍّ  رضي الله عنه قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4340, url: 'https://sunnah.com/bukhari:4340' },
      moments: [
        { title: "«فاجمعوا لي حطبا»", text: "«بَعَثَ النَّبِيُّ ﷺ سَرِيَّةً فَاسْتَعْمَلَ رَجُلًا مِنَ الْأَنْصَارِ، وَأَمَرَهُمْ أَنْ يُطِيعُوهُ، فَغَضِبَ، فَقَالَ: أَلَيْسَ أَمَرَكُمُ النَّبِيُّ ﷺ أَنْ تُطِيعُونِي؟ قَالُوا: بَلَى، قَالَ: فَاجْمَعُوا لِي حَطَبًا، فَجَمَعُوا، فَقَالَ: أَوْقِدُوا نَارًا، فَأَوْقَدُوهَا، فَقَالَ: ادْخُلُوهَا، فَهَمُّوا وَجَعَلَ بَعْضُهُمْ يُمْسِكُ بَعْضًا، وَيَقُولُونَ: فَرَرْنَا إِلَى النَّبِيِّ ﷺ مِنَ النَّارِ،", people: ['prophet-muhammad'] },
        { title: "«الطاعة في المعروف»", text: "فَمَا زَالُوا حَتَّى خَمَدَتِ النَّارُ، فَسَكَنَ غَضَبُهُ، فَبَلَغَ النَّبِيَّ ﷺ، فَقَالَ: لَوْ دَخَلُوهَا مَا خَرَجُوا مِنْهَا إِلَى يَوْمِ الْقِيَامَةِ، الطَّاعَةُ فِي الْمَعْرُوفِ.»", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theCommanderAndTheFire;
