import type { CatalogOrdering } from '@/lib/catalog/types';

// docs/adr/0028-a-stated-ordering-is-recorded-and-its-placement-is-derived.md
const firstHijraToAbyssiniaBeforeSecond = {
  kind: 'ORDERING',
  earlier: 'first-hijra-to-abyssinia',
  later: 'second-hijra-to-abyssinia',
  source: 'siyar-alam-al-nubala-risalah',
  claims: ['uthman/hijra-habasha-first', 'jaafar/hijra-habasha-second'],
} satisfies CatalogOrdering;

export default firstHijraToAbyssiniaBeforeSecond;
