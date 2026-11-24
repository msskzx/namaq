import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The people were thirsty at al-Hudaybiyah with no water but what was in his small vessel; he put his hand in it and the
 * water gushed from between his fingers like springs, and fifteen hundred drank and made wudu. Told from Sahih al-Bukhari
 * 4152 (al-Maghazi, the chapter on al-Hudaybiyah), whole.
 */
const waterFromHisFingersAtAlHudaybiyah = {
  kind: 'EVENT',
  slug: 'water-from-his-fingers-at-al-hudaybiyah',
  name: "الماء يفور من بين أصابعه يوم الحديبية",
  nameTransliterated: "Water from his fingers at al-Hudaybiyah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'jabir-ibn-abdullah' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4152, 0, 127),
      source: { slug: 'sahih-al-bukhari', hadith: 4152, url: 'https://sunnah.com/bukhari:4152' },
      moments: [
        { title: "«ما لكم؟»", text: sahih('bukhari', 4152, 128, 413), people: ['prophet-muhammad'] },
        { title: "يفور من بين أصابعه", text: sahih('bukhari', 4152, 414, 574), people: ['prophet-muhammad'] },
        { title: "«لو كنا مائة ألف لكفانا»", text: sahih('bukhari', 4152, 575, 699), people: ['jabir-ibn-abdullah'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default waterFromHisFingersAtAlHudaybiyah;
