import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * At al-Hudaybiyah the lice fell from Ka'b ibn Ujrah's head onto his face; the Prophet ﷺ told him to shave, and Allah sent
 * down the ransom: three days of fasting, feeding six poor people, or a sheep. Told from Sahih al-Bukhari, each hadith
 * whole: 4159 first (al-Maghazi, the chapter on al-Hudaybiyah), the fullest; then 4191, which recites the ayah, and 4190.
 */
const kaabIbnUjrahAndTheFidyah = {
  kind: 'EVENT',
  slug: 'kaab-ibn-ujrah-and-the-fidyah',
  name: "كعب بن عجرة والفدية",
  nameTransliterated: "Ka'b ibn Ujrah and the ransom",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'kaab-ibn-ujrah' }],
  tags: ['HIS_WORDS', 'REVEALED_ABOUT'],
  ayat: [
    {
      kind: 'REVEALED_ABOUT',
      from: '2:196',
      to: '2:196',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 4191, url: 'https://sunnah.com/bukhari:4191', quote: "وَأُنْزِلَتْ هَذِهِ الْآيَةُ: ﴿فَمَنْ كَانَ مِنْكُمْ مَرِيضًا أَوْ بِهِ أَذًى مِنْ رَأْسِهِ فَفِدْيَةٌ مِنْ صِيَامٍ أَوْ صَدَقَةٍ أَوْ نُسُكٍ﴾" }],
    },
  ],
  reports: [
    {
      isnad: "حَدَّثَنَا الْحَسَنُ بْنُ خَلَفٍ قَالَ: حَدَّثَنَا إِسْحَاقُ بْنُ يُوسُفَ، عَنْ أَبِي بِشْرٍ وَرْقَاءَ، عَنِ ابْنِ أَبِي نَجِيحٍ، عَنْ مُجَاهِدٍ قَالَ: حَدَّثَنِي عَبْدُ الرَّحْمَنِ بْنُ أَبِي لَيْلَى، عَنْ كَعْبِ بْنِ عُجْرَةَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4159, url: 'https://sunnah.com/bukhari:4159' },
      moments: [
        { title: "«أيؤذيك هوامك؟»", text: "«أَنَّ رَسُولَ اللهِ ﷺ رَآهُ وَقَمْلُهُ يَسْقُطُ عَلَى وَجْهِهِ، فَقَالَ: أَيُؤْذِيكَ هَوَامُّكَ؟ قَالَ: نَعَمْ،", people: ['prophet-muhammad', 'kaab-ibn-ujrah'] },
        { title: "فأنزل الله الفدية", text: "فَأَمَرَهُ رَسُولُ اللهِ ﷺ أَنْ يَحْلِقَ، وَهُوَ بِالْحُدَيْبِيَةِ، لَمْ يُبَيِّنْ لَهُمْ أَنَّهُمْ يَحِلُّونَ بِهَا، وَهُمْ عَلَى طَمَعٍ أَنْ يَدْخُلُوا مَكَّةَ، فَأَنْزَلَ اللهُ الْفِدْيَةَ، فَأَمَرَهُ رَسُولُ اللهِ ﷺ: أَنْ يُطْعِمَ فَرَقًا بَيْنَ سِتَّةِ مَسَاكِينَ، أَوْ يُهْدِيَ شَاةً، أَوْ يَصُومَ ثَلَاثَةَ أَيَّامٍ.»", people: ['prophet-muhammad', 'kaab-ibn-ujrah'] },
      ],
    },
    {
      isnad: "حَدَّثَنِي مُحَمَّدُ بْنُ هِشَامٍ أَبُو عَبْدِ اللهِ: حَدَّثَنَا هُشَيْمٌ، عَنْ أَبِي بِشْرٍ، عَنْ مُجَاهِدٍ، عَنْ عَبْدِ الرَّحْمَنِ بْنِ أَبِي لَيْلَى، عَنْ كَعْبِ بْنِ عُجْرَةَ قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4191, url: 'https://sunnah.com/bukhari:4191' },
      moments: [
        { title: "جعلت الهوام تساقط على وجهي", text: "«كُنَّا مَعَ رَسُولِ اللهِ ﷺ بِالْحُدَيْبِيَةِ وَنَحْنُ مُحْرِمُونَ، وَقَدْ حَصَرَنَا الْمُشْرِكُونَ، قَالَ: وَكَانَتْ لِي وَفْرَةٌ، فَجَعَلَتِ الْهَوَامُّ تَسَّاقَطُ عَلَى وَجْهِي، فَمَرَّ بِي النَّبِيُّ ﷺ فَقَالَ: أَيُؤْذِيكَ هَوَامُّ رَأْسِكَ؟ قُلْتُ: نَعَمْ،", people: ['kaab-ibn-ujrah', 'prophet-muhammad'] },
        { title: "وأنزلت هذه الآية", text: "قَالَ: وَأُنْزِلَتْ هَذِهِ الْآيَةُ: ﴿فَمَنْ كَانَ مِنْكُمْ مَرِيضًا أَوْ بِهِ أَذًى مِنْ رَأْسِهِ فَفِدْيَةٌ مِنْ صِيَامٍ أَوْ صَدَقَةٍ أَوْ نُسُكٍ﴾.»", people: [] },
      ],
    },
    {
      isnad: "حَدَّثَنَا سُلَيْمَانُ بْنُ حَرْبٍ: حَدَّثَنَا حَمَّادُ بْنُ زَيْدٍ، عَنْ أَيُّوبَ، عَنْ مُجَاهِدٍ، عَنِ ابْنِ أَبِي لَيْلَى، عَنْ كَعْبِ بْنِ عُجْرَةَ  رضي الله عنه قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4190, url: 'https://sunnah.com/bukhari:4190' },
      moments: [
        { title: "«أيؤذيك هوام رأسك؟»", text: "«أَتَى عَلَيَّ النَّبِيُّ ﷺ زَمَنَ الْحُدَيْبِيَةِ، وَالْقَمْلُ يَتَنَاثَرُ عَلَى وَجْهِي، فَقَالَ: أَيُؤْذِيكَ هَوَامُّ رَأْسِكَ؟. قُلْتُ: نَعَمْ،", people: ['prophet-muhammad', 'kaab-ibn-ujrah'] },
        { title: "«فاحلق، وصم ثلاثة أيام»", text: "قَالَ: فَاحْلِقْ، وَصُمْ ثَلَاثَةَ أَيَّامٍ، أَوْ أَطْعِمْ سِتَّةَ مَسَاكِينَ، أَوِ انْسُكْ نَسِيكَةً». قَالَ أَيُّوبُ: لَا أَدْرِي بِأَيِّ هَذَا بَدَأَ.", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default kaabIbnUjrahAndTheFidyah;
