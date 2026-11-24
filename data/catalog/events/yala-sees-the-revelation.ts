import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Ya'la ibn Umayyah wished to see the Prophet ﷺ as revelation came down; at al-Ji'ranah a bedouin in a perfumed cloak asked
 * about his umrah, Umar beckoned Ya'la, who put his head in and saw him red-faced and breathing heavily, and when it lifted
 * he answered the man. Told from Sahih al-Bukhari 4329 (al-Maghazi, the raid of al-Ta'if), whole. The bedouin is not named.
 */
const yalaSeesTheRevelation = {
  kind: 'EVENT',
  slug: 'yala-sees-the-revelation',
  name: "يعلى يرى الوحي ينزل",
  nameTransliterated: "Ya'la sees the revelation come down",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'yala-ibn-umayyah' }, { person: 'prophet-muhammad' }, { person: 'umar-ibn-al-khattab' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4329, 0, 201),
      source: { slug: 'sahih-al-bukhari', hadith: 4329, url: 'https://sunnah.com/bukhari:4329' },
      moments: [
        { title: "«ليتني أرى رسول الله ﷺ حين ينزل عليه»", text: sahih('bukhari', 4329, 202, 561), people: ['yala-ibn-umayyah', 'prophet-muhammad'] },
        { title: "محمر الوجه يغط", text: sahih('bukhari', 4329, 562, 743), people: ['umar-ibn-al-khattab', 'yala-ibn-umayyah', 'prophet-muhammad'] },
        { title: "«أما الطيب الذي بك فاغسله»", text: sahih('bukhari', 4329, 744, 1001), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default yalaSeesTheRevelation;
