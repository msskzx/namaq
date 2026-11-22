import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * A young widow stopped Umar in the market: her father Khufaf ibn Ima' had been at al-Hudaybiyah with the Prophet ﷺ; Umar
 * loaded a camel with food, money and clothes for her, and to the man who said he had given too much answered that her father
 * and brother had besieged a fort and taken it. Told from Sahih al-Bukhari 4160 (al-Maghazi, the chapter on al-Hudaybiyah),
 * whole. Khufaf has no catalog subject and is not linked.
 */
const umarAndTheDaughterOfKhufaf = {
  kind: 'EVENT',
  slug: 'umar-and-the-daughter-of-khufaf',
  name: "عمر وابنة خفاف بن إيماء",
  nameTransliterated: "Umar and the daughter of Khufaf",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'umar-ibn-al-khattab' }, { person: 'prophet-muhammad' }],
  reports: [
    {
      isnad: "حَدَّثَنَا إِسْمَاعِيلُ بْنُ عَبْدِ اللهِ قَالَ: حَدَّثَنِي مَالِكٌ، عَنْ زَيْدِ بْنِ أَسْلَمَ، عَنْ أَبِيهِ قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4160, url: 'https://sunnah.com/bukhari:4160' },
      moments: [
        { title: "«هلك زوجي وترك صبية صغارا»", text: "«خَرَجْتُ مَعَ عُمَرَ بْنِ الْخَطَّابِ رضي الله عنه إِلَى السُّوقِ، فَلَحِقَتْ عُمَرَ امْرَأَةٌ شَابَّةٌ، فَقَالَتْ: يَا أَمِيرَ الْمُؤْمِنِينَ، هَلَكَ زَوْجِي وَتَرَكَ صِبْيَةً صِغَارًا، وَاللهِ مَا يُنْضِجُونَ كُرَاعًا، وَلَا لَهُمْ زَرْعٌ وَلَا ضَرْعٌ، وَخَشِيتُ أَنْ تَأْكُلَهُمُ الضَّبُعُ، وَأَنَا بِنْتُ خُفَافِ بْنِ إِيمَاءَ الْغِفَارِيِّ، وَقَدْ شَهِدَ أَبِي الْحُدَيْبِيَةَ مَعَ النَّبِيِّ ﷺ.", people: ['umar-ibn-al-khattab', 'prophet-muhammad'] },
        { title: "«مرحبا بنسب قريب»", text: "فَوَقَفَ مَعَهَا عُمَرُ وَلَمْ يَمْضِ، ثُمَّ قَالَ: مَرْحَبًا بِنَسَبٍ قَرِيبٍ، ثُمَّ انْصَرَفَ إِلَى بَعِيرٍ ظَهِيرٍ كَانَ مَرْبُوطًا فِي الدَّارِ، فَحَمَلَ عَلَيْهِ غِرَارَتَيْنِ مَلَأَهُمَا طَعَامًا، وَحَمَلَ بَيْنَهُمَا نَفَقَةً وَثِيَابًا، ثُمَّ نَاوَلَهَا بِخِطَامِهِ، ثُمَّ قَالَ: اقْتَادِيهِ، فَلَنْ يَفْنَى حَتَّى يَأْتِيَكُمُ اللهُ بِخَيْرٍ،", people: ['umar-ibn-al-khattab'] },
        { title: "«ثكلتك أمك»", text: "فَقَالَ رَجُلٌ: يَا أَمِيرَ الْمُؤْمِنِينَ، أَكْثَرْتَ لَهَا؟ قَالَ عُمَرُ: ثَكِلَتْكَ أُمُّكَ، وَاللهِ إِنِّي لَأَرَى أَبَا هَذِهِ وَأَخَاهَا، قَدْ حَاصَرَا حِصْنًا زَمَانًا فَافْتَتَحَاهُ، ثُمَّ أَصْبَحْنَا نَسْتَفِيءُ سُهْمَانَهُمَا فِيهِ.»", people: ['umar-ibn-al-khattab'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default umarAndTheDaughterOfKhufaf;
