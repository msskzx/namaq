import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * On the third day after Badr the Prophet ﷺ stood at the well where the chiefs of Quraysh had been thrown and called them
 * by name, «فهل وجدتم ما وعد ربكم حقا»; Umar asked how he spoke to bodies without souls, and he said «ما أنتم بأسمع لما أقول
 * منهم». Told from Sahih al-Bukhari, each hadith whole: Abu Talhah's 3976 first, the fullest; then Ibn Umar's 3980 with
 * Aisha's answer; then Musa ibn Uqbah's from Ibn Shihab, 4026, with al-Bukhari's count of the Qurashi men of Badr after it.
 * 3978–3979, Aisha's answer alone, cut in two in our copy, are not repeated. Aisha recites «إنك لا تسمع الموتى», words that
 * stand in both al-Naml 80 and al-Rum 52; the text does not say which, so no ayah range is given.
 */
const theWellOfBadr = {
  kind: 'EVENT',
  slug: 'the-well-of-badr',
  name: "قليب بدر",
  nameTransliterated: "The well of Badr",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'umar-ibn-al-khattab' }, { person: 'aisha-bint-abi-bakr' }, { person: 'az-zubayr-ibn-al-awwam' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنِي عَبْدُ اللهِ بْنُ مُحَمَّدٍ: سَمِعَ رَوْحَ بْنَ عُبَادَةَ: حَدَّثَنَا سَعِيدُ بْنُ أَبِي عَرُوبَةَ، عَنْ قَتَادَةَ قَالَ: ذَكَرَ لَنَا أَنَسُ بْنُ مَالِكٍ، عَنْ أَبِي طَلْحَةَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 3976, url: 'https://sunnah.com/bukhari:3976' },
      moments: [
        { title: "طوي من أطواء بدر", text: "«أَنَّ نَبِيَّ اللهِ ﷺ أَمَرَ يَوْمَ بَدْرٍ بِأَرْبَعَةٍ وَعِشْرِينَ رَجُلًا مِنْ صَنَادِيدِ قُرَيْشٍ، فَقُذِفُوا فِي طَوِيٍّ مِنْ أَطْوَاءِ بَدْرٍ خَبِيثٍ مُخْبِثٍ،", people: ['prophet-muhammad'] },
        { title: "على شفة الركي", text: "وَكَانَ إِذَا ظَهَرَ عَلَى قَوْمٍ أَقَامَ بِالْعَرْصَةِ ثَلَاثَ لَيَالٍ، فَلَمَّا كَانَ بِبَدْرٍ الْيَوْمَ الثَّالِثَ أَمَرَ بِرَاحِلَتِهِ فَشُدَّ عَلَيْهَا رَحْلُهَا، ثُمَّ مَشَى وَاتَّبَعَهُ أَصْحَابُهُ وَقَالُوا: مَا نُرَى يَنْطَلِقُ إِلَّا لِبَعْضِ حَاجَتِهِ، حَتَّى قَامَ عَلَى شَفَةِ الرَّكِيِّ،", people: ['prophet-muhammad'] },
        { title: "«فهل وجدتم ما وعد ربكم حقا»", text: "فَجَعَلَ يُنَادِيهِمْ بِأَسْمَائِهِمْ وَأَسْمَاءِ آبَائِهِمْ: يَا فُلَانُ بْنَ فُلَانٍ، وَيَا فُلَانُ بْنَ فُلَانٍ، أَيَسُرُّكُمْ أَنَّكُمْ أَطَعْتُمُ اللهَ وَرَسُولَهُ، فَإِنَّا قَدْ وَجَدْنَا مَا وَعَدَنَا رَبُّنَا حَقًّا، فَهَلْ وَجَدْتُمْ مَا وَعَدَ رَبُّكُمْ حَقًّا.", people: ['prophet-muhammad'] },
        { title: "«ما أنتم بأسمع لما أقول منهم»", text: "قَالَ: فَقَالَ عُمَرُ: يَا رَسُولَ اللهِ، مَا تُكَلِّمُ مِنْ أَجْسَادٍ لَا أَرْوَاحَ لَهَا؟ فَقَالَ رَسُولُ اللهِ ﷺ: وَالَّذِي نَفْسُ مُحَمَّدٍ بِيَدِهِ، مَا أَنْتُمْ بِأَسْمَعَ لِمَا أَقُولُ مِنْهُمْ.", people: ['umar-ibn-al-khattab', 'prophet-muhammad'] },
        { title: "«أحياهم الله حتى أسمعهم قوله»", text: "قَالَ قَتَادَةُ: أَحْيَاهُمُ اللهُ حَتَّى أَسْمَعَهُمْ قَوْلَهُ، تَوْبِيخًا وَتَصْغِيرًا وَنَقِيمَةً وَحَسْرَةً وَنَدَمًا».", people: [] },
      ],
    },
    {
      isnad: "حَدَّثَنِي عُثْمَانُ: حَدَّثَنَا عَبْدَةُ، عَنْ هِشَامٍ، عَنْ أَبِيهِ، عَنِ ابْنِ عُمَرَ  رضي الله عنهما قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 3980, url: 'https://sunnah.com/bukhari:3980' },
      moments: [
        { title: "«إنهم الآن يسمعون ما أقول»", text: "«وَقَفَ النَّبِيُّ ﷺ عَلَى قَلِيبِ بَدْرٍ، فَقَالَ: هَلْ وَجَدْتُمْ مَا وَعَدَ رَبُّكُمْ حَقًّا. ثُمَّ قَالَ: إِنَّهُمُ الْآنَ يَسْمَعُونَ مَا أَقُولُ.", people: ['prophet-muhammad'] },
        { title: "«إنهم الآن ليعلمون»", text: "فَذُكِرَ لِعَائِشَةَ، فَقَالَتْ: إِنَّمَا قَالَ النَّبِيُّ ﷺ: إِنَّهُمُ الْآنَ لَيَعْلَمُونَ أَنَّ الَّذِي كُنْتُ أَقُولُ لَهُمْ هُوَ الْحَقُّ. ثُمَّ قَرَأَتْ: ﴿إِنَّكَ لا تُسْمِعُ الْمَوْتَى﴾ حَتَّى قَرَأَتِ الْآيَةَ.»", people: ['aisha-bint-abi-bakr', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا إِبْرَاهِيمُ بْنُ الْمُنْذِرِ: حَدَّثَنَا مُحَمَّدُ بْنُ فُلَيْحِ بْنِ سُلَيْمَانَ، عَنْ مُوسَى بْنِ عُقْبَةَ، عَنِ ابْنِ شِهَابٍ قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4026, url: 'https://sunnah.com/bukhari:4026' },
      moments: [
        { title: "«تنادي ناسا أمواتا؟»", text: "«هَذِهِ مَغَازِي رَسُولِ اللهِ ﷺ، فَذَكَرَ الْحَدِيثَ، فَقَالَ رَسُولُ اللهِ ﷺ وَهُوَ يُلْقِيهِمْ: هَلْ وَجَدْتُمْ مَا وَعَدَكُمْ رَبُّكُمْ حَقًّا قَالَ مُوسَى: قَالَ: نَافِعٌ: قَالَ: عَبْدُ اللهِ: قَالَ: نَاسٌ مِنْ أَصْحَابِهِ: يَا رَسُولَ اللهِ، تُنَادِي نَاسًا أَمْوَاتًا؟ قَالَ رَسُولُ اللهِ ﷺ: مَا أَنْتُمْ بِأَسْمَعَ لِمَا قُلْتُ مِنْهُمْ».", people: ['prophet-muhammad'] },
        { title: "أحد وثمانون رجلا", text: "قَالَ أَبُو عَبْدِ اللهِ: فَجَمِيعُ مَنْ شَهِدَ بَدْرًا مِنْ قُرَيْشٍ، مِمَّنْ ضُرِبَ لَهُ بِسَهْمِهِ، أَحَدٌ وَثَمَانُونَ رَجُلًا، وَكَانَ عُرْوَةُ بْنُ الزُّبَيْرِ يَقُولُ: قَالَ الزُّبَيْرُ: قُسِمَتْ سُهْمَانُهُمْ، فَكَانُوا مِائَةً، وَاللهُ أَعْلَمُ..", people: ['az-zubayr-ibn-al-awwam'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theWellOfBadr;
