import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Musaylimah came to Medina saying he would follow Muhammad if he made the matter his after him; the Prophet ﷺ came to him
 * with Thabit ibn Qays, a palm stalk in his hand, and said «لو سألتني هذه القطعة ما أعطيتكها… وهذا ثابت يجيبك عني», and
 * the dream of the two gold bracelets he blew away was read as two liars, al-Ansi and Musaylimah. Told from Sahih
 * al-Bukhari (al-Maghazi, the delegation of Banu Hanifah and the story of al-Aswad al-Ansi), each whole: Ibn Abbas's 4373
 * first, a connected chain, and its end in our copy, 4374, which has no chain of its own; then Ubayd Allah's 4378, which he
 * gives as «بلغنا» (a Tabi'i's report, kept second as 4070 is in not-yours-is-the-matter), and its end, 4379, where he asks
 * Ibn Abbas about the dream.
 * 4375 is the dream alone (a saying); 4376–4377 are Abu Raja's memories of the jahiliyyah. Musaylimah and al-Ansi have no
 * catalog subject.
 */
const musaylimahInMedina = {
  kind: 'EVENT',
  slug: 'musaylimah-in-medina',
  name: "مسيلمة الكذاب في المدينة",
  nameTransliterated: "Musaylimah the Liar in Medina",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'thabit-ibn-qais' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا أَبُو الْيَمَانِ: أَخْبَرَنَا شُعَيْبٌ، عَنْ عَبْدِ اللهِ بْنِ أَبِي حُسَيْنٍ: حَدَّثَنَا نَافِعُ بْنُ جُبَيْرٍ، عَنِ ابْنِ عَبَّاسٍ  رضي الله عنهما قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4373, url: 'https://sunnah.com/bukhari:4373' },
      moments: [
        { title: "«إن جعل لي محمد من بعده تبعته»", text: "«قَدِمَ مُسَيْلِمَةُ الْكَذَّابُ عَلَى عَهْدِ رَسُولِ اللهِ ﷺ، فَجَعَلَ يَقُولُ: إِنْ جَعَلَ لِي مُحَمَّدٌ مِنْ بَعْدِهِ تَبِعْتُهُ، وَقَدِمَهَا فِي بَشَرٍ كَثِيرٍ مِنْ قَوْمِهِ،", people: [] },
        { title: "«لو سألتني هذه القطعة ما أعطيتكها»", text: "فَأَقْبَلَ إِلَيْهِ رَسُولُ اللهِ ﷺ وَمَعَهُ ثَابِتُ بْنُ قَيْسِ بْنِ شَمَّاسٍ، وَفِي يَدِ رَسُولِ اللهِ ﷺ قِطْعَةُ جَرِيدٍ، حَتَّى وَقَفَ عَلَى مُسَيْلِمَةَ فِي أَصْحَابِهِ، فَقَالَ: لَوْ سَأَلْتَنِي هَذِهِ الْقِطْعَةَ مَا أَعْطَيْتُكَهَا، وَلَنْ تَعْدُوَ أَمْرَ اللهِ فِيكَ، وَلَئِنْ أَدْبَرْتَ لَيَعْقِرَنَّكَ اللهُ، وَإِنِّي لَأَرَاكَ الَّذِي أُرِيتُ فِيهِ مَا رَأَيْتُ، وَهَذَا ثَابِتٌ يُجِيبُكَ عَنِّي، ثُمَّ انْصَرَفَ عَنْهُ».", people: ['prophet-muhammad', 'thabit-ibn-qais'] },
      ],
    },
    {
      source: { slug: 'sahih-al-bukhari', hadith: 4374, url: 'https://sunnah.com/bukhari:4374' },
      moments: [
        { title: "«فأولتهما كذابين يخرجان بعدي»", text: "قَالَ ابْنُ عَبَّاسٍ: فَسَأَلْتُ عَنْ قَوْلِ رَسُولِ اللهِ ﷺ: إِنَّكَ أُرَى الَّذِي أُرِيتُ فِيهِ مَا رَأَيْتُ، فَأَخْبَرَنِي أَبُو هُرَيْرَةَ: أَنَّ رَسُولَ اللهِ ﷺ قَالَ: بَيْنَا أَنَا نَائِمٌ، رَأَيْتُ فِي يَدَيَّ سِوَارَيْنِ مِنْ ذَهَبٍ، فَأَهَمَّنِي شَأْنُهُمَا، فَأُوحِيَ إِلَيَّ فِي الْمَنَامِ: أَنِ انْفُخْهُمَا، فَنَفَخْتُهُمَا فَطَارَا، فَأَوَّلْتُهُمَا كَذَّابَيْنِ يَخْرُجَانِ بَعْدِي، أَحَدُهُمَا الْعَنْسِيُّ، وَالْآخَرُ مُسَيْلِمَةُ.", people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا سَعِيدُ بْنُ مُحَمَّدٍ الْجَرْمِيُّ: حَدَّثَنَا يَعْقُوبُ بْنُ إِبْرَاهِيمَ: حَدَّثَنَا أَبِي، عَنْ صَالِحٍ، عَنِ ابْنِ عُبَيْدَةَ بْنِ نَشِيطٍ، وَكَانَ فِي مَوْضِعٍ آخَرَ اسْمُهُ عَبْدُ اللهِ: أَنَّ عُبَيْدَ اللهِ بْنَ عَبْدِ اللهِ بْنِ عُتْبَةَ قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4378, url: 'https://sunnah.com/bukhari:4378' },
      moments: [
        { title: "نزل في دار بنت الحارث", text: "«بَلَغَنَا أَنَّ مُسَيْلِمَةَ الْكَذَّابَ قَدِمَ الْمَدِينَةَ، فَنَزَلَ فِي دَارِ بِنْتِ الْحَارِثِ، وَكَانَ تَحْتَهُ بِنْتُ الْحَارِثِ بْنِ كُرَيْزٍ، وَهِيَ أُمُّ عَبْدِ اللهِ بْنِ عَامِرٍ،", people: [] },
        { title: "«لو سألتني هذا القضيب ما أعطيتكه»", text: "فَأَتَاهُ رَسُولُ اللهِ ﷺ وَمَعَهُ ثَابِتُ بْنُ قَيْسِ بْنِ شَمَّاسٍ، وَهُوَ الَّذِي يُقَالُ لَهُ: خَطِيبُ رَسُولِ اللهِ ﷺ، وَفِي يَدِ رَسُولِ اللهِ ﷺ قَضِيبٌ، فَوَقَفَ عَلَيْهِ فَكَلَّمَهُ، فَقَالَ لَهُ مُسَيْلِمَةُ: إِنْ شِئْتَ خَلَّيْتَ بَيْنَنَا وَبَيْنَ الْأَمْرِ، ثُمَّ جَعَلْتَهُ لَنَا بَعْدَكَ، فَقَالَ النَّبِيُّ ﷺ: لَوْ سَأَلْتَنِي هَذَا الْقَضِيبَ مَا أَعْطَيْتُكَهُ، وَإِنِّي لَأَرَاكَ الَّذِي أُرِيتُ فِيهِ مَا أُرِيتُ، وَهَذَا ثَابِتُ بْنُ قَيْسٍ، وَسَيُجِيبُكَ عَنِّي، فَانْصَرَفَ النَّبِيُّ ﷺ»", people: ['prophet-muhammad', 'thabit-ibn-qais'] },
      ],
    },
    {
      source: { slug: 'sahih-al-bukhari', hadith: 4379, url: 'https://sunnah.com/bukhari:4379' },
      moments: [
        { title: "سواران من ذهب", text: "قَالَ عُبَيْدُ اللهِ بْنُ عَبْدِ اللهِ: سَأَلْتُ عَبْدَ اللهِ بْنَ عَبَّاسٍ، عَنْ رُؤْيَا رَسُولِ اللهِ ﷺ الَّتِي ذَكَرَ، فَقَالَ ابْنُ عَبَّاسٍ: ذُكِرَ لِي أَنَّ رَسُولَ اللهِ ﷺ قَالَ: بَيْنَا أَنَا نَائِمٌ، أُرِيتُ أَنَّهُ وُضِعَ فِي يَدَيَّ سِوَارَانِ مِنْ ذَهَبٍ، فَفُظِعْتُهُمَا وَكَرِهْتُهُمَا، فَأُذِنَ لِي فَنَفَخْتُهُمَا فَطَارَا، فَأَوَّلْتُهُمَا كَذَّابَيْنِ يَخْرُجَانِ.", people: ['prophet-muhammad'] },
        { title: "العنسي ومسيلمة", text: "فَقَالَ عُبَيْدُ اللهِ: أَحَدُهُمَا الْعَنْسِيُّ الَّذِي قَتَلَهُ فَيْرُوزُ بِالْيَمَنِ، وَالْآخَرُ مُسَيْلِمَةُ الْكَذَّابُ.", people: [] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default musaylimahInMedina;
