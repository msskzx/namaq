import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * At the trench Jabir saw the Prophet ﷺ with a stone bound to his belly from hunger, and he and his wife made a little
 * barley bread and a kid; he asked the Prophet ﷺ to come with one or two, and he brought all the people of the trench, broke
 * the bread and ladled the meat until a thousand had eaten and the pot still bubbled as it was. Told from Sahih al-Bukhari
 * 4101 (al-Maghazi, the chapter on al-Khandaq), whole, the fullest; then 4102, whole, folded. Jabir's wife has no catalog
 * subject and is not linked.
 */
const jabirsFoodAtTheTrench = {
  kind: 'EVENT',
  slug: 'jabirs-food-at-the-trench',
  name: "طعام جابر يوم الخندق",
  nameTransliterated: "Jabir's food at the trench",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'jabir-ibn-abdullah' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4101, 0, 138),
      source: { slug: 'sahih-al-bukhari', hadith: 4101, url: 'https://sunnah.com/bukhari:4101' },
      moments: [
        { title: "كدية عرضت في الخندق", text: sahih('bukhari', 4101, 139, 488), people: ['prophet-muhammad'] },
        { title: "«عندي شعير وعناق»", text: sahih('bukhari', 4101, 489, 774), people: ['jabir-ibn-abdullah', 'prophet-muhammad'] },
        { title: "«قل لها: لا تنزع البرمة»", text: sahih('bukhari', 4101, 775, 1184), people: ['jabir-ibn-abdullah', 'prophet-muhammad'] },
        { title: "«ادخلوا ولا تضاغطوا»", text: sahih('bukhari', 4101, 1185, 1381), people: ['jabir-ibn-abdullah', 'prophet-muhammad'] },
        { title: "حتى شبعوا وبقي بقية", text: sahih('bukhari', 4101, 1382, 1700), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4102, 0, 202),
      source: { slug: 'sahih-al-bukhari', hadith: 4102, url: 'https://sunnah.com/bukhari:4102' },
      moments: [
        { title: "«هل عندك شيء؟»", text: sahih('bukhari', 4102, 203, 569), people: ['jabir-ibn-abdullah', 'prophet-muhammad'] },
        { title: "«لا تفضحني برسول الله ﷺ»", text: sahih('bukhari', 4102, 570, 834), people: ['jabir-ibn-abdullah', 'prophet-muhammad'] },
        { title: "«إن جابرا قد صنع سورا»", text: sahih('bukhari', 4102, 835, 1046), people: ['prophet-muhammad', 'jabir-ibn-abdullah'] },
        { title: "فبصق فيه وبارك", text: sahih('bukhari', 4102, 1047, 1389), people: ['prophet-muhammad', 'jabir-ibn-abdullah'] },
        { title: "«وإن برمتنا لتغط كما هي»", text: sahih('bukhari', 4102, 1390, 1556), people: ['jabir-ibn-abdullah'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default jabirsFoodAtTheTrench;
