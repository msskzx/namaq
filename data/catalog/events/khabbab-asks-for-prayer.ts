import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Khabbab ibn al-Aratt came to the Prophet ﷺ, who lay on his cloak in the shade of the Ka'bah, when the Muslims had met
 * hardship from the idolaters, and asked him to pray for them; he sat up, his face reddened, and told of those before
 * who were combed with iron combs and sawn in two and did not leave their religion, and that Allah will complete this
 * matter. Told from Sahih al-Bukhari 3852 (Manaqib al-Ansar, the chapter on what the Prophet ﷺ and his companions met
 * from the idolaters at Makkah), whole.
 */
const khabbabAsksForPrayer = {
  kind: 'EVENT',
  slug: 'khabbab-asks-for-prayer',
  name: "شكوى خباب في ظل الكعبة",
  nameTransliterated: "Khabbab's complaint in the shade of the Ka'bah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'khabbab-ibn-al-aratt' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 3852, 0, 145),
      source: { slug: 'sahih-al-bukhari', hadith: 3852, url: 'https://sunnah.com/bukhari:3852' },
      moments: [
        { title: "«ألا تدعو الله»", text: sahih('bukhari', 3852, 146, 302), people: ['khabbab-ibn-al-aratt', 'prophet-muhammad'] },
        { title: "«ليمشط بمشاط الحديد»", text: sahih('bukhari', 3852, 303, 596), people: ['prophet-muhammad'] },
        { title: "«وليتمنّ الله هذا الأمر»", text: sahih('bukhari', 3852, 597, 763), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default khabbabAsksForPrayer;
