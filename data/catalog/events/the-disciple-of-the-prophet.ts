import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * On the day of the Confederates the Prophet ﷺ asked three times who would bring news of the enemy, and each time
 * al-Zubayr said «أنا»; then he said «إن لكل نبي حواري، وإن حواري الزبير». Told from Sahih al-Bukhari 4113 (al-Maghazi, the
 * chapter on al-Khandaq), whole.
 */
const theDiscipleOfTheProphet = {
  kind: 'EVENT',
  slug: 'the-disciple-of-the-prophet',
  name: "حواري النبي ﷺ",
  nameTransliterated: "The disciple of the Prophet",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'az-zubayr-ibn-al-awwam' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا مُحَمَّدُ بْنُ كَثِيرٍ: أَخْبَرَنَا سُفْيَانُ، عَنِ ابْنِ الْمُنْكَدِرِ قَالَ: سَمِعْتُ جَابِرًا يَقُولُ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4113, url: 'https://sunnah.com/bukhari:4113' },
      moments: [
        { title: "«من يأتينا بخبر القوم»", text: "«قَالَ رَسُولُ اللهِ ﷺ يَوْمَ الْأَحْزَابِ: مَنْ يَأْتِينَا بِخَبَرِ الْقَوْمِ. فَقَالَ الزُّبَيْرُ: أَنَا، ثُمَّ قَالَ: مَنْ يَأْتِينَا بِخَبَرِ الْقَوْمِ. فَقَالَ الزُّبَيْرُ: أَنَا، ثُمَّ قَالَ: مَنْ يَأْتِينَا بِخَبَرِ الْقَوْمِ. فَقَالَ الزُّبَيْرُ: أَنَا،", people: ['prophet-muhammad', 'az-zubayr-ibn-al-awwam'] },
        { title: "«إن لكل نبي حواري»", text: "ثُمَّ قَالَ: إِنَّ لِكُلِّ نَبِيٍّ حَوَارِيًّ، وَإِنَّ حَوَارِيَّ الزُّبَيْرُ.»", people: ['prophet-muhammad', 'az-zubayr-ibn-al-awwam'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theDiscipleOfTheProphet;
