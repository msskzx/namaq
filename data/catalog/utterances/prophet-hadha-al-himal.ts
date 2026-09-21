import type { CatalogUtterance } from '@/lib/catalog/types';

// Rajaz, said while carrying the bricks with everyone else. POETRY rather than
// SAYING because that is what it is, and the kind is not about who said it.
const prophetHadhaAlHimal = {
  kind: 'UTTERANCE',
  slug: 'prophet-hadha-al-himal',
  utteranceKind: 'POETRY',
  speaker: 'prophet-muhammad',
  event: 'building-of-the-prophets-mosque',
  textArabic: { value: 'هذا الحمال لا حمال خيبر ... هذا أبر ربنا وأطهر', claims: ['prophet/rajaz-al-himal'] },
  fields: {
    occasion: { value: 'كان ينقل اللبن مع أصحابه في بناء المسجد.', claims: ['prophet/rajaz-al-himal'] },
  },
} satisfies CatalogUtterance;

export default prophetHadhaAlHimal;
