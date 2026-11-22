import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Aisha: he married her at six; at Madinah, after a fever, her mother Umm Ruman took her from the swing to the Ansar women
 * of the house, who made her ready, and he came to her in the forenoon, when she was nine. Told from Sahih al-Bukhari,
 * each hadith whole, from its chapter on his marrying her (Manaqib al-Ansar): 3894, then 3895, his dream of her before
 * it. 3896 (Urwah's dates for Khadijah's death and the marriage) tells no story and is left out. Umm Ruman has no catalog
 * subject and is not linked.
 */
const marriageOfAisha = {
  kind: 'EVENT',
  slug: 'marriage-of-aisha',
  name: "زواج النبي ﷺ بعائشة",
  nameTransliterated: "The marriage of the Prophet to Aisha",
  type: 'MARRIAGE',
  fields: {},
  people: [{ person: 'aisha-bint-abi-bakr' }, { person: 'prophet-muhammad' }],
  reports: [
    {
      isnad: "حَدَّثَنِي فَرْوَةُ بْنُ أَبِي الْمَغْرَاءِ: حَدَّثَنَا عَلِيُّ بْنُ مُسْهِرٍ، عَنْ هِشَامٍ، عَنْ أَبِيهِ، عَنْ عَائِشَةَ  رضي الله عنها",
      source: { slug: 'sahih-al-bukhari', hadith: 3894, url: 'https://sunnah.com/bukhari:3894' },
      moments: [
        { title: "«تزوجني النبي ﷺ وأنا بنت ست سنين»", text: "قَالَتْ: «تَزَوَّجَنِي النَّبِيُّ ﷺ وَأَنَا بِنْتُ سِتِّ سِنِينَ، فَقَدِمْنَا الْمَدِينَةَ، فَنَزَلْنَا فِي بَنِي الْحَارِثِ بْنِ خَزْرَجٍ، فَوُعِكْتُ فَتَمَرَّقَ شَعَرِي فَوَفَى جُمَيْمَةً،", people: ['aisha-bint-abi-bakr', 'prophet-muhammad'] },
        { title: "أم رومان تأخذها من الأرجوحة", text: "فَأَتَتْنِي أُمِّي أُمُّ رُومَانَ، وَإِنِّي لَفِي أُرْجُوحَةٍ، وَمَعِي صَوَاحِبُ لِي، فَصَرَخَتْ بِي فَأَتَيْتُهَا، لَا أَدْرِي مَا تُرِيدُ بِي فَأَخَذَتْ بِيَدِي حَتَّى أَوْقَفَتْنِي عَلَى بَابِ الدَّارِ، وَإِنِّي لَأَُنْهَجُ حَتَّى سَكَنَ بَعْضُ نَفَسِي، ثُمَّ أَخَذَتْ شَيْئًا مِنْ مَاءٍ فَمَسَحَتْ بِهِ وَجْهِي وَرَأْسِي،", people: ['aisha-bint-abi-bakr'] },
        { title: "«على الخير والبركة»", text: "ثُمَّ أَدْخَلَتْنِي الدَّارَ، فَإِذَا نِسْوَةٌ مِنَ الْأَنْصَارِ فِي الْبَيْتِ، فَقُلْنَ: عَلَى الْخَيْرِ وَالْبَرَكَةِ، وَعَلَى خَيْرِ طَائِرٍ، فَأَسْلَمَتْنِي إِلَيْهِنَّ، فَأَصْلَحْنَ مِنْ شَأْنِي،", people: ['aisha-bint-abi-bakr'] },
        { title: "«فلم يرعني إلا رسول الله ﷺ ضحى»", text: "فَلَمْ يَرُعْنِي إِلَّا رَسُولُ اللهِ ﷺ ضُحًى، فَأَسْلَمْنَنِي إِلَيْهِ، وَأَنَا يَوْمَئِذٍ بِنْتُ تِسْعِ سِنِينَ».", people: ['aisha-bint-abi-bakr', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا مُعَلًّى: حَدَّثَنَا وُهَيْبٌ، عَنْ هِشَامِ بْنِ عُرْوَةَ، عَنْ أَبِيهِ، عَنْ عَائِشَةَ  رضي الله عنها،",
      source: { slug: 'sahih-al-bukhari', hadith: 3895, url: 'https://sunnah.com/bukhari:3895' },
      moments: [
        { title: "«أريتك في المنام مرتين»", text: "«أَنَّ النَّبِيَّ ﷺ قَالَ لَهَا: أُرِيتُكِ فِي الْمَنَامِ مَرَّتَيْنِ، أَرَى أَنَّكِ فِي سَرَقَةٍ مِنْ حَرِيرٍ، وَيَقُولُ: هَذِهِ امْرَأَتُكَ، فَاكْشِفْ عَنْهَا، فَإِذَا هِيَ أَنْتِ،", people: ['prophet-muhammad', 'aisha-bint-abi-bakr'] },
        { title: "«إن يك هذا من عند الله يمضه»", text: "فَأَقُولُ: إِنْ يَكُ هَذَا مِنْ عِنْدِ اللهِ يُمْضِهِ».", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default marriageOfAisha;
