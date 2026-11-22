import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Dated two ways, and the chapter says so plainly. al-Zuhri on Urwah's
 * authority puts it على رأس ستة أشهر من وقعة بدر, which the same chapter makes
 * المحرم سنة ثلاث. Musa ibn Uqbah and Ibn Ishaq put it after Uhud instead,
 * which would be year four. `sira/banu-nadir-after-uhud` is DISPUTED for that,
 * and the year here follows the reading the chapter dates outright.
 *
 * Told as a story from Sahih al-Bukhari (al-Maghazi, the chapter on Banu al-Nadir), each hadith whole: Ibn Umar's 4031,
 * the burning of their palms and the ayah sent down on it, first; then 4032, the same with Hassan's verse and Abu Sufyan
 * ibn al-Harith's answer.
 *
 * Then Ibn Umar's same hadith in Sahih Muslim 1746 (al-Jihad, cutting the trees of the disbelievers), whole, which gives
 * 59:5 to its end.
 */
const expulsionOfBanuNadir = {
  kind: 'EVENT',
  slug: 'expulsion-of-banu-nadir',
  name: 'إجلاء بني النضير',
  nameTransliterated: 'The Expulsion of Banu an-Nadir',
  type: 'OTHER',
  fields: {
    hijriYear: { value: 3, claims: ['sira/banu-nadir'] },
    description: {
      value:
        'حاصرهم رسول الله صلى الله عليه وسلم حتى نزلوا على الجلاء، ولهم ما أقلت الإبل إلا السلاح، فأجلاهم إلى الشام، وفيهم نزلت: {هُوَ الَّذِي أَخْرَجَ الَّذِينَ كَفَرُوا مِنْ أَهْلِ الْكِتَابِ مِنْ دِيَارِهِمْ لِأَوَّلِ الْحَشْرِ} . وذهب موسى بن عقبة وابن إسحاق إلى أنها كانت بعد أحد.',
      claims: ['sira/banu-nadir', 'sira/banu-nadir-after-uhud'],
    },
  },
  people: [{ person: 'prophet-muhammad', claims: ['sira/banu-nadir'] }, { person: 'hassan-ibn-thabit' }, { person: 'abu-sufyan-ibn-al-harith' }],
  tags: ['REVEALED_ABOUT'],
  ayat: [
    {
      kind: 'REVEALED_ABOUT',
      from: '59:5',
      to: '59:5',
      evidence: [
        { source: 'sahih-al-bukhari', hadith: 4031, url: 'https://sunnah.com/bukhari:4031', quote: "فَنَزَلَتْ: ﴿مَا قَطَعْتُمْ مِنْ لِينَةٍ أَوْ تَرَكْتُمُوهَا قَائِمَةً عَلَى أُصُولِهَا فَبِإِذْنِ اللهِ﴾" },
        { source: 'sahih-muslim', hadith: 1746, url: 'https://sunnah.com/muslim:1746', quote: "فَأَنْزَلَ اللَّهُ عز وجل: ﴿مَا قَطَعْتُمْ مِنْ لِينَةٍ أَوْ تَرَكْتُمُوهَا قَائِمَةً عَلَى أُصُولِهَا فَبِإِذْنِ اللَّهِ وليخزي الفاسقين﴾" },
      ],
    },
  ],
  reports: [
    {
      isnad: "حَدَّثَنَا آدَمُ: حَدَّثَنَا اللَّيْثُ، عَنْ نَافِعٍ، عَنِ ابْنِ عُمَرَ  رضي الله عنهما قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4031, url: 'https://sunnah.com/bukhari:4031' },
      moments: [
        { title: "حرق نخل بني النضير", text: "«حَرَّقَ رَسُولُ اللهِ ﷺ نَخْلَ بَنِي النَّضِيرِ وَقَطَعَ، وَهْيَ الْبُوَيْرَةُ، فَنَزَلَتْ: ﴿مَا قَطَعْتُمْ مِنْ لِينَةٍ أَوْ تَرَكْتُمُوهَا قَائِمَةً عَلَى أُصُولِهَا فَبِإِذْنِ اللهِ﴾».", people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: "حَدَّثَنِي إِسْحَاقُ: أَخْبَرَنَا حَبَّانُ: أَخْبَرَنَا جُوَيْرِيَةُ بْنُ أَسْمَاءَ، عَنْ نَافِعٍ، عَنِ ابْنِ عُمَرَ  رضي الله عنهما",
      source: { slug: 'sahih-al-bukhari', hadith: 4032, url: 'https://sunnah.com/bukhari:4032' },
      moments: [
        { title: "حرق نخل بني النضير", text: "«أَنَّ النَّبِيَّ ﷺ حَرَّقَ نَخْلَ بَنِي النَّضِيرِ،", people: ['prophet-muhammad'] },
        { title: "«حريق بالبويرة مستطير»", text: "قَالَ: وَلَهَا يَقُولُ حَسَّانُ بْنُ ثَابِتٍ: وَهَانَ عَلَى سَرَاةِ بَنِي لُؤَيٍّ … حَرِيقٌ بِالْبُوَيْرَةِ مُسْتَطِيرُ", people: ['hassan-ibn-thabit'] },
        { title: "فأجابه أبو سفيان بن الحارث", text: "قَالَ: فَأَجَابَهُ أَبُو سُفْيَانَ بْنُ الْحَارِثِ: أَدَامَ اللهُ ذَلِكَ مِنْ صَنِيعٍ … وَحَرَّقَ فِي نَوَاحِيهَا السَّعِيرُ سَتَعْلَمُ أَيُّنَا مِنْهَا بِنُزْهٍ … وَتَعْلَمُ أَيَّ أَرْضَيْنَا تَضِيرُ.»", people: ['abu-sufyan-ibn-al-harith'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا يَحْيَى بْنُ يَحْيَى وَمُحَمَّدُ بْنُ رُمْحٍ. قَالَا: أَخْبَرَنَا اللَّيْثُ. ح وحَدَّثَنَا قُتَيْبَةُ بْنُ سعيد. حَدَّثَنَا لَيْثٌ عَنْ نَافِعٍ، عَنْ عَبْدِ اللَّهِ؛",
      source: { slug: 'sahih-muslim', hadith: 1746, url: 'https://sunnah.com/muslim:1746' },
      moments: [
        { title: "حرق نخل بني النضير", text: "إن رسول الله ﷺ حَرَّقَ نَخْلَ بَنِي النَّضِيرِ وَقَطَعَ. وَهِيَ الْبُوَيْرَةُ.", people: ['prophet-muhammad'] },
        { title: "فأنزل الله", text: "زَادَ قُتَيْبَةُ وَابْنُ رُمْحٍ فِي حَدِيثِهِمَا: فَأَنْزَلَ اللَّهُ عز وجل: ﴿مَا قَطَعْتُمْ مِنْ لِينَةٍ أَوْ تَرَكْتُمُوهَا قَائِمَةً عَلَى أُصُولِهَا فَبِإِذْنِ اللَّهِ وليخزي الفاسقين﴾ [٥٩ /الحشر / ٥].", people: [] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default expulsionOfBanuNadir;
