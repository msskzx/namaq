import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * A woman stole in the campaign of the conquest; her people asked Usamah to intercede, the Prophet's face changed «أتكلمني
 * في حد من حدود الله», and that evening he said «لو أن فاطمة بنت محمد سرقت لقطعت يدها»; her hand was cut, she repented and
 * married, and Aisha used to take her needs to him. Told from Sahih al-Bukhari 4304 (al-Maghazi, the chapter after the
 * conquest), whole. The woman is not named; Fatimah is named only in his words and is not linked.
 */
const theWomanWhoStoleInTheConquest = {
  kind: 'EVENT',
  slug: 'the-woman-who-stole-in-the-conquest',
  name: "المرأة التي سرقت في غزوة الفتح",
  nameTransliterated: "The woman who stole in the conquest",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'usamah-ibn-zaid' }, { person: 'prophet-muhammad' }, { person: 'aisha-bint-abi-bakr' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا مُحَمَّدُ بْنُ مُقَاتِلٍ: أَخْبَرَنَا عَبْدُ اللهِ: أَخْبَرَنَا يُونُسُ، عَنِ الزُّهْرِيِّ قَالَ: أَخْبَرَنِي عُرْوَةُ بْنُ الزُّبَيْرِ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4304, url: 'https://sunnah.com/bukhari:4304' },
      moments: [
        { title: "«أتكلمني في حد من حدود الله»", text: "«أَنَّ امْرَأَةً سَرَقَتْ فِي عَهْدِ رَسُولِ اللهِ ﷺ فِي غَزْوَةِ الْفَتْحِ، فَفَزِعَ قَوْمُهَا إِلَى أُسَامَةَ بْنِ زَيْدٍ يَسْتَشْفِعُونَهُ. قَالَ عُرْوَةُ: فَلَمَّا كَلَّمَهُ أُسَامَةُ فِيهَا تَلَوَّنَ وَجْهُ رَسُولِ اللهِ ﷺ، فَقَالَ: أَتُكَلِّمُنِي فِي حَدٍّ مِنْ حُدُودِ اللهِ. قَالَ أُسَامَةُ: اسْتَغْفِرْ لِي يَا رَسُولَ اللهِ،", people: ['usamah-ibn-zaid', 'prophet-muhammad'] },
        { title: "«لو أن فاطمة بنت محمد سرقت لقطعت يدها»", text: "فَلَمَّا كَانَ الْعَشِيُّ قَامَ رَسُولُ اللهِ ﷺ خَطِيبًا، فَأَثْنَى عَلَى اللهِ بِمَا هُوَ أَهْلُهُ، ثُمَّ قَالَ: أَمَّا بَعْدُ، فَإِنَّمَا أَهْلَكَ النَّاسَ قَبْلَكُمْ: أَنَّهُمْ كَانُوا إِذَا سَرَقَ فِيهِمُ الشَّرِيفُ تَرَكُوهُ، وَإِذَا سَرَقَ فِيهِمُ الضَّعِيفُ أَقَامُوا عَلَيْهِ الْحَدَّ، وَالَّذِي نَفْسُ مُحَمَّدٍ بِيَدِهِ، لَوْ أَنَّ فَاطِمَةَ بِنْتَ مُحَمَّدٍ سَرَقَتْ لَقَطَعْتُ يَدَهَا. ثُمَّ أَمَرَ رَسُولُ اللهِ ﷺ بِتِلْكَ الْمَرْأَةِ فَقُطِعَتْ يَدُهَا،", people: ['prophet-muhammad'] },
        { title: "فحسنت توبتها", text: "فَحَسُنَتْ تَوْبَتُهَا بَعْدَ ذَلِكَ وَتَزَوَّجَتْ، قَالَتْ عَائِشَةُ: فَكَانَتْ تَأْتِي بَعْدَ ذَلِكَ، فَأَرْفَعُ حَاجَتَهَا إِلَى رَسُولِ اللهِ ﷺ.»", people: ['aisha-bint-abi-bakr', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theWomanWhoStoleInTheConquest;
