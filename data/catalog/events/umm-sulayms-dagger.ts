import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * At Hunayn Umm Sulaym carried a dagger; Abu Talhah told the Prophet ﷺ, she said it was for the belly of any mushrik who
 * came near her, he laughed, and when she asked him to kill the freedmen who had fled he said «يا أم سليم! إن الله قد كفى
 * وأحسن». Told from Sahih Muslim 1809 (al-Jihad, women going out with the men), the first of its routes, whole.
 */
const ummSulaymsDagger = {
  kind: 'EVENT',
  slug: 'umm-sulayms-dagger',
  name: "خنجر أم سليم يوم حنين",
  nameTransliterated: "Umm Sulaym's dagger at Hunayn",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'umm-sulaym-al-ghumaysa' }, { person: 'abu-talha-al-ansari' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('muslim', 1809, 0, 140),
      source: { slug: 'sahih-muslim', hadith: 1809, url: 'https://sunnah.com/muslim:1809' },
      moments: [
        { title: "«ما هذا الخنجر؟»", text: sahih('muslim', 1809, 141, 460), people: ['umm-sulaym-al-ghumaysa', 'abu-talha-al-ansari', 'prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1809, 141, 216) },
            { text: sahih('muslim', 1809, 217, 311), speaker: { person: "abu-talha-al-ansari", name: "أبو طلحة" }, lead: sahih('muslim', 1809, 217, 250) },
            { text: sahih('muslim', 1809, 312, 368), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1809, 312, 343) },
            { text: sahih('muslim', 1809, 369, 460), speaker: { person: "umm-sulaym-al-ghumaysa", name: "أم سليم" }, lead: sahih('muslim', 1809, 369, 377), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 403, quote: "(قالت) أم سليم: (اتخذته)", url: "https://shamela.ws/book/18268/8078" } },
          ] },
        { title: "«إن الله قد كفى وأحسن»", text: sahih('muslim', 1809, 461, 664), people: ['umm-sulaym-al-ghumaysa', 'prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1809, 461, 497) },
            { text: sahih('muslim', 1809, 498, 586), speaker: { person: "umm-sulaym-al-ghumaysa", name: "أم سليم" }, lead: sahih('muslim', 1809, 498, 506), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 404, quote: "فزعمت أم سليم أنهم انهزموا في حنين لأجل ضعف إسلامهم فاعتقدت أم سليم أنهم منافقون وأنهم استحقوا القتل بانهزامهم واقترحت قتلهم من النبي ﷺ", url: "https://shamela.ws/book/18268/8079" } },
            { text: sahih('muslim', 1809, 587, 664), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1809, 587, 612) },
          ] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default ummSulaymsDagger;
