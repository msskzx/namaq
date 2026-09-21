import type { CatalogPerson } from '@/lib/catalog/types';

/**
 * No seed file declares him, so this module is his only author. He is a
 * Companion by the entry's own account -- he took the Prophet's hand on Islam,
 * and on his people's behalf as well -- and the chapter gives him a section of
 * his own that the app had nothing for.
 */
const dimadAlAzdi = {
  kind: 'PERSON',
  slug: 'dimad-al-azdi',
  name: 'ضماد الأزدي',
  nameTransliterated: 'Dimad al-Azdi',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['dimad/sex'] },
    virtues: {
      value:
        'قال: لقد سمعت قول الكهنة والسحرة والشعراء، فما سمعت مثل هؤلاء الكلمات، ولقد بلغن قاموس البحر.',
      claims: ['dimad/virtues'],
    },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default dimadAlAzdi;
