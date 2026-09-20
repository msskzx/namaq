import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * She and Abu Talib died in one year, which the chapter states and does not
 * number. Their order is disputed and the model has one description to hold it
 * in, so the description names both readings: al-Waqidi has her die thirty-five
 * days before him, al-Hakim three days after. `sira/death-khadijah-order-alt`
 * is DISPUTED for the second.
 */
const deathOfKhadijah = {
  kind: 'EVENT',
  slug: 'death-of-khadijah',
  name: 'وفاة خديجة بنت خويلد',
  nameTransliterated: 'The Death of Khadijah bint Khuwaylid',
  type: 'DEATH',
  fields: {
    description: {
      value:
        'ماتت خديجة وأبو طالب في عام واحد، فتتابعت على رسول الله صلى الله عليه وسلم المصائب بهلاكهما. قال الواقدي: توفيت قبل أبي طالب بخمسة وثلاثين يوما، وقال الحاكم: بل كان موتها بعد موته بثلاثة أيام.',
      claims: ['sira/death-khadijah', 'sira/death-khadijah-order-alt'],
    },
  },
  people: [{ person: 'khadijah-bint-khuwaylid', claims: ['sira/death-khadijah'] }],
} satisfies CatalogEvent;

export default deathOfKhadijah;
