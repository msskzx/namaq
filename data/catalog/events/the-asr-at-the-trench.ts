import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * On the day of the trench Umar came after sunset cursing the disbelievers of Quraysh, saying he had hardly prayed before
 * the sun set; the Prophet ﷺ said «والله ما صليتها», went down to Buthan, made wudu, and prayed Asr after sunset and then
 * Maghrib. Told from Sahih al-Bukhari 4112 (al-Maghazi, the chapter on al-Khandaq), whole.
 */
const theAsrAtTheTrench = {
  kind: 'EVENT',
  slug: 'the-asr-at-the-trench',
  name: "العصر يوم الخندق",
  nameTransliterated: "The Asr prayer on the day of the trench",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'umar-ibn-al-khattab' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4112, 0, 128),
      source: { slug: 'sahih-al-bukhari', hadith: 4112, url: 'https://sunnah.com/bukhari:4112' },
      moments: [
        { title: "«ما كدت أن أصلي»", text: sahih('bukhari', 4112, 129, 356), people: ['umar-ibn-al-khattab', 'prophet-muhammad'] },
        { title: "«والله ما صليتها»", text: sahih('bukhari', 4112, 357, 402), people: ['prophet-muhammad'] },
        { title: "صلى العصر بعدما غربت الشمس", text: sahih('bukhari', 4112, 403, 575), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theAsrAtTheTrench;
