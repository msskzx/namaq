import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Ansar gave the Prophet ﷺ palms until he took Qurayzah and al-Nadir; Anas's people sent him to ask for theirs back,
 * but the Prophet ﷺ had given them to Umm Ayman, who put her cloth round Anas's neck and refused, «كلا والذي لا إله إلا
 * هو», until he gave her about ten times as much. Told from Sahih al-Bukhari 4120 (al-Maghazi, the chapter on Banu
 * Qurayzah), whole.
 *
 * Then Anas's hadith in Sahih Muslim 1771 (al-Jihad, the muhajirun returning the Ansar's gifts), whole: Umm Sulaym's palms
 * given to Umm Ayman and given back after Khaybar, with al-Zuhri's note on Umm Ayman's life. Abd Allah ibn Abd al-Muttalib
 * is named in the note only as her first master and is not linked.
 */
const ummAymanAndThePalms = {
  kind: 'EVENT',
  slug: 'umm-ayman-and-the-palms',
  name: "أم أيمن والنخلات",
  nameTransliterated: "Umm Ayman and the palms",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'anas-ibn-malik' }, { person: 'umm-ayman' }, { person: 'umm-sulaym-al-ghumaysa' }, { person: 'amina-bint-wahb' }, { person: 'zaid-ibn-harithah' }],
  reports: [
    {
      isnad: "حَدَّثَنَا ابْنُ أَبِي الْأَسْوَدِ: حَدَّثَنَا مُعْتَمِرٌ وَحَدَّثَنِي خَلِيفَةُ: حَدَّثَنَا مُعْتَمِرٌ قَالَ: سَمِعْتُ أَبِي، عَنْ أَنَسٍ  رضي الله عنه قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4120, url: 'https://sunnah.com/bukhari:4120' },
      moments: [
        { title: "يجعل للنبي ﷺ النخلات", text: "«كَانَ الرَّجُلُ يَجْعَلُ لِلنَّبِيِّ ﷺ النَّخَلَاتِ، حَتَّى افْتَتَحَ قُرَيْظَةَ وَالنَّضِيرَ، وَإِنَّ أَهْلِي أَمَرُونِي أَنْ آتِيَ النَّبِيَّ ﷺ فَأَسْأَلَهُ الَّذِينَ كَانُوا أَعْطَوْهُ أَوْ بَعْضَهُ، وَكَانَ النَّبِيُّ ﷺ قَدْ أَعْطَاهُ أُمَّ أَيْمَنَ،", people: ['prophet-muhammad', 'anas-ibn-malik'] },
        { title: "«كلا والذي لا إله إلا هو»", text: "فَجَاءَتْ أُمُّ أَيْمَنَ فَجَعَلَتِ الثَّوْبَ فِي عُنُقِي تَقُولُ: كَلَّا وَالَّذِي لَا إِلَهَ إِلَّا هُوَ لَا يُعْطِيكَهُمْ وَقَدْ أَعْطَانِيهَا، أَوْ كَمَا قَالَتْ، وَالنَّبِيُّ ﷺ يَقُولُ: لَكِ كَذَا. وَتَقُولُ: كَلَّا وَاللهِ، حَتَّى أَعْطَاهَا حَسِبْتُ أَنَّهُ قَالَ عَشَرَةَ أَمْثَالِهِ، أَوْ كَمَا قَالَ».", people: ['umm-ayman', 'prophet-muhammad', 'anas-ibn-malik'] },
      ],
    },
    {
      isnad: "وحَدَّثَنِي أبو الطاهر وحرملة. قالا: أخبرنا ابن وهب. أَخْبَرَنِي يُونُسُ عَنْ ابْنِ شِهَابٍ، عَنْ أَنَسِ بْنِ مَالِكٍ. قَالَ:",
      source: { slug: 'sahih-muslim', hadith: 1771, url: 'https://sunnah.com/muslim:1771' },
      moments: [
        { title: "قاسمهم الأنصار", text: "لَمَّا قَدِمَ الْمُهَاجِرُونَ، مِنْ مَكَّةَ، الْمَدِينَةَ قَدِمُوا وَلَيْسَ بِأَيْدِيهِمْ شَيْءٌ. وَكَانَ الْأَنْصَارُ أَهْلَ الْأَرْضِ وَالْعَقَارِ. فَقَاسَمَهُمْ الْأَنْصَارُ عَلَى أَنْ أَعْطَوْهُمْ أَنْصَافَ ثِمَارِ أَمْوَالِهِمْ، كُلَّ عَامٍ. ويكفونهم العمل والمؤونة. وكانت أم أنس ابن مَالِكٍ، وَهِيَ تُدْعَى أُمَّ سُلَيْمٍ، وَكَانَتْ أُمُّ عبد الله بن أبي طلحة، وكان أَخًا لِأَنَسٍ لِأُمِّهِ، وَكَانَتْ أَعْطَتْ أُمُّ أَنَسٍ رَسُولَ اللَّهِ ﷺ عِذَاقًا لَهَا. فَأَعْطَاهَا رَسُولُ اللَّهِ ﷺ أُمَّ أَيْمَنَ، مَوْلَاتَهُ، أُمَّ أُسَامَةَ بْنِ زَيْدٍ.", people: ['umm-sulaym-al-ghumaysa', 'prophet-muhammad', 'umm-ayman'] },
        { title: "رد المهاجرون إلى الأنصار منائحهم", text: "قَالَ ابْنُ شِهَابٍ: فَأَخْبَرَنِي أَنَسُ بْنُ مالك؛ أن رسول الله ﷺ لَمَّا فَرَغَ مِنْ قِتَالِ أَهْلِ خَيْبَرَ. وَانْصَرَفَ إِلَى الْمَدِينَةِ. رَدَّ الْمُهَاجِرُونَ إِلَى الْأَنْصَارِ مَنَائِحَهُمُ الَّتِي كَانُوا مَنَحُوهُمْ مِنْ ثِمَارِهِمْ. قَالَ: فَرَدَّ رَسُولُ اللَّهِ ﷺ إِلَى أُمِّي عِذَاقَهَا. وَأَعْطَى رَسُولُ اللَّهِ ﷺ أُمَّ أَيْمَنَ مَكَانَهُنَّ مِنْ حَائِطِهِ.", people: ['prophet-muhammad', 'umm-sulaym-al-ghumaysa', 'umm-ayman'] },
        { title: "من شأن أم أيمن", text: "قَالَ ابْنُ شِهَابٍ: وَكَانَ مِنْ شَأْنِ أُمِّ أَيْمَنَ، أُمِّ أُسَامَةَ بْنِ زَيْدٍ؛ أَنَّهَا كَانَتْ وَصِيفَةً لِعَبْدِ اللَّهِ بْنِ عَبْدِ الْمُطَّلِبِ. وَكَانَتْ مِنْ الْحَبَشَةِ. فَلَمَّا وَلَدَتْ آمِنَةُ رَسُولَ اللَّهِ ﷺ، بَعْدَ مَا تُوُفِّيَ أَبُوهُ، فَكَانَتْ أُمُّ أَيْمَنَ تَحْضُنُهُ، حَتَّى كَبَّرَ رَسُولُ اللَّهِ ﷺ. فَأَعْتَقَهَا. ثُمَّ أَنْكَحَهَا زَيْدَ بْنَ حَارِثَةَ. ثُمَّ تُوُفِّيَتْ بَعْدَ مَا تُوُفِّيَ رَسُولُ اللَّهِ ﷺ بخمسة أشهر.", people: ['umm-ayman', 'amina-bint-wahb', 'prophet-muhammad', 'zaid-ibn-harithah'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default ummAymanAndThePalms;
