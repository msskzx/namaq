import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * At al-Ji'ranah a bedouin said «ألا تنجز لي ما وعدتني؟» and refused his «أبشر»; the Prophet ﷺ turned to Abu Musa and
 * Bilal, «رد البشرى، فاقبلا أنتما», washed his hands and face in a cup and spat in it for them to drink and pour over
 * themselves, and Umm Salamah called from behind the curtain to leave some for their mother. Told from Sahih al-Bukhari
 * 4328 (al-Maghazi, the raid of al-Ta'if), whole. The bedouin is not named.
 */
const theGoodNewsAtAlJiranah = {
  kind: 'EVENT',
  slug: 'the-good-news-at-al-jiranah',
  name: "البشرى بالجعرانة",
  nameTransliterated: "The good news at al-Ji'ranah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abu-musa-al-ashari' }, { person: 'bilal-ibn-rabah' }, { person: 'umm-salamah' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4328, 0, 158),
      source: { slug: 'sahih-al-bukhari', hadith: 4328, url: 'https://sunnah.com/bukhari:4328' },
      moments: [
        { title: "«رد البشرى، فاقبلا أنتما»", text: sahih('bukhari', 4328, 159, 551), people: ['prophet-muhammad', 'abu-musa-al-ashari', 'bilal-ibn-rabah'] },
        { title: "«اشربا منه»", text: sahih('bukhari', 4328, 552, 724), people: ['prophet-muhammad', 'abu-musa-al-ashari', 'bilal-ibn-rabah'] },
        { title: "«أن أفضلا لأمكما»", text: sahih('bukhari', 4328, 725, 870), people: ['abu-musa-al-ashari', 'bilal-ibn-rabah', 'umm-salamah'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theGoodNewsAtAlJiranah;
