import type { CatalogUtterance } from '@/lib/catalog/types';

// One line, and a threat rather than a poem: Banu Makhzum asked him to
// discipline the young men who had become Muslims, and he warned them off his
// own brother's life before they started.
const hishamIbnAlWalidAlaLaTaqtulanna = {
  kind: 'UTTERANCE',
  slug: 'hisham-ibn-al-walid-ala-la-taqtulanna',
  utteranceKind: 'POETRY',
  textArabic: { value: 'ألا لا تقتلن أخي عييش ... فيبقى بيننا أبدا تلاحي', claims: ['sira/verses-hisham-ibn-al-walid'] },
  fields: {
    speakerName: { value: 'هشام بن الوليد', claims: ['sira/verses-hisham-ibn-al-walid'] },
    occasion: { value: 'قالها لبني مخزوم حين أرادوا أن يعاتبوا فتيتهم الذين أسلموا.', claims: ['sira/verses-hisham-ibn-al-walid'] },
  },
} satisfies CatalogUtterance;

export default hishamIbnAlWalidAlaLaTaqtulanna;
