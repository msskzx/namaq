import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * In his illness they put medicine in the side of his mouth though he signed to them not to, thinking it a sick man's dislike
 * of medicine; when he woke he said «ألم أنهكم أن تلدوني» and had everyone in the house given it while he watched, except
 * al-Abbas, who had not been there. Told from Sahih al-Bukhari 4458 (al-Maghazi, the illness of the Prophet ﷺ), whole; our
 * copy prints it as the addition («وزاد») to the hadith before it, whose numbers 4456–4457 it does not hold. Al-Abbas is
 * named only as the one who was not there and is not linked.
 */
const theMedicineInHisMouth = {
  kind: 'EVENT',
  slug: 'the-medicine-in-his-mouth',
  name: "اللدود في مرضه ﷺ",
  nameTransliterated: "The medicine put in his mouth",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'aisha-bint-abi-bakr' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا عَلِيٌّ، حَدَّثَنَا يَحْيَى، وَزَادَ: قَالَتْ عَائِشَةُ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4458, url: 'https://sunnah.com/bukhari:4458' },
      moments: [
        { title: "لددناه في مرضه", text: "«لَدَدْنَاهُ فِي مَرَضِهِ، فَجَعَلَ يُشِيرُ إِلَيْنَا: أَنْ لَا تَلُدُّونِي، فَقُلْنَا: كَرَاهِيَةُ الْمَرِيضِ لِلدَّوَاءِ،", people: ['aisha-bint-abi-bakr', 'prophet-muhammad'] },
        { title: "«ألم أنهكم أن تلدوني»", text: "فَلَمَّا أَفَاقَ قَالَ: أَلَمْ أَنْهَكُمْ أَنْ تَلُدُّونِي، قُلْنَا: كَرَاهِيَةَ الْمَرِيضِ لِلدَّوَاءِ، فَقَالَ: لَا يَبْقَى أَحَدٌ فِي الْبَيْتِ إِلَّا لُدَّ، وَأَنَا أَنْظُرُ إِلَّا الْعَبَّاسَ، فَإِنَّهُ لَمْ يَشْهَدْكُمْ». رَوَاهُ ابْنُ أَبِي الزِّنَادِ، عَنْ هِشَامٍ، عَنْ أَبِيهِ، عَنْ عَائِشَةَ، عَنِ النَّبِيِّ ﷺ.", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theMedicineInHisMouth;
