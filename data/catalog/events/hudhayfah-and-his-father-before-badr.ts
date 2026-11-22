import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Hudhayfah and his father Husayl, setting out, were taken by Quraysh and let go on their oath not to fight with the Prophet ﷺ;
 * he told them «انصرفا. نفي بعهدهم، ونستعين الله عليهم», and so they missed Badr. Told from Sahih Muslim 1787 (al-Jihad, the
 * chapter on keeping a pledge), whole. His father, named «حسيل» and «أبي» in the text, is linked as hisl-ibn-jabir-al-absi,
 * whose catalog file has him as Hudhayfah's father.
 */
const hudhayfahAndHisFatherBeforeBadr = {
  kind: 'EVENT',
  slug: 'hudhayfah-and-his-father-before-badr',
  name: "حذيفة وأبوه قبل بدر",
  nameTransliterated: "Hudhayfah and his father before Badr",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'hudhayfah-ibn-al-yaman' }, { person: 'hisl-ibn-jabir-al-absi' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "وحَدَّثَنَا أَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ. حَدَّثَنَا أَبُو أُسَامَةَ عَنْ الْوَلِيدِ ابن جُمَيْعٍ. حَدَّثَنَا أَبُو الطُّفَيْلِ. حَدَّثَنَا حُذَيْفَةُ بْنُ اليمان. قال:",
      source: { slug: 'sahih-muslim', hadith: 1787, url: 'https://sunnah.com/muslim:1787' },
      moments: [
        { title: "«ما نريد إلا المدينة»", text: "ما معنى أَنْ أَشْهَدَ بَدْرًا إِلَّا أَنِّي خَرَجْتُ أَنَا وَأَبِي، حُسَيْلٌ. قَالَ: فَأَخَذَنَا كُفَّارُ قُرَيْشٍ. قَالُوا: إِنَّكُمْ تُرِيدُونَ مُحَمَّدًا؟ فَقُلْنَا: مَا نُرِيدُهُ. مَا نُرِيدُ إِلَّا الْمَدِينَةَ. فَأَخَذُوا مِنَّا عَهْدَ اللَّهِ وَمِيثَاقَهُ لَنَنْصَرِفَنَّ إِلَى الْمَدِينَةِ وَلَا نُقَاتِلُ مَعَهُ.", people: ['hudhayfah-ibn-al-yaman', 'hisl-ibn-jabir-al-absi'] },
        { title: "«نفي بعهدهم، ونستعين الله عليهم»", text: "فَأَتَيْنَا رَسُولَ اللَّهِ ﷺ فأخبرناه الخبر. فقال (انصرفا. نفي بِعَهْدِهِمْ، وَنَسْتَعِينُ اللَّهَ عَلَيْهِمْ).", people: ['hudhayfah-ibn-al-yaman', 'hisl-ibn-jabir-al-absi', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default hudhayfahAndHisFatherBeforeBadr;
