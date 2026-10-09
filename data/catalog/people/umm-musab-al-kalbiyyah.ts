import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// docs/adr/0024-read-the-text-and-stop-where-it-is-unclear.md
const ummMusabAlKalbiyyah = {
  kind: 'PERSON',
  slug: 'umm-musab-al-kalbiyyah',
  name: 'أم مصعب الكلبية',
  nameTransliterated: 'Umm Musab al-Kalbiyyah',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default ummMusabAlKalbiyyah;
