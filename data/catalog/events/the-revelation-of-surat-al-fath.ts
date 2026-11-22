import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * On a night journey Umar asked the Prophet ﷺ three times and had no answer, rode ahead fearing Quran would come down about
 * him, and was called back: «لقد أنزلت علي الليلة سورة، لهي أحب إلي مما طلعت عليه الشمس», and he recited «إنا فتحنا لك
 * فتحا مبينا». Told from Sahih al-Bukhari 4177 (al-Maghazi, the chapter on al-Hudaybiyah), whole; then Anas's Sahih Muslim
 * 1786, whole, folded, which says it came down on the way back from al-Hudaybiyah.
 */
const theRevelationOfSuratAlFath = {
  kind: 'EVENT',
  slug: 'the-revelation-of-surat-al-fath',
  name: "نزول سورة الفتح",
  nameTransliterated: "The revelation of Surat al-Fath",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'umar-ibn-al-khattab' }],
  tags: ['HIS_WORDS', 'REVEALED_ABOUT'],
  ayat: [
    {
      kind: 'RECITED',
      from: '48:1',
      to: '48:1',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 4177, url: 'https://sunnah.com/bukhari:4177', quote: "ثُمَّ قَرَأَ: ﴿إِنَّا فَتَحْنَا لَكَ فَتْحًا مُبِينًا﴾" }],
    },
    {
      kind: 'REVEALED_ABOUT',
      report: "في رواية أنس",
      from: '48:1',
      to: '48:5',
      evidence: [{ source: 'sahih-muslim', hadith: 1786, url: 'https://sunnah.com/muslim:1786', quote: "لَمَّا نَزَلَتْ: ﴿إِنَّا فَتَحْنَا لَكَ فَتْحًا مبينا ليغفر لك الله﴾ إلى قوله: فوزا عظيما" }],
    },
  ],
  reports: [
    {
      isnad: "حَدَّثَنِي عَبْدُ اللهِ بْنُ يُوسُفَ: أَخْبَرَنَا مَالِكٌ، عَنْ زَيْدِ بْنِ أَسْلَمَ، عَنْ أَبِيهِ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4177, url: 'https://sunnah.com/bukhari:4177' },
      moments: [
        { title: "سأله ثلاث مرات فلم يجبه", text: "«أَنَّ رَسُولَ اللهِ ﷺ كَانَ يَسِيرُ فِي بَعْضِ أَسْفَارِهِ، وَعُمَرُ بْنُ الْخَطَّابِ يَسِيرُ مَعَهُ لَيْلًا، فَسَأَلَهُ عُمَرُ بْنُ الْخَطَّابِ، عَنْ شَيْءٍ فَلَمْ يُجِبْهُ رَسُولُ اللهِ ﷺ، ثُمَّ سَأَلَهُ فَلَمْ يُجِبْهُ، ثُمَّ سَأَلَهُ فَلَمْ يُجِبْهُ", people: ['prophet-muhammad', 'umar-ibn-al-khattab'] },
        { title: "«ثكلتك أمك يا عمر»", text: "وَقَالَ عُمَرُ بْنُ الْخَطَّابِ: ثَكِلَتْكَ أُمُّكَ يَا عُمَرُ، نَزَرْتَ رَسُولَ اللهِ ﷺ ثَلَاثَ مَرَّاتٍ كُلُّ ذَلِكَ لَا يُجِيبُكَ، قَالَ عُمَرُ: فَحَرَّكْتُ بَعِيرِي ثُمَّ تَقَدَّمْتُ أَمَامَ الْمُسْلِمِينَ، وَخَشِيتُ أَنْ يَنْزِلَ فِيَّ قُرْآنٌ،", people: ['umar-ibn-al-khattab', 'prophet-muhammad'] },
        { title: "«لقد أنزلت علي الليلة سورة»", text: "فَمَا نَشِبْتُ أَنْ سَمِعْتُ صَارِخًا يَصْرُخُ بِي، قَالَ: فَقُلْتُ: لَقَدْ خَشِيتُ أَنْ يَكُونَ نَزَلَ فِيَّ قُرْآنٌ، وَجِئْتُ رَسُولَ اللهِ ﷺ فَسَلَّمْتُ عَلَيْهِ، فَقَالَ: لَقَدْ أُنْزِلَتْ عَلَيَّ اللَّيْلَةَ سُورَةٌ، لَهِيَ أَحَبُّ إِلَيَّ مِمَّا طَلَعَتْ عَلَيْهِ الشَّمْسُ ثُمَّ قَرَأَ: ﴿إِنَّا فَتَحْنَا لَكَ فَتْحًا مُبِينًا﴾.»", people: ['umar-ibn-al-khattab', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: "وحَدَّثَنَا نَصْرُ بْنُ عَلِيٍّ الْجَهْضَمِيُّ. حَدَّثَنَا خَالِدُ بْنُ الْحَارِثِ. حَدَّثَنَا سَعِيدُ بْنُ أَبِي عَرُوبَةَ عَنْ قَتَادَةَ؛ أَنَّ أَنَسَ بْنَ مَالِكٍ حَدَّثَهُمْ قَالَ:",
      source: { slug: 'sahih-muslim', hadith: 1786, url: 'https://sunnah.com/muslim:1786' },
      moments: [
        { title: "«لقد أنزلت علي آية هي أحب إلي من الدنيا جميعا»", text: "لَمَّا نَزَلَتْ: ﴿إِنَّا فَتَحْنَا لَكَ فَتْحًا مبينا ليغفر لك الله﴾ إلى قوله: فوزا عظيما. [٤٨ /الفتح /الآيات ١ - ٥] مَرْجِعَهُ مِنْ الْحُدَيْبِيَةِ وَهُمْ يُخَالِطُهُمُ الْحُزْنُ وَالْكَآبَةُ. وَقَدْ نَحَرَ الْهَدْيَ بِالْحُدَيْبِيَةِ. فَقَالَ (لَقَدْ أُنْزِلَتْ عَلَيَّ آيَةٌ هِيَ أَحَبُّ إِلَيَّ مِنَ الدُّنْيَا جميعا).", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theRevelationOfSuratAlFath;
