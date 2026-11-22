import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Ibn Umar went in to Hafsah, who sent him to the people's gathering; when Mu'awiyah stood and said whoever wanted
 * to speak in this matter should show his head, Ibn Umar was about to answer and held back, fearing a word that would split
 * the people and shed blood, and remembered what Allah has prepared in the gardens. Told from Sahih al-Bukhari 4108
 * (al-Maghazi, in the chapter on al-Khandaq), whole. Hafsah is linked as named; Ibn Umar has no catalog subject and is not
 * linked.
 */
const ibnUmarHoldsHisTongue = {
  kind: 'EVENT',
  slug: 'ibn-umar-holds-his-tongue',
  name: "ابن عمر وخطبة معاوية",
  nameTransliterated: "Ibn Umar and Mu'awiyah's sermon",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'hafsa-bint-umar' }, { person: 'muawiyah-ibn-abi-sufyan' }, { person: 'habib-ibn-maslamah' }],
  reports: [
    {
      isnad: "حَدَّثَنِي إِبْرَاهِيمُ بْنُ مُوسَى: أَخْبَرَنَا هِشَامٌ، عَنْ مَعْمَرٍ، عَنِ الزُّهْرِيِّ، عَنْ سَالِمٍ، عَنِ ابْنِ عُمَرَ قَالَ: وَأَخْبَرَنِي ابْنُ طَاوُسٍ، عَنْ عِكْرِمَةَ بْنِ خَالِدٍ، عَنِ ابْنِ عُمَرَ قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4108, url: 'https://sunnah.com/bukhari:4108' },
      moments: [
        { title: "«الحق فإنهم ينتظرونك»", text: "«دَخَلْتُ عَلَى حَفْصَةَ وَنَسْوَاتُهَا تَنْطُفُ، قُلْتُ: قَدْ كَانَ مِنْ أَمْرِ النَّاسِ مَا تَرَيْنَ، فَلَمْ يُجْعَلْ لِي مِنَ الْأَمْرِ شَيْءٌ. فَقَالَت: الْحَقْ فَإِنَّهُمْ يَنْتَظِرُونَكَ، وَأَخْشَى أَنْ يَكُونَ فِي احْتِبَاسِكَ عَنْهُمْ فُرْقَةٌ. فَلَمْ تَدَعْهُ حَتَّى ذَهَبَ،", people: ['hafsa-bint-umar'] },
        { title: "«فلنحن أحق به منه ومن أبيه»", text: "فَلَمَّا تَفَرَّقَ النَّاسُ خَطَبَ مُعَاوِيَةُ، قَالَ: مَنْ كَانَ يُرِيدُ أَنْ يَتَكَلَّمَ فِي هَذَا الْأَمْرِ فَلْيُطْلِعْ لَنَا قَرْنَهُ فَلَنَحْنُ أَحَقُّ بِهِ مِنْهُ وَمِنْ أَبِيهِ،", people: ['muawiyah-ibn-abi-sufyan'] },
        { title: "«فهلا أجبته؟»", text: "قَالَ حَبِيبُ بْنُ مَسْلَمَةَ: فَهَلَّا أَجَبْتَهُ؟ قَالَ عَبْدُ اللهِ: فَحَلَلْتُ حُبْوَتِي، وَهَمَمْتُ أَنْ أَقُولَ: أَحَقُّ بِهَذَا الْأَمْرِ مِنْكَ مَنْ قَاتَلَكَ وَأَبَاكَ عَلَى الْإِسْلَامِ، فَخَشِيتُ أَنْ أَقُولَ كَلِمَةً تُفَرِّقُ بَيْنَ الْجَمْعِ، وَتَسْفِكُ الدَّمَ، وَيُحْمَلُ عَنِّي غَيْرُ ذَلِكَ، فَذَكَرْتُ مَا أَعَدَّ اللهُ فِي الْجِنَانِ». قَالَ حَبِيبٌ: حُفِظْتَ وَعُصِمْتَ قَالَ مَحْمُودٌ، عَنْ عَبْدِ الرَّزَّاقِ: وَنَوْسَاتُهَا.", people: ['habib-ibn-maslamah', 'muawiyah-ibn-abi-sufyan'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default ibnUmarHoldsHisTongue;
