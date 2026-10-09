import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// docs/adr/0024-read-the-text-and-stop-where-it-is-unclear.md
const atikahBintZayd = {
  kind: 'PERSON',
  slug: 'atikah-bint-zayd',
  name: 'عاتكة بنت زيد',
  nameTransliterated: 'Atikah bint Zayd',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'zayd-ibn-amr-ibn-nufayl', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default atikahBintZayd;
