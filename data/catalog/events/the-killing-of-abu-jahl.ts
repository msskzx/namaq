import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Abd al-Rahman ibn Awf, in the ranks at Badr, had two young men ask him in secret to show them Abu Jahl; he pointed, and
 * they fell on him like two falcons: the two sons of Afra. Then the Prophet ﷺ asked who would see what had become of Abu
 * Jahl, and Ibn Mas'ud found him struck down and took him by the beard. Told from the two Sahihs, each hadith whole: Ibn Awf's
 * Sahih al-Bukhari 3988 first; then Anas's, al-Bukhari 4020 (the fullest of his, with Abu Mijlaz's addition), 3962 and 3963,
 * and Sahih Muslim 1800; then Ibn Mas'ud's own one line, al-Bukhari 3961. 3964 only points to the hadith of the sons of
 * Afra and is not repeated. The text names the two young men only as «ابنا عفراء», so neither is linked.
 *
 * Then Abd al-Rahman ibn Awf's hadith in Sahih Muslim 1752 (al-Jihad, the killer's right to the spoils), whole, which names
 * the two youths at its end, Mu'adh ibn Amr ibn al-Jamuh and Mu'adh ibn Afra' (mu'adh-ibn-al-harith, Afra's son), and they
 * are linked from its moments.
 */
