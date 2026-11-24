import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * No year: the sira dates his Islam only by where it sits in the narrative,
 * after the Prophet reached Medina and while Salman was still enslaved to an
 * Ansari's palm grove. The long search that brought him there is the book's,
 * not the model's, so the description keeps only the moment he became Muslim.
 *
 * Its reports are Sahih al-Bukhari's two from Salman in its chapter on his islam (Manaqib al-Ansar), each whole: 3946
 * «من رب إلى رب», then 3947 «أنا من رام هرمز». His long story is Ibn Ishaq's and waits (owner, 2026-11-22). Not
 * tagged ISLAM: neither text tells the islam itself. 3948 in the chapter is a date, not told.
 */
const islamOfSalmanAlFarisi = {
  kind: 'EVENT',
  slug: 'islam-of-salman-al-farisi',
  name: 'إسلام سلمان الفارسي',
  nameTransliterated: 'Islam of Salman al-Farisi',
  type: 'OTHER',
  fields: {
    description: {
      value:
        'أسلم سلمان بالمدينة بعد الهجرة، حين اختبر رسول الله صلى الله عليه وسلم بالصدقة والهدية، ثم رأى خاتم النبوة بين كتفيه مثل بيضة الحمامة.',
      claims: ['salman/islam'],
    },
  },
  people: [{ person: 'salman-al-farisi', claims: ['salman/islam'] }],
  reports: [
    {
      isnad: sahih('bukhari', 3946, 0, 142),
      source: { slug: 'sahih-al-bukhari', hadith: 3946, url: 'https://sunnah.com/bukhari:3946' },
      moments: [
        { title: "«من رب إلى رب»", text: sahih('bukhari', 3946, 143, 205), people: ['salman-al-farisi'] },
      ],
    },
    {
      isnad: sahih('bukhari', 3947, 0, 97),
      source: { slug: 'sahih-al-bukhari', hadith: 3947, url: 'https://sunnah.com/bukhari:3947' },
      moments: [
        { title: "«أنا من رام هرمز»", text: sahih('bukhari', 3947, 98, 167), people: ['salman-al-farisi'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default islamOfSalmanAlFarisi;
