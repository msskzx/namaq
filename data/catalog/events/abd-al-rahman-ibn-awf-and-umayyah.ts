import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Abd al-Rahman ibn Awf and Umayyah ibn Khalaf agreed in writing to guard each other's people; at Badr he took Umayyah up a
 * hill to save him, Bilal saw him and cried «لا نجوت إن نجا أمية», the Ansar overtook them and killed Umayyah under Abd
 * al-Rahman's own body. Told from Sahih al-Bukhari 2301 (al-Wakalah), whole; then 3971 (al-Maghazi, the chapter on the
 * killing of Abu Jahl), the short telling «فذكر قتله وقتل ابنه», whole, folded. His son has no catalog subject and is not
 * linked.
 */
const abdAlRahmanIbnAwfAndUmayyah = {
  kind: 'EVENT',
  slug: 'abd-al-rahman-ibn-awf-and-umayyah',
  name: "عبد الرحمن بن عوف وأمية بن خلف",
  nameTransliterated: "Abd al-Rahman ibn Awf and Umayyah ibn Khalaf",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abdur-rahman-ibn-awf' }, { person: 'umayyah-ibn-khalaf' }, { person: 'bilal-ibn-rabah' }],
  reports: [
    {
      isnad: sahih('bukhari', 2301, 0, 239),
      source: { slug: 'sahih-al-bukhari', hadith: 2301, url: 'https://sunnah.com/bukhari:2301' },
      moments: [
        { title: "«لا أعرف الرحمن»", text: sahih('bukhari', 2301, 240, 523), people: ['abdur-rahman-ibn-awf', 'umayyah-ibn-khalaf'] },
        { title: "«لا نجوت إن نجا أمية»", text: sahih('bukhari', 2301, 524, 817), people: ['abdur-rahman-ibn-awf', 'bilal-ibn-rabah', 'umayyah-ibn-khalaf'] },
        { title: "تخللوه بالسيوف من تحتي", text: sahih('bukhari', 2301, 818, 1252), people: ['abdur-rahman-ibn-awf', 'umayyah-ibn-khalaf'] },
      ],
    },
    {
      isnad: sahih('bukhari', 3971, 0, 213),
      source: { slug: 'sahih-al-bukhari', hadith: 3971, url: 'https://sunnah.com/bukhari:3971' },
      moments: [
        {
          title: "«لا نجوت إن نجا أمية»",
          text: sahih('bukhari', 3971, 214, 367),
          people: ['abdur-rahman-ibn-awf', 'umayyah-ibn-khalaf', 'bilal-ibn-rabah'],
          turns: [
            { text: sahih('bukhari', 3971, 214, 314) },
            { text: sahih('bukhari', 3971, 315, 367), speaker: { person: "bilal-ibn-rabah", name: "بلال" }, lead: sahih('bukhari', 3971, 315, 331) },
          ],
        },
      ],
    },
  ],
} satisfies CatalogEvent;

export default abdAlRahmanIbnAwfAndUmayyah;
