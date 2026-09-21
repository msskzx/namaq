import type { CatalogUtterance } from '@/lib/catalog/types';

// A lament, and the one place in these chapters where a Mother of the
// Believers is the poet. She is his cousin; he is the man the Prophet named in
// the qunut while Mecca held him.
const ummSalamahYaAynFabki = {
  kind: 'UTTERANCE',
  slug: 'umm-salamah-ya-ayn-fabki',
  utteranceKind: 'POETRY',
  speaker: 'umm-salamah',
  textArabic: {
    value: [
      'يا عين فابكي للوليـ ... ـد بن الوليد بن المغيره',
      'قد كان عيثا في السنيـ ... ـن ورحمة فينا وميره',
      'ضخم الدسيعة ماجدا ... يسمو إلى طلب الوتيره',
      'مثل الوليد بن الوليد ... أبي الوليد كفى العشيره',
    ].join('\n'),
    claims: ['umm-salamah/verses-al-walid'],
  },
  fields: {
    occasion: { value: 'بكت بها ابن عمها الوليد بن الوليد بن المغيرة حين توفي.', claims: ['umm-salamah/verses-al-walid'] },
  },
} satisfies CatalogUtterance;

export default ummSalamahYaAynFabki;
