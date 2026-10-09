import type { CatalogOrdering } from '@/lib/catalog/types';

// docs/adr/0028-a-stated-ordering-is-recorded-and-its-placement-is-derived.md
const ordering = {
  kind: 'ORDERING',
  earlier: 'islam-of-az-zubayr',
  later: 'first-hijra-to-abyssinia',
  source: 'siyar-alam-al-nubala-risalah',
  claims: ['zubayr/islam', 'zubayr/muslims-left-habasha'],
} satisfies CatalogOrdering;

export default ordering;
