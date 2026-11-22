import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ put Zayd ibn Harithah over the army of Mu'tah, then Ja'far if Zayd fell, then Abd Allah ibn Rawahah; all
 * three fell, Ja'far with more than ninety wounds, none in his back, and the Prophet ﷺ gave the news in Medina before it
 * came, his eyes streaming, «حتى أخذ الراية سيف من سيوف الله». Told from Sahih al-Bukhari (al-Maghazi, the chapter on
 * Mu'tah), each hadith whole: Ibn Umar's 4261 first; then Anas's 4262, Ibn Umar's 4260 and Khalid's own 4265 and 4266
 * (nine swords broke in his hand). The «سيف من سيوف الله» is not named in 4262 and is not linked from it.
 * 4263 (the women of Ja'far) and 4267–4268 (Ibn Rawahah's fainting) are their own events; 4264 is a one-line greeting.
 */
const theDayOfMutah = {
  kind: 'EVENT',
  slug: 'the-day-of-mutah',
  name: "يوم مؤتة",
  nameTransliterated: "The day of Mu'tah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'zaid-ibn-harithah' }, { person: 'jaafar-ibn-abi-talib' }, { person: 'abdullah-ibn-rawahah' }, { person: 'khalid-ibn-al-walid' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "أَخْبَرَنَا أَحْمَدُ بْنُ أَبِي بَكْرٍ: حَدَّثَنَا مُغِيرَةُ بْنُ عَبْدِ الرَّحْمَنِ، عَنْ عَبْدِ اللهِ بْنِ سَعْدٍ، عَنْ نَافِعٍ، عَنْ عَبْدِ اللهِ بْنِ عُمَرَ  رضي الله عنهما قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4261, url: 'https://sunnah.com/bukhari:4261' },
      moments: [
        {
          title: "«إن قتل زيد فجعفر»",
          text: "«أَمَّرَ رَسُولُ اللهِ ﷺ فِي غَزْوَةِ مُؤْتَةَ زَيْدَ بْنَ حَارِثَةَ، فَقَالَ رَسُولُ اللهِ ﷺ: إِنْ قُتِلَ زَيْدٌ فَجَعْفَرٌ، وَإِنْ قُتِلَ جَعْفَرٌ، فَعَبْدُ اللهِ بْنُ رَوَاحَةَ",
          people: ['prophet-muhammad', 'zaid-ibn-harithah', 'jaafar-ibn-abi-talib', 'abdullah-ibn-rawahah'],
          turns: [
            { text: "«أَمَّرَ رَسُولُ اللهِ ﷺ فِي غَزْوَةِ مُؤْتَةَ زَيْدَ بْنَ حَارِثَةَ،" },
            { text: "فَقَالَ رَسُولُ اللهِ ﷺ: إِنْ قُتِلَ زَيْدٌ فَجَعْفَرٌ، وَإِنْ قُتِلَ جَعْفَرٌ، فَعَبْدُ اللهِ بْنُ رَوَاحَةَ", speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: "فَقَالَ رَسُولُ اللهِ ﷺ:" },
          ],
        },
        {
          title: "وجدناه في القتلى",
          text: "قَالَ: عَبْدُ اللهِ كُنْتُ فِيهِمْ فِي تِلْكَ الْغَزْوَةِ، فَالْتَمَسْنَا جَعْفَرَ بْنَ أَبِي طَالِبٍ، فَوَجَدْنَاهُ فِي الْقَتْلَى، وَوَجَدْنَا مَا فِي جَسَدِهِ بِضْعًا وَتِسْعِينَ، مِنْ طَعْنَةٍ وَرَمْيَةٍ.»",
          people: ['jaafar-ibn-abi-talib'],
          turns: [
            { text: "قَالَ: عَبْدُ اللهِ كُنْتُ فِيهِمْ فِي تِلْكَ الْغَزْوَةِ، فَالْتَمَسْنَا جَعْفَرَ بْنَ أَبِي طَالِبٍ، فَوَجَدْنَاهُ فِي الْقَتْلَى، وَوَجَدْنَا مَا فِي جَسَدِهِ بِضْعًا وَتِسْعِينَ، مِنْ طَعْنَةٍ وَرَمْيَةٍ.»" },
          ],
        },
      ],
    },
    {
      isnad: "حَدَّثَنَا أَحْمَدُ بْنُ وَاقِدٍ: حَدَّثَنَا حَمَّادُ بْنُ زَيْدٍ، عَنْ أَيُّوبَ، عَنْ حُمَيْدِ بْنِ هِلَالٍ، عَنْ أَنَسٍ  رضي الله عنه:",
      source: { slug: 'sahih-al-bukhari', hadith: 4262, url: 'https://sunnah.com/bukhari:4262' },
      moments: [
        { title: "نعاهم قبل أن يأتي خبرهم", text: "«أَنَّ النَّبِيَّ ﷺ نَعَى زَيْدًا وَجَعْفَرًا وَابْنَ رَوَاحَةَ لِلنَّاسِ قَبْلَ أَنْ يَأْتِيَهُمْ خَبَرُهُمْ، فَقَالَ: أَخَذَ الرَّايَةَ زَيْدٌ فَأُصِيبَ، ثُمَّ أَخَذَ جَعْفَرٌ فَأُصِيبَ، ثُمَّ أَخَذَ ابْنُ رَوَاحَةَ فَأُصِيبَ.", people: ['prophet-muhammad', 'zaid-ibn-harithah', 'jaafar-ibn-abi-talib', 'abdullah-ibn-rawahah'] },
        { title: "«حتى أخذ الراية سيف من سيوف الله»", text: "وَعَيْنَاهُ تَذْرِفَانِ: حَتَّى أَخَذَ الرَّايَةَ سَيْفٌ مِنْ سُيُوفِ اللهِ، حَتَّى فَتَحَ اللهُ عَلَيْهِمْ».", people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا أَحْمَدُ: حَدَّثَنَا ابْنُ وَهْبٍ، عَنْ عَمْرٍو، عَنِ ابْنِ أَبِي هِلَالٍ قَالَ: وَأَخْبَرَنِي نَافِعٌ: أَنَّ ابْنَ عُمَرَ أَخْبَرَهُ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4260, url: 'https://sunnah.com/bukhari:4260' },
      moments: [
        { title: "خمسون بين طعنة وضربة", text: "«أَنَّهُ وَقَفَ عَلَى جَعْفَرٍ يَوْمَئِذٍ، وَهُوَ قَتِيلٌ، فَعَدَدْتُ بِهِ خَمْسِينَ، بَيْنَ طَعْنَةٍ وَضَرْبَةٍ، لَيْسَ مِنْهَا شَيْءٌ فِي دُبُرِهِ». يَعْنِي فِي ظَهْرِهِ.", people: ['jaafar-ibn-abi-talib'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا أَبُو نُعَيْمٍ: حَدَّثَنَا سُفْيَانُ، عَنْ إِسْمَاعِيلَ، عَنْ قَيْسِ بْنِ أَبِي حَازِمٍ قَالَ: سَمِعْتُ خَالِدَ بْنَ الْوَلِيدِ يَقُولُ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4265, url: 'https://sunnah.com/bukhari:4265' },
      moments: [
        { title: "تسعة أسياف", text: "«لَقَدِ انْقَطَعَتْ فِي يَدِي يَوْمَ مُؤْتَةَ تِسْعَةُ أَسْيَافٍ، فَمَا بَقِيَ فِي يَدِي إِلَّا صَفِيحَةٌ يَمَانِيَةٌ.»", people: ['khalid-ibn-al-walid'] },
      ],
    },
    {
      isnad: "حَدَّثَنِي مُحَمَّدُ بْنُ الْمُثَنَّى: حَدَّثَنَا يَحْيَى، عَنْ إِسْمَاعِيلَ قَالَ: حَدَّثَنِي قَيْسٌ قَالَ: سَمِعْتُ خَالِدَ بْنَ الْوَلِيدِ يَقُولُ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4266, url: 'https://sunnah.com/bukhari:4266' },
      moments: [
        { title: "تسعة أسياف", text: "«لَقَدْ دُقَّ فِي يَدِي يَوْمَ مُؤْتَةَ تِسْعَةُ أَسْيَافٍ، وَصَبَرَتْ فِي يَدِي صَفِيحَةٌ لِي يَمَانِيَةٌ».", people: ['khalid-ibn-al-walid'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theDayOfMutah;
