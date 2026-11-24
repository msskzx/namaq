import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Passing al-Hijr on the way to Tabuk the Prophet ﷺ said «لا تدخلوا مساكن الذين ظلموا أنفسهم… إلا أن تكونوا باكين»,
 * covered his head and hurried until he had crossed the valley. Told from Sahih al-Bukhari 4419 (al-Maghazi, his stopping
 * at al-Hijr), whole. 4420 is the saying alone.
 */
const passingAlHijr = {
  kind: 'EVENT',
  slug: 'passing-al-hijr',
  name: "المرور بالحجر",
  nameTransliterated: "Passing al-Hijr",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4419, 0, 180),
      source: { slug: 'sahih-al-bukhari', hadith: 4419, url: 'https://sunnah.com/bukhari:4419' },
      moments: [
        {
          title: "«لا تدخلوا مساكن الذين ظلموا أنفسهم»",
          text: sahih('bukhari', 4419, 181, 424),
          people: ['prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4419, 181, 350), speaker: { person: "prophet-muhammad", name: "النبي ﷺ" }, lead: sahih('bukhari', 4419, 181, 226) },
            { text: sahih('bukhari', 4419, 351, 424) },
          ],
        },
      ],
    },
  ],
} satisfies CatalogEvent;

export default passingAlHijr;
