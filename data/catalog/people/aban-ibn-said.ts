import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/aban-ibn-said, entry 49, sharing
// printed page 261 with entry 50. The entry names his father but stops there,
// so the chain deeper than Sa'id rides on the SON edge (docs/extraction-checklist.md,
// "Nasab"). No mother is stated for either brother, so the sibling ties are
// HALF_BROTHER.
const abanIbnSaid = {
  kind: 'PERSON',
  slug: 'aban-ibn-said',
  name: 'أبان بن سعيد',
  nameTransliterated: 'Aban ibn Said',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'أبان بن سعيد الأموي',
      claims: ['aban-ibn-said-siyar49/fullName'],
    },
    kunya: { value: 'أبو الوليد', claims: ['aban-ibn-said-siyar49/kunya'] },
    virtues: {
      value:
        'تأخر إسلامه، كان تاجراً موسراً، سافر إلى الشام، أجار ابن عمه عثمان بن عفان يوم الحديبية، أسلم قبل الفتح وهاجر، قدم المدينة مسلماً، استعمله رسول الله سنة تسع على البحرين، استشهد هو وأخوه خالد يوم أجنادين.',
      claims: ['aban-ibn-said-siyar49/virtues'],
    },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['aban-ibn-said-siyar49/virtues'],
    },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'said-ibn-al-as', claims: ['aban-ibn-said-siyar49/father'] },
    {
      type: 'HALF_BROTHER',
      inverse: 'HALF_BROTHER',
      to: 'khalid-ibn-said',
      claims: ['aban-ibn-said-siyar49/half-brother-khalid'],
    },
    {
      type: 'HALF_BROTHER',
      inverse: 'HALF_BROTHER',
      to: 'amr-ibn-said-al-umawi',
      claims: ['aban-ibn-said-siyar49/half-brother-amr', 'amr-ibn-said-al-umawi-siyar50/brother-aban'],
    },
  ],
} satisfies CatalogPerson;

export default abanIbnSaid;
