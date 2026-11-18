import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * An ifrit of the jinn sprang at the Prophet ﷺ in the night to cut off his prayer; Allah gave him power over it, and he
 * meant to tie it to a pillar of the mosque, then remembered the prayer of his brother Sulayman and let it go (Sahih
 * al-Bukhari 3423, in the Prophets, and 461, in the Prayer; al-Dhahabi: «متفق عليه», al-Sira 1 p162). Each whole; 3423
 * ends with al-Bukhari's own note on the word ifrit. The words of Sulayman («رب هب لي ملكا لا ينبغي لأحد من بعدي», Sad 35)
 * are quoted by the Prophet ﷺ, not recited, so the story carries no ayat range.
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
        { title: 'قول البخاري في العفريت', text: 'عِفْرِيتٌ مُتَمَرِّدٌ مِنْ إِنْسٍ أَوْ جَانٍّ، مِثْلُ زِبْنِيَةٍ جَمَاعَتُهَا الزَّبَانِيَةُ.', people: [] },
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
  ],
} satisfies CatalogEvent;

export default theIfritInThePrayer;
