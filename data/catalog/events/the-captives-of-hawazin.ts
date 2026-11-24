import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Hawazin's delegation came as Muslims asking for their wealth and captives; the Prophet ﷺ, who had waited for them more
 * than ten nights after al-Ta'if, had them choose one of the two, they chose the captives, and he asked the Muslims to give
 * them up willingly, sending them back to their leaders to be sure of each one's consent. Told from Sahih al-Bukhari 4318
 * (al-Maghazi, the chapter on Hunayn), whole.
 */
const theCaptivesOfHawazin = {
  kind: 'EVENT',
  slug: 'the-captives-of-hawazin',
  name: "سبي هوازن",
  nameTransliterated: "The captives of Hawazin",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4318, 0, 324),
      source: { slug: 'sahih-al-bukhari', hadith: 4318, url: 'https://sunnah.com/bukhari:4318' },
      moments: [
        { title: "«وأحب الحديث إلي أصدقه»", text: sahih('bukhari', 4318, 325, 904), people: ['prophet-muhammad'] },
        { title: "«إن إخوانكم قد جاؤونا تائبين»", text: sahih('bukhari', 4318, 905, 1320), people: ['prophet-muhammad'] },
        { title: "«قد طيبنا ذلك يا رسول الله»", text: sahih('bukhari', 4318, 1321, 1727), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theCaptivesOfHawazin;
