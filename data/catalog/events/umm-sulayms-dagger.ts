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
        { title: "«ما هذا الخنجر؟»", text: "أَنَّ أُمَّ سُلَيْمٍ اتَّخَذَتْ يَوْمَ حُنَيْنٍ خِنْجَرًا. فَكَانَ مَعَهَا. فَرَآهَا أَبُو طَلْحَةَ. فَقَالَ: يَا رَسُولَ اللَّهِ! هَذِهِ أُمُّ سُلَيْمٍ مَعَهَا خِنْجَرٌ. فَقَالَ لَهَا رَسُولُ اللَّهِ ﷺ (مَا هَذَا الْخِنْجَرُ؟) قَالَتْ: اتَّخَذْتُهُ. إِنْ دَنَا مِنِّي أَحَدٌ مِنَ الْمُشْرِكِينَ بَقَرْتُ بِهِ بَطْنَهُ.", people: ['umm-sulaym-al-ghumaysa', 'abu-talha-al-ansari', 'prophet-muhammad'] },
        { title: "«إن الله قد كفى وأحسن»", text: "فَجَعَلَ رَسُولُ اللَّهِ ﷺ يَضْحَكُ. قَالَتْ: يَا رَسُولَ اللَّهِ! اقْتُلْ مَنْ بَعْدَنَا مِنَ الطُّلَقَاءِ انْهَزَمُوا بِكَ. فَقَالَ رَسُولُ اللَّهِ ﷺ (يَا أُمَّ سُلَيْمٍ! إِنَّ اللَّهَ قَدْ كفى وأحسن).", people: ['umm-sulaym-al-ghumaysa', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default ummSulaymsDagger;
