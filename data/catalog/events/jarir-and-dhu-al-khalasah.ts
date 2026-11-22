import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ said to Jarir «ألا تريحني من ذي الخلصة», the house of Khath'am called the Yemeni Ka'bah; Jarir, who could
 * not sit firm on a horse, was struck on the chest and prayed for, «اللهم ثبته، واجعله هاديا مهديا», rode out with a hundred
 * and fifty horsemen of Ahmas, burned and broke it, made a man casting arrows break them and bear witness, and sent word
 * «كأنها جمل أجرب»; the Prophet ﷺ blessed the horses and men of Ahmas five times. Told from Sahih al-Bukhari (al-Maghazi,
 * the raid of Dhu al-Khalasah), each hadith whole: 4357 first, the fullest; then 4356 and 4355. Abu Artah and the man with
 * the arrows have no catalog subject.
 */
const jarirAndDhuAlKhalasah = {
  kind: 'EVENT',
  slug: 'jarir-and-dhu-al-khalasah',
  name: "جرير وذو الخلصة",
  nameTransliterated: "Jarir and Dhu al-Khalasah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'jarir-ibn-abdullah' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا يُوسُفُ بْنُ مُوسَى: أَخْبَرَنَا أَبُو أُسَامَةَ، عَنْ إِسْمَاعِيلَ بْنِ أَبِي خَالِدٍ، عَنْ قَيْسٍ، عَنْ جَرِيرٍ قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4357, url: 'https://sunnah.com/bukhari:4357' },
      moments: [
        { title: "«ألا تريحني من ذي الخلصة»", text: "«قَالَ لِي رَسُولُ اللهِ ﷺ: أَلَا تُرِيحُنِي مِنْ ذِي الْخَلَصَةِ، فَقُلْتُ: بَلَى،", people: ['prophet-muhammad', 'jarir-ibn-abdullah'] },
        { title: "«اللهم ثبته»", text: "فَانْطَلَقْتُ فِي خَمْسِينَ وَمِائَةِ فَارِسٍ مِنْ أَحْمَسَ، وَكَانُوا أَصْحَابَ خَيْلٍ، وَكُنْتُ لَا أَثْبُتُ عَلَى الْخَيْلِ، فَذَكَرْتُ ذَلِكَ لِلنَّبِيِّ ﷺ، فَضَرَبَ يَدَهُ عَلَى صَدْرِي حَتَّى رَأَيْتُ أَثَرَ يَدِهِ فِي صَدْرِي، وَقَالَ: اللَّهُمَّ ثَبِّتْهُ، وَاجْعَلْهُ هَادِيًا مَهْدِيًّا، قَالَ: فَمَا وَقَعْتُ عَنْ فَرَسٍ بَعْدُ.", people: ['jarir-ibn-abdullah', 'prophet-muhammad'] },
        { title: "حرقها بالنار وكسرها", text: "قَالَ: وَكَانَ ذُو الْخَلَصَةِ بَيْتًا بِالْيَمَنِ لِخَثْعَمَ وَبَجِيلَةَ، فِيهِ نُصُبٌ تُعْبَدُ، يُقَالُ لَهُ الْكَعْبَةُ، قَالَ: فَأَتَاهَا فَحَرَّقَهَا بِالنَّارِ وَكَسَرَهَا.", people: ['jarir-ibn-abdullah'] },
        { title: "«لتكسرنها ولتشهدا»", text: "قَالَ: وَلَمَّا قَدِمَ جَرِيرٌ الْيَمَنَ، كَانَ بِهَا رَجُلٌ يَسْتَقْسِمُ بِالْأَزْلَامِ، فَقِيلَ لَهُ: إِنَّ رَسُولَ رَسُولِ اللهِ ﷺ هَا هُنَا، فَإِنْ قَدَرَ عَلَيْكَ ضَرَبَ عُنُقَكَ، قَالَ: فَبَيْنَمَا هُوَ يَضْرِبُ بِهَا إِذْ وَقَفَ عَلَيْهِ جَرِيرٌ، فَقَالَ: لَتَكْسِرَنَّهَا وَلْتَشْهَدَا: أَنْ لَا إِلَهَ إِلَّا اللهُ، أَوْ لَأَضْرِبَنَّ عُنُقَكَ؟ قَالَ: فَكَسَرَهَا وَشَهِدَ،", people: ['jarir-ibn-abdullah'] },
        { title: "«كأنها جمل أجرب»", text: "ثُمَّ بَعَثَ جَرِيرٌ رَجُلًا مِنْ أَحْمَسَ يُكْنَى أَبَا أَرْطَاةَ إِلَى النَّبِيِّ ﷺ يُبَشِّرُهُ، بِذَلِكَ فَلَمَّا أَتَى النَّبِيَّ ﷺ قَالَ: يَا رَسُولَ اللهِ، وَالَّذِي بَعَثَكَ بِالْحَقِّ، مَا جِئْتُ حَتَّى تَرَكْتُهَا كَأَنَّهَا جَمَلٌ أَجْرَبُ، قَالَ: فَبَرَّكَ النَّبِيُّ ﷺ عَلَى خَيْلِ أَحْمَسَ وَرِجَالِهَا خَمْسَ مَرَّاتٍ».", people: ['jarir-ibn-abdullah', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا مُحَمَّدُ بْنُ الْمُثَنَّى: حَدَّثَنَا يَحْيَى: حَدَّثَنَا إِسْمَاعِيلُ: حَدَّثَنَا قَيْسٌ قَالَ: قَالَ لِي جَرِيرٌ  رضي الله عنه:",
      source: { slug: 'sahih-al-bukhari', hadith: 4356, url: 'https://sunnah.com/bukhari:4356' },
      moments: [
        { title: "«ألا تريحني من ذي الخلصة»", text: "«قَالَ لِي النَّبِيُّ ﷺ: أَلَا تُرِيحُنِي مِنْ ذِي الْخَلَصَةِ، وَكَانَ بَيْتًا فِي خَثْعَمَ، يُسَمَّى الْكَعْبَةَ الْيَمَانِيَةَ، فَانْطَلَقْتُ فِي خَمْسِينَ وَمِائَةِ فَارِسٍ مِنْ أَحْمَسَ، وَكَانُوا أَصْحَابَ خَيْلٍ، وَكُنْتُ لَا أَثْبُتُ عَلَى الْخَيْلِ،", people: ['prophet-muhammad', 'jarir-ibn-abdullah'] },
        { title: "«اللهم ثبته»", text: "فَضَرَبَ فِي صَدْرِي حَتَّى رَأَيْتُ أَثَرَ أَصَابِعِهِ فِي صَدْرِي وَقَالَ: اللَّهُمَّ ثَبِّتْهُ، وَاجْعَلْهُ هَادِيًا مَهْدِيًّا، فَانْطَلَقَ إِلَيْهَا فَكَسَرَهَا وَحَرَّقَهَا،", people: ['prophet-muhammad', 'jarir-ibn-abdullah'] },
        { title: "«كأنها جمل أجرب»", text: "ثُمَّ بَعَثَ إِلَى رَسُولِ اللهِ ﷺ، فَقَالَ رَسُولُ جَرِيرٍ: وَالَّذِي بَعَثَكَ بِالْحَقِّ، مَا جِئْتُكَ حَتَّى تَرَكْتُهَا كَأَنَّهَا جَمَلٌ أَجْرَبُ، قَالَ: فَبَارَكَ فِي خَيْلِ أَحْمَسَ وَرِجَالِهَا، خَمْسَ مَرَّاتٍ».", people: ['jarir-ibn-abdullah', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا مُسَدَّدٌ: حَدَّثَنَا خَالِدٌ: حَدَّثَنَا بَيَانٌ، عَنْ قَيْسٍ، عَنْ جَرِيرٍ قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4355, url: 'https://sunnah.com/bukhari:4355' },
      moments: [
        { title: "«ألا تريحني من ذي الخلصة»", text: "«كَانَ بَيْتٌ فِي الْجَاهِلِيَّةِ يُقَالُ لَهُ ذُو الْخَلَصَةِ، وَالْكَعْبَةُ الْيَمَانِيَةُ، وَالْكَعْبَةُ الشَّأْمِيَّةُ، فَقَالَ لِي النَّبِيُّ ﷺ: أَلَا تُرِيحُنِي مِنْ ذِي الْخَلَصَةِ، فَنَفَرْتُ فِي مِائَةٍ وَخَمْسِينَ رَاكِبًا فَكَسَرْنَاهُ، وَقَتَلْنَا مَنْ وَجَدْنَا عِنْدَهُ،", people: ['prophet-muhammad', 'jarir-ibn-abdullah'] },
        { title: "فدعا لنا ولأحمس", text: "فَأَتَيْتُ النَّبِيَّ ﷺ فَأَخْبَرْتُهُ، فَدَعَا لَنَا وَلِأَحْمَسَ».", people: ['jarir-ibn-abdullah', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default jarirAndDhuAlKhalasah;
