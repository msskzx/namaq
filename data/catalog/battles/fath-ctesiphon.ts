import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

// Carried, not cited. His entry has him settle at al-Mada'in after Qadisiyyah
// and lead at Jalula, but it never narrates this conquest, so the participation
// the retired seed row held keeps the legacy marker.
const fathCtesiphon = {
  kind: 'BATTLE',
  slug: 'fath-ctesiphon',
  name: 'فتح المدائن',
  nameTransliterated: 'Conquest of Ctesiphon',
  fields: { engagement: { value: 'BATTLE', claims: legacyUnreviewed },},
  participants: [
    { person: 'saad-ibn-abi-waqqas', isMuslim: true, claims: legacyUnreviewed },
  ],
} satisfies CatalogBattle;

export default fathCtesiphon;
