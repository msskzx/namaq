import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Khabbab asked Ibn Mas'ud whether the young men could recite as he did; Ibn Mas'ud had Alqamah read fifty ayat of Maryam,
 * said «ما أقرأ شيئا إلا وهو يقرؤه», then turned to the gold ring on Khabbab's hand, «ألم يأن لهذا الخاتم أن يلقى», and
 * Khabbab threw it off. Told from Sahih al-Bukhari 4391 (al-Maghazi, the coming of the Ash'aris and the people of Yemen),
 * whole. Alqamah and Zayd ibn Hudayr have no catalog subject. The fifty ayat are not named, so no range is given.
 */
const khabbabsGoldRing = {
  kind: 'EVENT',
  slug: 'khabbabs-gold-ring',
  name: "خاتم خباب",
  nameTransliterated: "Khabbab's gold ring",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abdullah-ibn-masud' }, { person: 'khabbab-ibn-al-aratt' }],
  reports: [
    {
      isnad: sahih('bukhari', 4391, 0, 102),
      source: { slug: 'sahih-al-bukhari', hadith: 4391, url: 'https://sunnah.com/bukhari:4391' },
      moments: [
        { title: "«أيستطيع هؤلاء الشباب أن يقرؤوا كما تقرأ؟»", text: sahih('bukhari', 4391, 103, 382), people: ['abdullah-ibn-masud', 'khabbab-ibn-al-aratt'] },
        { title: "«ما أقرأ شيئا إلا وهو يقرؤه»", text: sahih('bukhari', 4391, 383, 771), people: ['abdullah-ibn-masud'] },
        { title: "«ألم يأن لهذا الخاتم أن يلقى»", text: sahih('bukhari', 4391, 772, 996), people: ['abdullah-ibn-masud', 'khabbab-ibn-al-aratt'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default khabbabsGoldRing;
