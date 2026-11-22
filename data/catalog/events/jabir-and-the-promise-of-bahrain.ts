import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ promised Jabir three handfuls if the wealth of Bahrain came; it came after his death, and Abu Bakr had it
 * called that anyone owed by the Prophet ﷺ should come; Jabir came and was given, asked again three times and was refused,
 * and Abu Bakr said «وأي داء أدوأ من البخل» and that he had meant to give him each time. Told from Sahih al-Bukhari 4383
 * (al-Maghazi, the story of Oman and Bahrain), whole, with Muhammad ibn Ali's route at its end («خذ مثلها مرتين»).
 */
const jabirAndThePromiseOfBahrain = {
  kind: 'EVENT',
  slug: 'jabir-and-the-promise-of-bahrain',
  name: "جابر ووعد مال البحرين",
  nameTransliterated: "Jabir and the promise of Bahrain's wealth",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'jabir-ibn-abdullah' }, { person: 'abu-bakr-as-siddiq' }],
  reports: [
    {
      isnad: "حَدَّثَنَا قُتَيْبَةُ بْنُ سَعِيدٍ: حَدَّثَنَا سُفْيَانُ: سَمِعَ ابْنُ الْمُنْكَدِرِ جَابِرَ بْنَ عَبْدِ اللهِ  رضي الله عنهما يَقُولُ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4383, url: 'https://sunnah.com/bukhari:4383' },
      moments: [
        { title: "«لو قد جاء مال البحرين»", text: "«قَالَ لِي رَسُولُ اللهِ ﷺ: لَوْ قَدْ جَاءَ مَالُ الْبَحْرَيْنِ، لَقَدْ أَعْطَيْتُكَ هَكَذَا وَهَكَذَا ثَلَاثًا، فَلَمْ يَقْدَمْ مَالُ الْبَحْرَيْنِ حَتَّى قُبِضَ رَسُولُ اللهِ ﷺ،", people: ['prophet-muhammad', 'jabir-ibn-abdullah'] },
        { title: "فأعطاني", text: "فَلَمَّا قَدِمَ عَلَى أَبِي بَكْرٍ، أَمَرَ مُنَادِيًا فَنَادَى مَنْ كَانَ لَهُ عِنْدَ النَّبِيِّ ﷺ دَيْنٌ أَوْ عِدَةٌ فَلْيَأْتِنِي، قَالَ جَابِرٌ: فَجِئْتُ أَبَا بَكْرٍ، فَأَخْبَرْتُهُ أَنَّ النَّبِيَّ ﷺ قَالَ: لَوْ جَاءَ مَالُ الْبَحْرَيْنِ أَعْطَيْتُكَ هَكَذَا وَهَكَذَا ثَلَاثًا، قَالَ: فَأَعْطَانِي،", people: ['abu-bakr-as-siddiq', 'jabir-ibn-abdullah', 'prophet-muhammad'] },
        { title: "«وأي داء أدوأ من البخل»", text: "قَالَ: جَابِرٌ: فَلَقِيتُ أَبَا بَكْرٍ بَعْدَ ذَلِكَ، فَسَأَلْتُهُ، فَلَمْ يُعْطِنِي، ثُمَّ أَتَيْتُهُ، فَلَمْ يُعْطِنِي، ثُمَّ أَتَيْتُهُ الثَّالِثَةَ، فَلَمْ يُعْطِنِي، فَقُلْتُ لَهُ: قَدْ أَتَيْتُكَ، فَلَمْ تُعْطِنِي، ثُمَّ أَتَيْتُكَ، فَلَمْ تُعْطِنِي، ثُمَّ أَتَيْتُكَ، فَلَمْ تُعْطِنِي، فَإِمَّا أَنْ تُعْطِيَنِي وَإِمَّا أَنْ تَبْخَلَ عَنِّي، فَقَالَ: أَقُلْتَ: تَبْخَلُ عَنِّي، وَأَيُّ دَاءٍ أَدْوَأُ مِنَ الْبُخْلِ، قَالَهَا ثَلَاثًا، مَا مَنَعْتُكَ مِنْ مَرَّةٍ إِلَّا وَأَنَا أُرِيدُ أَنْ أُعْطِيَكَ،»", people: ['jabir-ibn-abdullah', 'abu-bakr-as-siddiq'] },
        { title: "«خذ مثلها مرتين»", text: "وَعَنْ عَمْرٍو، عَنْ مُحَمَّدِ بْنِ عَلِيٍّ سَمِعْتُ جَابِرَ بْنَ عَبْدِ اللهِ يَقُولُ: جِئْتُهُ، فَقَالَ لِي أَبُو بَكْرٍ: عُدَّهَا، فَعَدَدْتُهَا فَوَجَدْتُهَا خَمْسَمِائَةٍ، فَقَالَ: خُذْ مِثْلَهَا مَرَّتَيْنِ.", people: ['jabir-ibn-abdullah', 'abu-bakr-as-siddiq'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default jabirAndThePromiseOfBahrain;
