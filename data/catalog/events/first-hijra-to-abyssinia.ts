import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Name and type match the seeded event, which still authors it; this module
 * only adds the people the sources place there. Its year and location stay the
 * seed's, since neither entry gives them.
 *
 * The first two came from their own Siyar entries. The rest come from the
 * sira's chapter two, where Ibn Ishaq names the first party outright. Only
 * those with subjects in the app are here; his roster runs to eighty-three.
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
    { person: 'uthman-ibn-affan', claims: ['uthman/hijra-habasha-first'] },
    { person: 'ruqayyah-bint-muhammad', claims: ['ruqayyah/hijra-habasha-first'] },
    // prophet-muhammad-sira already names him among Ibn Ishaq's first party;
    // his own Siyar entry corroborates a migration without naming which.
    { person: 'abu-hudhayfah', claims: ['abu-hudhayfah/hijra-habasha-first', 'abu-hudhayfah-siyar13/hijra-first'] },
    { person: 'musab-ibn-umayr', claims: ['musab/hijra-habasha-first'] },
    { person: 'abu-salamah', claims: ['abu-salamah/hijra-habasha-first'] },
    { person: 'umm-salamah', claims: ['umm-salamah/hijra-habasha-first'] },
    { person: 'uthman-ibn-mazun', claims: ['ibn-mazun/hijra-habasha-first'] },
    { person: 'amir-ibn-rabiah', claims: ['amir-ibn-rabiah/hijra-habasha-first'] },
    { person: 'suhail-ibn-bayda', claims: ['suhail/hijra-habasha-first'] },
  ],
} satisfies CatalogEvent;

export default firstHijraToAbyssinia;
