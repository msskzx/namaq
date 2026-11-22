import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * People said Ibn Umar became Muslim before Umar: Nafi' says that at al-Hudaybiyah Umar sent his son for a horse, he passed
 * the Prophet ﷺ taking the pledge under the tree and pledged, then told Umar, who went and pledged. Told from Sahih al-Bukhari
 * 4186 (al-Maghazi, the chapter on al-Hudaybiyah), whole; then 4187, which al-Bukhari gives without his own chain («وقال هشام
 * بن عمار»), whole, folded; then 3916 (the chapter on the hijra), Ibn Umar's own telling against those who said he emigrated
 * before his father, whole, folded: it does not name the day, but tells the same thing, his pledging first when Umar sent
 * him and Umar pledging after. Ibn Umar has no catalog subject and is not linked.
 */
const ibnUmarPledgesBeforeHisFather = {
  kind: 'EVENT',
  slug: 'ibn-umar-pledges-before-his-father',
  name: "بيعة ابن عمر قبل أبيه",
  nameTransliterated: "Ibn Umar pledges before his father",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'umar-ibn-al-khattab' }, { person: 'prophet-muhammad' }],
  reports: [
    {
      isnad: "حَدَّثَنِي شُجَاعُ بْنُ الْوَلِيدِ سَمِعَ النَّضْرَ بْنَ مُحَمَّدٍ: حَدَّثَنَا صَخْرٌ، عَنْ نَافِعٍ قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4186, url: 'https://sunnah.com/bukhari:4186' },
      moments: [
        { title: "«إن الناس يتحدثون أن ابن عمر أسلم قبل عمر»", text: "«إِنَّ النَّاسَ يَتَحَدَّثُونَ أَنَّ ابْنَ عُمَرَ أَسْلَمَ قَبْلَ عُمَرَ، وَلَيْسَ كَذَلِكَ،", people: ['umar-ibn-al-khattab'] },
        { title: "فبايعه عبد الله", text: "وَلَكِنْ عُمَرُ يَوْمَ الْحُدَيْبِيَةِ أَرْسَلَ عَبْدَ اللهِ إِلَى فَرَسٍ لَهُ عِنْدَ رَجُلٍ مِنَ الْأَنْصَارِ، يَأْتِي بِهِ لِيُقَاتِلَ عَلَيْهِ، وَرَسُولُ اللهِ ﷺ يُبَايِعُ عِنْدَ الشَّجَرَةِ، وَعُمَرُ لَا يَدْرِي بِذَلِكَ، فَبَايَعَهُ عَبْدُ اللهِ ثُمَّ ذَهَبَ إِلَى الْفَرَسِ،", people: ['umar-ibn-al-khattab', 'prophet-muhammad'] },
        { title: "فانطلق فذهب معه حتى بايع", text: "فَجَاءَ بِهِ إِلَى عُمَرَ، وَعُمَرُ يَسْتَلْئِمُ لِلْقِتَالِ، فَأَخْبَرَهُ أَنَّ رَسُولَ اللهِ ﷺ يُبَايِعُ تَحْتَ الشَّجَرَةِ، قَالَ: فَانْطَلَقَ، فَذَهَبَ مَعَهُ حَتَّى بَايَعَ رَسُولَ اللهِ ﷺ، فَهْيَ الَّتِي يَتَحَدَّثُ النَّاسُ أَنَّ ابْنَ عُمَرَ أَسْلَمَ قَبْلَ عُمَرَ»", people: ['umar-ibn-al-khattab', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: "وَقَالَ هِشَامُ بْنُ عَمَّارٍ: حَدَّثَنَا الْوَلِيدُ بْنُ مُسْلِمٍ: حَدَّثَنَا عُمَرُ بْنُ مُحَمَّدٍ الْعُمَرِيُّ: أَخْبَرَنِي نَافِعٌ، عَنِ ابْنِ عُمَرَ رضي الله عنهما:",
      source: { slug: 'sahih-al-bukhari', hadith: 4187, url: 'https://sunnah.com/bukhari:4187' },
      moments: [
        {
          title: "تفرقوا في ظلال الشجر",
          text: "أَنَّ النَّاسَ كَانُوا مَعَ النَّبِيِّ ﷺ يَوْمَ الْحُدَيْبِيَةِ، تَفَرَّقُوا فِي ظِلَالِ الشَّجَرِ، فَإِذَا النَّاسُ مُحْدِقُونَ بِالنَّبِيِّ ﷺ،",
          people: ['prophet-muhammad'],
          turns: [
            { text: "أَنَّ النَّاسَ كَانُوا مَعَ النَّبِيِّ ﷺ يَوْمَ الْحُدَيْبِيَةِ، تَفَرَّقُوا فِي ظِلَالِ الشَّجَرِ، فَإِذَا النَّاسُ مُحْدِقُونَ بِالنَّبِيِّ ﷺ،" },
          ],
        },
        {
          title: "فبايع ثم رجع إلى عمر",
          text: "فَقَالَ: يَا عَبْدَ اللهِ، انْظُرْ مَا شَأْنُ النَّاسِ قَدْ أَحْدَقُوا بِرَسُولِ اللهِ ﷺ؟ فَوَجَدَهُمْ يُبَايِعُونَ، فَبَايَعَ ثُمَّ رَجَعَ إِلَى عُمَرَ، فَخَرَجَ فَبَايَعَ.",
          people: ['umar-ibn-al-khattab', 'prophet-muhammad'],
          turns: [
            { text: "فَقَالَ: يَا عَبْدَ اللهِ، انْظُرْ مَا شَأْنُ النَّاسِ قَدْ أَحْدَقُوا بِرَسُولِ اللهِ ﷺ؟", speaker: { person: "umar-ibn-al-khattab", name: "عمر" }, lead: "فَقَالَ:", witness: { source: "fath-al-bari", volume: 7, volumeLabel: "7", page: 456, quote: "قَوْلُهُ: (فَقَالَ: يَا عَبْدَ اللَّهِ) الْقَائِلُ يَا عَبْدَ اللَّهِ هُوَ عُمَرُ.", url: "https://shamela.ws/book/1673/4284" } },
            { text: "فَوَجَدَهُمْ يُبَايِعُونَ، فَبَايَعَ ثُمَّ رَجَعَ إِلَى عُمَرَ، فَخَرَجَ فَبَايَعَ." },
          ],
        },
      ],
    },
    {
      isnad: "حَدَّثَنِي مُحَمَّدُ بْنُ صَبَّاحٍ: أَوْ بَلَغَنِي عَنْهُ: حَدَّثَنَا إِسْمَاعِيلُ، عَنْ عَاصِمٍ، عَنْ أَبِي عُثْمَانَ قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 3916, url: 'https://sunnah.com/bukhari:3916' },
      moments: [
        { title: "«هاجر قبل أبيه»", text: "«سَمِعْتُ ابْنَ عُمَرَ رضي الله عنهما: إِذَا قِيلَ لَهُ: هَاجَرَ قَبْلَ أَبِيهِ يَغْضَبُ،", people: [] },
        { title: "«اذهب فانظر هل استيقظ»", text: "قَالَ: وَقَدِمْتُ أَنَا وَعُمَرُ عَلَى رَسُولِ اللهِ ﷺ، فَوَجَدْنَاهُ قَائِلًا، فَرَجَعْنَا إِلَى الْمَنْزِلِ، فَأَرْسَلَنِي عُمَرُ وَقَالَ: اذْهَبْ فَانْظُرْ هَلِ اسْتَيْقَظَ، فَأَتَيْتُهُ فَدَخَلْتُ عَلَيْهِ فَبَايَعْتُهُ،", people: ['umar-ibn-al-khattab', 'prophet-muhammad'] },
        { title: "فبايعه ثم بايعته", text: "ثُمَّ انْطَلَقْتُ إِلَى عُمَرَ فَأَخْبَرْتُهُ أَنَّهُ قَدِ اسْتَيْقَظَ، فَانْطَلَقْنَا إِلَيْهِ نُهَرْوِلُ هَرْوَلَةً، حَتَّى دَخَلَ عَلَيْهِ فَبَايَعَهُ، ثُمَّ بَايَعْتُهُ».", people: ['umar-ibn-al-khattab', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default ibnUmarPledgesBeforeHisFather;
