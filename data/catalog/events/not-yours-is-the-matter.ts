import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ cursed men of Quraysh by name in the dawn prayer, and Allah sent down «ليس لك من الأمر شيء»; in Anas's report
 * it came when he wiped the blood from his face at Uhud saying «كيف يفلح قوم شجوا نبيهم». Told from the two Sahihs, each
 * hadith whole: Ibn Umar's Sahih al-Bukhari 4069 first (al-Maghazi, the chapter on that ayah); then Salim's 4070, which
 * names those he cursed; then Anas's Sahih Muslim 1791. Suhayl ibn Amr and al-Harith ibn Hisham have no catalog subject
 * and are not linked.
 */
const notYoursIsTheMatter = {
  kind: 'EVENT',
  slug: 'not-yours-is-the-matter',
  name: "«ليس لك من الأمر شيء»",
  nameTransliterated: "Not yours is the matter",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'safwan-ibn-umayyah' }],
  tags: ['HIS_WORDS', 'REVEALED_ABOUT'],
  ayat: [
    {
      kind: 'REVEALED_ABOUT',
      from: '3:128',
      to: '3:128',
      evidence: [
        { source: 'sahih-al-bukhari', hadith: 4069, url: 'https://sunnah.com/bukhari:4069', quote: "فَأَنْزَلَ اللهُ: ﴿لَيْسَ لَكَ مِنَ الأَمْرِ شَيْءٌ﴾ إِلَى قَوْلِهِ: ﴿فَإِنَّهُمْ ظَالِمُونَ﴾" },
        { source: 'sahih-al-bukhari', hadith: 4070, url: 'https://sunnah.com/bukhari:4070', quote: "فَنَزَلَتْ: ﴿لَيْسَ لَكَ مِنَ الأَمْرِ شَيْءٌ﴾ إِلَى قَوْلِهِ: ﴿فَإِنَّهُمْ ظَالِمُونَ﴾" },
        { source: 'sahih-muslim', hadith: 1791, url: 'https://sunnah.com/muslim:1791', quote: "فَأَنْزَلَ اللَّهُ تعالى: ﴿لَيْسَ لَكَ مِنَ الأَمْرِ شَيْءٌ﴾" },
      ],
    },
  ],
  reports: [
    {
      isnad: "حَدَّثَنَا يَحْيَى بْنُ عَبْدِ اللهِ السُّلَمِيُّ: أَخْبَرَنَا عَبْدُ اللهِ: أَخْبَرَنَا مَعْمَرٌ، عَنِ الزُّهْرِيِّ: حَدَّثَنِي سَالِمٌ، عَنْ أَبِيهِ",
      source: { slug: 'sahih-al-bukhari', hadith: 4069, url: 'https://sunnah.com/bukhari:4069' },
      moments: [
        { title: "«اللهم العن فلانا وفلانا وفلانا»", text: "«أَنَّهُ: سَمِعَ رَسُولَ اللهِ ﷺ إِذَا رَفَعَ رَأْسَهُ مِنَ الرُّكُوعِ مِنَ الرَّكْعَةِ الْآخِرَةِ مِنَ الْفَجْرِ يَقُولُ: اللَّهُمَّ الْعَنْ فُلَانًا وَفُلَانًا وَفُلَانًا. بَعْدَمَا يَقُولُ: سَمِعَ اللهُ لِمَنْ حَمِدَهُ، رَبَّنَا وَلَكَ الْحَمْدُ.", people: ['prophet-muhammad'] },
        { title: "«ليس لك من الأمر شيء»", text: "فَأَنْزَلَ اللهُ: ﴿لَيْسَ لَكَ مِنَ الأَمْرِ شَيْءٌ﴾ إِلَى قَوْلِهِ: ﴿فَإِنَّهُمْ ظَالِمُونَ﴾.»", people: [] },
      ],
    },
    {
      isnad: "وَعَنْ حَنْظَلَةَ بْنِ أَبِي سُفْيَانَ سَمِعْتُ سَالِمَ بْنَ عَبْدِ اللهِ يَقُولُ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4070, url: 'https://sunnah.com/bukhari:4070' },
      moments: [
        { title: "يدعو على صفوان بن أمية", text: "«كَانَ رَسُولُ اللهِ ﷺ يَدْعُو عَلَى: صَفْوَانَ بْنِ أُمَيَّةَ، وَسُهَيْلِ بْنِ عَمْرٍو، وَالْحَارِثِ بْنِ هِشَامٍ", people: ['prophet-muhammad', 'safwan-ibn-umayyah'] },
        { title: "«ليس لك من الأمر شيء»", text: "فَنَزَلَتْ: ﴿لَيْسَ لَكَ مِنَ الأَمْرِ شَيْءٌ﴾ إِلَى قَوْلِهِ: ﴿فَإِنَّهُمْ ظَالِمُونَ﴾»", people: [] },
      ],
    },
    {
      isnad: "حَدَّثَنَا عَبْدُ اللَّهِ بْنُ مَسْلَمَةَ بْنِ قَعْنَبٍ. حَدَّثَنَا حَمَّادُ بْنُ سَلَمَةَ عَنْ ثَابِتٍ، عَنْ أنس؛",
      source: { slug: 'sahih-muslim', hadith: 1791, url: 'https://sunnah.com/muslim:1791' },
      moments: [
        { title: "«كيف يفلح قوم شجوا نبيهم؟»", text: "أن رسول الله ﷺ كُسِرَتْ رَبَاعِيَتُهُ يَوْمَ أُحُدٍ. وَشُجَّ فِي رَأْسِهِ. فَجَعَلَ يَسْلُتُ الدَّمَ عَنْهُ وَيَقُولُ (كَيْفَ يفلح قوم شجوا نبيهم وشجوا رَبَاعِيَتَهُ، وَهُوَ يَدْعُوهُمْ إِلَى اللَّهِ؟)", people: ['prophet-muhammad'] },
        { title: "«ليس لك من الأمر شيء»", text: "فَأَنْزَلَ اللَّهُ تعالى: ﴿لَيْسَ لَكَ مِنَ الأَمْرِ شَيْءٌ﴾ [٣ /آل عمران /١٢٨].", people: [] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default notYoursIsTheMatter;
