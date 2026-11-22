import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ came to Khaybar by night and waited for morning; when the people came out with their spades and baskets and
 * saw him they cried «محمد والخميس», and he said «الله أكبر، خربت خيبر، إنا إذا نزلنا بساحة قوم فساء صباح المنذرين».
 * Told from Sahih al-Bukhari (al-Maghazi, the chapter on Khaybar), each hadith whole: Anas's 4200 first, the fullest, with
 * Safiyyah among the captives; then 4198, with the call against the donkeys' meat; then 4197, whose printed route in our copy
 * begins with the last words of 4196 («نشأ بها») before its own chain, kept with the chain as printed.
 */
const theMorningAtKhaybar = {
  kind: 'EVENT',
  slug: 'the-morning-at-khaybar',
  name: "صباح خيبر",
  nameTransliterated: "The morning at Khaybar",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'safiyyah-bint-huyayy' }, { person: 'dihyah-al-kalbi' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا سُلَيْمَانُ بْنُ حَرْبٍ: حَدَّثَنَا حَمَّادُ بْنُ زَيْدٍ، عَنْ ثَابِتٍ، عَنْ أَنَسٍ  رضي الله عنه قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4200, url: 'https://sunnah.com/bukhari:4200' },
      moments: [
        { title: "«خربت خيبر»", text: "«صَلَّى النَّبِيُّ ﷺ الصُّبْحَ قَرِيبًا مِنْ خَيْبَرَ بِغَلَسٍ، ثُمَّ قَالَ: اللهُ أَكْبَرُ، خَرِبَتْ خَيْبَرُ، إِنَّا إِذَا نَزَلْنَا بِسَاحَةِ قَوْمٍ فَسَاءَ صَبَاحُ الْمُنْذَرِينَ", people: ['prophet-muhammad'] },
        { title: "فجعل عتقها صداقها", text: "فَخَرَجُوا يَسْعَوْنَ فِي السِّكَكِ، فَقَتَلَ النَّبِيُّ ﷺ الْمُقَاتِلَةَ وَسَبَى الذُّرِّيَّةَ، وَكَانَ فِي السَّبْيِ صَفِيَّةُ، فَصَارَتْ إِلَى دَِحْيَةَ الْكَلْبِيِّ، ثُمَّ صَارَتْ إِلَى النَّبِيِّ ﷺ، فَجَعَلَ عِتْقَهَا صَدَاقَهَا». فَقَالَ عَبْدُ الْعَزِيزِ بْنُ صُهَيْبٍ لِثَابِتٍ: يَا أَبَا مُحَمَّدٍ، آنْتَ قُلْتَ لِأَنَسٍ: مَا أَصْدَقَهَا؟ فَحَرَّكَ ثَابِتٌ رَأْسَهُ تَصْدِيقًا لَهُ.", people: ['prophet-muhammad', 'safiyyah-bint-huyayy', 'dihyah-al-kalbi'] },
      ],
    },
    {
      isnad: "أَخْبَرَنَا صَدَقَةُ بْنُ الْفَضْلِ: أَخْبَرَنَا ابْنُ عُيَيْنَةَ: حَدَّثَنَا أَيُّوبُ، عَنْ مُحَمَّدِ بْنِ سِيرِينَ، عَنْ أَنَسِ بْنِ مَالِكٍ  رضي الله عنه قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4198, url: 'https://sunnah.com/bukhari:4198' },
      moments: [
        { title: "«محمد والخميس»", text: "«صَبَّحْنَا خَيْبَرَ بُكْرَةً، فَخَرَجَ أَهْلُهَا بِالْمَسَاحِي، فَلَمَّا بَصُرُوا بِالنَّبِيِّ ﷺ قَالُوا: مُحَمَّدٌ وَاللهِ، مُحَمَّدٌ وَالْخَمِيسُ", people: ['prophet-muhammad'] },
        { title: "«خربت خيبر»", text: "فَقَالَ النَّبِيُّ ﷺ: اللهُ أَكْبَرُ، خَرِبَتْ خَيْبَرُ، إِنَّا إِذَا نَزَلْنَا بِسَاحَةِ قَوْمٍ فَسَاءَ صَبَاحُ الْمُنْذَرِينَ", people: ['prophet-muhammad'] },
        { title: "«إن الله ورسوله ينهيانكم عن لحوم الحمر»", text: "فَأَصَبْنَا مِنْ لُحُومِ الْحُمُرِ، فَنَادَى مُنَادِي النَّبِيِّ ﷺ: إِنَّ اللهَ وَرَسُولَهُ يَنْهَيَانِكُمْ عَنْ لُحُومِ الْحُمُرِ، فَإِنَّهَا رِجْسٌ».", people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا قُتَيْبَةُ: حَدَّثَنَا حَاتِمٌ، قَالَ: «نَشَأَ بِهَا». ٤١٩٧ (م) - حَدَّثَنَا عَبْدُ اللهِ بْنُ يُوسُفَ: أَخْبَرَنَا مَالِكٌ، عَنْ حُمَيْدٍ الطَّوِيلِ، عَنْ أَنَسٍ  رضي الله عنه:",
      source: { slug: 'sahih-al-bukhari', hadith: 4197, url: 'https://sunnah.com/bukhari:4197' },
      moments: [
        { title: "لم يغر بهم حتى يصبح", text: "«أَنَّ رَسُولَ اللهِ ﷺ أَتَى خَيْبَرَ لَيْلًا: وَكَانَ إِذَا أَتَى قَوْمًا بِلَيْلٍ لَمْ يُغِرْ بِهِمْ حَتَّى يُصْبِحَ، فَلَمَّا أَصْبَحَ خَرَجَتِ الْيَهُودُ بِمَسَاحِيهِمْ وَمَكَاتِلِهِمْ، فَلَمَّا رَأَوْهُ قَالُوا: مُحَمَّدٌ وَاللهِ، مُحَمَّدٌ وَالْخَمِيسُ.", people: ['prophet-muhammad'] },
        { title: "«خربت خيبر»", text: "فَقَالَ النَّبِيُّ ﷺ: خَرِبَتْ خَيْبَرُ، إِنَّا إِذَا نَزَلْنَا بِسَاحَةِ قَوْمٍ فَسَاءَ صَبَاحُ الْمُنْذَرِينَ.»", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theMorningAtKhaybar;
