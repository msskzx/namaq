import type { CatalogPerson } from '@/lib/catalog/types';

/**
 * Graph-only, from data/history/batches/thabit-ibn-qais, entry 61. The entry
 * names her once, in a single clause, so she has no profile page; what it
 * gives is her name, her father, and the marriage, and all three are cited.
 *
 * The editor's footnote (٤) on printed 312 reports Ibn Abd al-Barr recording a
 * disagreement over her name — the Basrans say جَميلة بنت أبي, the Medinans
 * حبيبة بنت سهل — and Ibn Hajar reading the two as two separate women, hence
 * two separate خلع incidents. Al-Dhahabi's own text says جَميلة and this
 * module follows the text; the competing form stays in the account's notes,
 * and the contest is recorded in the batch's summary rather than resolved.
 */
const jamilahBintAbdAllahIbnAbi = {
  kind: 'PERSON',
  slug: 'jamilah-bint-abd-allah-ibn-abi',
  name: 'جميلة بنت عبد الله بن أبي',
  nameTransliterated: 'Jamilah bint Abdullah ibn Abi',
  hasProfile: false,
  fields: {
    sex: { value: 'FEMALE', claims: ['jamilah-bint-abd-allah-ibn-abi-siyar61/sex'] },
    fullName: {
      value: 'جميلة بنت عبد الله بن أبي ابن سلول',
      claims: ['jamilah-bint-abd-allah-ibn-abi-siyar61/full-name'],
    },
  },
  titles: [],
  relations: [
    {
      type: 'WIFE',
      inverse: 'HUSBAND',
      to: 'thabit-ibn-qais',
      claims: ['thabit-ibn-qais-siyar61/wife-jamilah'],
    },
  ],
} satisfies CatalogPerson;

export default jamilahBintAbdAllahIbnAbi;
