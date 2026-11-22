import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * After the conquest Mujashi' brought his brother to pledge for hijrah and the Prophet ﷺ said «ذهب أهل الهجرة بما فيها»
 * and took his pledge on islam, iman and jihad. Told from Sahih al-Bukhari (al-Maghazi, the chapter after the conquest),
 * each hadith whole: 4305 first, then 4307, which names the brother as Abu Ma'bad. Mujashi' and his brother have no
 * catalog subject.
 */
const mujashiAndHisBrother = {
  kind: 'EVENT',
  slug: 'mujashi-and-his-brother',
  name: "مجاشع وأخوه بعد الفتح",
  nameTransliterated: "Mujashi' and his brother after the conquest",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا عَمْرُو بْنُ خَالِدٍ: حَدَّثَنَا زُهَيْرٌ: حَدَّثَنَا عَاصِمٌ، عَنْ أَبِي عُثْمَانَ قَالَ: حَدَّثَنِي مُجَاشِعٌ قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4305, url: 'https://sunnah.com/bukhari:4305' },
      moments: [
        { title: "«ذهب أهل الهجرة بما فيها»", text: "«أَتَيْتُ النَّبِيَّ ﷺ بِأَخِي بَعْدَ الْفَتْحِ، قُلْتُ: يَا رَسُولَ اللهِ، جِئْتُكَ بِأَخِي لِتُبَايِعَهُ عَلَى الْهِجْرَةِ. قَالَ: ذَهَبَ أَهْلُ الْهِجْرَةِ بِمَا فِيهَا. فَقُلْتُ: عَلَى أَيِّ شَيْءٍ تُبَايِعُهُ؟ قَالَ: أُبَايِعُهُ عَلَى الْإِسْلَامِ، وَالْإِيمَانِ، وَالْجِهَادِ» فَلَقِيتُ أَبَا مَعْبَدٍ بَعْدُ، وَكَانَ أَكْبَرَهُمَا، فَسَأَلْتُهُ فَقَالَ: صَدَقَ مُجَاشِعٌ.", people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا مُحَمَّدُ بْنُ أَبِي بَكْرٍ: حَدَّثَنَا الْفُضَيْلُ بْنُ سُلَيْمَانَ: حَدَّثَنَا عَاصِمٌ، عَنْ أَبِي عُثْمَانَ النَّهْدِيِّ، عَنْ مُجَاشِعِ بْنِ مَسْعُودٍ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4307, url: 'https://sunnah.com/bukhari:4307' },
      moments: [
        { title: "«مضت الهجرة لأهلها»", text: "«انْطَلَقْتُ بِأَبِي مَعْبَدٍ إِلَى النَّبِيِّ ﷺ لِيُبَايِعَهُ عَلَى الْهِجْرَةِ، قَالَ: مَضَتِ الْهِجْرَةُ لِأَهْلِهَا، أُبَايِعُهُ عَلَى الْإِسْلَامِ وَالْجِهَادِ» فَلَقِيتُ أَبَا مَعْبَدٍ فَسَأَلْتُهُ، فَقَالَ: صَدَقَ مُجَاشِعٌ وَقَالَ خَالِدٌ، عَنْ أَبِي عُثْمَانَ، عَنْ مُجَاشِعٍ: أَنَّهُ جَاءَ بِأَخِيهِ مُجَالِدٍ.", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default mujashiAndHisBrother;
