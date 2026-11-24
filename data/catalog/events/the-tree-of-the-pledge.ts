import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Tariq ibn Abd al-Rahman passed people praying at a mosque they said was the tree of the pledge; Sa'id ibn al-Musayyib told
 * him his father, who had pledged under it, could not find it the next year, «إن أصحاب محمد ﷺ لم يعلموها، وعلمتموها أنتم،
 * فأنتم أعلم». Told from Sahih al-Bukhari 4163 (al-Maghazi, the chapter on al-Hudaybiyah), whole; then al-Musayyib's own
 * shorter words, 4164 and 4162, whole, folded. 4165 is a fragment and is not repeated. Al-Musayyib has no catalog subject
 * and is not linked.
 */
const theTreeOfThePledge = {
  kind: 'EVENT',
  slug: 'the-tree-of-the-pledge',
  name: "شجرة الرضوان",
  nameTransliterated: "The tree of the pledge",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  reports: [
    {
      isnad: sahih('bukhari', 4163, 0, 111),
      source: { slug: 'sahih-al-bukhari', hadith: 4163, url: 'https://sunnah.com/bukhari:4163' },
      moments: [
        { title: "«ما هذا المسجد؟»", text: sahih('bukhari', 4163, 112, 280), people: ['prophet-muhammad'] },
        { title: "«فلما خرجنا من العام المقبل نسيناها»", text: sahih('bukhari', 4163, 281, 526), people: ['prophet-muhammad'] },
        { title: "«فأنتم أعلم»", text: sahih('bukhari', 4163, 527, 639), people: [] },
      ],
    },
    {
      isnad: sahih('bukhari', 4164, 0, 112),
      source: { slug: 'sahih-al-bukhari', hadith: 4164, url: 'https://sunnah.com/bukhari:4164' },
      moments: [
        { title: "«فعميت علينا»", text: sahih('bukhari', 4164, 113, 229), people: [] },
      ],
    },
    {
      isnad: sahih('bukhari', 4162, 0, 187),
      source: { slug: 'sahih-al-bukhari', hadith: 4162, url: 'https://sunnah.com/bukhari:4162' },
      moments: [
        { title: "«فلم أعرفها»", text: sahih('bukhari', 4162, 188, 306), people: [] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theTreeOfThePledge;
