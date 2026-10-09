import type { CatalogOrdering } from '@/lib/catalog/types';

// docs/adr/0028-a-stated-ordering-is-recorded-and-its-placement-is-derived.md
const firstHijraToAbyssiniaBeforeHijraToMedina = {
  kind: 'ORDERING',
  earlier: 'first-hijra-to-abyssinia',
  later: 'hijra-to-medina',
  source: 'siyar-alam-al-nubala-risalah',
  claims: ['abu-salamah/hijra-madinah-first'],
} satisfies CatalogOrdering;

export default firstHijraToAbyssiniaBeforeHijraToMedina;
