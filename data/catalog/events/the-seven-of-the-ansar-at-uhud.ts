import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * At Uhud the Prophet ﷺ was left with seven of the Ansar and two of Quraysh; each time the enemy pressed he asked who would
 * drive them off for Paradise, and one of the Ansar went forward and was killed, until all seven were; then he said to his
 * two companions «ما أنصفنا أصحابنا». Told from Sahih Muslim 1789 (al-Jihad, the chapter on Uhud), whole.
 */
const theSevenOfTheAnsarAtUhud = {
  kind: 'EVENT',
  slug: 'the-seven-of-the-ansar-at-uhud',
  name: "السبعة من الأنصار يوم أحد",
  nameTransliterated: "The seven of the Ansar at Uhud",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('muslim', 1789, 0, 131),
      source: { slug: 'sahih-muslim', hadith: 1789, url: 'https://sunnah.com/muslim:1789' },
      moments: [
        { title: "«من يردهم عنا وله الجنة»", text: sahih('muslim', 1789, 132, 573), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1789, 132, 247) },
            { text: sahih('muslim', 1789, 248, 333), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1789, 248, 253), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 308, quote: "(قال) رسول الله ﷺ: (من يردهم)", url: "https://shamela.ws/book/18268/7983" } },
            { text: sahih('muslim', 1789, 334, 421) },
            { text: sahih('muslim', 1789, 422, 509), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1789, 422, 429), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 309, quote: "(فقال) رسول الله ﷺ: (من يردهم عنا", url: "https://shamela.ws/book/18268/7984" } },
            { text: sahih('muslim', 1789, 510, 573) },
          ] },
        { title: "«ما أنصفنا أصحابنا»", text: sahih('muslim', 1789, 574, 685), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1789, 574, 623) },
            { text: sahih('muslim', 1789, 624, 685), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1789, 624, 663) },
          ] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theSevenOfTheAnsarAtUhud;
