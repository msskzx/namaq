import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * When his pain grew the Prophet ﷺ said «هلموا أكتب لكم كتابا لا تضلوا بعده»; some said pain had overcome him and «حسبنا
 * كتاب الله», those in the house disputed, and he said «قوموا»; Ibn Abbas called it «الرزية كل الرزية». In Sa'id ibn
 * Jubayr's telling he said «دعوني» and charged them with three things. Told from Ibn Abbas's hadith in Sahih al-Bukhari
 * (al-Maghazi, the illness of the Prophet ﷺ), each whole: 4432 first, then 4431. Neither names those who spoke, and no one
 * is linked from them.
 */
const theDayOfThursday = {
  kind: 'EVENT',
  slug: 'the-day-of-thursday',
  name: "يوم الخميس",
  nameTransliterated: "The Thursday",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4432, 0, 206),
      source: { slug: 'sahih-al-bukhari', hadith: 4432, url: 'https://sunnah.com/bukhari:4432' },
      moments: [
        { title: "«هلموا أكتب لكم كتابا لا تضلوا بعده»", text: sahih('bukhari', 4432, 207, 494), people: ['prophet-muhammad'] },
        { title: "«قوموا»", text: sahih('bukhari', 4432, 495, 740), people: ['prophet-muhammad'] },
        { title: "«إن الرزية كل الرزية»", text: sahih('bukhari', 4432, 741, 947), people: [] },
      ],
    },
    {
      isnad: sahih('bukhari', 4431, 0, 130),
      source: { slug: 'sahih-al-bukhari', hadith: 4431, url: 'https://sunnah.com/bukhari:4431' },
      moments: [
        { title: "«ائتوني أكتب لكم كتابا لن تضلوا بعده أبدا»", text: sahih('bukhari', 4431, 131, 505), people: ['prophet-muhammad'] },
        { title: "أوصاهم بثلاث", text: sahih('bukhari', 4431, 506, 699), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theDayOfThursday;
