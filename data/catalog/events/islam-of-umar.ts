import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The section is three du'as and Ibn Mas'ud's line about what followed; it
 * never narrates the conversion itself, so the description is the du'a and the
 * event carries no location.
 */
const islamOfUmar = {
  kind: 'EVENT',
  slug: 'islam-of-umar',
  name: 'إسلام عمر بن الخطاب',
  nameTransliterated: 'The Islam of Umar ibn al-Khattab',
  type: 'OTHER',
  fields: {
    description: {
      value:
        'قال النبي صلى الله عليه وسلم: (اللهم أعز الإسلام بأحب هذين الرجلين إليك: بعمر بن الخطاب أو بأبي جهل بن هشام) ، وقال: (اللهم أعز الإسلام بعمر بن الخطاب خاصة) . قال ابن مسعود: ما زلنا أعزة منذ أسلم عمر.',
      claims: ['umar/islam'],
    },
  },
  people: [
    { person: 'umar-ibn-al-khattab', claims: ['umar/islam'] },
    { person: 'prophet-muhammad', claims: ['umar/islam'] },
  ],
} satisfies CatalogEvent;

export default islamOfUmar;
