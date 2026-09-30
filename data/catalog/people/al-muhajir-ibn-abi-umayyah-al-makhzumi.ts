import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * See data/history/batches/asma-bint-al-numan-al-kindiyyah/summary.md for the
 * marriage claim this module exists to hold the other side of.
 */
const alMuhajirIbnAbiUmayyahAlMakhzumi = {
  kind: 'PERSON',
  slug: 'al-muhajir-ibn-abi-umayyah-al-makhzumi',
  name: 'المهاجر بن أبي أمية',
  nameTransliterated: 'Al-Muhajir ibn Abi Umayyah al-Makhzumi',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    {
      type: 'HUSBAND',
      inverse: 'WIFE',
      to: 'asma-bint-al-numan-al-kindiyyah',
      claims: ['asma-bint-al-numan-al-kindiyyah-siyar/husband-al-muhajir'],
    },
  ],
} satisfies CatalogPerson;

export default alMuhajirIbnAbiUmayyahAlMakhzumi;
