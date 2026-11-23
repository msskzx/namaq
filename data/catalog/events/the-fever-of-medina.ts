import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * When the Prophet ﷺ came to Medina, Abu Bakr and Bilal fell ill with fever, each with his lines of verse; Aisha told the
 * Prophet ﷺ, and he prayed that Allah make Medina beloved to them as Makkah or more, bless its sa' and mudd, and move its
 * fever to al-Juhfah. Told from Sahih al-Bukhari 3926 (Manaqib al-Ansar, the chapter on the Prophet's arrival in Medina),
 * whole.
 */
const theFeverOfMedina = {
  kind: 'EVENT',
  slug: 'the-fever-of-medina',
  name: "حمى المدينة",
  nameTransliterated: "The fever of Medina",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abu-bakr-as-siddiq' }, { person: 'bilal-ibn-rabah' }, { person: 'aisha-bint-abi-bakr' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا عَبْدُ اللهِ بْنُ يُوسُفَ: أَخْبَرَنَا مَالِكٌ، عَنْ هِشَامِ بْنِ عُرْوَةَ، عَنْ أَبِيهِ، عَنْ عَائِشَةَ  رضي الله عنها أَنَّهَا قَالَتْ:",
      source: { slug: 'sahih-al-bukhari', hadith: 3926, url: 'https://sunnah.com/bukhari:3926' },
      moments: [
        { title: "وعك أبو بكر وبلال", text: "«لَمَّا قَدِمَ رَسُولُ اللهِ ﷺ الْمَدِينَةَ، وُعِكَ أَبُو بَكْرٍ وَبِلَالٌ، قَالَتْ: فَدَخَلْتُ عَلَيْهِمَا، فَقُلْتُ: يَا أَبَتِ كَيْفَ تَجِدُكَ، وَيَا بِلَالُ كَيْفَ تَجِدُكَ،", people: ['prophet-muhammad', 'abu-bakr-as-siddiq', 'bilal-ibn-rabah', 'aisha-bint-abi-bakr'] },
        { title: "«كل امرئ مصبح في أهله»", text: "قَالَتْ: فَكَانَ أَبُو بَكْرٍ إِذَا أَخَذَتْهُ الْحُمَّى يَقُولُ: كُلُّ امْرِئٍ مُصَبَّحٌ فِي أَهْلِهِ … وَالْمَوْتُ أَدْنَى مِنْ شِرَاكِ نَعْلِهِ", people: ['abu-bakr-as-siddiq'] },
        { title: "«ألا ليت شعري»", text: "وَكَانَ بِلَالٌ إِذَا أَقْلَعَ عَنْهُ الْحُمَّى يَرْفَعُ عَقِيرَتَهُ وَيَقُولُ أَلَا لَيْتَ شِعْرِي هَلْ أَبِيتَنَّ لَيْلَةً … بِوَادٍ وَحَوْلِي إِذْخِرٌ وَجَلِيلُ وَهَلْ أَرِدَنْ يَوْمًا مِيَاهَ مَجَِنَّةٍ … وَهَلْ يَبْدُوَنْ لِي شَامَةٌ وَطَفِيلُ", people: ['bilal-ibn-rabah'] },
        { title: "«اللهم حبب إلينا المدينة»", text: "قَالَتْ عَائِشَةُ: فَجِئْتُ رَسُولَ اللهِ ﷺ فَأَخْبَرْتُهُ، فَقَالَ: اللَّهُمَّ حَبِّبْ إِلَيْنَا الْمَدِينَةَ كَحُبِّنَا مَكَّةَ أَوْ أَشَدَّ، وَصَحِّحْهَا، وَبَارِكْ لَنَا فِي صَاعِهَا وَمُدِّهَا، وَانْقُلْ حُمَّاهَا فَاجْعَلْهَا بِالْجُحْفَةِ.»", people: ['aisha-bint-abi-bakr', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theFeverOfMedina;
