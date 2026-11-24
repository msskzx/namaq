import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * In Yemen Jarir told Dhu Kala' and Dhu Amr about the Prophet ﷺ, and Dhu Amr said that if it was as he said, he had passed
 * his term three days ago; on the road riders from Medina said he had died and Abu Bakr was khalifah, the two went back,
 * and Dhu Amr later told Jarir the Arabs would do well while they chose their leaders. Told from Sahih al-Bukhari 4359
 * (al-Maghazi, Jarir's going to Yemen), whole. Dhu Kala' and Dhu Amr have no catalog subject.
 */
const jarirAndDhuAmr = {
  kind: 'EVENT',
  slug: 'jarir-and-dhu-amr',
  name: "جرير وذو عمرو",
  nameTransliterated: "Jarir and Dhu Amr",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'jarir-ibn-abdullah' }, { person: 'abu-bakr-as-siddiq' }],
  reports: [
    {
      isnad: sahih('bukhari', 4359, 0, 156),
      source: { slug: 'sahih-al-bukhari', hadith: 4359, url: 'https://sunnah.com/bukhari:4359' },
      moments: [
        { title: "«لقد مر على أجله منذ ثلاث»", text: sahih('bukhari', 4359, 157, 418), people: ['jarir-ibn-abdullah'] },
        { title: "«قبض رسول الله ﷺ، واستخلف أبو بكر»", text: sahih('bukhari', 4359, 419, 815), people: ['jarir-ibn-abdullah', 'abu-bakr-as-siddiq'] },
        { title: "«لن تزالوا بخير»", text: sahih('bukhari', 4359, 816, 1153), people: ['jarir-ibn-abdullah'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default jarirAndDhuAmr;
