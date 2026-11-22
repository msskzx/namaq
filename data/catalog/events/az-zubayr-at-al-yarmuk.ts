import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * At al-Yarmuk al-Zubayr charged through the Roman ranks alone and came back with two sword blows on his shoulder, with a
 * Badr wound between them, in which Urwah as a boy would put his fingers. Told from Sahih al-Bukhari (al-Maghazi, in the
 * chapters on Badr), each hadith whole: 3975, the charge, first; then 3973, his wounds and his sword, which Abd al-Malik
 * ibn Marwan asked Urwah about after Abd Allah ibn al-Zubayr was killed. 3974 (his sword was decorated with silver) is not
 * a story. Abd Allah ibn al-Zubayr and Abd al-Malik have no catalog subject and are not linked.
 */
const azZubayrAtAlYarmuk = {
  kind: 'EVENT',
  slug: 'az-zubayr-at-al-yarmuk',
  name: "الزبير يوم اليرموك",
  nameTransliterated: "Al-Zubayr at al-Yarmuk",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'az-zubayr-ibn-al-awwam' }],
  reports: [
    {
      isnad: "حَدَّثَنَا أَحْمَدُ بْنُ مُحَمَّدٍ: حَدَّثَنَا عَبْدُ اللهِ: أَخْبَرَنَا هِشَامُ بْنُ عُرْوَةَ، عَنْ أَبِيهِ:",
      source: { slug: 'sahih-al-bukhari', hadith: 3975, url: 'https://sunnah.com/bukhari:3975' },
      moments: [
        { title: "«ألا تشد فنشد معك؟»", text: "«أَنَّ أَصْحَابَ رَسُولِ اللهِ ﷺ قَالُوا لِلزُّبَيْرِ يَوْمَ الْيَرْمُوكِ: أَلَا تَشُدُّ فَنَشُدَّ مَعَكَ؟ فَقَالَ: إِنِّي إِنْ شَدَدْتُ كَذَبْتُمْ، فَقَالُوا: لَا نَفْعَلُ، فَحَمَلَ عَلَيْهِمْ حَتَّى شَقَّ صُفُوفَهُمْ، فَجَاوَزَهُمْ وَمَا مَعَهُ أَحَدٌ،", people: ['az-zubayr-ibn-al-awwam'] },
        { title: "ضربتين على عاتقه", text: "ثُمَّ رَجَعَ مُقْبِلًا، فَأَخَذُوا بِلِجَامِهِ، فَضَرَبُوهُ ضَرْبَتَيْنِ عَلَى عَاتِقِهِ، بَيْنَهُمَا ضَرْبَةٌ ضُرِبَهَا يَوْمَ بَدْرٍ قَالَ عُرْوَةُ: كُنْتُ أُدْخِلُ أَصَابِعِي فِي تِلْكَ الضَّرَبَاتِ أَلْعَبُ وَأَنَا صَغِيرٌ.", people: ['az-zubayr-ibn-al-awwam'] },
        { title: "وهو ابن عشر سنين", text: "قَالَ عُرْوَةُ: وَكَانَ مَعَهُ عَبْدُ اللهِ بْنُ الزُّبَيْرِ يَوْمَئِذٍ، وَهُوَ ابْنُ عَشْرِ سِنِينَ، فَحَمَلَهُ عَلَى فَرَسٍ، وَكَّلَ بِهِ رَجُلًا».", people: ['az-zubayr-ibn-al-awwam'] },
      ],
    },
    {
      isnad: "أَخْبَرَنِي إِبْرَاهِيمُ   بْنُ مُوسَى: حَدَّثَنَا هِشَامُ بْنُ يُوسُفَ، عَنْ مَعْمَرٍ، عَنْ هِشَامٍ، عَنْ عُرْوَةَ قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 3973, url: 'https://sunnah.com/bukhari:3973' },
      moments: [
        { title: "ثلاث ضربات بالسيف", text: "«كَانَ فِي الزُّبَيْرِ ثَلَاثُ ضَرَبَاتٍ بِالسَّيْفِ، إِحْدَاهُنَّ فِي عَاتِقِهِ، قَالَ: إِنْ كُنْتُ لَأُدْخِلُ أَصَابِعِي فِيهَا. قَالَ: ضُرِبَ ثِنْتَيْنِ يَوْمَ بَدْرٍ، وَوَاحِدَةً يَوْمَ الْيَرْمُوكِ،", people: ['az-zubayr-ibn-al-awwam'] },
        { title: "«هل تعرف سيف الزبير؟»", text: "قَالَ عُرْوَةُ: وَقَالَ لِي عَبْدُ الْمَلِكِ بْنُ مَرْوَانَ، حِينَ قُتِلَ عَبْدُ اللهِ بْنُ الزُّبَيْرِ: يَا عُرْوَةُ، هَلْ تَعْرِفُ سَيْفَ الزُّبَيْرِ؟ قُلْتُ: نَعَمْ، قَالَ: فَمَا فِيهِ؟ قُلْتُ: فِيهِ فَلَّةٌ فُلَّهَا يَوْمَ بَدْرٍ، قَالَ: صَدَقْتَ، بِهِنَّ فُلُولٌ مِنْ قِرَاعِ الْكَتَائِبِ. ثُمَّ رَدَّهُ عَلَى عُرْوَةَ قَالَ: هِشَامٌ: فَأَقَمْنَاهُ بَيْنَنَا ثَلَاثَةَ آلَافٍ، وَأَخَذَهُ بَعْضُنَا، وَلَوَدِدْتُ أَنِّي كُنْتُ أَخَذْتُهُ».", people: ['az-zubayr-ibn-al-awwam'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default azZubayrAtAlYarmuk;
