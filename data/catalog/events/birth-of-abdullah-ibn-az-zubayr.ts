import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Asma bint Abi Bakr emigrated carrying Abd Allah ibn al-Zubayr, gave birth to him at Quba and brought him to the Prophet ﷺ,
 * who chewed a date and put it in his mouth and prayed for him: the first child born in Islam. Told from Sahih al-Bukhari,
 * each hadith whole, as its chapter on the hijra gives them: Asma's 3909 first, then Aisha's 3910. Abd Allah has no
 * catalog subject and is not linked.
 */
const birthOfAbdullahIbnAzZubayr = {
  kind: 'EVENT',
  slug: 'birth-of-abdullah-ibn-az-zubayr',
  name: "مولد عبد الله بن الزبير",
  nameTransliterated: "The birth of Abd Allah ibn al-Zubayr",
  type: 'BIRTH',
  fields: {},
  people: [{ person: 'asma-bint-abi-bakr' }, { person: 'prophet-muhammad' }],
  reports: [
    {
      isnad: "حَدَّثَنِي زَكَرِيَّاءُ بْنُ يَحْيَى، عَنْ أَبِي أُسَامَةَ، عَنْ هِشَامِ بْنِ عُرْوَةَ، عَنْ أَبِيهِ، عَنْ أَسْمَاءَ  رضي الله عنها:",
      source: { slug: 'sahih-al-bukhari', hadith: 3909, url: 'https://sunnah.com/bukhari:3909' },
      moments: [
        { title: "فولدته بقباء", text: "«أَنَّهَا حَمَلَتْ بِعَبْدِ اللهِ بْنِ الزُّبَيْرِ، قَالَتْ: فَخَرَجْتُ وَأَنَا مُتِمٌّ، فَأَتَيْتُ الْمَدِينَةَ فَنَزَلْتُ بِقُبَاءٍ، فَوَلَدْتُهُ بِقُبَاءٍ،", people: ['asma-bint-abi-bakr'] },
        { title: "أول شيء دخل جوفه", text: "ثُمَّ أَتَيْتُ بِهِ النَّبِيَّ ﷺ فَوَضَعْتُهُ فِي حَجْرِهِ، ثُمَّ دَعَا بِتَمْرَةٍ فَمَضَغَهَا، ثُمَّ تَفَلَ فِي فِيهِ، فَكَانَ أَوَّلَ شَيْءٍ دَخَلَ جَوْفَهُ رِيقُ رَسُولِ اللهِ ﷺ، ثُمَّ حَنَّكَهُ بِتَمْرَةٍ، ثُمَّ دَعَا لَهُ وَبَرَّكَ عَلَيْهِ، وَكَانَ أَوَّلَ مَوْلُودٍ وُلِدَ فِي الْإِسْلَامِ».", people: ['asma-bint-abi-bakr', 'prophet-muhammad'] },
        { title: "هاجرت وهي حبلى", text: "تَابَعَهُ خَالِدُ بْنُ مَخْلَدٍ، عَنْ عَلِيِّ بْنِ مُسْهِرٍ، عَنْ هِشَامٍ، عَنْ أَبِيهِ، عَنْ أَسْمَاءَ رضي الله عنها: أَنَّهَا هَاجَرَتْ إِلَى النَّبِيِّ ﷺ وَهْيَ حُبْلَى.", people: ['asma-bint-abi-bakr', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا قُتَيْبَةُ، عَنْ أَبِي أُسَامَةَ، عَنْ هِشَامِ بْنِ عُرْوَةَ، عَنْ أَبِيهِ، عَنْ عَائِشَةَ  رضي الله عنها قَالَتْ:",
      source: { slug: 'sahih-al-bukhari', hadith: 3910, url: 'https://sunnah.com/bukhari:3910' },
      moments: [
        { title: "أول مولود ولد في الإسلام", text: "«أَوَّلُ مَوْلُودٍ وُلِدَ فِي الْإِسْلَامِ عَبْدُ اللهِ بْنُ الزُّبَيْرِ، أَتَوْا بِهِ النَّبِيَّ ﷺ، فَأَخَذَ النَّبِيُّ ﷺ تَمْرَةً فَلَاكَهَا، ثُمَّ أَدْخَلَهَا فِي فِيهِ، فَأَوَّلُ مَا دَخَلَ بَطْنَهُ رِيقُ النَّبِيِّ ﷺ.»", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default birthOfAbdullahIbnAzZubayr;
