import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Banu Tamim came and the Prophet ﷺ said «أبشروا»; they said «قد بشرتنا فأعطنا» and his face changed, then people from
 * Yemen came and he said «اقبلوا البشرى إذ لم يقبلها بنو تميم», and they accepted. Told from Imran ibn Husayn's hadith in
 * Sahih al-Bukhari, each whole: 4386 (the coming of the Ash'aris and the people of Yemen) first, then 4365 (the delegation
 * of Banu Tamim).
 */
const banuTamimAndTheGoodNews = {
  kind: 'EVENT',
  slug: 'banu-tamim-and-the-good-news',
  name: "بنو تميم والبشرى",
  nameTransliterated: "Banu Tamim and the good news",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4386, 0, 221),
      source: { slug: 'sahih-al-bukhari', hadith: 4386, url: 'https://sunnah.com/bukhari:4386' },
      moments: [
        { title: "«أبشروا يا بني تميم»", text: sahih('bukhari', 4386, 222, 389), people: ['prophet-muhammad'] },
        { title: "«اقبلوا البشرى إذ لم يقبلها بنو تميم»", text: sahih('bukhari', 4386, 390, 550), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4365, 0, 165),
      source: { slug: 'sahih-al-bukhari', hadith: 4365, url: 'https://sunnah.com/bukhari:4365' },
      moments: [
        { title: "«اقبلوا البشرى يا بني تميم»", text: sahih('bukhari', 4365, 166, 349), people: ['prophet-muhammad'] },
        { title: "«قد قبلنا يا رسول الله»", text: sahih('bukhari', 4365, 350, 491), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default banuTamimAndTheGoodNews;
