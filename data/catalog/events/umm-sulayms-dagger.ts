import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * At Hunayn Umm Sulaym carried a dagger; Abu Talhah told the Prophet ﷺ, she said it was for the belly of any mushrik who
 * came near her, he laughed, and when she asked him to kill the freedmen who had fled he said «يا أم سليم! إن الله قد كفى
 * وأحسن». Told from Sahih Muslim 1809 (al-Jihad, women going out with the men), the first of its routes, whole.
 */
const ummSulaymsDagger = {
  kind: 'EVENT',
  slug: 'umm-sulayms-dagger',
  name: "خنجر أم سليم يوم حنين",
  nameTransliterated: "Umm Sulaym's dagger at Hunayn",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'umm-sulaym-al-ghumaysa' }, { person: 'abu-talha-al-ansari' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا أَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ. حَدَّثَنَا يَزِيدُ بْنُ هَارُونَ. أَخْبَرَنَا حَمَّادُ بْنُ سَلَمَةَ عَنْ ثَابِتٍ، عَنْ أَنَسٍ؛",
      source: { slug: 'sahih-muslim', hadith: 1809, url: 'https://sunnah.com/muslim:1809' },
      moments: [
        { title: "«ما هذا الخنجر؟»", text: "أَنَّ أُمَّ سُلَيْمٍ اتَّخَذَتْ يَوْمَ حُنَيْنٍ خِنْجَرًا. فَكَانَ مَعَهَا. فَرَآهَا أَبُو طَلْحَةَ. فَقَالَ: يَا رَسُولَ اللَّهِ! هَذِهِ أُمُّ سُلَيْمٍ مَعَهَا خِنْجَرٌ. فَقَالَ لَهَا رَسُولُ اللَّهِ ﷺ (مَا هَذَا الْخِنْجَرُ؟) قَالَتْ: اتَّخَذْتُهُ. إِنْ دَنَا مِنِّي أَحَدٌ مِنَ الْمُشْرِكِينَ بَقَرْتُ بِهِ بَطْنَهُ.", people: ['umm-sulaym-al-ghumaysa', 'abu-talha-al-ansari', 'prophet-muhammad'],
          turns: [
            { text: "أَنَّ أُمَّ سُلَيْمٍ اتَّخَذَتْ يَوْمَ حُنَيْنٍ خِنْجَرًا. فَكَانَ مَعَهَا." },
            { text: "فَرَآهَا أَبُو طَلْحَةَ. فَقَالَ: يَا رَسُولَ اللَّهِ! هَذِهِ أُمُّ سُلَيْمٍ مَعَهَا خِنْجَرٌ.", speaker: { person: "abu-talha-al-ansari", name: "أبو طلحة" }, lead: "فَرَآهَا أَبُو طَلْحَةَ. فَقَالَ:" },
            { text: "فَقَالَ لَهَا رَسُولُ اللَّهِ ﷺ (مَا هَذَا الْخِنْجَرُ؟)", speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: "فَقَالَ لَهَا رَسُولُ اللَّهِ ﷺ" },
            { text: "قَالَتْ: اتَّخَذْتُهُ. إِنْ دَنَا مِنِّي أَحَدٌ مِنَ الْمُشْرِكِينَ بَقَرْتُ بِهِ بَطْنَهُ.", speaker: { person: "umm-sulaym-al-ghumaysa", name: "أم سليم" }, lead: "قَالَتْ:", witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 403, quote: "(قالت) أم سليم: (اتخذته)", url: "https://shamela.ws/book/18268/8078" } },
          ] },
        { title: "«إن الله قد كفى وأحسن»", text: "فَجَعَلَ رَسُولُ اللَّهِ ﷺ يَضْحَكُ. قَالَتْ: يَا رَسُولَ اللَّهِ! اقْتُلْ مَنْ بَعْدَنَا مِنَ الطُّلَقَاءِ انْهَزَمُوا بِكَ. فَقَالَ رَسُولُ اللَّهِ ﷺ (يَا أُمَّ سُلَيْمٍ! إِنَّ اللَّهَ قَدْ كفى وأحسن).", people: ['umm-sulaym-al-ghumaysa', 'prophet-muhammad'],
          turns: [
            { text: "فَجَعَلَ رَسُولُ اللَّهِ ﷺ يَضْحَكُ." },
            { text: "قَالَتْ: يَا رَسُولَ اللَّهِ! اقْتُلْ مَنْ بَعْدَنَا مِنَ الطُّلَقَاءِ انْهَزَمُوا بِكَ.", speaker: { person: "umm-sulaym-al-ghumaysa", name: "أم سليم" }, lead: "قَالَتْ:", witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 404, quote: "فزعمت أم سليم أنهم انهزموا في حنين لأجل ضعف إسلامهم فاعتقدت أم سليم أنهم منافقون وأنهم استحقوا القتل بانهزامهم واقترحت قتلهم من النبي ﷺ", url: "https://shamela.ws/book/18268/8079" } },
            { text: "فَقَالَ رَسُولُ اللَّهِ ﷺ (يَا أُمَّ سُلَيْمٍ! إِنَّ اللَّهَ قَدْ كفى وأحسن).", speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: "فَقَالَ رَسُولُ اللَّهِ ﷺ" },
          ] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default ummSulaymsDagger;
