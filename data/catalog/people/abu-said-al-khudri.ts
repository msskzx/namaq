import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker. fullName and the companion title
 * are carried from the retired prisma/personSeedData15.ts entry. Father
 * Malik, martyred at Uhud, is not modelled as a separate node.
 */
const abuSaidAlKhudri = {
  kind: 'PERSON',
  slug: 'abu-said-al-khudri',
  name: 'أبو سعيد الخدري',
  nameTransliterated: 'Abu Said al-Khudri',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'سعد بن مالك بن سنان بن ثعلبة بن عبيد بن الأبجر بن عوف بن الحارث بن الخزرج الأنصاري الخزرجي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'BROTHER', inverse: 'BROTHER', to: 'qatadah-ibn-al-numan', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abuSaidAlKhudri;
