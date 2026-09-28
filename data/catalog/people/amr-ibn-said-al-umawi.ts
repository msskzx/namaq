import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/amr-ibn-said-al-umawi, entry 50, the
// page between his brothers Khalid (entry 48) and Aban (entry 49).
const amrIbnSaidAlUmawi = {
  kind: 'PERSON',
  slug: 'amr-ibn-said-al-umawi',
  name: 'عمرو بن سعيد الأموي',
  nameTransliterated: 'Amr ibn Said al-Umawi',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'عمرو بن سعيد بن العاص الأموي',
      claims: ['amr-ibn-said-al-umawi-siyar50/fullName'],
    },
    virtues: {
      value:
        'له هجرتان: إلى الحبشة ثم إلى المدينة، ورجع عن عمله حين بلغه موت رسول الله صلى الله عليه وسلم، فأبى العودة إليه وخرج إلى الشام فقتل.',
      claims: ['amr-ibn-said-al-umawi-siyar50/virtues'],
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: ['amr-ibn-said-al-umawi-siyar50/virtues'] },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'said-ibn-al-as', claims: ['amr-ibn-said-al-umawi-siyar50/father'] },
    // docs/extraction-checklist.md item 6: the entry names both brothers and
    // the shared father, and no mother, so neither tie is a full brother.
    {
      type: 'HALF_BROTHER',
      inverse: 'HALF_BROTHER',
      to: 'khalid-ibn-said',
      claims: ['amr-ibn-said-al-umawi-siyar50/brother-khalid'],
    },
    {
      type: 'HALF_BROTHER',
      inverse: 'HALF_BROTHER',
      to: 'aban-ibn-said',
      claims: ['amr-ibn-said-al-umawi-siyar50/brother-aban'],
    },
  ],
} satisfies CatalogPerson;

export default amrIbnSaidAlUmawi;
