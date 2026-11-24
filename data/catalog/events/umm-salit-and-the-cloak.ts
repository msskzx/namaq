import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Umar was dividing cloaks among the women of Medina and one fine one was left; those with him said to give it to Umm Kulthum
 * bint Ali, and he gave it to Umm Salit of the Ansar, «فإنها كانت تزفر لنا القرب يوم أحد». Told from Sahih al-Bukhari 4071
 * (al-Maghazi, the chapter on the women carrying water at Uhud), whole. Umm Salit has no catalog subject and is not linked.
 */
const ummSalitAndTheCloak = {
  kind: 'EVENT',
  slug: 'umm-salit-and-the-cloak',
  name: "أم سليط والمرط",
  nameTransliterated: "Umm Salit and the cloak",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'umar-ibn-al-khattab' }, { person: 'prophet-muhammad' }, { person: 'umm-kulthum-bint-ali' }],
  reports: [
    {
      isnad: sahih('bukhari', 4071, 0, 127),
      source: { slug: 'sahih-al-bukhari', hadith: 4071, url: 'https://sunnah.com/bukhari:4071' },
      moments: [
        {
          title: "«أعط هذا بنت رسول الله ﷺ التي عندك»",
          text: sahih('bukhari', 4071, 128, 429),
          people: ['umar-ibn-al-khattab', 'prophet-muhammad', 'umm-kulthum-bint-ali'],
          turns: [
            { text: sahih('bukhari', 4071, 128, 269) },
            { text: sahih('bukhari', 4071, 270, 386), speaker: { name: "بعض من عنده" }, lead: sahih('bukhari', 4071, 270, 304) },
            { text: sahih('bukhari', 4071, 387, 429) },
          ],
        },
        {
          title: "«كانت تزفر لنا القرب يوم أحد»",
          text: sahih('bukhari', 4071, 430, 622),
          people: ['umar-ibn-al-khattab', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4071, 430, 472), speaker: { person: "umar-ibn-al-khattab", name: "عمر" }, lead: sahih('bukhari', 4071, 430, 445) },
            { text: sahih('bukhari', 4071, 473, 548) },
            { text: sahih('bukhari', 4071, 549, 622), speaker: { person: "umar-ibn-al-khattab", name: "عمر" }, lead: sahih('bukhari', 4071, 549, 562) },
          ],
        },
      ],
    },
  ],
} satisfies CatalogEvent;

export default ummSalitAndTheCloak;
