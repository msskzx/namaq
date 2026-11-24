import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * At Uhud, when the mushrikun were routed, Iblis cried «أي عباد الله أخراكم» and the Muslims turned on each other; Hudhayfah
 * saw his father al-Yaman among them and cried out, but they killed him, and Hudhayfah said «يغفر الله لكم». Told from Sahih
 * al-Bukhari 4065 (al-Maghazi, the chapter on Uhud), whole, with al-Bukhari's note on the word. Al-Yaman has no catalog
 * subject and is not linked.
 */
const theKillingOfAlYaman = {
  kind: 'EVENT',
  slug: 'the-killing-of-al-yaman',
  name: "مقتل اليمان",
  nameTransliterated: "The killing of al-Yaman",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'hudhayfah-ibn-al-yaman' }],
  reports: [
    {
      isnad: sahih('bukhari', 4065, 0, 148),
      source: { slug: 'sahih-al-bukhari', hadith: 4065, url: 'https://sunnah.com/bukhari:4065' },
      moments: [
        {
          title: "«أي عباد الله أخراكم»",
          text: sahih('bukhari', 4065, 149, 331),
          people: [],
          turns: [
            { text: sahih('bukhari', 4065, 149, 199) },
            { text: sahih('bukhari', 4065, 200, 275), speaker: { name: "إبليس" }, lead: sahih('bukhari', 4065, 200, 243) },
            { text: sahih('bukhari', 4065, 276, 331) },
          ],
        },
        {
          title: "«أي عباد الله أبي أبي»",
          text: sahih('bukhari', 4065, 332, 530),
          people: ['hudhayfah-ibn-al-yaman'],
          turns: [
            { text: sahih('bukhari', 4065, 332, 427), speaker: { person: "hudhayfah-ibn-al-yaman", name: "حذيفة" }, lead: sahih('bukhari', 4065, 332, 395) },
            { text: sahih('bukhari', 4065, 428, 487) },
            { text: sahih('bukhari', 4065, 488, 530), speaker: { person: "hudhayfah-ibn-al-yaman", name: "حذيفة" }, lead: sahih('bukhari', 4065, 488, 507) },
          ],
        },
        {
          title: "بقية خير",
          text: sahih('bukhari', 4065, 531, 755),
          people: ['hudhayfah-ibn-al-yaman'],
          turns: [
            { text: sahih('bukhari', 4065, 531, 755) },
          ],
        },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theKillingOfAlYaman;
