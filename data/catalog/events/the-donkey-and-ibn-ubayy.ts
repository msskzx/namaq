import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ was asked to go to Abd Allah ibn Ubayy and rode to him on a donkey; Ibn Ubayy said «إليك عني، فوالله لقد
 * آذاني نتن حمارك», a man of the Ansar answered that the donkey smelt sweeter than he, and their people fought with palm
 * stalks, hands and sandals; word was that «وإن طائفتان من المؤمنين اقتتلوا فأصلحوا بينهما» came down about them. Told from
 * Sahih Muslim 1799 (al-Jihad), whole.
 */
const theDonkeyAndIbnUbayy = {
  kind: 'EVENT',
  slug: 'the-donkey-and-ibn-ubayy',
  name: "حمار رسول الله ﷺ وعبد الله بن أبي",
  nameTransliterated: "The donkey and Ibn Ubayy",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abdullah-ibn-ubayy' }],
  tags: ['REVEALED_ABOUT'],
  ayat: [
    {
      kind: 'REVEALED_ABOUT',
      from: '49:9',
      to: '49:9',
      evidence: [{ source: 'sahih-muslim', hadith: 1799, url: 'https://sunnah.com/muslim:1799', quote: "فَبَلَغَنَا أَنَّهَا نَزَلَتْ فِيهِمْ: ﴿وَإِنْ طَائِفَتَانِ مِنَ الْمُؤْمِنِينَ اقْتَتَلُوا فأصلحوا بينهما﴾" }],
    },
  ],
  reports: [
    {
      isnad: "حَدَّثَنَا مُحَمَّدُ بْنُ عَبْدِ الْأَعْلَى الْقَيْسِيُّ. حَدَّثَنَا الْمُعْتَمِرُ عَنْ أَبِيهِ، عَنْ أَنَسِ بْنِ مَالِكٍ. قَالَ:",
      source: { slug: 'sahih-muslim', hadith: 1799, url: 'https://sunnah.com/muslim:1799' },
      moments: [
        { title: "«لقد آذاني نتن حمارك»", text: "قِيلَ لِلنَّبِيِّ ﷺ: لَوْ أَتَيْتَ عَبْدَ اللَّهِ بْنَ أُبَيٍّ؟ قَالَ: فَانْطَلَقَ إِلَيْهِ. وَرَكِبَ حِمَارًا. وَانْطَلَقَ الْمُسْلِمُونَ. وَهِيَ أَرْضٌ سَبَخَةٌ. فَلَمَّا أَتَاهُ النَّبِيُّ ﷺ قَالَ: إِلَيْكَ عَنِّي. فَوَاللَّهِ! لَقَدْ آذَانِي نَتْنُ حِمَارِكَ.", people: ['prophet-muhammad', 'abdullah-ibn-ubayy'],
          turns: [
            { text: "قِيلَ لِلنَّبِيِّ ﷺ: لَوْ أَتَيْتَ عَبْدَ اللَّهِ بْنَ أُبَيٍّ؟ قَالَ: فَانْطَلَقَ إِلَيْهِ. وَرَكِبَ حِمَارًا. وَانْطَلَقَ الْمُسْلِمُونَ. وَهِيَ أَرْضٌ سَبَخَةٌ." },
            { text: "فَلَمَّا أَتَاهُ النَّبِيُّ ﷺ قَالَ: إِلَيْكَ عَنِّي. فَوَاللَّهِ! لَقَدْ آذَانِي نَتْنُ حِمَارِكَ.", speaker: { person: "abdullah-ibn-ubayy", name: "ابن أبي" }, lead: "فَلَمَّا أَتَاهُ النَّبِيُّ ﷺ قَالَ:", witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 337, quote: "(النبي ﷺ قال) ابن أبي لرسول الله ﷺ: (إليك عني)", url: "https://shamela.ws/book/18268/8012" } },
          ] },
        { title: "ضرب بالجريد وبالأيدي وبالنعال", text: "قَالَ: فَقَالَ رَجُلٌ مِنْ الْأَنْصَارِ: وَاللَّهِ! لَحِمَارُ رَسُولِ اللَّهِ ﷺ أَطْيَبُ رِيحًا مِنْكَ. قَالَ: فَغَضِبَ لِعَبْدِ اللَّهِ رَجُلٌ مِنْ قَوْمِهِ. قَالَ: فَغَضِبَ لِكُلِّ وَاحِدٍ مِنْهُمَا أَصْحَابُهُ. قَالَ: فَكَانَ بَيْنَهُمْ ضَرْبٌ بِالْجَرِيدِ وَبِالْأَيْدِي وَبِالنِّعَالِ.", people: ['prophet-muhammad', 'abdullah-ibn-ubayy'],
          turns: [
            { text: "قَالَ: فَقَالَ رَجُلٌ مِنْ الْأَنْصَارِ: وَاللَّهِ! لَحِمَارُ رَسُولِ اللَّهِ ﷺ أَطْيَبُ رِيحًا مِنْكَ.", speaker: { name: "رجل من الأنصار" }, lead: "قَالَ: فَقَالَ رَجُلٌ مِنْ الْأَنْصَارِ:" },
            { text: "قَالَ: فَغَضِبَ لِعَبْدِ اللَّهِ رَجُلٌ مِنْ قَوْمِهِ. قَالَ: فَغَضِبَ لِكُلِّ وَاحِدٍ مِنْهُمَا أَصْحَابُهُ. قَالَ: فَكَانَ بَيْنَهُمْ ضَرْبٌ بِالْجَرِيدِ وَبِالْأَيْدِي وَبِالنِّعَالِ." },
          ] },
        { title: "«وإن طائفتان من المؤمنين اقتتلوا»", text: "قَالَ: فَبَلَغَنَا أَنَّهَا نَزَلَتْ فِيهِمْ: ﴿وَإِنْ طَائِفَتَانِ مِنَ الْمُؤْمِنِينَ اقْتَتَلُوا فأصلحوا بينهما﴾ [٤٩ /الحجرات /٩].", people: [],
          turns: [
            { text: "قَالَ: فَبَلَغَنَا أَنَّهَا نَزَلَتْ فِيهِمْ: ﴿وَإِنْ طَائِفَتَانِ مِنَ الْمُؤْمِنِينَ اقْتَتَلُوا فأصلحوا بينهما﴾ [٤٩ /الحجرات /٩]." },
          ] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theDonkeyAndIbnUbayy;
