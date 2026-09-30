import { type CatalogPerson } from '@/lib/catalog/types';

/**
 * Authored from data/history/batches/umm-shareek, entry 33 of سير
 * أعلام النبلاء (النجارية). The name is contested across the wider
 * tradition (العامرية / الدوسية), but Siyar's own entry is this short one; see
 * the batch's summary.md for the scope call.
 */
const ummShareek = {
  kind: 'PERSON',
  slug: 'umm-shareek',
  name: 'أم شريك',
  nameTransliterated: 'Umm Shareek',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: ['umm-shareek-siyar33/sex'] },
    kunya: { value: 'أم شريك', claims: ['umm-shareek-siyar33/kunya'] },
    tribalAffiliation: { value: 'النجارية', claims: ['umm-shareek-siyar33/tribal-affiliation'] },
    virtues: {
      value:
        'عن قتادة: أن النبي صلى الله عليه وسلم قال: إني أحب أن أتزوج في الأنصار، ثم إني أكره غيرتهن، قال: فلم يدخل بها. نعم، وروى عروة بن الزبير، عن أم شريك: أنها كانت فيمن وهبت نفسها للنبي صلى الله عليه وسلم.',
      claims: ['umm-shareek-siyar33/virtues'],
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: ['umm-shareek-siyar33/titles'] },
  ],
  relations: [],
} satisfies CatalogPerson;

export default ummShareek;
