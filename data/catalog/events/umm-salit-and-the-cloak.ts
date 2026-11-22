import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Umar was dividing cloaks among the women of Medina and one fine one was left; those with him said to give it to Umm Kulthum
 * bint Ali, and he gave it to Umm Salit of the Ansar, «فإنها كانت تزفر لنا القرب يوم أحد». Told from Sahih al-Bukhari 4071
 * (al-Maghazi, the chapter on the women carrying water at Uhud), whole. Umm Salit has no catalog subject and is not linked.
 */
const ummSalitAndTheCloak = {
  kind: 'EVENT',
  slug: 'umm-salit-and-the-cloak',
  name: "أم سليط والمرط",
  nameTransliterated: "Umm Salit and the cloak",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'umar-ibn-al-khattab' }, { person: 'prophet-muhammad' }, { person: 'umm-kulthum-bint-ali' }],
  reports: [
    {
      isnad: "حَدَّثَنَا يَحْيَى بْنُ بُكَيْرٍ: حَدَّثَنَا اللَّيْثُ، عَنْ يُونُسَ، عَنِ ابْنِ شِهَابٍ وَقَالَ ثَعْلَبَةُ بْنُ أَبِي مَالِكٍ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4071, url: 'https://sunnah.com/bukhari:4071' },
      moments: [
        { title: "«أعط هذا بنت رسول الله ﷺ التي عندك»", text: "«إِنَّ عُمَرَ بْنَ الْخَطَّابِ رضي الله عنه قَسَمَ مُرُوطًا بَيْنَ نِسَاءٍ مِنْ نِسَاءِ أَهْلِ الْمَدِينَةِ، فَبَقِيَ مِنْهَا مِرْطٌ جَيِّدٌ، فَقَالَ لَهُ بَعْضُ مَنْ عِنْدَهُ: يَا أَمِيرَ الْمُؤْمِنِينَ، أَعْطِ هَذَا بِنْتَ رَسُولِ اللهِ ﷺ الَّتِي عِنْدَكَ، يُرِيدُونَ أُمَّ كُلْثُومٍ بِنْتَ عَلِيٍّ،", people: ['umar-ibn-al-khattab', 'prophet-muhammad', 'umm-kulthum-bint-ali'] },
        { title: "«كانت تزفر لنا القرب يوم أحد»", text: "فَقَالَ عُمَرُ: أُمُّ سَلِيطٍ أَحَقُّ بِهِ وَأُمُّ سَلِيطٍ مِنْ نِسَاءِ الْأَنْصَارِ، مِمَّنْ بَايَعَ رَسُولَ اللهِ ﷺ، قَالَ عُمَرُ: فَإِنَّهَا كَانَتْ تُزْفِرُ لَنَا الْقِرَبَ يَوْمَ أُحُدٍ.»", people: ['umar-ibn-al-khattab', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default ummSalitAndTheCloak;
