import type { CatalogUtterance } from '@/lib/catalog/types';

// Rajaz, said circling the House when the boy he had sent after his camels was
// late back. The man who heard it did not know who he was until he asked.
const abdAlMuttalibRabbiRuddaIlayya = {
  kind: 'UTTERANCE',
  slug: 'abd-al-muttalib-rabbi-rudda-ilayya',
  utteranceKind: 'POETRY',
  speaker: 'abd-al-muttalib-ibn-hashim',
  subject: 'prophet-muhammad',
  textArabic: {
    value: 'رب رد إليّ راكبي محمدا ... يا رب رده واصطنع عندي يدا',
    claims: ['abd-al-muttalib/verses-rajaz'],
  },
  fields: {
    occasion: { value: 'كان يطوف بالبيت ويرتجز بها وقد احتبس عليه في طلب إبل له.', claims: ['abd-al-muttalib/verses-rajaz'] },
  },
} satisfies CatalogUtterance;

export default abdAlMuttalibRabbiRuddaIlayya;
