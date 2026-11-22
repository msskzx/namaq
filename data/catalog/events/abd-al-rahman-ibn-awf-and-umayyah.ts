import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Abd al-Rahman ibn Awf and Umayyah ibn Khalaf agreed in writing to guard each other's people; at Badr he took Umayyah up a
 * hill to save him, Bilal saw him and cried «لا نجوت إن نجا أمية», the Ansar overtook them and killed Umayyah under Abd
 * al-Rahman's own body. Told from Sahih al-Bukhari 2301 (al-Wakalah), whole; then 3971 (al-Maghazi, the chapter on the
 * killing of Abu Jahl), the short telling «فذكر قتله وقتل ابنه», whole, folded. His son has no catalog subject and is not
 * linked.
 */
const abdAlRahmanIbnAwfAndUmayyah = {
  kind: 'EVENT',
  slug: 'abd-al-rahman-ibn-awf-and-umayyah',
  name: "عبد الرحمن بن عوف وأمية بن خلف",
  nameTransliterated: "Abd al-Rahman ibn Awf and Umayyah ibn Khalaf",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abdur-rahman-ibn-awf' }, { person: 'umayyah-ibn-khalaf' }, { person: 'bilal-ibn-rabah' }],
  reports: [
    {
      isnad: "حَدَّثَنَا عَبْدُ الْعَزِيزِ بْنُ عَبْدِ اللهِ قَالَ: حَدَّثَنِي يُوسُفُ بْنُ الْمَاجِشُونِ، عَنْ صَالِحِ بْنِ إِبْرَاهِيمَ بْنِ عَبْدِ الرَّحْمَنِ بْنِ عَوْفٍ، عَنْ أَبِيهِ، عَنْ جَدِّهِ عَبْدِ الرَّحْمَنِ بْنِ عَوْفٍ  رضي الله عنه قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 2301, url: 'https://sunnah.com/bukhari:2301' },
      moments: [
        { title: "«لا أعرف الرحمن»", text: "«كَاتَبْتُ أُمَيَّةَ بْنَ خَلَفٍ كِتَابًا، بِأَنْ يَحْفَظَنِي فِي صَاغِيَتِي بِمَكَّةَ، وَأَحْفَظَهُ فِي صَاغِيَتِهِ بِالْمَدِينَةِ، فَلَمَّا ذَكَرْتُ الرَّحْمَنَ، قَالَ: لَا أَعْرِفُ الرَّحْمَنَ، كَاتِبْنِي بِاسْمِكَ الَّذِي كَانَ فِي الْجَاهِلِيَّةِ، فَكَاتَبْتُهُ: عَبْدُ عَمْرٍو،", people: ['abdur-rahman-ibn-awf', 'umayyah-ibn-khalaf'] },
        { title: "«لا نجوت إن نجا أمية»", text: "فَلَمَّا كَانَ فِي يَوْمِ بَدْرٍ، خَرَجْتُ إِلَى جَبَلٍ لِأُحْرِزَهُ حِينَ نَامَ النَّاسُ، فَأَبْصَرَهُ بِلَالٌ، فَخَرَجَ حَتَّى وَقَفَ عَلَى مَجْلِسٍ مِنَ الْأَنْصَارِ، فَقَالَ: أُمَيَّةُ بْنُ خَلَفٍ، لَا نَجَوْتُ إِنْ نَجَا أُمَيَّةُ، فَخَرَجَ مَعَهُ فَرِيقٌ مِنَ الْأَنْصَارِ فِي آثَارِنَا،", people: ['abdur-rahman-ibn-awf', 'bilal-ibn-rabah', 'umayyah-ibn-khalaf'] },
        { title: "تخللوه بالسيوف من تحتي", text: "فَلَمَّا خَشِيتُ أَنْ يَلْحَقُونَا، خَلَّفْتُ لَهُمُ ابْنَهُ لِأَشْغَلَهُمْ فَقَتَلُوهُ، ثُمَّ أَبَوْا حَتَّى يَتْبَعُونَا، وَكَانَ رَجُلًا ثَقِيلًا، فَلَمَّا أَدْرَكُونَا، قُلْتُ لَهُ: ابْرُكْ فَبَرَكَ، فَأَلْقَيْتُ عَلَيْهِ نَفْسِي لِأَمْنَعَهُ، فَتَخَلَّلُوهُ بِالسُّيُوفِ مِنْ تَحْتِي حَتَّى قَتَلُوهُ، وَأَصَابَ أَحَدُهُمْ رِجْلِي بِسَيْفِهِ، وَكَانَ عَبْدُ الرَّحْمَنِ بْنُ عَوْفٍ يُرِينَا ذَلِكَ الْأَثَرَ فِي ظَهْرِ قَدَمِهِ.»", people: ['abdur-rahman-ibn-awf', 'umayyah-ibn-khalaf'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا عَبْدُ الْعَزِيزِ بْنُ عَبْدِ اللهِ قَالَ: حَدَّثَنِي يُوسُفُ بْنُ الْمَاجِشُونِ، عَنْ صَالِحِ بْنِ إِبْرَاهِيمَ بْنِ عَبْدِ الرَّحْمَنِ بْنِ عَوْفٍ، عَنْ أَبِيهِ، عَنْ جَدِّهِ عَبْدِ الرَّحْمَنِ قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 3971, url: 'https://sunnah.com/bukhari:3971' },
      moments: [
        { title: "«لا نجوت إن نجا أمية»", text: "«كَاتَبْتُ أُمَيَّةَ بْنَ خَلَفٍ، فَلَمَّا كَانَ يَوْمَُ بَدْرٍ، فَذَكَرَ قَتْلَهُ وَقَتْلَ ابْنِهِ، فَقَالَ بِلَالٌ: لَا نَجَوْتُ إِنْ نَجَا أُمَيَّةُ.»", people: ['abdur-rahman-ibn-awf', 'umayyah-ibn-khalaf', 'bilal-ibn-rabah'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default abdAlRahmanIbnAwfAndUmayyah;
