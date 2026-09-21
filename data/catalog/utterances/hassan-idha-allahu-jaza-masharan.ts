import type { CatalogUtterance } from '@/lib/catalog/types';

// Against the man who bloodied the Prophet's mouth at Uhud. The poem names
// him; the battle's roster does not, because the app has no subject for him.
const hassanIdhaAllahuJazaMasharan = {
  kind: 'UTTERANCE',
  slug: 'hassan-idha-allahu-jaza-masharan',
  utteranceKind: 'POETRY',
  speaker: 'hassan-ibn-thabit',
  battle: 'uhud',
  textArabic: {
    value: [
      'إذا الله جازى معشرا بفعالهم ... ونصرهم الرحمن رب المشارق',
      'فأخزاك ربي يا عتيب بن مالك ... ولقاك قبل الموت إحدى الصواعق',
      'بسطت يمينا للنبي تعمدا ... فأدميت فاه قطعت بالبوارق',
      'فهلا ذكرت الله والمنزل الذي ... تصير إليه عند إحدى البوائق',
    ].join('\n'),
    claims: ['hassan/verses-utaybah'],
  },
  fields: {
    occasion: { value: 'قالها فيمن بسط يده للنبي صلى الله عليه وسلم يوم أحد فأدمى فاه.', claims: ['hassan/verses-utaybah'] },
  },
} satisfies CatalogUtterance;

export default hassanIdhaAllahuJazaMasharan;
