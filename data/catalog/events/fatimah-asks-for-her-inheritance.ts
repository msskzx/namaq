import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Fatimah sent to Abu Bakr asking for her inheritance from the Prophet ﷺ; he answered «لا نورث ما تركنا صدقة» and would
 * change nothing, and she kept away from him until she died six months later; Ali buried her by night, then sent for Abu
 * Bakr alone, they spoke and wept, and Ali gave his pledge before the people. Told from Sahih al-Bukhari 4240 (al-Maghazi, the
 * chapter on Khaybar), whole: our copy prints 4241 inside it. 4035–4036, the same hadith from Ma'mar, is cut in two in our
 * copy and not repeated.
 *
 * Then Aisha's same hadith in Sahih Muslim 1759 (al-Jihad, «لا نورث، ما تركنا فهو صدقة»), the first of its routes, whole.
 */
const fatimahAsksForHerInheritance = {
  kind: 'EVENT',
  slug: 'fatimah-asks-for-her-inheritance',
  name: "فاطمة تسأل ميراثها",
  nameTransliterated: "Fatimah asks for her inheritance",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'fatimah-bint-muhammad' }, { person: 'abu-bakr-as-siddiq' }, { person: 'prophet-muhammad' }, { person: 'ali-ibn-abi-talib' }, { person: 'umar-ibn-al-khattab' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4240, 0, 120),
      source: { slug: 'sahih-al-bukhari', hadith: 4240, url: 'https://sunnah.com/bukhari:4240' },
      moments: [
        { title: "تسأله ميراثها", text: sahih('bukhari', 4240, 121, 337), people: ['fatimah-bint-muhammad', 'abu-bakr-as-siddiq', 'prophet-muhammad'] },
        { title: "«لا نورث، ما تركنا صدقة»", text: sahih('bukhari', 4240, 338, 692), people: ['abu-bakr-as-siddiq', 'prophet-muhammad'] },
        { title: "فهجرته فلم تكلمه حتى توفيت", text: sahih('bukhari', 4240, 693, 912), people: ['abu-bakr-as-siddiq', 'fatimah-bint-muhammad', 'prophet-muhammad'] },
        { title: "دفنها زوجها علي ليلا", text: sahih('bukhari', 4240, 913, 1025), people: ['ali-ibn-abi-talib', 'fatimah-bint-muhammad', 'abu-bakr-as-siddiq'] },
        { title: "«لا تدخل عليهم وحدك»", text: sahih('bukhari', 4240, 1026, 1495), people: ['ali-ibn-abi-talib', 'abu-bakr-as-siddiq', 'umar-ibn-al-khattab'] },
        { title: "«ولكنك استبددت علينا بالأمر»", text: sahih('bukhari', 4240, 1496, 1780), people: ['abu-bakr-as-siddiq', 'ali-ibn-abi-talib', 'prophet-muhammad'] },
        { title: "«لقرابة رسول الله ﷺ أحب إلي أن أصل من قرابتي»", text: sahih('bukhari', 4240, 1781, 2148), people: ['abu-bakr-as-siddiq', 'prophet-muhammad'] },
        { title: "«موعدك العشية للبيعة»", text: sahih('bukhari', 4240, 2149, 2219), people: ['ali-ibn-abi-talib', 'abu-bakr-as-siddiq'] },
        { title: "فسر بذلك المسلمون", text: sahih('bukhari', 4240, 2220, 2851), people: ['abu-bakr-as-siddiq', 'ali-ibn-abi-talib'] },
      ],
    },
    {
      isnad: sahih('muslim', 1759, 0, 180),
      source: { slug: 'sahih-muslim', hadith: 1759, url: 'https://sunnah.com/muslim:1759' },
      moments: [
        { title: "تسأله ميراثها", text: sahih('muslim', 1759, 181, 388), people: ['fatimah-bint-muhammad', 'abu-bakr-as-siddiq', 'prophet-muhammad'] },
        { title: "«لا نورث ما تركنا صدقة»", text: sahih('muslim', 1759, 389, 733), people: ['abu-bakr-as-siddiq', 'prophet-muhammad'] },
        { title: "فهجرته فلم تكلمه حتى توفيت", text: sahih('muslim', 1759, 734, 958), people: ['abu-bakr-as-siddiq', 'fatimah-bint-muhammad', 'prophet-muhammad'] },
        { title: "دفنها زوجها علي ليلا", text: sahih('muslim', 1759, 959, 1315), people: ['ali-ibn-abi-talib', 'fatimah-bint-muhammad', 'abu-bakr-as-siddiq'] },
        { title: "«لا تدخل عليهم وحدك»", text: sahih('muslim', 1759, 1316, 1586), people: ['ali-ibn-abi-talib', 'abu-bakr-as-siddiq', 'umar-ibn-al-khattab'] },
        { title: "«ولكنك استبددت علينا بالأمر»", text: sahih('muslim', 1759, 1587, 2323), people: ['abu-bakr-as-siddiq', 'ali-ibn-abi-talib', 'prophet-muhammad'] },
        { title: "«موعدك العشية للبيعة»", text: sahih('muslim', 1759, 2324, 2393), people: ['ali-ibn-abi-talib', 'abu-bakr-as-siddiq'] },
        { title: "فسر بذلك المسلمون", text: sahih('muslim', 1759, 2394, 3022), people: ['abu-bakr-as-siddiq', 'ali-ibn-abi-talib'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default fatimahAsksForHerInheritance;
