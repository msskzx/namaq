import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * In his last illness the Prophet ﷺ called Fatimah and told her something in secret and she wept, then told her something
 * and she laughed; asked, she said he had told her he would die of this illness, then that she would be the first of his
 * family to follow him. Told from Sahih al-Bukhari 4433 (al-Maghazi, the illness of the Prophet ﷺ), whole.
 */
const fatimahWeepsAndLaughs = {
  kind: 'EVENT',
  slug: 'fatimah-weeps-and-laughs',
  name: "بكاء فاطمة وضحكها",
  nameTransliterated: "Fatimah weeps and laughs",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'fatimah-bint-muhammad' }, { person: 'aisha-bint-abi-bakr' }],
  reports: [
    {
      isnad: "حَدَّثَنَا يَسَرَةُ بْنُ صَفْوَانَ بْنِ جَمِيلٍ اللَّخْمِيُّ، حَدَّثَنَا إِبْرَاهِيمُ بْنُ سَعْدٍ، عَنْ أَبِيهِ، عَنْ عُرْوَةَ، عَنْ عَائِشَةَ رضي الله عنها قَالَتْ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4433, url: 'https://sunnah.com/bukhari:4433' },
      moments: [
        { title: "سارها فبكت ثم سارها فضحكت", text: "«دَعَا النَّبِيُّ ﷺ فَاطِمَةَ عليها السلام فِي شَكْوَاهُ الَّذِي قُبِضَ فِيهِ، فَسَارَّهَا بِشَيْءٍ فَبَكَتْ، ثُمَّ دَعَاهَا فَسَارَّهَا بِشَيْءٍ فَضَحِكَتْ، فَسَأَلْنَا عَنْ ذَلِكَ،", people: ['prophet-muhammad', 'fatimah-bint-muhammad', 'aisha-bint-abi-bakr'] },
        { title: "«أني أول أهله يتبعه»", text: "فَقَالَتْ: سَارَّنِي النَّبِيُّ ﷺ: أَنَّهُ يُقْبَضُ فِي وَجَعِهِ الَّذِي تُوُفِّيَ فِيهِ، فَبَكَيْتُ، ثُمَّ سَارَّنِي فَأَخْبَرَنِي أَنِّي أَوَّلُ أَهْلِهِ يَتْبَعُهُ، فَضَحِكْتُ.»", people: ['fatimah-bint-muhammad', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default fatimahWeepsAndLaughs;
