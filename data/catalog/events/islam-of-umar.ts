import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The section is three du'as and Ibn Mas'ud's line about what followed (the cited description). Told as a story from the
 * two reports al-Dhahabi places in al-Bukhari (al-Sira 1 pp138, 140): when Umar's islam became known, Ibn Umar saw the
 * people gather on him crying «صبأ عمر» until al-As ibn Wa'il took him under his protection, and Ibn Mas'ud said
 * «ما زلنا أعزة منذ أسلم عمر». The longer accounts on pp138-142 (al-Haqqah in the mosque, his sister and Ta-Ha, the house
 * at al-Safa, the du'as) come with chains al-Dhahabi does not place in either Sahih, so they wait (owner: sahih first).
 *
 * al-Bukhari's own texts follow, each whole: 3864 (al-As ibn Wa'il comes to Umar in his house), 3865 and 3863
 * (the hadith al-Dhahabi's two reports point to). Sa'id ibn Zayd's «موثقي عمر» is islam-of-saeed-ibn-zaid.ts, and the
 * soothsayer Umar questioned is umar-and-the-kahin.ts.
 */
const islamOfUmar = {
  kind: 'EVENT',
  slug: 'islam-of-umar',
  name: 'إسلام عمر بن الخطاب',
  nameTransliterated: 'The Islam of Umar ibn al-Khattab',
  type: 'OTHER',
  fields: {
    description: {
      value:
        'قال النبي صلى الله عليه وسلم: (اللهم أعز الإسلام بأحب هذين الرجلين إليك: بعمر بن الخطاب أو بأبي جهل بن هشام) ، وقال: (اللهم أعز الإسلام بعمر بن الخطاب خاصة) . قال ابن مسعود: ما زلنا أعزة منذ أسلم عمر.',
      claims: ['umar/islam'],
    },
  },
  people: [
    { person: 'umar-ibn-al-khattab', claims: ['umar/islam'] },
    { person: 'prophet-muhammad', claims: ['umar/islam'] },
    // On it for what came before it: Umar had him and his own sister bound
    // over Islam, which al-Bukhari gives in Sa'id's own words.
    { person: 'saeed-ibn-zaid', claims: ['saeed-ibn-zaid/before-umar'] },
    { person: 'al-as-ibn-wail-al-sahmi' },
    { person: 'abdullah-ibn-masud' },
  ],
  tags: ['ISLAM'],
  reports: [
    {
      isnad: 'وقال ابن عيينة، عن عمرو، عن ابن عمر،',
      source: { slug: 'siyar-alam-al-nubala-risalah', volume: 1, volumeLabel: 'السيرة 1', page: 140, url: 'https://shamela.ws/book/10906/278' },
      grading: 'أخرجه البخاري عن ابن المديني، عنه.',
      moments: [
        { title: '«صبأ عمر، صبأ عمر»', text: 'قال: إني لعلى سطح، فرأيت الناس مجتمعين على رجل وهم يقولون: صبأ عمر، صبأ عمر.', people: ['umar-ibn-al-khattab'] },
        { title: 'العاص بن وائل يجيره', text: 'فجاء العاص بن وائل عليه قباء ديباج، فقال: إن كان عمر قد صبأ فمه أنا له جار.', people: ['al-as-ibn-wail-al-sahmi', 'umar-ibn-al-khattab'] },
        { title: 'تفرّق الناس عنه', text: 'قال فتفرق الناس عنه.', people: ['umar-ibn-al-khattab'] },
        { title: '«فعجبت من عزه»', text: 'قال: فعجبت من عزه.', people: ['al-as-ibn-wail-al-sahmi'] },
      ],
    },
    {
      isnad: 'قال إسماعيل بن أبي خالد: حدثنا قيس،',
      source: { slug: 'siyar-alam-al-nubala-risalah', volume: 1, volumeLabel: 'السيرة 1', page: 138, url: 'https://shamela.ws/book/10906/276' },
      grading: 'أخرجه البخاري.',
      moments: [
        { title: '«ما زلنا أعزة»', text: 'قال ابن مسعود: ما زلنا أعزة منذ أسلم عمر.', people: ['abdullah-ibn-masud', 'umar-ibn-al-khattab'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا يَحْيَى بْنُ سُلَيْمَانَ قَالَ: حَدَّثَنِي ابْنُ وَهْبٍ قَالَ: حَدَّثَنِي عُمَرُ بْنُ مُحَمَّدٍ قَالَ: فَأَخْبَرَنِي جَدِّي زَيْدُ بْنُ عَبْدِ اللهِ بْنِ عُمَرَ، عَنْ أَبِيهِ",
      source: { slug: 'sahih-al-bukhari', hadith: 3864, url: 'https://sunnah.com/bukhari:3864' },
      moments: [
        { title: "في الدار خائفا", text: "قَالَ: «بَيْنَمَا هُوَ فِي الدَّارِ خَائِفًا، إِذْ جَاءَهُ الْعَاصِ بْنُ وَائِلٍ السَّهْمِيُّ أَبُو عَمْرٍو، عَلَيْهِ حُلَّةُ حِبَرَةٍ وَقَمِيصٌ مَكْفُوفٌ بِحَرِيرٍ، وَهُوَ مِنْ بَنِي سَهْمٍ، وَهُمْ حُلَفَاؤُنَا فِي الْجَاهِلِيَّةِ،", people: ['umar-ibn-al-khattab', 'al-as-ibn-wail-al-sahmi'] },
        { title: "«لا سبيل إليك»", text: "فَقَالَ لَهُ: مَا بَالُكَ؟ قَالَ: زَعَمَ قَوْمُكَ أَنَّهُمْ سَيَقْتُلُونِي إِنْ أَسْلَمْتُ، قَالَ: لَا سَبِيلَ إِلَيْكَ، بَعْدَ أَنْ قَالَهَا أَمِنْتُ،", people: ['al-as-ibn-wail-al-sahmi', 'umar-ibn-al-khattab'] },
        { title: "«فكرّ الناس»", text: "فَخَرَجَ العَاصِ فَلَقِيَ النَّاسَ قَدْ سَالَ بِهِمُ الْوَادِي، فَقَالَ: أَيْنَ تُرِيدُونَ؟ فَقَالُوا: نُرِيدُ هَذَا ابْنَ الْخَطَّابِ الَّذِي صَبَا، قَالَ: لَا سَبِيلَ إِلَيْهِ، فَكَرَّ النَّاسُ.»", people: ['al-as-ibn-wail-al-sahmi', 'umar-ibn-al-khattab'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا عَلِيُّ بْنُ عَبْدِ اللهِ: حَدَّثَنَا سُفْيَانُ قَالَ عَمْرُو بْنُ دِينَارٍ سَمِعْتُهُ قَالَ: قَالَ عَبْدُ اللهِ بْنُ عُمَرَ  رضي الله عنهما:",
      source: { slug: 'sahih-al-bukhari', hadith: 3865, url: 'https://sunnah.com/bukhari:3865' },
      moments: [
        { title: "«صبأ عمر»", text: "«لَمَّا أَسْلَمَ عُمَرُ، اجْتَمَعَ النَّاسُ عِنْدَ دَارِهِ، وَقَالُوا: صَبَا عُمَرُ، وَأَنَا غُلَامٌ فَوْقَ ظَهْرِ بَيْتِي،", people: ['umar-ibn-al-khattab'] },
        { title: "«فأنا له جار»", text: "فَجَاءَ رَجُلٌ عَلَيْهِ قَبَاءٌ مِنْ دِيبَاجٍ، فَقَالَ: قَدْ صَبَا عُمَرُ، فَمَا ذَاكَ؟ فَأَنَا لَهُ جَارٌ،", people: ['al-as-ibn-wail-al-sahmi', 'umar-ibn-al-khattab'] },
        { title: "تصدّع الناس عنه", text: "قَالَ: فَرَأَيْتُ النَّاسَ تَصَدَّعُوا عَنْهُ، فَقُلْتُ: مَنْ هَذَا؟ قَالُوا: العَاصِ بْنُ وَائِلٍ.»", people: ['al-as-ibn-wail-al-sahmi', 'umar-ibn-al-khattab'] },
      ],
    },
    {
      isnad: "حَدَّثَنِي مُحَمَّدُ بْنُ كَثِيرٍ: أَخْبَرَنَا سُفْيَانُ، عَنْ إِسْمَاعِيلَ بْنِ أَبِي خَالِدٍ، عَنْ قَيْسِ بْنِ أَبِي حَازِمٍ، عَنْ عَبْدِ اللهِ بْنِ مَسْعُودٍ  رضي الله عنه",
      source: { slug: 'sahih-al-bukhari', hadith: 3863, url: 'https://sunnah.com/bukhari:3863' },
      moments: [
        { title: "«ما زلنا أعزة»", text: "قَالَ: «مَا زِلْنَا أَعِزَّةً مُنْذُ أَسْلَمَ عُمَرُ.»", people: ['abdullah-ibn-masud', 'umar-ibn-al-khattab'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default islamOfUmar;
