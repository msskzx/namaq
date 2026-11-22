import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Khabbab asked Ibn Mas'ud whether the young men could recite as he did; Ibn Mas'ud had Alqamah read fifty ayat of Maryam,
 * said «ما أقرأ شيئا إلا وهو يقرؤه», then turned to the gold ring on Khabbab's hand, «ألم يأن لهذا الخاتم أن يلقى», and
 * Khabbab threw it off. Told from Sahih al-Bukhari 4391 (al-Maghazi, the coming of the Ash'aris and the people of Yemen),
 * whole. Alqamah and Zayd ibn Hudayr have no catalog subject. The fifty ayat are not named, so no range is given.
 */
const khabbabsGoldRing = {
  kind: 'EVENT',
  slug: 'khabbabs-gold-ring',
  name: "خاتم خباب",
  nameTransliterated: "Khabbab's gold ring",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abdullah-ibn-masud' }, { person: 'khabbab-ibn-al-aratt' }],
  reports: [
    {
      isnad: "حَدَّثَنَا عَبْدَانُ، عَنْ أَبِي حَمْزَةَ، عَنِ الْأَعْمَشِ، عَنْ إِبْرَاهِيمَ، عَنْ عَلْقَمَةَ قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4391, url: 'https://sunnah.com/bukhari:4391' },
      moments: [
        { title: "«أيستطيع هؤلاء الشباب أن يقرؤوا كما تقرأ؟»", text: "«كُنَّا جُلُوسًا مَعَ ابْنِ مَسْعُودٍ فَجَاءَ خَبَّابٌ، فَقَالَ: يَا أَبَا عَبْدِ الرَّحْمَنِ، أَيَسْتَطِيعُ هَؤُلَاءِ الشَّبَابُ أَنْ يَقْرَؤُوا كَمَا تَقْرَأُ؟ قَالَ: أَمَا إِنَّكَ لَوْ شِئْتَ أمَرْتَُ بَعْضَهُمْ يَقْرَأُ عَلَيْكَ، قَالَ: أَجَلْ، قَالَ: اقْرَأْ يَا عَلْقَمَةُ،", people: ['abdullah-ibn-masud', 'khabbab-ibn-al-aratt'] },
        { title: "«ما أقرأ شيئا إلا وهو يقرؤه»", text: "فَقَالَ زَيْدُ بْنُ حُدَيْرٍ، أَخُو زِيَادِ بْنِ حُدَيْرٍ: أَتَأْمُرُ عَلْقَمَةَ أَنْ يَقْرَأَ وَلَيْسَ بِأَقْرَئِنَا؟ قَالَ: أَمَا إِنَّكَ إِنْ شِئْتَ أَخْبَرْتُكَ بِمَا قَالَ النَّبِيُّ ﷺ فِي قَوْمِكَ وَقَوْمِهِ، فَقَرَأْتُ خَمْسِينَ آيَةً مِنْ سُورَةِ مَرْيَمَ فَقَالَ عَبْدُ اللهِ: كَيْفَ تَرَى؟ قَالَ: قَدْ أَحْسَنَ، قَالَ عَبْدُ اللهِ: مَا أَقْرَأُ شَيْئًا إِلَّا وَهُوَ يَقْرَؤُهُ،", people: ['abdullah-ibn-masud'] },
        { title: "«ألم يأن لهذا الخاتم أن يلقى»", text: "ثُمَّ الْتَفَتَ إِلَى خَبَّابٍ وَعَلَيْهِ خَاتَمٌ مِنْ ذَهَبٍ، فَقَالَ: أَلَمْ يَأْنِ لِهَذَا الْخَاتَمِ أَنْ يُلْقَى، قَالَ: أَمَا إِنَّكَ لَنْ تَرَاهُ عَلَيَّ بَعْدَ الْيَوْمِ، فَأَلْقَاهُ» رَوَاهُ غُنْدَرٌ، عَنْ شُعْبَةَ.", people: ['abdullah-ibn-masud', 'khabbab-ibn-al-aratt'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default khabbabsGoldRing;
