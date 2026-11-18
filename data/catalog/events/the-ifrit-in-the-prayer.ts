import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * An ifrit of the jinn sprang at the Prophet ﷺ in the night to cut off his prayer; Allah gave him power over it, and he
 * meant to tie it to a pillar of the mosque, then remembered the du'a of his brother Sulayman (Sad 35, which he gives in
 * part, in his own telling) and it was driven back (al-Dhahabi: «متفق عليه», al-Sira 1 p162). Told from Sahih al-Bukhari,
 * each hadith whole: 3423 (the Prophets), 461 (the Prayer) and 1210 (action in the prayer), which has al-Dhahabi's other
 * wording «فذعته» and calls it الشيطان. 3423 ends with a gloss on the word عفريت that follows the hadith in al-Bukhari's
 * text, and 1210 with al-Nadr ibn Shumayl's note on «فذعته». 4808 (Tafsir, Sad) is word for word 461, and 3284 is the
 * same chain cut short, so neither is repeated. The du'a is quoted, not recited, so the story carries no ayat range.
 */
const theIfritInThePrayer = {
  kind: 'EVENT',
  slug: 'the-ifrit-in-the-prayer',
  name: 'عفريت يتفلّت عليه في صلاته',
  nameTransliterated: 'The ifrit in the prayer',
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: 'حَدَّثَنِي مُحَمَّدُ بْنُ بَشَّارٍ، حَدَّثَنَا مُحَمَّدُ بْنُ جَعْفَرٍ، حَدَّثَنَا شُعْبَةُ، عَنْ مُحَمَّدِ بْنِ زِيَادٍ، عَنْ أَبِي هُرَيْرَةَ، عَنِ النَّبِيِّ صلى الله عليه وسلم',
      source: { slug: 'sahih-al-bukhari', hadith: 3423, url: 'https://sunnah.com/bukhari:3423' },
      moments: [
        { title: '«تفلّت البارحة ليقطع علي صلاتي»', text: '" إِنَّ عِفْرِيتًا مِنَ الْجِنِّ تَفَلَّتَ الْبَارِحَةَ لِيَقْطَعَ عَلَىَّ صَلاَتِي،', people: ['prophet-muhammad'] },
        { title: '«فأمكنني الله منه»', text: 'فَأَمْكَنَنِي اللَّهُ مِنْهُ، فَأَخَذْتُهُ، فَأَرَدْتُ أَنْ أَرْبُطَهُ عَلَى سَارِيَةٍ مِنْ سَوَارِي الْمَسْجِدِ حَتَّى تَنْظُرُوا إِلَيْهِ كُلُّكُمْ', people: ['prophet-muhammad'] },
        { title: '«فذكرت دعوة أخي سليمان»', text: 'فَذَكَرْتُ دَعْوَةَ أَخِي سُلَيْمَانَ رَبِّ هَبْ لِي مُلْكًا لاَ يَنْبَغِي لأَحَدٍ مِنْ بَعْدِي. فَرَدَدْتُهُ خَاسِئًا ".', people: ['prophet-muhammad'] },
        { title: 'في معنى العفريت', text: 'عِفْرِيتٌ مُتَمَرِّدٌ مِنْ إِنْسٍ أَوْ جَانٍّ، مِثْلُ زِبْنِيَةٍ جَمَاعَتُهَا الزَّبَانِيَةُ.', people: [] },
      ],
    },
    {
      isnad: 'حَدَّثَنَا إِسْحَاقُ بْنُ إِبْرَاهِيمَ، قَالَ أَخْبَرَنَا رَوْحٌ، وَمُحَمَّدُ بْنُ جَعْفَرٍ، عَنْ شُعْبَةَ، عَنْ مُحَمَّدِ بْنِ زِيَادٍ، عَنْ أَبِي هُرَيْرَةَ، عَنِ النَّبِيِّ صلى الله عليه وسلم',
      source: { slug: 'sahih-al-bukhari', hadith: 461, url: 'https://sunnah.com/bukhari:461' },
      moments: [
        { title: '«تفلّت علي البارحة»', text: 'قَالَ " إِنَّ عِفْرِيتًا مِنَ الْجِنِّ تَفَلَّتَ عَلَىَّ الْبَارِحَةَ ـ أَوْ كَلِمَةً نَحْوَهَا ـ لِيَقْطَعَ عَلَىَّ الصَّلاَةَ،', people: ['prophet-muhammad'] },
        { title: '«فأمكنني الله منه»', text: 'فَأَمْكَنَنِي اللَّهُ مِنْهُ، فَأَرَدْتُ أَنْ أَرْبِطَهُ إِلَى سَارِيَةٍ مِنْ سَوَارِي الْمَسْجِدِ، حَتَّى تُصْبِحُوا وَتَنْظُرُوا إِلَيْهِ كُلُّكُمْ،', people: ['prophet-muhammad'] },
        { title: '«فذكرت قول أخي سليمان»', text: 'فَذَكَرْتُ قَوْلَ أَخِي سُلَيْمَانَ رَبِّ هَبْ لِي مُلْكًا لاَ يَنْبَغِي لأَحَدٍ مِنْ بَعْدِي ".', people: ['prophet-muhammad'] },
        { title: 'قول روح: فرده خاسئا', text: 'قَالَ رَوْحٌ فَرَدَّهُ خَاسِئًا.', people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: 'حَدَّثَنَا مَحْمُودٌ، حَدَّثَنَا شَبَابَةُ، حَدَّثَنَا شُعْبَةُ، عَنْ مُحَمَّدِ بْنِ زِيَادٍ، عَنْ أَبِي هُرَيْرَةَ ـ رضى الله عنه ـ عَنِ النَّبِيِّ صلى الله عليه وسلم',
      source: { slug: 'sahih-al-bukhari', hadith: 1210, url: 'https://sunnah.com/bukhari:1210' },
      moments: [
        { title: '«إن الشيطان عرض لي»', text: 'أَنَّهُ صَلَّى صَلاَةً قَالَ " إِنَّ الشَّيْطَانَ عَرَضَ لِي، فَشَدَّ عَلَىَّ لِيَقْطَعَ الصَّلاَةَ عَلَىَّ،', people: ['prophet-muhammad'] },
        { title: '«فأمكنني الله منه فذعته»', text: 'فَأَمْكَنَنِي اللَّهُ مِنْهُ، فَذَعَتُّهُ، وَلَقَدْ هَمَمْتُ أَنْ أُوثِقَهُ إِلَى سَارِيَةٍ حَتَّى تُصْبِحُوا فَتَنْظُرُوا إِلَيْهِ', people: ['prophet-muhammad'] },
        { title: '«فذكرت قول سليمان»', text: 'فَذَكَرْتُ قَوْلَ سُلَيْمَانَ ـ عَلَيْهِ السَّلاَمُ ـ رَبِّ هَبْ لِي مُلْكًا لاَ يَنْبَغِي لأَحَدٍ مِنْ بَعْدِي. فَرَدَّهُ اللَّهُ خَاسِيًا ".', people: ['prophet-muhammad'] },
        { title: 'قول النضر بن شميل في «فذعته»', text: 'ثُمَّ قَالَ النَّضْرُ بْنُ شُمَيْلٍ فَذَعَتُّهُ بِالذَّالِ أَىْ خَنَقْتُهُ وَفَدَعَّتُّهُ مِنْ قَوْلِ اللَّهِ {يَوْمَ يُدَعُّونَ} أَىْ يُدْفَعُونَ وَالصَّوَابُ، فَدَعَتُّهُ إِلاَّ أَنَّهُ كَذَا قَالَ بِتَشْدِيدِ الْعَيْنِ وَالتَّاءِ.', people: [] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theIfritInThePrayer;
