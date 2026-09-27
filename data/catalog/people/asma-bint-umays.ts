import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * Married, in sequence, per the retired prisma/personSeedData10.ts entry:
 * Jaafar ibn Abi Talib (mother by him of Abdullah ibn Jaafar), then Abu Bakr
 * as-Siddiq after Jaafar's death at Mutah, then Ali ibn Abi Talib after Abu
 * Bakr's death.
 */
const asmaBintUmays = {
  kind: 'PERSON',
  slug: 'asma-bint-umays',
  name: 'أسماء بنت عميس',
  nameTransliterated: 'Asma bint Umays',
  hasProfile: true,
  fields: {
    fullName: { value: 'أسماء بنت عميس بن معبد بن الحارث الخثعمية', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'umays-ibn-mabad-al-khathami', claims: legacyUnreviewed },
    { type: 'WIFE', inverse: 'HUSBAND', to: 'jaafar-ibn-abi-talib', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default asmaBintUmays;
