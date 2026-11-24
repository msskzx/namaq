import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * In the raid on Hawazin a man on a red camel ate with them, looking about, then ran for his camel and rode off; Salamah ibn
 * al-Akwa' outran a man on a she-camel, caught the bridle, killed him and led the camel back, and the Prophet ﷺ said «له
 * سلبه أجمع». Told from Sahih Muslim 1754 (al-Jihad, the killer's right to the spoils), whole. Salamah has no catalog subject.
 */
const salamahAndTheSpy = {
  kind: 'EVENT',
  slug: 'salamah-and-the-spy',
  name: "سلمة والعين في غزوة هوازن",
  nameTransliterated: "Salamah and the spy",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('muslim', 1754, 0, 200),
      source: { slug: 'sahih-muslim', hadith: 1754, url: 'https://sunnah.com/muslim:1754' },
      moments: [
        { title: "رجل على جمل أحمر", text: sahih('muslim', 1754, 201, 708), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1754, 201, 708) },
          ] },
        { title: "أخذت بخطام الجمل", text: sahih('muslim', 1754, 709, 1074), people: [],
          turns: [
            { text: sahih('muslim', 1754, 709, 1074) },
          ] },
        { title: "«له سلبه أجمع»", text: sahih('muslim', 1754, 1075, 1195), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1754, 1075, 1157), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1754, 1075, 1136) },
            { text: sahih('muslim', 1754, 1158, 1174) },
            { text: sahih('muslim', 1754, 1175, 1195), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1754, 1175, 1179), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 156, quote: "(ابن الأكوع قال) رسول الله ﷺ (له)", url: "https://shamela.ws/book/18268/7831" } },
          ] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default salamahAndTheSpy;
