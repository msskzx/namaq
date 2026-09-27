import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker. Wife Umm Sa'd bint Sa'd ibn
 * al-Rabi (daughter of the companion Saad ibn al-Rabi) and his many
 * children per the retired prisma/personSeedData12.ts entry are not
 * modelled -- none are their own entries in this pipeline.
 */
const zaidIbnThabit = {
  kind: 'PERSON',
  slug: 'zaid-ibn-thabit',
  name: 'زيد بن ثابت',
  nameTransliterated: 'Zaid ibn Thabit',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'زيد بن ثابت بن الضحاك بن زيد بن لوذان بن عمرو بن عبد عوف بن غنم بن مالك بن النجار بن ثعلبة الأنصاري الخزرجي النجاري',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'thabit-ibn-al-dahhak', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default zaidIbnThabit;
