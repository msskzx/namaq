import type { CatalogPerson } from '@/lib/catalog/types';

/**
 * Named only as سناء's father in her own entry — see
 * data/history/batches/sanaa-bint-asma-al-sulami. No profile of his own, so
 * this is a graph-only node, docs/extraction-checklist.md's nasab item.
 */
const asmaIbnAlSaltAlSulami = {
  kind: 'PERSON',
  slug: 'asma-ibn-al-salt-al-sulami',
  name: 'أسماء بن الصلت السلمي',
  nameTransliterated: 'Asma ibn al-Salt al-Sulami',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: ['sanaa-bint-asma-al-sulami-siyar/father'] },
  },
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'DAUGHTER', to: 'sanaa-bint-asma-al-sulami', claims: ['sanaa-bint-asma-al-sulami-siyar/father'] },
  ],
} satisfies CatalogPerson;

export default asmaIbnAlSaltAlSulami;
