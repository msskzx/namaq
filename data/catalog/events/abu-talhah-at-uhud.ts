import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * When the people broke away from the Prophet ﷺ at Uhud, Abu Talhah stood before him with his shield, shooting, «نحري دون
 * نحرك», while Aisha and Umm Sulaym carried water skins to the wounded. Told from Sahih al-Bukhari 4064 (al-Maghazi, the
 * chapter on Uhud), whole.
 *
 * Then Anas's same hadith in Sahih Muslim 1811 (al-Jihad, women going out with the men), whole.
 */
const abuTalhahAtUhud = {
  kind: 'EVENT',
  slug: 'abu-talhah-at-uhud',
  name: "أبو طلحة يوم أحد",
  nameTransliterated: "Abu Talhah at Uhud",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abu-talha-al-ansari' }, { person: 'anas-ibn-malik' }, { person: 'aisha-bint-abi-bakr' }, { person: 'umm-sulaym-al-ghumaysa' }],
  reports: [
    {
      isnad: "حَدَّثَنَا أَبُو مَعْمَرٍ: حَدَّثَنَا عَبْدُ الْوَارِثِ: حَدَّثَنَا عَبْدُ الْعَزِيزِ، عَنْ أَنَسٍ  رضي الله عنه قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4064, url: 'https://sunnah.com/bukhari:4064' },
      moments: [
        { title: "مجوب عليه بحجفة له", text: "«لَمَّا كَانَ يَوْمَُ أُحُدٍ انْهَزَمَ النَّاسُ عَنِ النَّبِيِّ ﷺ، وَأَبُو طَلْحَةَ بَيْنَ يَدَيِ النَّبِيِّ ﷺ مُجَوِّبٌ عَلَيْهِ بِحَجَفَةٍ لَهُ، وَكَانَ أَبُو طَلْحَةَ رَجُلًا رَامِيًا شَدِيدَ النَّزْعِ، كَسَرَ يَوْمَئِذٍ قَوْسَيْنِ أَوْ ثَلَاثًا، وَكَانَ الرَّجُلُ يَمُرُّ مَعَهُ بِجَعْبَةٍ مِنَ النَّبْلِ، فَيَقُولُ: انْثُرْهَا لِأَبِي طَلْحَةَ", people: ['prophet-muhammad', 'abu-talha-al-ansari'] },
        { title: "«نحري دون نحرك»", text: "قَالَ: وَيُشْرِفُ النَّبِيُّ ﷺ يَنْظُرُ إِلَى الْقَوْمِ، فَيَقُولُ أَبُو طَلْحَةَ: بِأَبِي أَنْتَ وَأُمِّي، لَا تُشْرِفْ، يُصِيبُكَ سَهْمٌ مِنْ سِهَامِ الْقَوْمِ، نَحْرِي دُونَ نَحْرِكَ.", people: ['prophet-muhammad', 'abu-talha-al-ansari'] },
        { title: "تنقزان القرب على متونهما", text: "وَلَقَدْ رَأَيْتُ عَائِشَةَ بِنْتَ أَبِي بَكْرٍ وَأُمَّ سُلَيْمٍ، وَإِنَّهُمَا لَمُشَمِّرَتَانِ، أَرَى خَدَمَ سُوقِهِمَا، تَُنْقُِزَانِ الْقِرَبَُ عَلَى مُتُونِهِمَا، تُفْرِغَانِهِ فِي أَفْوَاهِ الْقَوْمِ، ثُمَّ تَرْجِعَانِ فَتَمْلَآنِهَا، ثُمَّ تَجِيئَانِ فَتُفْرِغَانِهِ فِي أَفْوَاهِ الْقَوْمِ،", people: ['anas-ibn-malik', 'aisha-bint-abi-bakr', 'umm-sulaym-al-ghumaysa'] },
        { title: "وقع السيف من يديه", text: "وَلَقَدْ وَقَعَ السَّيْفُ مِنْ يَدَيْ أَبِي طَلْحَةَ، إِمَّا مَرَّتَيْنِ وَإِمَّا ثَلَاثًا.»", people: ['abu-talha-al-ansari'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا عَبْدُ اللَّهِ بْنُ عَبْدِ الرَّحْمَنِ الدَّارِمِيُّ. حدثنا عبد الله ابن عَمْرٍو (وَهُوَ أَبُو مَعْمَرٍ الْمِنْقَرِيُّ). حَدَّثَنَا عَبْدُ الْوَارِثِ. حَدَّثَنَا عَبْدُ الْعَزِيزِ (وَهُوَ ابْنُ صُهَيْبٍ) عَنْ أَنَسِ بْنِ مَالِكٍ، قَالَ:",
      source: { slug: 'sahih-muslim', hadith: 1811, url: 'https://sunnah.com/muslim:1811' },
      moments: [
        { title: "مجوب عليه بجحفة", text: "لَمَّا كَانَ يوم أحد انهزم ناس عَنِ النَّبِيِّ ﷺ. وَأَبُو طَلْحَةَ بَيْنَ يَدَيِ النَّبِيِّ ﷺ مجوب عليه بجحفة. قَالَ: وَكَانَ أَبُو طَلْحَةَ رَجُلًا رَامِيًا شَدِيدَ النَّزْعِ. وَكَسَرَ يَوْمَئِذٍ قَوْسَيْنِ أَوْ ثَلَاثًا. قَالَ: فَكَانَ الرَّجُلُ يَمُرُّ مَعَهُ الْجَعْبَةُ مِنَ النَّبْلِ. فيقول: انثرها لأبي طلحة.", people: ['prophet-muhammad', 'abu-talha-al-ansari'] },
        { title: "«نحري دون نحرك»", text: "قال: ويشرف النبي ﷺ يَنْظُرُ إِلَى الْقَوْمِ. فَيَقُولُ أَبُو طَلْحَةَ: يَا نَبِيَّ اللَّهِ! بِأَبِي أَنْتَ وَأُمِّي! لَا تُشْرِفْ لَا يُصِبْكَ سَهْمٌ مِنْ سِهَامِ الْقَوْمِ. نَحْرِي دُونَ نَحْرِكَ.", people: ['prophet-muhammad', 'abu-talha-al-ansari'] },
        { title: "تنقلان القرب على متونهما", text: "قَالَ: وَلَقَدْ رَأَيْتُ عَائِشَةَ بِنْتَ أَبِي بَكْرٍ وَأُمَّ سُلَيْمٍ وَإِنَّهُمَا لَمُشَمِّرَتَانِ. أَرَى خَدَمَ سُوقِهِمَا. تَنْقُلَانِ الْقِرَبَ عَلَى مُتُونِهِمَا. ثُمَّ تُفْرِغَانِهِ فِي أَفْوَاهِهِمْ. ثُمَّ تَرْجِعَانِ فَتَمْلَآَنِهَا. ثُمَّ تَجِيئَانِ تُفْرِغَانِهِ فِي أَفْوَاهِ الْقَوْمِ.", people: ['anas-ibn-malik', 'aisha-bint-abi-bakr', 'umm-sulaym-al-ghumaysa'] },
        { title: "وقع السيف من يدي أبي طلحة", text: "وَلَقَدْ وَقَعَ السَّيْفُ مِنْ يَدَيْ أبي طلحة إما مرتين أو ثلاثا، من النعاس.", people: ['abu-talha-al-ansari'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default abuTalhahAtUhud;
