import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * On his way to the Prophet ﷺ Abu Hurayrah recited «يا ليلة من طولها وعنائها» and a slave of his ran off; as he sat with
 * the Prophet ﷺ after his pledge the slave appeared, «يا أبا هريرة، هذا غلامك», and he freed him for Allah. Told from Sahih
 * al-Bukhari 4393 (al-Maghazi, the story of Daws and al-Tufayl), whole.
 */
const abuHurayrahComes = {
  kind: 'EVENT',
  slug: 'abu-hurayrah-comes',
  name: "قدوم أبي هريرة",
  nameTransliterated: "Abu Hurayrah comes to the Prophet",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abu-hurayrah' }, { person: 'prophet-muhammad' }],
  reports: [
    {
      isnad: sahih('bukhari', 4393, 0, 132),
      source: { slug: 'sahih-al-bukhari', hadith: 4393, url: 'https://sunnah.com/bukhari:4393' },
      moments: [
        { title: "«يا ليلة من طولها وعنائها»", text: sahih('bukhari', 4393, 133, 317), people: ['abu-hurayrah'] },
        { title: "«هو لوجه الله»", text: sahih('bukhari', 4393, 318, 531), people: ['abu-hurayrah', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default abuHurayrahComes;
