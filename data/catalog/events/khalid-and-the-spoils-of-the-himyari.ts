import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * A man of Himyar killed an enemy and Khalid ibn al-Walid, his commander, held back the spoils; Awf ibn Malik told the
 * Prophet ﷺ, who said «ادفعه إليه», but when Awf taunted Khalid he grew angry, «لا تعطه. يا خالد!… هل أنتم تاركون لي
 * أمرائي؟». Told from Sahih Muslim 1753 (al-Jihad, the killer's right to the spoils), the first of its routes, whole. The
 * Himyari is not named.
 */
const khalidAndTheSpoilsOfTheHimyari = {
  kind: 'EVENT',
  slug: 'khalid-and-the-spoils-of-the-himyari',
  name: "خالد وسلب الحميري",
  nameTransliterated: "Khalid and the Himyari's spoils",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'khalid-ibn-al-walid' }, { person: 'awf-ibn-malik-al-ashjai' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('muslim', 1753, 0, 219),
      source: { slug: 'sahih-muslim', hadith: 1753, url: 'https://sunnah.com/muslim:1753' },
      moments: [
        { title: "«ما منعك أن تعطيه سلبه؟»", text: sahih('muslim', 1753, 220, 549), people: ['khalid-ibn-al-walid', 'awf-ibn-malik-al-ashjai', 'prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1753, 220, 418) },
            { text: sahih('muslim', 1753, 419, 477), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1753, 419, 436), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 150, quote: "(فقال) رسول الله ﷺ (لخالد: ما منعك)", url: "https://shamela.ws/book/18268/7825" } },
            { text: sahih('muslim', 1753, 478, 522), speaker: { person: "khalid-ibn-al-walid", name: "خالد" }, lead: sahih('muslim', 1753, 478, 484), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 150, quote: "(قال) خالد: (استكثرته)", url: "https://shamela.ws/book/18268/7825" } },
            { text: sahih('muslim', 1753, 523, 549), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1753, 523, 528), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 150, quote: "فـ (ـقال) رسول الله ﷺ لخالد: (ادفعه)", url: "https://shamela.ws/book/18268/7825" } },
          ] },
        { title: "«هل أنتم تاركون لي أمرائي؟»", text: sahih('muslim', 1753, 550, 1055), people: ['khalid-ibn-al-walid', 'awf-ibn-malik-al-ashjai', 'prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1753, 550, 595) },
            { text: sahih('muslim', 1753, 596, 671), speaker: { person: "awf-ibn-malik-al-ashjai", name: "عوف" }, lead: sahih('muslim', 1753, 596, 608), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 150, quote: "(ثم قال) عوف لخالد: هل أنجزت", url: "https://shamela.ws/book/18268/7825" } },
            { text: sahih('muslim', 1753, 672, 1055), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1753, 672, 723) },
          ] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default khalidAndTheSpoilsOfTheHimyari;
