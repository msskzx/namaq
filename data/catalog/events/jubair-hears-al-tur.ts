import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Jubayr ibn Mut'im, not yet Muslim, came to Madinah about the captives of Badr and heard the Prophet ﷺ recite al-Tur at
 * Maghrib: at {أم خلقوا من غير شيء} (al-Tur 35-37) his heart all but flew, and it was the first time faith settled in
 * it. Told from Sahih al-Bukhari, each hadith whole: 4854 (Kitab al-Tafsir) names the ayat, 4023 (al-Maghazi) says it was
 * the first stirring of his faith, 3050 (al-Jihad) that he had come about the captives of Badr, and 765 (al-Adhan) is
 * Malik's report of the recitation. The people stand on these reports, which name them, not on a batch claim.
 */
const jubairHearsAlTur = {
  kind: 'EVENT',
  slug: 'jubair-hears-al-tur',
  name: 'جبير بن مطعم يسمع سورة الطور',
  nameTransliterated: "Jubayr ibn Mut'im hears al-Tur",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'jubair-ibn-mutim' }, { person: 'prophet-muhammad' }],
  tags: ['HEARD_QURAN', 'ISLAM'],
  ayat: [
    {
      kind: 'RECITED',
      from: '52:35',
      to: '52:37',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 4854, url: 'https://sunnah.com/bukhari:4854', quote: 'فَلَمَّا بَلَغَ هَذِهِ الآيَةَ {أَمْ خُلِقُوا مِنْ غَيْرِ شَىْءٍ أَمْ هُمُ الْخَالِقُونَ * أَمْ خَلَقُوا السَّمَوَاتِ وَالأَرْضَ بَلْ لاَ يُوقِنُونَ * أَمْ عِنْدَهُمْ خَزَائِنُ رَبِّكَ أَمْ هُمُ الْمُسَيْطِرُونَ} كَادَ قَلْبِي أَنْ يَطِيرَ.' }],
    },
  ],
  reports: [
    {
      isnad: 'حَدَّثَنَا الْحُمَيْدِيُّ، حَدَّثَنَا سُفْيَانُ، قَالَ حَدَّثُونِي عَنِ الزُّهْرِيِّ، عَنْ مُحَمَّدِ بْنِ جُبَيْرِ بْنِ مُطْعِمٍ، عَنْ أَبِيهِ ـ رضى الله عنه ـ',
      source: { slug: 'sahih-al-bukhari', hadith: 4854, url: 'https://sunnah.com/bukhari:4854' },
      moments: [
        { title: 'يقرأ في المغرب بالطور', text: 'قَالَ سَمِعْتُ النَّبِيَّ صلى الله عليه وسلم يَقْرَأُ فِي الْمَغْرِبِ بِالطُّورِ', people: ['jubair-ibn-mutim', 'prophet-muhammad'] },
        { title: '«كاد قلبي أن يطير»', text: 'فَلَمَّا بَلَغَ هَذِهِ الآيَةَ {أَمْ خُلِقُوا مِنْ غَيْرِ شَىْءٍ أَمْ هُمُ الْخَالِقُونَ * أَمْ خَلَقُوا السَّمَوَاتِ وَالأَرْضَ بَلْ لاَ يُوقِنُونَ * أَمْ عِنْدَهُمْ خَزَائِنُ رَبِّكَ أَمْ هُمُ الْمُسَيْطِرُونَ} كَادَ قَلْبِي أَنْ يَطِيرَ.', people: ['jubair-ibn-mutim', 'prophet-muhammad'] },
        { title: 'ما سمعه سفيان من الزهري', text: 'قَالَ سُفْيَانُ فَأَمَّا أَنَا فَإِنَّمَا سَمِعْتُ الزُّهْرِيَّ يُحَدِّثُ عَنْ مُحَمَّدِ بْنِ جُبَيْرِ بْنِ مُطْعِمٍ عَنْ أَبِيهِ سَمِعْتُ النَّبِيَّ صلى الله عليه وسلم يَقْرَأُ فِي الْمَغْرِبِ بِالطُّورِ. لَمْ أَسْمَعْهُ زَادَ الَّذِي قَالُوا لِي.', people: [] },
      ],
    },
    {
      isnad: 'حَدَّثَنِي إِسْحَاقُ بْنُ مَنْصُورٍ، حَدَّثَنَا عَبْدُ الرَّزَّاقِ، أَخْبَرَنَا مَعْمَرٌ، عَنِ الزُّهْرِيِّ، عَنْ مُحَمَّدِ بْنِ جُبَيْرٍ، عَنْ أَبِيهِ،',
      source: { slug: 'sahih-al-bukhari', hadith: 4023, url: 'https://sunnah.com/bukhari:4023' },
      moments: [
        { title: 'يقرأ في المغرب بالطور', text: 'قَالَ سَمِعْتُ النَّبِيَّ صلى الله عليه وسلم يَقْرَأُ فِي الْمَغْرِبِ بِالطُّورِ،', people: ['jubair-ibn-mutim', 'prophet-muhammad'] },
        { title: 'أول ما وقر الإيمان في قلبه', text: 'وَذَلِكَ أَوَّلَ مَا وَقَرَ الإِيمَانُ فِي قَلْبِي.', people: ['jubair-ibn-mutim'] },
      ],
    },
    {
      isnad: 'حَدَّثَنِي مَحْمُودٌ، حَدَّثَنَا عَبْدُ الرَّزَّاقِ، أَخْبَرَنَا مَعْمَرٌ، عَنِ الزُّهْرِيِّ، عَنْ مُحَمَّدِ بْنِ جُبَيْرٍ، عَنْ أَبِيهِ',
      source: { slug: 'sahih-al-bukhari', hadith: 3050, url: 'https://sunnah.com/bukhari:3050' },
      moments: [
        { title: 'جاء في أسارى بدر', text: 'ـ وَكَانَ جَاءَ فِي أُسَارَى بَدْرٍ ـ', people: ['jubair-ibn-mutim'] },
        { title: 'يقرأ في المغرب بالطور', text: 'قَالَ سَمِعْتُ النَّبِيَّ صلى الله عليه وسلم يَقْرَأُ فِي الْمَغْرِبِ بِالطُّورِ.', people: ['jubair-ibn-mutim', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: 'حَدَّثَنَا عَبْدُ اللَّهِ بْنُ يُوسُفَ، قَالَ أَخْبَرَنَا مَالِكٌ، عَنِ ابْنِ شِهَابٍ، عَنْ مُحَمَّدِ بْنِ جُبَيْرِ بْنِ مُطْعِمٍ، عَنْ أَبِيهِ،',
      source: { slug: 'sahih-al-bukhari', hadith: 765, url: 'https://sunnah.com/bukhari:765' },
      moments: [
        { title: 'قرأ في المغرب بالطور', text: 'قَالَ سَمِعْتُ رَسُولَ اللَّهِ صلى الله عليه وسلم قَرَأَ فِي الْمَغْرِبِ بِالطُّورِ.', people: ['jubair-ibn-mutim', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default jubairHearsAlTur;
