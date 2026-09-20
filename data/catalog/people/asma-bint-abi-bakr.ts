import type { CatalogPerson } from '@/lib/catalog/types';

// ذات النطاقين is earned in this chapter, not merely reported: she cut her
// waistband to tie the provisions for the hijra. Seed-declared, so additive.
const asmaBintAbiBakr = {
  kind: 'PERSON',
  slug: 'asma-bint-abi-bakr',
  name: 'أسماء بنت أبي بكر',
  nameTransliterated: 'Asma bint Abi Bakr',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: ['asma/sex'] },
  },
  titles: [{ title: 'dhat-an-nitaqayn', claims: ['asma/dhat-an-nitaqayn'] }],
  relations: [],
} satisfies CatalogPerson;

export default asmaBintAbiBakr;
