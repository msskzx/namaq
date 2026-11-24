import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ was asked to go to Abd Allah ibn Ubayy and rode to him on a donkey; Ibn Ubayy said «إليك عني، فوالله لقد
 * آذاني نتن حمارك», a man of the Ansar answered that the donkey smelt sweeter than he, and their people fought with palm
 * stalks, hands and sandals; word was that «وإن طائفتان من المؤمنين اقتتلوا فأصلحوا بينهما» came down about them. Told from
 * Sahih Muslim 1799 (al-Jihad), whole.
 */
const theDonkeyAndIbnUbayy = {
  kind: 'EVENT',
  slug: 'the-donkey-and-ibn-ubayy',
  name: "حمار رسول الله ﷺ وعبد الله بن أبي",
  nameTransliterated: "The donkey and Ibn Ubayy",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abdullah-ibn-ubayy' }],
  tags: ['REVEALED_ABOUT'],
  ayat: [
    {
      kind: 'REVEALED_ABOUT',
      from: '49:9',
      to: '49:9',
      evidence: [{ source: 'sahih-muslim', hadith: 1799, url: 'https://sunnah.com/muslim:1799', quote: sahih('muslim', 1799, 692, 799) }],
    },
  ],
  reports: [
    {
      isnad: sahih('muslim', 1799, 0, 129),
      source: { slug: 'sahih-muslim', hadith: 1799, url: 'https://sunnah.com/muslim:1799' },
      moments: [
        { title: "«لقد آذاني نتن حمارك»", text: sahih('muslim', 1799, 130, 393), people: ['prophet-muhammad', 'abdullah-ibn-ubayy'],
          turns: [
            { text: sahih('muslim', 1799, 130, 293) },
            { text: sahih('muslim', 1799, 294, 393), speaker: { person: "abdullah-ibn-ubayy", name: "ابن أبي" }, lead: sahih('muslim', 1799, 294, 330), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 337, quote: "(النبي ﷺ قال) ابن أبي لرسول الله ﷺ: (إليك عني)", url: "https://shamela.ws/book/18268/8012" } },
          ] },
        { title: "ضرب بالجريد وبالأيدي وبالنعال", text: sahih('muslim', 1799, 394, 684), people: ['prophet-muhammad', 'abdullah-ibn-ubayy'],
          turns: [
            { text: sahih('muslim', 1799, 394, 497), speaker: { name: "رجل من الأنصار" }, lead: sahih('muslim', 1799, 394, 434) },
            { text: sahih('muslim', 1799, 498, 684) },
          ] },
        { title: "«وإن طائفتان من المؤمنين اقتتلوا»", text: sahih('muslim', 1799, 685, 817), people: [],
          turns: [
            { text: sahih('muslim', 1799, 685, 817) },
          ] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theDonkeyAndIbnUbayy;
