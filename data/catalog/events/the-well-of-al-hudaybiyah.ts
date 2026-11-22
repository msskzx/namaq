import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Fourteen hundred at al-Hudaybiyah drew its well dry; the Prophet ﷺ sat on its rim, rinsed his mouth and prayed and poured
 * the water into it, and it gave them and their mounts all they wanted. Told from Sahih al-Bukhari 4150 (al-Maghazi, the
 * chapter on al-Hudaybiyah), whole, with al-Bara's «ونحن نعد الفتح بيعة الرضوان»; then 4151, whole, folded.
 */
const theWellOfAlHudaybiyah = {
  kind: 'EVENT',
  slug: 'the-well-of-al-hudaybiyah',
  name: "بئر الحديبية",
  nameTransliterated: "The well of al-Hudaybiyah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا عُبَيْدُ اللهِ بْنُ مُوسَى، عَنْ إِسْرَائِيلَ، عَنْ أَبِي إِسْحَاقَ، عَنِ الْبَرَاءِ  رضي الله عنه قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4150, url: 'https://sunnah.com/bukhari:4150' },
      moments: [
        { title: "«ونحن نعد الفتح بيعة الرضوان»", text: "«تَعُدُّونَ أَنْتُمُ الْفَتْحَ فَتْحَ مَكَّةَ، وَقَدْ كَانَ فَتْحُ مَكَّةَ فَتْحًا، وَنَحْنُ نَعُدُّ الْفَتْحَ بَيْعَةَ الرُِّضْوَانِ يَوْمَ الْحُدَيْبِيَةِ، كُنَّا مَعَ النَّبِيِّ ﷺ أَرْبَعَ عَشْرَةَ مِائَةً،", people: ['prophet-muhammad'] },
        { title: "فجلس على شفيرها", text: "وَالْحُدَيْبِيَةُ بِئْرٌ، فَنَزَحْنَاهَا فَلَمْ نَتْرُكْ فِيهَا قَطْرَةً، فَبَلَغَ ذَلِكَ النَّبِيَّ ﷺ فَأَتَاهَا، فَجَلَسَ عَلَى شَفِيرِهَا، ثُمَّ دَعَا بِإِنَاءٍ مِنْ مَاءٍ فَتَوَضَّأَ، ثُمَّ مَضْمَضَ وَدَعَا ثُمَّ صَبَّهُ فِيهَا، فَتَرَكْنَاهَا غَيْرَ بَعِيدٍ، ثُمَّ إِنَّهَا أَصْدَرَتْنَا مَا شِئْنَا نَحْنُ وَرِكَابَنَا.»", people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: "حَدَّثَنِي فَضْلُ بْنُ يَعْقُوبَ: حَدَّثَنَا الْحَسَنُ بْنُ مُحَمَّدِ بْنِ أَعْيَنَ أَبُو عَلِيٍّ الْحَرَّانِيُّ: حَدَّثَنَا زُهَيْرٌ: حَدَّثَنَا أَبُو إِسْحَاقَ قَالَ: أَنْبَأَنَا الْبَرَاءُ بْنُ عَازِبٍ  رضي الله عنهما:",
      source: { slug: 'sahih-al-bukhari', hadith: 4151, url: 'https://sunnah.com/bukhari:4151' },
      moments: [
        { title: "نزحوا البئر", text: "«أَنَّهُمْ كَانُوا مَعَ رَسُولِ اللهِ ﷺ يَوْمَ الْحُدَيْبِيَةِ أَلْفًا وَأَرْبَعَمِائَةٍ أَوْ أَكْثَرَ، فَنَزَلُوا عَلَى بِئْرٍ فَنَزَحُوهَا، فَأَتَوْا رَسُولَ اللهِ ﷺ،", people: ['prophet-muhammad'] },
        { title: "«دعوها ساعة»", text: "فَأَتَى الْبِئْرَ وَقَعَدَ عَلَى شَفِيرِهَا، ثُمَّ قَالَ: ائْتُونِي بِدَلْوٍ مِنْ مَائِهَا. فَأُتِيَ بِهِ، فَبَصَقَ فَدَعَا، ثُمَّ قَالَ: دَعُوهَا سَاعَةً. فَأَرْوَوْا أَنْفُسَهُمْ وَرِكَابَهُمْ حَتَّى ارْتَحَلُوا.»", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theWellOfAlHudaybiyah;
