import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * Ally (حليف) of Banu Asad ibn Abd al-Uzza, not blood Quraysh, per the
 * retired prisma/personSeedData8.ts entry, which used his real name (Amr)
 * in the nasab chain in place of his father's kunya "Abi Baltaah".
 */
const hatibIbnAbiBaltaah = {
  kind: 'PERSON',
  slug: 'hatib-ibn-abi-baltaah',
  name: 'حاطب بن أبي بلتعة',
  nameTransliterated: 'Hatib ibn Abi Baltaah',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'حاطب بن عمرو بن عمير بن سلمة اللخمي المكي حليف بني أسد بن عبد العزى بن قصي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'amr-ibn-umayr-al-lakhmi', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default hatibIbnAbiBaltaah;
