import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Abd Allah ibn Rawahah fainted and his sister Amrah wept over him listing his virtues; when he came to he said every word
 * she said was put to him «آنت كذلك», and when he died she did not weep. Told from Sahih al-Bukhari (al-Maghazi, the
 * chapter on Mu'tah): al-Nu'man ibn Bashir's 4267 first, whole; then 4268, whole, which gives the story «بهذا» and adds
 * that she did not weep when he died. Amrah has no catalog subject and is not linked.
 */
const abdullahIbnRawahahFaints = {
  kind: 'EVENT',
  slug: 'abdullah-ibn-rawahah-faints',
  name: "إغماء عبد الله بن رواحة",
  nameTransliterated: "Abd Allah ibn Rawahah faints",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abdullah-ibn-rawahah' }],
  reports: [
    {
      isnad: sahih('bukhari', 4267, 0, 156),
      source: { slug: 'sahih-al-bukhari', hadith: 4267, url: 'https://sunnah.com/bukhari:4267' },
      moments: [
        { title: "أخته تعدد عليه", text: sahih('bukhari', 4267, 157, 295), people: ['abdullah-ibn-rawahah'] },
        { title: "«آنت كذلك»", text: sahih('bukhari', 4267, 296, 372), people: ['abdullah-ibn-rawahah'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4268, 0, 115),
      source: { slug: 'sahih-al-bukhari', hadith: 4268, url: 'https://sunnah.com/bukhari:4268' },
      moments: [
        { title: "فلما مات لم تبك عليه", text: sahih('bukhari', 4268, 116, 207), people: ['abdullah-ibn-rawahah'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default abdullahIbnRawahahFaints;
