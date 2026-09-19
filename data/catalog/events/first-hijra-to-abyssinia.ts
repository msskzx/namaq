import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Name and type match the seeded event, which still authors it; this module
 * only adds the person the entry places there. Its year and location stay the
 * seed's, since the entry gives neither.
 */
const firstHijraToAbyssinia = {
  kind: 'EVENT',
  slug: 'first-hijra-to-abyssinia',
  name: 'الهجرة الأولى إلى الحبشة',
  nameTransliterated: 'First Hijra to Abyssinia',
  type: 'HIJRA_HABASHA',
  fields: {},
  people: [
    { person: 'az-zubayr-ibn-al-awwam', claims: ['zubayr/hijra-habasha'] },
    { person: 'abdur-rahman-ibn-awf', claims: ['awf/hijra-habasha'] },
  ],
} satisfies CatalogEvent;

export default firstHijraToAbyssinia;
