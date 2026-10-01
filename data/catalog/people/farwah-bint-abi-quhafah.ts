import { type CatalogPerson } from '@/lib/catalog/types';

/**
 * Named only inside al-Ash'ath ibn Qais's entry: Abu Bakr married her to him
 * after his reconciliation (data/history/batches/al-ashath-ibn-qais,
 * wife-farwah). A graph-only person, so this module carries the relation
 * from her own side and nothing else.
 */
const farwahBintAbiQuhafah = {
  kind: 'PERSON',
  slug: 'farwah-bint-abi-quhafah',
  name: 'فروة بنت أبي قحافة',
  nameTransliterated: 'Farwah bint Abi Quhafah',
  hasProfile: false,
  fields: {
    sex: { value: 'FEMALE', claims: ['al-ashath-ibn-qais-siyar8/wife-farwah'] },
  },
  titles: [],
  relations: [
    {
      type: 'WIFE',
      inverse: 'HUSBAND',
      to: 'al-ashath-ibn-qais',
      claims: ['al-ashath-ibn-qais-siyar8/wife-farwah'],
    },
  ],
} satisfies CatalogPerson;

export default farwahBintAbiQuhafah;
