import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * In the hajj the Prophet ﷺ put Abu Bakr over the year before the farewell hajj, Abu Bakr sent Abu Hurayrah with others on
 * the day of sacrifice to proclaim «لا يحج بعد العام مشرك، ولا يطوف بالبيت عريان». Told from Sahih al-Bukhari 4363
 * (al-Maghazi, Abu Bakr's hajj with the people), whole. 4364 is a note on the last surahs sent down.
 */
const theProclamationAtAbuBakrsHajj = {
  kind: 'EVENT',
  slug: 'the-proclamation-at-abu-bakrs-hajj',
  name: "الأذان في حجة أبي بكر",
  nameTransliterated: "The proclamation at Abu Bakr's hajj",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abu-bakr-as-siddiq' }, { person: 'abu-hurayrah' }, { person: 'prophet-muhammad' }],
  reports: [
    {
      isnad: sahih('bukhari', 4363, 0, 155),
      source: { slug: 'sahih-al-bukhari', hadith: 4363, url: 'https://sunnah.com/bukhari:4363' },
      moments: [
        { title: "«لا يحج بعد العام مشرك»", text: sahih('bukhari', 4363, 156, 411), people: ['abu-bakr-as-siddiq', 'abu-hurayrah', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theProclamationAtAbuBakrsHajj;
