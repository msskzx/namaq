import type { CatalogEvent } from '@/lib/catalog/types';

// After Abu Talib died and Quraysh closed in. Undated in the chapter.
// Told as a story from Sahih Muslim 1795 (al-Jihad, the chapter on what the Prophet ﷺ met from the mushrikun), whole:
// Aisha asks whether any day was harder than Uhud, and he tells of the day of al-Aqabah, Jibril and the angel of the
// mountains. Ibn Abd Yalil ibn Abd Kulal has no catalog subject and is not linked.
const journeyToTaif = {
  kind: 'EVENT',
  slug: 'journey-to-taif',
  name: 'خروجه إلى الطائف',
  nameTransliterated: 'The Journey to Ta’if',
  type: 'TRAVEL',
  fields: {
    location: { value: 'الطائف', claims: ['sira/taif'] },
    description: {
      value:
        'عمد إلى ثقيف بالطائف يرجو أن يؤووه، فرده سادتهم وتهزؤوا به وأقعدوا له صفين يرضخون رجليه بالحجارة، فعرض عليه ملك الجبال أن يطبق عليهم الأخشبين، فقال: بل أرجو أن يخرج الله من أصلابهم من يعبد الله لا يشرك به شيئا.',
      claims: ['sira/taif'],
    },
  },
  people: [{ person: 'prophet-muhammad', claims: ['sira/taif'] }, { person: 'aisha-bint-abi-bakr' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "وحَدَّثَنِي أَبُو الطَّاهِرِ أَحْمَدُ بْنُ عَمْرِو بْنِ سرح، وحرملة ابن يَحْيَى، وَعَمْرُو بْنُ سَوَّادٍ الْعَامِرِيُّ (وَأَلْفَاظُهُمْ مُتَقَارِبَةٌ) قَالُوا: حَدَّثَنَا ابْنُ وَهْبٍ. قَالَ: أَخْبَرَنِي يُونُسُ عَنِ ابْنِ شهاب. حَدَّثَنِي عُرْوَةُ بْنُ الزُّبَيْرِ؛ أَنَّ عَائِشَةَ زَوْجَ النبي ﷺ حَدَّثَتْهُ؛",
      source: { slug: 'sahih-muslim', hadith: 1795, url: 'https://sunnah.com/muslim:1795' },
      moments: [
        { title: "«هل أتى عليك يوم كان أشد من يوم أحد؟»", text: "أَنَّهَا قَالَتْ لِرَسُولِ اللَّهِ ﷺ: يَا رَسُولَ اللَّهِ! هَلْ أَتَى عَلَيْكَ يَوْمٌ كَانَ أَشَدَّ مِنْ يَوْمِ أُحُدٍ؟ فَقَالَ (لَقَدْ لَقِيتُ مِنْ قَوْمِكِ. وَكَانَ أَشَدَّ مَا لَقِيتُ مِنْهُمْ يَوْمَ الْعَقَبَةِ. إِذْ عرضت نفسي على ابن عبد يا ليل بْنِ عَبْدِ كُلَالٍ. فَلَمْ يُجِبْنِي إِلَى مَا أَرَدْتُ. فَانْطَلَقْتُ وَأَنَا مَهْمُومٌ عَلَى وَجْهِي.", people: ['aisha-bint-abi-bakr', 'prophet-muhammad'] },
        { title: "فإذا فيها جبريل", text: "فَلَمْ أَسْتَفِقْ إِلَّا بِقَرْنِ الثَّعَالِبِ. فَرَفَعْتُ رَأْسِي فَإِذَا أَنَا بِسَحَابَةٍ قَدْ أَظَلَّتْنِي. فَنَظَرْتُ فَإِذَا فِيهَا جِبْرِيلُ. فَنَادَانِي. فَقَالَ: إِنَّ اللَّهَ عز وجل قَدْ سَمِعَ قَوْلَ قَوْمِكَ لَكَ وَمَا رُدُّوا عَلَيْكَ. وَقَدْ بَعَثَ إِلَيْكَ مَلَكَ الْجِبَالِ لِتَأْمُرَهُ بِمَا شِئْتَ فِيهِمْ.", people: ['prophet-muhammad'] },
        { title: "«إن شئت أن أطبق عليهم الأخشبين»", text: "قَالَ: فَنَادَانِي مَلَكُ الْجِبَالِ وَسَلَّمَ عَلَيَّ. ثُمَّ قَالَ: يَا مُحَمَّدُ! إِنَّ اللَّهَ قَدْ سَمِعَ قَوْلَ قَوْمِكَ لَكَ. وَأَنَا مَلَكُ الْجِبَالِ. وَقَدْ بَعَثَنِي رَبُّكَ إِلَيْكَ لِتَأْمُرَنِي بِأَمْرِكَ. فَمَا شِئْتَ؟ إِنْ شِئْتَ أَنْ أُطْبِقَ عَلَيْهِمُ الْأَخْشَبَيْنِ).", people: ['prophet-muhammad'] },
        { title: "«بل أرجو أن يخرج الله من أصلابهم»", text: "فَقَالَ لَهُ رَسُولُ اللَّهِ ﷺ (بَلْ أَرْجُو أَنْ يُخْرِجَ اللَّهُ مِنْ أَصْلَابِهِمْ مَنْ يَعْبُدُ اللَّهَ وَحْدَهُ، لا يشرك به شيئا).", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default journeyToTaif;
