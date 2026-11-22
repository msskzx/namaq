import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ sat on the minbar and spoke of a servant whom Allah gave the choice between the flower of this world and
 * what is with Him, and he chose what is with Him; Abu Bakr wept, «فديناك بآبائنا وأمهاتنا», and the people wondered,
 * until they knew the one given the choice was the Prophet ﷺ himself. Told from Sahih al-Bukhari 3904 (Manaqib al-Ansar,
 * the chapter on the hijra), whole. The text does not say when; no date is given here.
 */
const theServantGivenTheChoice = {
  kind: 'EVENT',
  slug: 'the-servant-given-the-choice',
  name: "عبد خيره الله",
  nameTransliterated: "The servant whom Allah gave the choice",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abu-bakr-as-siddiq' }, { person: 'abu-said-al-khudri' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا إِسْمَاعِيلُ بْنُ عَبْدِ اللهِ قَالَ: حَدَّثَنِي مَالِكٌ، عَنْ أَبِي النَّضْرِ، مَوْلَى عُمَرَ بْنِ عُبَيْدِ اللهِ، عَنْ عُبَيْدٍ، يَعْنِي ابْنَ حُنَيْنٍ، عَنْ أَبِي سَعِيدٍ الْخُدْرِيِّ  رضي الله عنه:",
      source: { slug: 'sahih-al-bukhari', hadith: 3904, url: 'https://sunnah.com/bukhari:3904' },
      moments: [
        { title: "«عبد خيره الله»", text: "«أَنَّ رَسُولَ اللهِ ﷺ جَلَسَ عَلَى الْمِنْبَرِ فَقَالَ: إِنَّ عَبْدًا خَيَّرَهُ اللهُ بَيْنَ أَنْ يُؤْتِيَهُ مِنْ زَهْرَةِ الدُّنْيَا مَا شَاءَ، وَبَيْنَ مَا عِنْدَهُ، فَاخْتَارَ مَا عِنْدَهُ", people: ['prophet-muhammad'] },
        { title: "«فديناك بآبائنا وأمهاتنا»", text: "فَبَكَى أَبُو بَكْرٍ وَقَالَ: فَدَيْنَاكَ بِآبَائِنَا وَأُمَّهَاتِنَا. فَعَجِبْنَا لَهُ، وَقَالَ النَّاسُ: انْظُرُوا إِلَى هَذَا الشَّيْخِ، يُخْبِرُ رَسُولُ اللهِ ﷺ عَنْ عَبْدٍ خَيَّرَهُ اللهُ بَيْنَ أَنْ يُؤْتِيَهُ مِنْ زَهْرَةِ الدُّنْيَا وَبَيْنَ مَا عِنْدَهُ، وَهُوَ يَقُولُ: فَدَيْنَاكَ بِآبَائِنَا وَأُمَّهَاتِنَا،", people: ['abu-bakr-as-siddiq', 'abu-said-al-khudri'] },
        { title: "كان أبو بكر أعلمنا به", text: "فَكَانَ رَسُولُ اللهِ ﷺ هُوَ الْمُخَيَّرَ، وَكَانَ أَبُو بَكْرٍ هُوَ أَعْلَمَنَا بِهِ،", people: ['prophet-muhammad', 'abu-bakr-as-siddiq', 'abu-said-al-khudri'] },
        { title: "«إلا خوخة أبي بكر»", text: "وَقَالَ رَسُولُ اللهِ ﷺ: إِنَّ مِنْ أَمَنِّ النَّاسِ عَلَيَّ فِي صُحْبَتِهِ وَمَالِهِ أَبَا بَكْرٍ، وَلَوْ كُنْتُ مُتَّخِذًا خَلِيلًا مِنْ أُمَّتِي لَاتَّخَذْتُ أَبَا بَكْرٍ، إِلَّا خُلَّةَ الْإِسْلَامِ، لَا يَبْقَيَنَّ فِي الْمَسْجِدِ خَوْخَةٌ إِلَّا خَوْخَةُ أَبِي بَكْرٍ.»", people: ['prophet-muhammad', 'abu-bakr-as-siddiq'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theServantGivenTheChoice;
