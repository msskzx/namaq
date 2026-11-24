import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Abu Bakr came in on Aisha, with the Prophet ﷺ there, on a day of Fitr or Adha, when two girls were singing what the
 * Ansar had said on the day of Bu'ath; he said «مزمار الشيطان» twice, and the Prophet ﷺ said «دعهما يا أبا بكر، إن لكل قوم
 * عيدا، وإن عيدنا هذا اليوم». Told from Sahih al-Bukhari 3931 (Manaqib al-Ansar, the chapter on the Prophet's arrival
 * in Medina), whole, drawn by speaker: each lead names who speaks.
 */
const theTwoSingersOnEid = {
  kind: 'EVENT',
  slug: 'the-two-singers-on-eid',
  name: "القينتان يوم العيد",
  nameTransliterated: "The two singing girls on the day of Eid",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abu-bakr-as-siddiq' }, { person: 'aisha-bint-abi-bakr' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 3931, 0, 123),
      source: { slug: 'sahih-al-bukhari', hadith: 3931, url: 'https://sunnah.com/bukhari:3931' },
      moments: [
        {
          title: "قينتان يوم عيد",
          text: sahih('bukhari', 3931, 124, 286),
          people: ['abu-bakr-as-siddiq', 'aisha-bint-abi-bakr', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 3931, 124, 286) },
          ],
        },
        {
          title: "«مزمار الشيطان»",
          text: sahih('bukhari', 3931, 287, 344),
          people: ['abu-bakr-as-siddiq'],
          turns: [
            { text: sahih('bukhari', 3931, 287, 344), speaker: { person: 'abu-bakr-as-siddiq', name: "أبو بكر" }, lead: sahih('bukhari', 3931, 287, 308) },
          ],
        },
        {
          title: "«إن لكل قوم عيدا»",
          text: sahih('bukhari', 3931, 345, 458),
          people: ['prophet-muhammad', 'abu-bakr-as-siddiq'],
          turns: [
            { text: sahih('bukhari', 3931, 345, 458), speaker: { person: 'prophet-muhammad', name: "النبي ﷺ" }, lead: sahih('bukhari', 3931, 345, 366) },
          ],
        },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theTwoSingersOnEid;
