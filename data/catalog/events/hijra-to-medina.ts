import type { CatalogEvent } from '@/lib/catalog/types';

// docs/plans/time-layer.md
const hijraToMedina = {
  kind: 'EVENT',
  slug: 'hijra-to-medina',
  name: 'هجرة إلى المدينة',
  nameTransliterated: 'Hijra to Medina',
  type: 'HIJRA',
  fields: {},
  dateParts: { hijriMonth: { value: 3, claims: ['sira/hijra-madinah'] } },
  people: [
    { person: 'az-zubayr-ibn-al-awwam', claims: ['zubayr/hijra-madinah'] },
    { person: 'abdur-rahman-ibn-awf', claims: ['awf/hijra-madinah'] },
    { person: 'prophet-muhammad', claims: ['sira/hijra-madinah'] },
    { person: 'abu-bakr-as-siddiq', claims: ['abu-bakr/hijra-cave'] },
    // Ibn Ishaq makes him the first of all of them, a year before the greater
    // Aqaba, not one of the party that left with the Prophet.
    { person: 'abu-salamah', claims: ['abu-salamah/hijra-madinah-first'] },
    { person: 'abu-ayyub-al-ansari', claims: ['abu-ayyub/hijra-host'] },
  ],
} satisfies CatalogEvent;

export default hijraToMedina;
