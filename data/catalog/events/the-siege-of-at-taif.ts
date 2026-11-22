import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ besieged al-Ta'if and gained nothing, and said «إنا قافلون إن شاء الله»; it weighed on them, so he said
 * «اغدوا على القتال», they were wounded, and when he said again they would leave tomorrow they were pleased and he laughed.
 * Told from Abd Allah ibn Amr's hadith: Sahih al-Bukhari 4325 (al-Maghazi, the raid of al-Ta'if) first, whole; then
 * Sahih Muslim 1778 (al-Jihad, the raid of al-Ta'if), whole.
 */
const theSiegeOfAtTaif = {
  kind: 'EVENT',
  slug: 'the-siege-of-at-taif',
  name: "حصار الطائف",
  nameTransliterated: "The siege of al-Ta'if",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا عَلِيُّ بْنُ عَبْدِ اللهِ: حَدَّثَنَا سُفْيَانُ، عَنْ عَمْرٍو، عَنْ أَبِي الْعَبَّاسِ الشَّاعِرِ الْأَعْمَى عَنْ عَبْدِ اللهِ بْنِ عَمْرٍو قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4325, url: 'https://sunnah.com/bukhari:4325' },
      moments: [
        { title: "«إنا قافلون إن شاء الله»", text: "«لَمَّا حَاصَرَ رَسُولُ اللهِ ﷺ الطَّائِفَ، فَلَمْ يَنَلْ مِنْهُمْ شَيْئًا، قَالَ: إِنَّا قَافِلُونَ إِنْ شَاءَ اللهُ. فَثَقُلَ عَلَيْهِمْ، وَقَالُوا: نَذْهَبُ وَلَا نَفْتَحُهُ، وَقَالَ مَرَّةً: نَقْفُلُ", people: ['prophet-muhammad'] },
        { title: "«اغدوا على القتال»", text: "فَقَالَ: اغْدُوا عَلَى الْقِتَالِ فَغَدَوْا فَأَصَابَهُمْ جِرَاحٌ، فَقَالَ: إِنَّا قَافِلُونَ غَدًا إِنْ شَاءَ اللهُ. فَأَعْجَبَهُمْ، فَضَحِكَ النَّبِيُّ ﷺ». وَقَالَ سُفْيَانُ مَرَّةً: فَتَبَسَّمَ، قَالَ: قَالَ الْحُمَيْدِيُّ: حَدَّثَنَا سُفْيَانُ الْخَبَرَ كُلَّهُ.", people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا أَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ وَزُهَيْرُ بْنُ حَرْبٍ وَابْنُ نُمَيْرٍ. جَمِيعًا عَنْ سُفْيَانَ. قَالَ زُهَيْرٌ: حَدَّثَنَا سُفْيَانُ بْنُ عُيَيْنَةَ عَنْ عَمْرٍو، عَنْ أَبِي الْعَبَّاسِ الشَّاعِرِ الْأَعْمَى، عَنْ عَبْدِ اللَّهِ بْنِ عَمْرٍو. قَالَ:",
      source: { slug: 'sahih-muslim', hadith: 1778, url: 'https://sunnah.com/muslim:1778' },
      moments: [
        { title: "«إنا قافلون، إن شاء الله»", text: "حَاصَرَ رَسُولُ اللَّهِ ﷺ أَهْلَ الطَّائِفِ. فَلَمْ يَنَلْ مِنْهُمْ شَيْئًا. فَقَالَ (إِنَّا قَافِلُونَ، إِنْ شَاءَ اللَّهُ) قَالَ أَصْحَابُهُ: نَرْجِعُ وَلَمْ نَفْتَتِحْهُ!", people: ['prophet-muhammad'] },
        { title: "«اغدوا على القتال»", text: "فَقَالَ لَهُمْ رَسُولُ اللَّهِ ﷺ (اغْدُوا عَلَى الْقِتَالِ) فَغَدَوْا عَلَيْهِ فَأَصَابَهُمْ جِرَاحٌ. فَقَالَ لَهُمْ رَسُولُ اللَّهِ ﷺ (أنا قَافِلُونَ غَدًا) قَالَ: فَأَعْجَبَهُمْ ذَلِكَ. فَضَحِكَ رَسُولُ الله ﷺ.", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theSiegeOfAtTaif;
