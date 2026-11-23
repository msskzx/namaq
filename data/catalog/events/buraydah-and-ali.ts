import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ sent Ali to Khalid to take the fifth; Buraydah, who disliked Ali, saw him come from bathing and spoke of it to
 * Khalid, and on their return the Prophet ﷺ said «يا بريدة أتبغض عليا… لا تبغضه، فإن له في الخمس أكثر من ذلك». Told from
 * Sahih al-Bukhari 4350 (al-Maghazi, the sending of Ali and Khalid to Yemen), whole. 4349 (al-Bara stays on with Ali) is a
 * note on the mission and is not told.
 */
const buraydahAndAli = {
  kind: 'EVENT',
  slug: 'buraydah-and-ali',
  name: "بريدة وعلي",
  nameTransliterated: "Buraydah and Ali",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'ali-ibn-abi-talib' }, { person: 'khalid-ibn-al-walid' }, { person: 'buraidah-ibn-al-husayb' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنِي مُحَمَّدُ بْنُ بَشَّارٍ: حَدَّثَنَا رَوْحُ بْنُ عُبَادَةَ: حَدَّثَنَا عَلِيُّ بْنُ سُوَيْدِ بْنِ مَنْجُوفٍ، عَنْ عَبْدِ اللهِ بْنِ بُرَيْدَةَ، عَنْ أَبِيهِ  رضي الله عنه قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4350, url: 'https://sunnah.com/bukhari:4350' },
      moments: [
        { title: "وكنت أبغض عليا", text: "«بَعَثَ النَّبِيُّ ﷺ عَلِيًّا إِلَى خَالِدٍ لِيَقْبِضَ الْخُمُسَ، وَكُنْتُ أُبْغِضُ عَلِيًّا، وَقَدِ اغْتَسَلَ، فَقُلْتُ لِخَالِدٍ: أَلَا تَرَى إِلَى هَذَا،", people: ['ali-ibn-abi-talib', 'khalid-ibn-al-walid', 'buraidah-ibn-al-husayb'] },
        { title: "«يا بريدة أتبغض عليا»", text: "فَلَمَّا قَدِمْنَا عَلَى النَّبِيِّ ﷺ ذَكَرْتُ ذَلِكَ لَهُ، فَقَالَ: يَا بُرَيْدَةُ أَتُبْغِضُ عَلِيًّا، فَقُلْتُ: نَعَمْ، قَالَ: لَا تُبْغِضْهُ، فَإِنَّ لَهُ فِي الْخُمُسِ أَكْثَرَ مِنْ ذَلِكَ.»", people: ['prophet-muhammad', 'buraidah-ibn-al-husayb', 'ali-ibn-abi-talib'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default buraydahAndAli;
