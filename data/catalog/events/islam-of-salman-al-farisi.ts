import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * No year: the sira dates his Islam only by where it sits in the narrative,
 * after the Prophet reached Medina and while Salman was still enslaved to an
 * Ansari's palm grove. The long search that brought him there is the book's,
 * not the model's, so the description keeps only the moment he became Muslim.
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
} satisfies CatalogEvent;

export default islamOfSalmanAlFarisi;
