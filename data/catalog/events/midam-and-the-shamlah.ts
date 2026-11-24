import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * After Khaybar the Prophet's slave Mid'am was killed by a stray arrow at Wadi al-Qura as he unloaded his saddle; the
 * people said «هنيئا له الشهادة», and the Prophet ﷺ said the cloak he had taken from the spoils before the division would
 * blaze on him; a man brought back a sandal strap. Told from Sahih al-Bukhari 4234 (al-Maghazi, the chapter on Khaybar), whole.
 */
const midamAndTheShamlah = {
  kind: 'EVENT',
  slug: 'midam-and-the-shamlah',
  name: "مدعم والشملة",
  nameTransliterated: "Mid'am and the cloak",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4234, 0, 258),
      source: { slug: 'sahih-al-bukhari', hadith: 4234, url: 'https://sunnah.com/bukhari:4234' },
      moments: [
        { title: "عبد يقال له مدعم", text: sahih('bukhari', 4234, 259, 648), people: ['prophet-muhammad'] },
        { title: "«لتشتعل عليه نارا»", text: sahih('bukhari', 4234, 649, 885), people: ['prophet-muhammad'] },
        { title: "جاء رجل بشراك", text: sahih('bukhari', 4234, 886, 1071), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default midamAndTheShamlah;
