import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * In the raid on Fazarah under Abu Bakr, Salamah ibn al-Akwa' stopped a band of women and children with an arrow and drove
 * them in, and Abu Bakr gave him a girl from among them; twice in the market the Prophet ﷺ asked «يا سلمة! هب لي
 * المرأة», Salamah gave her, and he sent her to Makkah to ransom Muslims held there. Told from Sahih Muslim 1755 (al-Jihad,
 * ransoming Muslims with captives), whole.
 */
const salamahAndTheFazariGirl = {
  kind: 'EVENT',
  slug: 'salamah-and-the-fazari-girl',
  name: "سلمة وجارية فزارة",
  nameTransliterated: "Salamah and the girl of Fazarah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abu-bakr-as-siddiq' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('muslim', 1755, 0, 134),
      source: { slug: 'sahih-muslim', hadith: 1755, url: 'https://sunnah.com/muslim:1755' },
      moments: [
        { title: "غزونا فزارة وعلينا أبو بكر", text: sahih('muslim', 1755, 135, 849), people: ['abu-bakr-as-siddiq', 'prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1755, 135, 849) },
          ] },
        { title: "«يا سلمة! هب لي المرأة»", text: sahih('muslim', 1755, 850, 1299), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1755, 850, 948) },
            { text: sahih('muslim', 1755, 949, 994), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1755, 949, 956), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 159, quote: "(رسول الله ﷺ في السوق فقال) لي: (يا سلمة هب لي المرأة)", url: "https://shamela.ws/book/18268/7834" } },
            { text: sahih('muslim', 1755, 995, 1088), speaker: { name: "سلمة" }, lead: sahih('muslim', 1755, 995, 1004), teller: true },
            { text: sahih('muslim', 1755, 1089, 1149) },
            { text: sahih('muslim', 1755, 1150, 1216), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1755, 1150, 1161), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 159, quote: "(ثم لقيني رسول الله ﷺ من الغد) من اليوم الأول (في السوق فقال لي", url: "https://shamela.ws/book/18268/7834" } },
            { text: sahih('muslim', 1755, 1217, 1299), speaker: { name: "سلمة" }, lead: sahih('muslim', 1755, 1217, 1226), teller: true },
          ] },
        { title: "ففدى بها ناسا من المسلمين", text: sahih('muslim', 1755, 1300, 1406), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1755, 1300, 1406) },
          ] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default salamahAndTheFazariGirl;