const theKillingOfAbuJahl = {
  kind: 'EVENT',
  slug: 'the-killing-of-abu-jahl',
  name: "مقتل أبي جهل",
  nameTransliterated: "The killing of Abu Jahl",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abdur-rahman-ibn-awf' }, { person: 'abu-jahl-ibn-hisham' }, { person: 'prophet-muhammad' }, { person: 'abdullah-ibn-masud' }, { person: 'muadh-ibn-amr-ibn-al-jumuh' }, { person: 'muadh-ibn-al-harith' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنِي يَعْقُوبُ، حَدَّثَنَا إِبْرَاهِيمُ بْنُ سَعْدٍ، عَنْ أَبِيهِ، عَنْ جَدِّهِ قَالَ: قَالَ عَبْدُ الرَّحْمَنِ بْنُ عَوْفٍ:",
      source: { slug: 'sahih-al-bukhari', hadith: 3988, url: 'https://sunnah.com/bukhari:3988' },
      moments: [
        { title: "«يا عم أرني أبا جهل»", text: "«إِنِّي لَفِي الصَّفِّ يَوْمَ بَدْرٍ، إِذِ الْتَفَتُّ فَإِذَا عَنْ يَمِينِي وَعَنْ يَسَارِي فَتَيَانِ حَدِيثَا السِّنِّ، فَكَأَنِّي لَمْ آمَنْ بِمَكَانِهِمَا، إِذْ قَالَ لِي أَحَدُهُمَا سِرًّا مِنْ صَاحِبِهِ: يَا عَمِّ أَرِنِي أَبَا جَهْلٍ، فَقُلْتُ: يَا ابْنَ أَخِي، وَمَا تَصْنَعُ بِهِ؟ قَالَ: عَاهَدْتُ اللهَ إِنْ رَأَيْتُهُ أَنْ أَقْتُلَهُ أَوْ أَمُوتَ دُونَهُ، فَقَالَ لِي الْآخَرُ سِرًّا مِنْ صَاحِبِهِ مِثْلَهُ، قَالَ: فَمَا سَرَّنِي أَنِّي بَيْنَ رَجُلَيْنِ مَكَانَهُمَا،", people: ['abdur-rahman-ibn-awf', 'abu-jahl-ibn-hisham'] },
        { title: "مثل الصقرين", text: "فَأَشَرْتُ لَهُمَا إِلَيْهِ، فَشَدَّا عَلَيْهِ مِثْلَ الصَّقْرَيْنِ حَتَّى ضَرَبَاهُ، وَهُمَا ابْنَا عَفْرَاءَ».", people: ['abdur-rahman-ibn-awf', 'abu-jahl-ibn-hisham'] },
      ],
    },
    {
      isnad: "حَدَّثَنِي يَعْقُوبُ بْنُ إِبْرَاهِيمَ: حَدَّثَنَا ابْنُ عُلَيَّةَ: حَدَّثَنَا سُلَيْمَانُ التَّيْمِيُّ: حَدَّثَنَا أَنَسٌ  رضي الله عنه قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4020, url: 'https://sunnah.com/bukhari:4020' },
      moments: [
        { title: "«من ينظر ما صنع أبو جهل»", text: "«قَالَ رَسُولُ اللهِ ﷺ يَوْمَ بَدْرٍ: مَنْ يَنْظُرُ مَا صَنَعَ أَبُو جَهْلٍ فَانْطَلَقَ ابْنُ مَسْعُودٍ، فَوَجَدَهُ قَدْ ضَرَبَهُ ابْنَا عَفْرَاءَ حَتَّى بَرَدَ،", people: ['prophet-muhammad', 'abdullah-ibn-masud', 'abu-jahl-ibn-hisham'] },
        { title: "«وهل فوق رجل قتلتموه»", text: "فَقَالَ: آنْتَ أَبَا جَهْلٍ؟ قَالَ ابْنُ عُلَيَّةَ: قَالَ: سُلَيْمَانُ: هَكَذَا قَالَهَا أَنَسٌ، قَالَ: أَنْتَ أَبَا جَهْلٍ؟ قَالَ: وَهَلْ فَوْقَ رَجُلٍ قَتَلْتُمُوهُ. قَالَ سُلَيْمَانُ: أَوْ قَالَ: قَتَلَهُ قَوْمُهُ».", people: ['abdullah-ibn-masud', 'abu-jahl-ibn-hisham'] },
        { title: "«فلو غير أكار قتلني»", text: "قَالَ: وَقَالَ أَبُو مِجْلَزٍ: قَالَ: أَبُو جَهْلٍ: فَلَوْ غَيْرُ أَكَّارٍ قَتَلَنِي.", people: ['abu-jahl-ibn-hisham'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا أَحْمَدُ بْنُ يُونُسَ: حَدَّثَنَا زُهَيْرٌ: حَدَّثَنَا سُلَيْمَانُ التَّيْمِيُّ: أَنَّ أَنَسًا حَدَّثَهُمْ قَالَ: قَالَ النَّبِيُّ ﷺ. حَدَّثَنِي عَمْرُو بْنُ خَالِدٍ: حَدَّثَنَا زُهَيْرٌ، عَنْ سُلَيْمَانَ التَّيْمِيِّ، عَنْ أَنَسٍ  رضي الله عنه قَالَ: قَالَ النَّبِيُّ ﷺ:",
      source: { slug: 'sahih-al-bukhari', hadith: 3962, url: 'https://sunnah.com/bukhari:3962' },
      moments: [
        { title: "«من ينظر ما صنع أبو جهل»", text: "«مَنْ يَنْظُرُ مَا صَنَعَ أَبُو جَهْلٍ فَانْطَلَقَ ابْنُ مَسْعُودٍ فَوَجَدَهُ قَدْ ضَرَبَهُ ابْنَا عَفْرَاءَ حَتَّى بَرَدَ.", people: ['prophet-muhammad', 'abdullah-ibn-masud', 'abu-jahl-ibn-hisham'] },
        { title: "«وهل فوق رجل قتلتموه»", text: "قَالَ: أَأَنْتَ أَبُو جَهْلٍ؟ قَالَ: فَأَخَذَ بِلِحْيَتِهِ، قَالَ: وَهَلْ فَوْقَ رَجُلٍ قَتَلْتُمُوهُ، أَوْ رَجُلٍ قَتَلَهُ قَوْمُهُ». قَالَ أَحْمَدُ بْنُ يُونُسَ: أَنْتَ أَبُو جَهْلٍ.", people: ['abdullah-ibn-masud', 'abu-jahl-ibn-hisham'] },
      ],
    },
    {
      isnad: "حَدَّثَنِي مُحَمَّدُ بْنُ الْمُثَنَّى: حَدَّثَنَا ابْنُ أَبِي عَدِيٍّ، عَنْ سُلَيْمَانَ التَّيْمِيِّ، عَنْ أَنَسٍ  رضي الله عنه قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 3963, url: 'https://sunnah.com/bukhari:3963' },
      moments: [
        { title: "«من ينظر ما فعل أبو جهل؟»", text: "«قَالَ النَّبِيُّ ﷺ يَوْمَ بَدْرٍ: مَنْ يَنْظُرُ مَا فَعَلَ أَبُو جَهْلٍ؟ فَانْطَلَقَ ابْنُ مَسْعُودٍ فَوَجَدَهُ قَدْ ضَرَبَهُ ابْنَا عَفْرَاءَ حَتَّى بَرَدَ،", people: ['prophet-muhammad', 'abdullah-ibn-masud', 'abu-jahl-ibn-hisham'] },
        { title: "«وهل فوق رجل قتله قومه؟»", text: "فَأَخَذَ بِلِحْيَتِهِ فَقَالَ: أَنْتَ، أَبَا جَهْلٍ؟ قَالَ: وَهَلْ فَوْقَ رَجُلٍ قَتَلَهُ قَوْمُهُ؟ أَوْ قَالَ: قَتَلْتُمُوهُ.» حَدَّثَنِي ابْنُ الْمُثَنَّى: أَخْبَرَنَا مُعَاذُ بْنُ مُعَاذٍ: حَدَّثَنَا سُلَيْمَانُ: أَخْبَرَنَا أَنَسُ بْنُ مَالِكٍ: نَحْوَهُ.", people: ['abdullah-ibn-masud', 'abu-jahl-ibn-hisham'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا عَلِيُّ بْنُ حُجْرٍ السَّعْدِيُّ. أَخْبَرَنَا إِسْمَاعِيلُ (يَعْنِي ابْنَ عُلَيَّةَ). حَدَّثَنَا سُلَيْمَانُ التَّيْمِيُّ. حَدَّثَنَا أَنَسِ بْنِ مَالِكٍ قَالَ:",
      source: { slug: 'sahih-muslim', hadith: 1800, url: 'https://sunnah.com/muslim:1800' },
      moments: [
        { title: "«من ينظر لنا ما صنع أبو جهل؟»", text: "قَالَ رَسُولُ اللَّهِ ﷺ (مَنْ يَنْظُرُ لَنَا مَا صَنَعَ أَبُو جَهْلٍ؟) فَانْطَلَقَ ابْنُ مَسْعُودٍ. فَوَجَدَهُ قَدْ ضَرَبَهُ ابْنَا عَفْرَاءَ حَتَّى بَرَكَ.", people: ['prophet-muhammad', 'abdullah-ibn-masud', 'abu-jahl-ibn-hisham'] },
        { title: "«وهل فوق رجل قتلتموه»", text: "قَالَ: فَأَخَذَ بِلِحْيَتِهِ. فَقَالَ: آنْتَ أَبُو جَهْلٍ؟ فَقَالَ: وَهَلْ فَوْقَ رَجُلٍ قَتَلْتُمُوهُ (أَوَ قَالَ) قَتَلَهُ قَوْمُهُ؟", people: ['abdullah-ibn-masud', 'abu-jahl-ibn-hisham'] },
        { title: "«فلو غير أكار قتلني»", text: "قَالَ: وَقَالَ أَبُو مِجْلَزٍ: قَالَ أَبُو جَهْلٍ: فَلَوْ غير أكار قتلني!", people: ['abu-jahl-ibn-hisham'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا ابْنُ نُمَيْرٍ: حَدَّثَنَا أَبُو أُسَامَةَ: حَدَّثَنَا إِسْمَاعِيلُ: أَخْبَرَنَا قَيْسٌ، عَنْ عَبْدِ اللهِ  رضي الله عنه:",
      source: { slug: 'sahih-al-bukhari', hadith: 3961, url: 'https://sunnah.com/bukhari:3961' },
      moments: [
        { title: "«هل أعمد من رجل قتلتموه»", text: "«أَنَّهُ أَتَى أَبَا جَهْلٍ وَبِهِ رَمَقٌ يَوْمَ بَدْرٍ، فَقَالَ أَبُو جَهْلٍ: هَلْ أَعْمَدُ مِنْ رَجُلٍ قَتَلْتُمُوهُ».", people: ['abdullah-ibn-masud', 'abu-jahl-ibn-hisham'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا يَحْيَي بْنُ يَحْيَي التَّمِيمِيُّ. أَخْبَرَنَا يُوسُفُ بْنُ الْمَاجِشُونِ عَنْ صَالِحِ بْنِ إِبْرَاهِيمَ بْنِ عَبْدِ الرَّحْمَنِ بْنِ عَوْفٍ، عَنْ أَبِيهِ، عَنْ عَبْدِ الرَّحْمَنِ بْنِ عَوْفٍ؛ أَنَّهُ قَالَ:",
      source: { slug: 'sahih-muslim', hadith: 1752, url: 'https://sunnah.com/muslim:1752' },
      moments: [
        { title: "«يا عم! هل تعرف أبا جهل؟»", text: "بَيْنَا أَنَا وَاقِفٌ فِي الصَّفِّ يَوْمَ بَدْرٍ. نَظَرْتُ عَنْ يَمِينِي وَشِمَالِي. فَإِذَا أَنَا بَيْنَ غُلَامَيْنِ مِنْ الْأَنْصَارِ. حَدِيثَةٍ أَسْنَانُهُمَا. تَمَنَّيْتُ لَوْ كُنْتُ بَيْنَ أَضْلَعَ مِنْهُمَا. فَغَمَزَنِي أَحَدُهُمَا. فَقَالَ: يَا عَمِّ! هَلْ تَعْرِفُ أَبَا جَهْلٍ؟ قَالَ: قُلْتُ: نَعَمْ. وَمَا حَاجَتُكَ إِلَيْهِ؟ يَا ابْنَ أَخِي! أُخْبِرْتُ أَنَّهُ يَسُبُّ رَسُولُ اللَّهِ ﷺ. وَالَّذِي نَفْسِي بِيَدِهِ! لَئِنْ رَأَيْتُهُ لَا يُفَارِقُ سَوَادِي سَوَادَهُ حَتَّى يَمُوتَ الْأَعْجَلُ مِنَّا. قَالَ: فَتَعَجَّبْتُ لِذَلِكَ. فَغَمَزَنِي الْآخَرُ فَقَالَ مِثْلَهَا.", people: ['abdur-rahman-ibn-awf', 'abu-jahl-ibn-hisham'] },
        { title: "فابتدراه فضرباه", text: "قَالَ: فَلَمْ أَنْشَبْ أَنْ نَظَرْتُ إِلَى أَبِي جَهْلٍ يَزُولُ فِي النَّاسِ. فَقُلْتُ: أَلَا تَرَيَانِ؟ هَذَا صَاحِبُكُمَا الَّذِي تَسْأَلَانِ عَنْهُ. قَالَ: فابتدراه، فضرباه بسيفهما، حَتَّى قَتَلَاهُ.", people: ['abdur-rahman-ibn-awf', 'abu-jahl-ibn-hisham', 'muadh-ibn-amr-ibn-al-jumuh', 'muadh-ibn-al-harith'] },
        { title: "«كلاكما قتله»", text: "ثُمَّ انْصَرَفَا إِلَى رَسُولِ اللَّهِ ﷺ. فَأَخْبَرَاهُ. فَقَالَ (أَيُّكُمَا قَتَلَهُ؟) فَقَالَ كُلُّ وَاحِدٍ مِنْهُمَا: أَنَا قَتَلْتُ. فَقَالَ (هَلْ مَسَحْتُمَا سَيْفَيْكُمَا؟) قَالَا: لَا. فَنَظَرَ فِي السَّيْفَيْنِ فَقَالَ (كِلَاكُمَا قَتَلَهُ) وَقَضَى بِسَلَبِهِ لِمُعَاذِ بْنِ عَمْرِو بْنِ الْجَمُوحِ. (وَالرَّجُلَانِ: مُعَاذُ بن عمر بن الجموح ومعاذ بن عفراء).", people: ['prophet-muhammad', 'muadh-ibn-amr-ibn-al-jumuh', 'muadh-ibn-al-harith'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theKillingOfAbuJahl;
