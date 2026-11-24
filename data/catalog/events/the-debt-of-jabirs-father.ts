import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Jabir's father was killed at Uhud owing a heavy debt; at the date harvest the Prophet ﷺ had Jabir heap each kind apart,
 * walked three times round the largest heap, sat on it and measured out to the creditors until the debt was paid, and the
 * heaps were left as they were. Told from Sahih al-Bukhari 4053 (al-Maghazi, the chapter on Uhud), whole.
 */
const theDebtOfJabirsFather = {
  kind: 'EVENT',
  slug: 'the-debt-of-jabirs-father',
  name: "دين أبي جابر",
  nameTransliterated: "The debt of Jabir's father",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'jabir-ibn-abdullah' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4053, 0, 195),
      source: { slug: 'sahih-al-bukhari', hadith: 4053, url: 'https://sunnah.com/bukhari:4053' },
      moments: [
        { title: "«إني أحب أن يراك الغرماء»", text: sahih('bukhari', 4053, 196, 496), people: ['jabir-ibn-abdullah', 'prophet-muhammad'] },
        { title: "«اذهب فبيدر كل تمر على ناحية»", text: sahih('bukhari', 4053, 497, 763), people: ['prophet-muhammad', 'jabir-ibn-abdullah'] },
        { title: "كأنها لم تنقص تمرة واحدة", text: sahih('bukhari', 4053, 764, 1138), people: ['prophet-muhammad', 'jabir-ibn-abdullah'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theDebtOfJabirsFather;
