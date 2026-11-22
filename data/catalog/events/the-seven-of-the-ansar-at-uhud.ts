import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * At Uhud the Prophet ﷺ was left with seven of the Ansar and two of Quraysh; each time the enemy pressed he asked who would
 * drive them off for Paradise, and one of the Ansar went forward and was killed, until all seven were; then he said to his
 * two companions «ما أنصفنا أصحابنا». Told from Sahih Muslim 1789 (al-Jihad, the chapter on Uhud), whole.
 */
const theSevenOfTheAnsarAtUhud = {
  kind: 'EVENT',
  slug: 'the-seven-of-the-ansar-at-uhud',
  name: "السبعة من الأنصار يوم أحد",
  nameTransliterated: "The seven of the Ansar at Uhud",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "وحَدَّثَنَا هَدَّابُ بْنُ خَالِدٍ الأَزْدِيُّ. حَدَّثَنَا حَمَّادُ بْنُ سَلَمَةَ عَنْ عَلِيِّ بن زيد وثابت البناتي، عن أنس بن مالك؛",
      source: { slug: 'sahih-muslim', hadith: 1789, url: 'https://sunnah.com/muslim:1789' },
      moments: [
        { title: "«من يردهم عنا وله الجنة»", text: "أن رسول الله ﷺ أُفْرِدَ يَوْمَ أُحُدٍ فِي سَبْعَةٍ مِنْ الْأَنْصَارِ وَرَجُلَيْنِ مِنْ قُرَيْشٍ. فَلَمَّا رَهِقُوهُ قَالَ (مَنْ يَرُدُّهُمْ عَنَّا وَلَهُ الْجَنَّةُ، أَوْ هُوَ رَفِيقِي فِي الْجَنَّةِ؟) فَتَقَدَّمَ رَجُلٌ مِنْ الْأَنْصَارِ، فَقَاتَلَ حَتَّى قُتِلَ. ثُمَّ رَهِقُوهُ أَيْضًا. فَقَالَ (مَنْ يَرُدُّهُمْ عَنَّا وَلَهُ الْجَنَّةُ، أَوْ هُوَ رَفِيقِي فِي الْجَنَّةِ؟) فَتَقَدَّمَ رَجُلٌ، مِنْ الْأَنْصَارِ، فَقَاتَلَ حَتَّى قُتِلَ.", people: ['prophet-muhammad'],
          turns: [
            { text: "أن رسول الله ﷺ أُفْرِدَ يَوْمَ أُحُدٍ فِي سَبْعَةٍ مِنْ الْأَنْصَارِ وَرَجُلَيْنِ مِنْ قُرَيْشٍ. فَلَمَّا رَهِقُوهُ" },
            { text: "قَالَ (مَنْ يَرُدُّهُمْ عَنَّا وَلَهُ الْجَنَّةُ، أَوْ هُوَ رَفِيقِي فِي الْجَنَّةِ؟)", speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: "قَالَ", witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 308, quote: "(قال) رسول الله ﷺ: (من يردهم)", url: "https://shamela.ws/book/18268/7983" } },
            { text: "فَتَقَدَّمَ رَجُلٌ مِنْ الْأَنْصَارِ، فَقَاتَلَ حَتَّى قُتِلَ. ثُمَّ رَهِقُوهُ أَيْضًا." },
            { text: "فَقَالَ (مَنْ يَرُدُّهُمْ عَنَّا وَلَهُ الْجَنَّةُ، أَوْ هُوَ رَفِيقِي فِي الْجَنَّةِ؟)", speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: "فَقَالَ", witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 309, quote: "(فقال) رسول الله ﷺ: (من يردهم عنا", url: "https://shamela.ws/book/18268/7984" } },
            { text: "فَتَقَدَّمَ رَجُلٌ، مِنْ الْأَنْصَارِ، فَقَاتَلَ حَتَّى قُتِلَ." },
          ] },
        { title: "«ما أنصفنا أصحابنا»", text: "فَلَمْ يَزَلْ كَذَلِكَ حَتَّى قُتِلَ السَّبْعَةُ. فَقَالَ رَسُولُ اللَّهِ ﷺ لِصَاحِبَيْهِ (مَا أنصفنا أصحابنا).", people: ['prophet-muhammad'],
          turns: [
            { text: "فَلَمْ يَزَلْ كَذَلِكَ حَتَّى قُتِلَ السَّبْعَةُ." },
            { text: "فَقَالَ رَسُولُ اللَّهِ ﷺ لِصَاحِبَيْهِ (مَا أنصفنا أصحابنا).", speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: "فَقَالَ رَسُولُ اللَّهِ ﷺ لِصَاحِبَيْهِ" },
          ] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theSevenOfTheAnsarAtUhud;
