import type { CatalogUtterance } from '@/lib/catalog/types';

/**
 * The لامية al-Dhahabi quotes right after the rain came: Abu Talib's word for
 * his nephew before there was anything to call him. The istisqa event already
 * holds the occasion; this holds the verse.
 */
const abuTalibYustasqaAlGhamam = {
  kind: 'UTTERANCE',
  slug: 'abu-talib-yustasqa-al-ghamam',
  utteranceKind: 'POETRY',
  speaker: 'abu-talib',
  subject: 'prophet-muhammad',
  event: 'istisqa-by-abu-talib',
  textArabic: {
    value: [
      'وأبيض يستسقى الغمام بوجهه ... ربيع اليتامى عصمة للأرامل',
      'يطيف به الهلاك من آل هاشم ... فهم عنده في نعمة وفضائل',
      'وميزان عدل لا يخيس شعيرة ... ووزان صدق وزنه غير عائل',
    ].join('\n'),
    claims: ['abu-talib/verses-istisqa'],
  },
  fields: {
    occasion: { value: 'قاله بعد أن استسقى به فأغدق الوادي وأخصب النادي والبادي.', claims: ['abu-talib/verses-istisqa'] },
  },
} satisfies CatalogUtterance;

export default abuTalibYustasqaAlGhamam;
