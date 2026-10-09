import { legacyUnreviewed, type CatalogOrdering } from '@/lib/catalog/types';

// docs/adr/0028-a-stated-ordering-is-recorded-and-its-placement-is-derived.md
const ordering = {
  kind: 'ORDERING',
  earlier: 'second-hijra-to-abyssinia',
  later: 'hijra-to-medina',
  source: 'siyar-alam-al-nubala-risalah',
  claims: legacyUnreviewed,
} satisfies CatalogOrdering;

export default ordering;
