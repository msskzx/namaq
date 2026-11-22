import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Tariq ibn Abd al-Rahman passed people praying at a mosque they said was the tree of the pledge; Sa'id ibn al-Musayyib told
 * him his father, who had pledged under it, could not find it the next year, «إن أصحاب محمد ﷺ لم يعلموها، وعلمتموها أنتم،
 * فأنتم أعلم». Told from Sahih al-Bukhari 4163 (al-Maghazi, the chapter on al-Hudaybiyah), whole; then al-Musayyib's own
 * shorter words, 4164 and 4162, whole, folded. 4165 is a fragment and is not repeated. Al-Musayyib has no catalog subject
 * and is not linked.
 */
const theTreeOfThePledge = {
  kind: 'EVENT',
  slug: 'the-tree-of-the-pledge',
  name: "شجرة الرضوان",
  nameTransliterated: "The tree of the pledge",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  reports: [
    {
      isnad: "حَدَّثَنَا مَحْمُودٌ: حَدَّثَنَا عُبَيْدُ اللهِ، عَنْ إِسْرَائِيلَ، عَنْ طَارِقِ بْنِ عَبْدِ الرَّحْمَنِ قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4163, url: 'https://sunnah.com/bukhari:4163' },
      moments: [
        { title: "«ما هذا المسجد؟»", text: "«انْطَلَقْتُ حَاجًّا، فَمَرَرْتُ بِقَوْمٍ يُصَلُّونَ، قُلْتُ: مَا هَذَا الْمَسْجِدُ؟ قَالُوا: هَذِهِ الشَّجَرَةُ، حَيْثُ بَايَعَ رَسُولُ اللهِ ﷺ بَيْعَةَ الرُِّضْوَانِ،", people: ['prophet-muhammad'] },
        { title: "«فلما خرجنا من العام المقبل نسيناها»", text: "فَأَتَيْتُ سَعِيدَ بْنَ الْمُسَيَّبِ فَأَخْبَرْتُهُ، فَقَالَ سَعِيدٌ: حَدَّثَنِي أَبِي: أَنَّهُ كَانَ فِيمَنْ بَايَعَ رَسُولَ اللهِ ﷺ تَحْتَ الشَّجَرَةِ، قَالَ: فَلَمَّا خَرَجْنَا مِنَ الْعَامِ الْمُقْبِلِ نَسِينَاهَا، فَلَمْ نَقْدِرْ عَلَيْهَا.", people: ['prophet-muhammad'] },
        { title: "«فأنتم أعلم»", text: "فَقَالَ سَعِيدٌ: إِنَّ أَصْحَابَ مُحَمَّدٍ ﷺ لَمْ يَعْلَمُوهَا، وَعَلِمْتُمُوهَا أَنْتُمْ، فَأَنْتُمْ أَعْلَمُ».", people: [] },
      ],
    },
    {
      isnad: "حَدَّثَنَا مُوسَى: حَدَّثَنَا أَبُو عَوَانَةَ: حَدَّثَنَا طَارِقٌ، عَنْ سَعِيدِ بْنِ الْمُسَيَّبِ، عَنْ أَبِيهِ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4164, url: 'https://sunnah.com/bukhari:4164' },
      moments: [
        { title: "«فعميت علينا»", text: "«أَنَّهُ كَانَ مِمَّنْ بَايَعَ تَحْتَ الشَّجَرَةِ، فَرَجَعْنَا إِلَيْهَا الْعَامَ الْمُقْبِلَ فَعَمِيَتْ عَلَيْنَا».", people: [] },
      ],
    },
    {
      isnad: "حَدَّثَنِي مُحَمَّدُ بْنُ رَافِعٍ: حَدَّثَنَا شَبَابَةُ بْنُ سَوَّارٍ أَبُو عَمْرٍو الْفَزَارِيُّ: حَدَّثَنَا شُعْبَةُ، عَنْ قَتَادَةَ، عَنْ سَعِيدِ بْنِ الْمُسَيَّبِ، عَنْ أَبِيهِ قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4162, url: 'https://sunnah.com/bukhari:4162' },
      moments: [
        { title: "«فلم أعرفها»", text: "«لَقَدْ رَأَيْتُ الشَّجَرَةَ، ثُمَّ أَتَيْتُهَا بَعْدُ فَلَمْ أَعْرِفْهَا» قَالَ مَحْمُودٌ: ثُمَّ أُنْسِيتُهَا بَعْدُ.", people: [] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theTreeOfThePledge;
