import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Ansar gave the Prophet ﷺ palms until he took Qurayzah and al-Nadir; Anas's people sent him to ask for theirs back,
 * but the Prophet ﷺ had given them to Umm Ayman, who put her cloth round Anas's neck and refused, «كلا والذي لا إله إلا
 * هو», until he gave her about ten times as much. Told from Sahih al-Bukhari 4120 (al-Maghazi, the chapter on Banu
 * Qurayzah), whole.
 */
const ummAymanAndThePalms = {
  kind: 'EVENT',
  slug: 'umm-ayman-and-the-palms',
  name: "أم أيمن والنخلات",
  nameTransliterated: "Umm Ayman and the palms",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'anas-ibn-malik' }, { person: 'umm-ayman' }],
  reports: [
    {
      isnad: "حَدَّثَنَا ابْنُ أَبِي الْأَسْوَدِ: حَدَّثَنَا مُعْتَمِرٌ وَحَدَّثَنِي خَلِيفَةُ: حَدَّثَنَا مُعْتَمِرٌ قَالَ: سَمِعْتُ أَبِي، عَنْ أَنَسٍ  رضي الله عنه قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4120, url: 'https://sunnah.com/bukhari:4120' },
      moments: [
        { title: "يجعل للنبي ﷺ النخلات", text: "«كَانَ الرَّجُلُ يَجْعَلُ لِلنَّبِيِّ ﷺ النَّخَلَاتِ، حَتَّى افْتَتَحَ قُرَيْظَةَ وَالنَّضِيرَ، وَإِنَّ أَهْلِي أَمَرُونِي أَنْ آتِيَ النَّبِيَّ ﷺ فَأَسْأَلَهُ الَّذِينَ كَانُوا أَعْطَوْهُ أَوْ بَعْضَهُ، وَكَانَ النَّبِيُّ ﷺ قَدْ أَعْطَاهُ أُمَّ أَيْمَنَ،", people: ['prophet-muhammad', 'anas-ibn-malik'] },
        { title: "«كلا والذي لا إله إلا هو»", text: "فَجَاءَتْ أُمُّ أَيْمَنَ فَجَعَلَتِ الثَّوْبَ فِي عُنُقِي تَقُولُ: كَلَّا وَالَّذِي لَا إِلَهَ إِلَّا هُوَ لَا يُعْطِيكَهُمْ وَقَدْ أَعْطَانِيهَا، أَوْ كَمَا قَالَتْ، وَالنَّبِيُّ ﷺ يَقُولُ: لَكِ كَذَا. وَتَقُولُ: كَلَّا وَاللهِ، حَتَّى أَعْطَاهَا حَسِبْتُ أَنَّهُ قَالَ عَشَرَةَ أَمْثَالِهِ، أَوْ كَمَا قَالَ».", people: ['umm-ayman', 'prophet-muhammad', 'anas-ibn-malik'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default ummAymanAndThePalms;
