import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ promised Jabir three handfuls if the wealth of Bahrain came; it came after his death, and Abu Bakr had it
 * called that anyone owed by the Prophet ﷺ should come; Jabir came and was given, asked again three times and was refused,
 * and Abu Bakr said «وأي داء أدوأ من البخل» and that he had meant to give him each time. Told from Sahih al-Bukhari 4383
 * (al-Maghazi, the story of Oman and Bahrain), whole, with Muhammad ibn Ali's route at its end («خذ مثلها مرتين»).
 */
const jabirAndThePromiseOfBahrain = {
  kind: 'EVENT',
  slug: 'jabir-and-the-promise-of-bahrain',
  name: "جابر ووعد مال البحرين",
  nameTransliterated: "Jabir and the promise of Bahrain's wealth",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'jabir-ibn-abdullah' }, { person: 'abu-bakr-as-siddiq' }],
  reports: [
    {
      isnad: sahih('bukhari', 4383, 0, 135),
      source: { slug: 'sahih-al-bukhari', hadith: 4383, url: 'https://sunnah.com/bukhari:4383' },
      moments: [
        { title: "«لو قد جاء مال البحرين»", text: sahih('bukhari', 4383, 136, 315), people: ['prophet-muhammad', 'jabir-ibn-abdullah'] },
        { title: "فأعطاني", text: sahih('bukhari', 4383, 316, 620), people: ['abu-bakr-as-siddiq', 'jabir-ibn-abdullah', 'prophet-muhammad'] },
        { title: "«وأي داء أدوأ من البخل»", text: sahih('bukhari', 4383, 621, 1133), people: ['jabir-ibn-abdullah', 'abu-bakr-as-siddiq'] },
        { title: "«خذ مثلها مرتين»", text: sahih('bukhari', 4383, 1134, 1347), people: ['jabir-ibn-abdullah', 'abu-bakr-as-siddiq'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default jabirAndThePromiseOfBahrain;
