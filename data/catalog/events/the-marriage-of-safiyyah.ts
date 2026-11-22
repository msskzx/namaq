import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Safiyyah bint Huyayy, a bride whose husband was killed at Khaybar, was chosen by the Prophet ﷺ for himself; he married her
 * on the road back at Sadd al-Sahba', Anas called the people to a wedding feast of dates, cottage cheese and butter, and when
 * he set off he screened her behind him and knelt so she could mount from his knee. Told from Sahih al-Bukhari (al-Maghazi, the
 * chapter on Khaybar), each hadith whole: Anas's 4211 first, the fullest; then 4213, 4212 and 4201.
 */
const theMarriageOfSafiyyah = {
  kind: 'EVENT',
  slug: 'the-marriage-of-safiyyah',
  name: "زواجه ﷺ بصفية",
  nameTransliterated: "His marriage to Safiyyah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'safiyyah-bint-huyayy' }, { person: 'prophet-muhammad' }, { person: 'anas-ibn-malik' }, { person: 'bilal-ibn-rabah' }],
  reports: [
    {
      isnad: "حَدَّثَنَا عَبْدُ الْغَفَّارِ بْنُ دَاوُدَ: حَدَّثَنَا يَعْقُوبُ بْنُ عَبْدِ الرَّحْمَنِ (ح) وَحَدَّثَنِي أَحْمَدُ: حَدَّثَنَا ابْنُ وَهْبٍ قَالَ: أَخْبَرَنِي يَعْقُوبُ بْنُ عَبْدِ الرَّحْمَنِ الزُّهْرِيُّ، عَنْ عَمْرٍو مَوْلَى الْمُطَّلِبِ، عَنْ أَنَسِ بْنِ مَالِكٍ  رضي الله عنه قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4211, url: 'https://sunnah.com/bukhari:4211' },
      moments: [
        { title: "اصطفاها لنفسه", text: "«قَدِمْنَا خَيْبَرَ، فَلَمَّا فَتَحَ اللهُ عَلَيْهِ الْحِصْنَ، ذُكِرَ لَهُ جَمَالُ صَفِيَّةَ بِنْتِ حُيَيِّ بْنِ أَخْطَبَ، وَقَدْ قُتِلَ زَوْجُهَا وَكَانَتْ عَرُوسًا، فَاصْطَفَاهَا النَّبِيُّ ﷺ لِنَفْسِهِ،", people: ['safiyyah-bint-huyayy', 'prophet-muhammad'] },
        { title: "«آذن من حولك»", text: "فَخَرَجَ بِهَا حَتَّى بَلَغْنَا سَُدَّ الصَّهْبَاءِ حَلَّتْ، فَبَنَى بِهَا رَسُولُ اللهِ ﷺ، ثُمَّ صَنَعَ حَيْسًا فِي نِطَعٍ صَغِيرٍ، ثُمَّ قَالَ لِي: آذِنْ مَنْ حَوْلَكَ. فَكَانَتْ تِلْكَ وَلِيمَتَهُ عَلَى صَفِيَّةَ،", people: ['prophet-muhammad', 'safiyyah-bint-huyayy', 'anas-ibn-malik'] },
        { title: "تضع رجلها على ركبته", text: "ثُمَّ خَرَجْنَا إِلَى الْمَدِينَةِ، فَرَأَيْتُ النَّبِيَّ ﷺ يُحَوِّي لَهَا وَرَاءَهُ بِعَبَاءَةٍ، ثُمَّ يَجْلِسُ عِنْدَ بَعِيرِهِ فَيَضَعُ رُكْبَتَهُ، وَتَضَعُ صَفِيَّةُ رِجْلَهَا عَلَى رُكْبَتِهِ حَتَّى تَرْكَبَ».", people: ['prophet-muhammad', 'safiyyah-bint-huyayy'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا سَعِيدُ بْنُ أَبِي مَرْيَمَ: أَخْبَرَنَا مُحَمَّدُ بْنُ جَعْفَرِ بْنِ أَبِي كَثِيرٍ قَالَ: أَخْبَرَنِي حُمَيْدٌ أَنَّهُ سَمِعَ أَنَسًا  رضي الله عنه يَقُولُ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4213, url: 'https://sunnah.com/bukhari:4213' },
      moments: [
        { title: "التمر والأقط والسمن", text: "«أَقَامَ النَّبِيُّ ﷺ بَيْنَ خَيْبَرَ وَالْمَدِينَةِ ثَلَاثَ لَيَالٍ يُبْنَى عَلَيْهِ بِصَفِيَّةَ، فَدَعَوْتُ الْمُسْلِمِينَ إِلَى وَلِيمَتِهِ، وَمَا كَانَ فِيهَا مِنْ خُبْزٍ وَلَا لَحْمٍ، وَمَا كَانَ فِيهَا إِلَّا أَنْ أَمَرَ بِلَالًا بِالْأَنْطَاعِ فَبُسِطَتْ، فَأَلْقَى عَلَيْهَا التَّمْرَ وَالْأَقِطَ وَالسَّمْنَ،", people: ['prophet-muhammad', 'safiyyah-bint-huyayy', 'anas-ibn-malik', 'bilal-ibn-rabah'] },
        { title: "«إن حجبها فهي إحدى أمهات المؤمنين»", text: "فَقَالَ الْمُسْلِمُونَ: إِحْدَى أُمَّهَاتِ الْمُؤْمِنِينَ، أَوْ مَا مَلَكَتْ يَمِينُهُ؟ قَالُوا: إِنْ حَجَبَهَا فَهِيَ إِحْدَى أُمَّهَاتِ الْمُؤْمِنِينَ، وَإِنْ لَمْ يَحْجُبْهَا فَهِيَ مِمَّا مَلَكَتْ يَمِينُهُ.", people: [] },
        { title: "ومد الحجاب", text: "فَلَمَّا ارْتَحَلَ وَطَّأَ لَهَا خَلْفَهُ، وَمَدَّ الْحِجَابَ».", people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا إِسْمَاعِيلُ قَالَ: حَدَّثَنِي أَخِي، عَنْ سُلَيْمَانَ، عَنْ يَحْيَى، عَنْ حُمَيْدٍ الطَّوِيلِ: سَمِعَ أَنَسَ بْنَ مَالِكٍ  رضي الله عنه:",
      source: { slug: 'sahih-al-bukhari', hadith: 4212, url: 'https://sunnah.com/bukhari:4212' },
      moments: [
        { title: "أقام عليها ثلاثة أيام", text: "«أَنَّ النَّبِيَّ ﷺ أَقَامَ عَلَى صَفِيَّةَ بِنْتِ حُيَيٍّ بِطَرِيقِ خَيْبَرَ ثَلَاثَةَ أَيَّامٍ، حَتَّى أَعْرَسَ بِهَا، وَكَانَتْ فِيمَنْ ضُرِبَ عَلَيْهَا الْحِجَابُ.»", people: ['prophet-muhammad', 'safiyyah-bint-huyayy'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا آدَمُ: حَدَّثَنَا شُعْبَةُ، عَنْ عَبْدِ الْعَزِيزِ بْنِ صُهَيْبٍ قَالَ: سَمِعْتُ أَنَسَ بْنَ مَالِكٍ  رضي الله عنه يَقُولُ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4201, url: 'https://sunnah.com/bukhari:4201' },
      moments: [
        { title: "«أصدقها نفسها»", text: "«سَبَى النَّبِيُّ ﷺ صَفِيَّةَ، فَأَعْتَقَهَا وَتَزَوَّجَهَا. فَقَالَ ثَابِتٌ لِأَنَسٍ: مَا أَصْدَقَهَا؟ قَالَ: أَصْدَقَهَا نَفْسَهَا، فَأَعْتَقَهَا.»", people: ['prophet-muhammad', 'safiyyah-bint-huyayy'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theMarriageOfSafiyyah;
