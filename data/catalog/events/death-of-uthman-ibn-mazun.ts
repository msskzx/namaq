import type { CatalogEvent } from '@/lib/catalog/types';

// Shortly after Badr. The chapter gives his rank among the first Muslims and
// his manner rather than a cause. Told as a story from Sahih al-Bukhari 3929 (Umm al-Ala), whole; Umm
// al-Ala has no catalog subject and is not linked.
const deathOfUthmanIbnMazun = {
  kind: 'EVENT',
  slug: 'death-of-uthman-ibn-mazun',
  name: 'وفاة عثمان بن مظعون',
  nameTransliterated: 'The Death of Uthman ibn Mazun',
  type: 'DEATH',
  fields: {
    hijriYear: { value: 2, claims: ['ibn-mazun/death'] },
    description: {
      value:
        'توفي بعد بدر بيسير، وهو أحد السابقين، أسلم بعد ثلاثة عشر رجلا، وهاجر إلى الحبشة الهجرة الأولى، وكان صواما قواما قانتا لله.',
      claims: ['ibn-mazun/death'],
    },
  },
  people: [{ person: 'uthman-ibn-mazun', claims: ['ibn-mazun/death'] }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا مُوسَى بْنُ إِسْمَاعِيلَ: حَدَّثَنَا إِبْرَاهِيمُ بْنُ سَعْدٍ: أَخْبَرَنَا ابْنُ شِهَابٍ، عَنْ خَارِجَةَ بْنِ زَيْدِ بْنِ ثَابِتٍ: أَنَّ أُمَّ الْعَلَاءِ، امْرَأَةً مِنْ نِسَائِهِمْ بَايَعَتِ النَّبِيَّ ﷺ، أَخْبَرَتْهُ:",
      source: { slug: 'sahih-al-bukhari', hadith: 3929, url: 'https://sunnah.com/bukhari:3929' },
      moments: [
        { title: "طار لهم في السكنى", text: "«أَنَّ عُثْمَانَ بْنَ مَظْعُونٍ طَارَ لَهُمْ فِي السُّكْنَى، حِينَ اقْتَرَعَتِ الْأَنْصَارُ عَلَى سُكْنَى الْمُهَاجِرِينَ،", people: ['uthman-ibn-mazun'] },
        { title: "«لقد أكرمك الله»", text: "قَالَتْ أُمُّ الْعَلَاءِ: فَاشْتَكَى عُثْمَانُ عِنْدَنَا فَمَرَّضْتُهُ، حَتَّى تُوُفِّيَ وَجَعَلْنَاهُ فِي أَثْوَابِهِ، فَدَخَلَ عَلَيْنَا النَّبِيُّ ﷺ، فَقُلْتُ: رَحْمَةُ اللهِ عَلَيْكَ أَبَا السَّائِبِ، شَهَادَتِي عَلَيْكَ لَقَدْ أَكْرَمَكَ اللهُ،", people: ['uthman-ibn-mazun', 'prophet-muhammad'] },
        { title: "«وما يدريك أن الله أكرمه»", text: "فَقَالَ النَّبِيُّ ﷺ: وَمَا يُدْرِيكِ أَنَّ اللهَ أَكْرَمَهُ قَالَتْ: قُلْتُ: لَا أَدْرِي، بِأَبِي أَنْتَ وَأُمِّي يَا رَسُولَ اللهِ، فَمَنْ؟ قَالَ: أَمَّا هُوَ فَقَدْ جَاءَهُ وَاللهِ الْيَقِينُ، وَاللهِ إِنِّي لَأَرْجُو لَهُ الْخَيْرَ، وَمَا أَدْرِي وَاللهِ وَأَنَا رَسُولُ اللهِ مَا يُفْعَلُ بِي قَالَتْ: فَوَاللهِ لَا أُزَكِّي أَحَدًا بَعْدَهُ،", people: ['prophet-muhammad', 'uthman-ibn-mazun'] },
        { title: "«ذلك عمله»", text: "قَالَتْ: فَأَحْزَنَنِي ذَلِكَ، فَنِمْتُ، فَأُرِيتُ لِعُثْمَانَ بْنِ مَظْعُونٍ عَيْنًا تَجْرِي، فَجِئْتُ رَسُولَ اللهِ ﷺ فَأَخْبَرْتُهُ، فَقَالَ: ذَلِكِ عَمَلُهُ».", people: ['uthman-ibn-mazun', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default deathOfUthmanIbnMazun;
