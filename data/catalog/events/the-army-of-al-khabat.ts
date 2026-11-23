import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ sent three hundred riders under Abu Ubaydah to watch for a caravan of Quraysh; their food ran out to a date
 * a day and they ate leaves, until the sea threw up a great fish, al-Anbar, which fed them for half a month; Abu Ubaydah set
 * up one of its ribs and a rider passed under it, and back in Medina the Prophet ﷺ said «كلوا، رزقا أخرجه الله» and ate of
 * it. Told from Jabir's hadith in Sahih al-Bukhari (al-Maghazi, the raid of Sif al-Bahr), each whole: 4361 first, then
 * 4360 and 4362. In 4361 Amr adds that Qays ibn Sa'd slaughtered for the army and told his father; Qays is Qays ibn Sa'd
 * ibn Ubadah (his father in the catalog), who is linked.
 */
const theArmyOfAlKhabat = {
  kind: 'EVENT',
  slug: 'the-army-of-al-khabat',
  name: "جيش الخبط",
  nameTransliterated: "The army of al-Khabat",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abu-ubaydah-ibn-al-jarrah' }, { person: 'jabir-ibn-abdullah' }, { person: 'qais-ibn-saad' }, { person: 'saad-ibn-ubadah' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا عَلِيُّ بْنُ عَبْدِ اللهِ: حَدَّثَنَا سُفْيَانُ قَالَ: الَّذِي حَفِظْنَاهُ مِنْ عَمْرِو بْنِ دِينَارٍ قَالَ: سَمِعْتُ جَابِرَ بْنَ عَبْدِ اللهِ يَقُولُ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4361, url: 'https://sunnah.com/bukhari:4361' },
      moments: [
        { title: "جيش الخبط", text: "«بَعَثَنَا رَسُولُ اللهِ ﷺ ثَلَاثَمِائَةِ رَاكِبٍ، أَمِيرُنَا أَبُو عُبَيْدَةَ بْنُ الْجَرَّاحِ، نَرْصُدُ عِيرَ قُرَيْشٍ، فَأَقَمْنَا بِالسَّاحِلِ نِصْفَ شَهْرٍ، فَأَصَابَنَا جُوعٌ شَدِيدٌ حَتَّى أَكَلْنَا الْخَبَطَ، فَسُمِّيَ ذَلِكَ الْجَيْشُ جَيْشَ الْخَبَطِ،", people: ['prophet-muhammad', 'abu-ubaydah-ibn-al-jarrah', 'jabir-ibn-abdullah'] },
        { title: "دابة يقال لها العنبر", text: "فَأَلْقَى لَنَا الْبَحْرُ دَابَّةً يُقَالُ لَهَا الْعَنْبَرُ، فَأَكَلْنَا مِنْهُ نِصْفَ شَهْرٍ، وَادَّهَنَّا مِنْ وَدَكِهِ، حَتَّى ثَابَتْ إِلَيْنَا أَجْسَامُنَا، فَأَخَذَ أَبُو عُبَيْدَةَ ضِلَعًا مِنْ أَضْلَاعِهِ فَنَصَبَهُ، فَعَمَدَ إِلَى أَطْوَلِ رَجُلٍ مَعَهُ، قَالَ سُفْيَانُ مَرَّةً: ضِلَعًا مِنْ أَضْلَاعِهِ فَنَصَبَهُ، وَأَخَذَ رَجُلًا وَبَعِيرًا فَمَرَّ تَحْتَهُ.", people: ['abu-ubaydah-ibn-al-jarrah', 'jabir-ibn-abdullah'] },
        { title: "نحر ثلاث جزائر", text: "قَالَ جَابِرٌ: وَكَانَ رَجُلٌ مِنَ الْقَوْمِ نَحَرَ ثَلَاثَ جَزَائِرَ، ثُمَّ نَحَرَ ثَلَاثَ جَزَائِرَ، ثُمَّ نَحَرَ ثَلَاثَ جَزَائِرَ، ثُمَّ إِنَّ أَبَا عُبَيْدَةَ نَهَاهُ».", people: ['abu-ubaydah-ibn-al-jarrah'] },
        { title: "قيس بن سعد وأبوه", text: "وَكَانَ عَمْرٌو يَقُولُ: أَخْبَرَنَا أَبُو صَالِحٍ: أَنَّ قَيْسَ بْنَ سَعْدٍ قَالَ لِأَبِيهِ: كُنْتُ فِي الْجَيْشِ فَجَاعُوا، قَالَ: انْحَرْ، قَالَ: نَحَرْتُ، قَالَ: ثُمَّ جَاعُوا، قَالَ: انْحَرْ، قَالَ: نَحَرْتُ، قَالَ: ثُمَّ جَاعُوا، قَالَ: انْحَرْ، قَالَ: نَحَرْتُ، ثُمَّ جَاعُوا، قَالَ: انْحَرْ، قَالَ: نُهِيتُ.", people: ['qais-ibn-saad', 'saad-ibn-ubadah'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا إِسْمَاعِيلُ قَالَ: حَدَّثَنِي مَالِكٌ، عَنْ وَهْبِ بْنِ كَيْسَانَ، عَنْ جَابِرِ بْنِ عَبْدِ اللهِ  رضي الله عنهما أَنَّهُ قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4360, url: 'https://sunnah.com/bukhari:4360' },
      moments: [
        { title: "فني الزاد", text: "«بَعَثَ رَسُولُ اللهِ ﷺ بَعْثًا قِبَلَ السَّاحِلِ، وَأَمَّرَ عَلَيْهِمْ أَبَا عُبَيْدَةَ بْنَ الْجَرَّاحِ، وَهُمْ ثَلَاثُمِائَةٍ، فَخَرَجْنَا وَكُنَّا بِبَعْضِ الطَّرِيقِ فَنِيَ الزَّادُ، فَأَمَرَ أَبُو عُبَيْدَةَ بِأَزْوَادِ الْجَيْشِ فَجُمِعَ، فَكَانَ مِزْوَدَيْ تَمْرٍ، فَكَانَ يَقُوتُنَا كُلَّ يَوْمٍ قَلِيلٌ قَلِيلٌ حَتَّى فَنِيَ، فَلَمْ يَكُنْ يُصِيبُنَا إِلَّا تَمْرَةٌ تَمْرَةٌ، فَقُلْتُ: مَا تُغْنِي عَنْكُمْ تَمْرَةٌ؟ فَقَالَ: لَقَدْ وَجَدْنَا فَقْدَهَا حِينَ فَنِيَتْ،", people: ['prophet-muhammad', 'abu-ubaydah-ibn-al-jarrah', 'jabir-ibn-abdullah'] },
        { title: "حوت مثل الظرب", text: "ثُمَّ انْتَهَيْنَا إِلَى الْبَحْرِ، فَإِذَا حُوتٌ مِثْلُ الظَّرِبِ، فَأَكَلَ مِنْهَا الْقَوْمُ ثَمَانَ عَشْرَةَ لَيْلَةً، ثُمَّ أَمَرَ أَبُو عُبَيْدَةَ بِضِلَعَيْنِ مِنْ أَضْلَاعِهِ فَنُصِبَا، ثُمَّ أَمَرَ بِرَاحِلَةٍ فَرُحِلَتْ ثُمَّ مَرَّتْ تَحْتَهُمَا فَلَمْ تُصِبْهُمَا.»", people: ['abu-ubaydah-ibn-al-jarrah'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا مُسَدَّدٌ: حَدَّثَنَا يَحْيَى، عَنِ ابْنِ جُرَيْجٍ قَالَ: أَخْبَرَنِي عَمْرٌو: أَنَّهُ سَمِعَ جَابِرًا رضي الله عنه يَقُولُ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4362, url: 'https://sunnah.com/bukhari:4362' },
      moments: [
        { title: "حوت لم نر مثله", text: "«غَزَوْنَا جَيْشَ الْخَبَطِ، وَأُمِّرَ أَبُو عُبَيْدَةَ، فَجُعْنَا جُوعًا شَدِيدًا، فَأَلْقَى الْبَحْرُ حُوتًا مَيِّتًا لَمْ نَرَ مِثْلَهُ، يُقَالُ لَهُ الْعَنْبَرُ، فَأَكَلْنَا مِنْهُ نِصْفَ شَهْرٍ، فَأَخَذَ أَبُو عُبَيْدَةَ عَظْمًا مِنْ عِظَامِهِ فَمَرَّ الرَّاكِبُ تَحْتَهُ.", people: ['abu-ubaydah-ibn-al-jarrah', 'jabir-ibn-abdullah'] },
        { title: "«رزقا أخرجه الله»", text: "فَأَخْبَرَنِي أَبُو الزُّبَيْرِ: أَنَّهُ سَمِعَ جَابِرًا يَقُولُ: قَالَ أَبُو عُبَيْدَةَ: كُلُوا، فَلَمَّا قَدِمْنَا الْمَدِينَةَ ذَكَرْنَا ذَلِكَ لِلنَّبِيِّ ﷺ فَقَالَ: كُلُوا، رِزْقًا أَخْرَجَهُ اللهُ، أَطْعِمُونَا إِنْ كَانَ مَعَكُمْ، فَأَتَاهُ بَعْضُهُمْ فَأَكَلَهُ».", people: ['abu-ubaydah-ibn-al-jarrah', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theArmyOfAlKhabat;
