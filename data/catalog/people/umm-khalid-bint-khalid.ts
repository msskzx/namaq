import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// docs/adr/0024-read-the-text-and-stop-where-it-is-unclear.md
const ummKhalidBintKhalid = {
  kind: 'PERSON',
  slug: 'umm-khalid-bint-khalid',
  name: 'أم خالد بنت خالد بن سعيد',
  nameTransliterated: 'Umm Khalid bint Khalid ibn Said',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
  ],
} satisfies CatalogPerson;

export default ummKhalidBintKhalid;
