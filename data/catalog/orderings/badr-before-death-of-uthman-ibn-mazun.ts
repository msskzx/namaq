import type { CatalogOrdering } from '@/lib/catalog/types';

// docs/adr/0028-a-stated-ordering-is-recorded-and-its-placement-is-derived.md
const badrBeforeDeathOfUthmanIbnMazun = {
  kind: 'ORDERING',
  earlier: 'badr',
  later: 'death-of-uthman-ibn-mazun',
  source: 'siyar-alam-al-nubala-risalah',
  claims: ['ibn-mazun/death'],
} satisfies CatalogOrdering;

export default badrBeforeDeathOfUthmanIbnMazun;
