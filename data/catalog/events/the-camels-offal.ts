import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * While the Prophet ﷺ was prostrating with men of Quraysh around him, Uqbah ibn Abi Mu'ayt threw a camel's offal on his
 * back; Fatimah took it off and prayed against whoever did it, and he prayed against the chiefs of Quraysh by name. Ibn
 * Mas'ud saw them killed at Badr. Told from Sahih al-Bukhari 3854 (Manaqib al-Ansar), whole. Of those named in the du'a,
 * Shaybah ibn Rabi'ah and Ubayy ibn Khalaf have no catalog subject and are not linked; Umayyah is linked though Shu'bah
 * doubts whether it was Umayyah or Ubayy, as the text says, because al-Bukhari settles it himself after Shu'bah's doubt
 * in 2934: «وَقَالَ شُعْبَةُ: أُمَيَّةُ أَوْ أُبَيٌّ وَالصَّحِيحُ أُمَيَّةُ».
 */
const theCamelsOffal = {
  kind: 'EVENT',
  slug: 'the-camels-offal',
  name: "سلى الجزور على ظهره ﷺ",
  nameTransliterated: "The camel's offal on his back",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'uqba-ibn-abi-muayt' }, { person: 'fatimah-bint-muhammad' }, { person: 'abu-jahl-ibn-hisham' }, { person: 'utbah-ibn-rabiah' }, { person: 'umayyah-ibn-khalaf' }, { person: 'abdullah-ibn-masud' }],
  reports: [
    {
      isnad: "حَدَّثَنِي مُحَمَّدُ بْنُ بَشَّارٍ: حَدَّثَنَا غُنْدَرٌ: حَدَّثَنَا شُعْبَةُ، عَنْ أَبِي إِسْحَاقَ، عَنْ عَمْرِو بْنِ مَيْمُونٍ، عَنْ عَبْدِ اللهِ  رضي الله عنه",
      source: { slug: 'sahih-al-bukhari', hadith: 3854, url: 'https://sunnah.com/bukhari:3854' },
      moments: [
        {
          title: "سلى الجزور على ظهره",
          text: "قَالَ: «بَيْنَا النَّبِيُّ ﷺ سَاجِدٌ، وَحَوْلَهُ نَاسٌ مِنْ قُرَيْشٍ، جَاءَ عُقْبَةُ بْنُ أَبِي مُعَيْطٍ بِسَلَى جَزُورٍ، فَقَذَفَهُ عَلَى ظَهْرِ النَّبِيِّ ﷺ، فَلَمْ يَرْفَعْ رَأْسَهُ،",
          people: ['prophet-muhammad', 'uqba-ibn-abi-muayt'],
          turns: [
            { text: "قَالَ: «بَيْنَا النَّبِيُّ ﷺ سَاجِدٌ، وَحَوْلَهُ نَاسٌ مِنْ قُرَيْشٍ، جَاءَ عُقْبَةُ بْنُ أَبِي مُعَيْطٍ بِسَلَى جَزُورٍ، فَقَذَفَهُ عَلَى ظَهْرِ النَّبِيِّ ﷺ، فَلَمْ يَرْفَعْ رَأْسَهُ،" },
          ],
        },
        {
          title: "فاطمة تأخذه عن ظهره",
          text: "فَجَاءَتْ فَاطِمَةُ عليها السلام فَأَخَذَتْهُ مِنْ ظَهْرِهِ وَدَعَتْ عَلَى مَنْ صَنَعَ،",
          people: ['fatimah-bint-muhammad', 'prophet-muhammad'],
          turns: [
            { text: "فَجَاءَتْ فَاطِمَةُ عليها السلام فَأَخَذَتْهُ مِنْ ظَهْرِهِ وَدَعَتْ عَلَى مَنْ صَنَعَ،" },
          ],
        },
        {
          title: "«اللهم عليك الملأ من قريش»",
          text: "فَقَالَ النَّبِيُّ ﷺ: اللَّهُمَّ عَلَيْكَ الْمَلَأَ مِنْ قُرَيْشٍ: أَبَا جَهْلِ بْنَ هِشَامٍ، وَعُتْبَةَ بْنَ رَبِيعَةَ، وَشَيْبَةَ بْنَ رَبِيعَةَ، وَأُمَيَّةَ بْنَ خَلَفٍ، أَوْ أُبَيَّ بْنَ خَلَفٍ شُعْبَةُ الشَّاكُّ",
          people: ['prophet-muhammad', 'abu-jahl-ibn-hisham', 'utbah-ibn-rabiah', 'umayyah-ibn-khalaf'],
          turns: [
            { text: "فَقَالَ النَّبِيُّ ﷺ: اللَّهُمَّ عَلَيْكَ الْمَلَأَ مِنْ قُرَيْشٍ: أَبَا جَهْلِ بْنَ هِشَامٍ، وَعُتْبَةَ بْنَ رَبِيعَةَ، وَشَيْبَةَ بْنَ رَبِيعَةَ، وَأُمَيَّةَ بْنَ خَلَفٍ، أَوْ أُبَيَّ بْنَ خَلَفٍ شُعْبَةُ الشَّاكُّ", speaker: { person: 'prophet-muhammad', name: "النبي ﷺ" }, lead: "فَقَالَ النَّبِيُّ ﷺ:" },
          ],
        },
        {
          title: "قُتلوا يوم بدر",
          text: "فَرَأَيْتُهُمْ قُتِلُوا يَوْمَ بَدْرٍ، فَأُلْقُوا فِي بِئْرٍ غَيْرَ أُمَيَّةَ أَوْ أُبَيٍّ، تَقَطَّعَتْ أَوْصَالُهُ، فَلَمْ يُلْقَ فِي الْبِئْرِ.»",
          people: ['abdullah-ibn-masud'],
          turns: [
            { text: "فَرَأَيْتُهُمْ قُتِلُوا يَوْمَ بَدْرٍ، فَأُلْقُوا فِي بِئْرٍ غَيْرَ أُمَيَّةَ أَوْ أُبَيٍّ، تَقَطَّعَتْ أَوْصَالُهُ، فَلَمْ يُلْقَ فِي الْبِئْرِ.»" },
          ],
        },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theCamelsOffal;
