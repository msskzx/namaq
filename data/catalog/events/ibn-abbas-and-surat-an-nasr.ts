import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Umar brought the young Ibn Abbas into the gathering of the elders of Badr; when some objected he asked them about «إذا جاء
 * نصر الله والفتح», and Ibn Abbas said it was the Prophet's term made known to him, and Umar said «ما أعلم منها إلا ما
 * تعلم». Told from Sahih al-Bukhari 4294 (al-Maghazi, the chapter on the conquest) first, whole; then 4430 (the illness
 * of the Prophet ﷺ), whole, which names Abd al-Rahman ibn Awf as the one who objected. Ibn Abbas has no catalog subject.
 */
const ibnAbbasAndSuratAnNasr = {
  kind: 'EVENT',
  slug: 'ibn-abbas-and-surat-an-nasr',
  name: "ابن عباس وسورة النصر",
  nameTransliterated: "Ibn Abbas and Surat al-Nasr",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'umar-ibn-al-khattab' }, { person: 'abdur-rahman-ibn-awf' }],
  ayat: [
    {
      kind: 'RECITED',
      from: '110:1',
      to: '110:3',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 4294, url: 'https://sunnah.com/bukhari:4294', quote: "فَقَالَ: مَا تَقُولُونَ: ﴿إِذَا جَاءَ نَصْرُ اللهِ وَالْفَتْحُ * وَرَأَيْتَ النَّاسَ يَدْخُلُونَ﴾ حَتَّى خَتَمَ السُّورَةَ" }],
    },
  ],
  reports: [
    {
      isnad: "حَدَّثَنَا أَبُو النُّعْمَانِ: حَدَّثَنَا أَبُو عَوَانَةَ، عَنْ أَبِي بِشْرٍ، عَنْ سَعِيدِ بْنِ جُبَيْرٍ، عَنِ ابْنِ عَبَّاسٍ  رضي الله عنهما قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4294, url: 'https://sunnah.com/bukhari:4294' },
      moments: [
        { title: "«لم تدخل هذا الفتى معنا»", text: "«كَانَ عُمَرُ يُدْخِلُنِي مَعَ أَشْيَاخِ بَدْرٍ، فَقَالَ بَعْضُهُمْ: لِمَ تُدْخِلُ هَذَا الْفَتَى مَعَنَا وَلَنَا أَبْنَاءٌ مِثْلُهُ؟ فَقَالَ: إِنَّهُ مِمَّنْ قَدْ عَلِمْتُمْ، قَالَ: فَدَعَاهُمْ ذَاتَ يَوْمٍ وَدَعَانِي مَعَهُمْ، قَالَ: وَمَا رُؤِيتُهُ دَعَانِي يَوْمَئِذٍ إِلَّا لِيُرِيَهُمْ مِنِّي،", people: ['umar-ibn-al-khattab'] },
        { title: "سألهم عن السورة", text: "فَقَالَ: مَا تَقُولُونَ: ﴿إِذَا جَاءَ نَصْرُ اللهِ وَالْفَتْحُ * وَرَأَيْتَ النَّاسَ يَدْخُلُونَ﴾ حَتَّى خَتَمَ السُّورَةَ، فَقَالَ بَعْضُهُمْ: أُمِرْنَا أَنْ نَحْمَدَ اللهَ وَنَسْتَغْفِرَهُ إِذَا نُصِرْنَا وَفُتِحَ عَلَيْنَا، وَقَالَ بَعْضُهُمْ: لَا نَدْرِي، أَوْ لَمْ يَقُلْ بَعْضُهُمْ شَيْئًا،", people: ['umar-ibn-al-khattab'] },
        { title: "«ما أعلم منها إلا ما تعلم»", text: "فَقَالَ لِي: يَا ابْنَ عَبَّاسٍ، أَكَذَاكَ تَقُولُ؟ قُلْتُ: لَا، قَالَ: فَمَا تَقُولُ؟ قُلْتُ: هُوَ أَجَلُ رَسُولِ اللهِ ﷺ أَعْلَمَهُ اللهُ لَهُ: ﴿إِذَا جَاءَ نَصْرُ اللهِ وَالْفَتْحُ﴾ فَتْحُ مَكَّةَ، فَذَاكَ عَلَامَةُ أَجَلِكَ: ﴿فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا﴾ قَالَ عُمَرُ: مَا أَعْلَمُ مِنْهَا إِلَّا مَا تَعْلَمُ».", people: ['umar-ibn-al-khattab'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا مُحَمَّدُ بْنُ عَرْعَرَةَ، حَدَّثَنَا شُعْبَةُ، عَنْ أَبِي بِشْرٍ، عَنْ سَعِيدِ بْنِ جُبَيْرٍ، عَنِ ابْنِ عَبَّاسٍ قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4430, url: 'https://sunnah.com/bukhari:4430' },
      moments: [
        { title: "«إن لنا أبناء مثله»", text: "«كَانَ عُمَرُ بْنُ الْخَطَّابِ رضي الله عنه يُدْنِي ابْنَ عَبَّاسٍ، فَقَالَ لَهُ عَبْدُ الرَّحْمَنِ بْنُ عَوْفٍ: إِنَّ لَنَا أَبْنَاءً مِثْلَهُ، فَقَالَ: إِنَّهُ مِنْ حَيْثُ تَعْلَمُ،", people: ['umar-ibn-al-khattab', 'abdur-rahman-ibn-awf'] },
        { title: "«ما أعلم منها إلا ما تعلم»", text: "فَسَأَلَ عُمَرُ ابْنَ عَبَّاسٍ، عَنْ هَذِهِ الْآيَةِ: ﴿إِذَا جَاءَ نَصْرُ اللهِ وَالْفَتْحُ﴾ فَقَالَ: أَجَلُ رَسُولِ اللهِ ﷺ أَعْلَمَهُ إِيَّاهُ، فَقَالَ: مَا أَعْلَمُ مِنْهَا إِلَّا مَا تَعْلَمُ».", people: ['umar-ibn-al-khattab'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default ibnAbbasAndSuratAnNasr;
