import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const hafsaBintUmar = {
  kind: 'PERSON',
  slug: 'hafsa-bint-umar',
  name: 'حفصة بنت عمر',
  nameTransliterated: 'Hafsa bint Umar',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
    fullName: {
      value: 'حفصة بنت عمر بن الخطاب العدوية أم المؤمنين',
      claims: ['hafsa-bint-umar-siyar25/full-name'],
    },
    appearance: { value: 'وصفت بأنها كانت ذات هيئة وجمال.', claims: legacyUnreviewed },
    virtues: {
      value: 'صوامة قوامة، وزوجة النبي في الجنة.',
      claims: ['hafsa-bint-umar-siyar25/virtues'],
    },
    deathYearHijri: { value: '41', claims: ['hafsa-bint-umar-siyar25/death-year'] },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
    {
      title: 'mother-of-believers',
      name: 'أم المؤمنين',
      nameTransliterated: 'Mother of the Believers',
      claims: ['hafsa-bint-umar-siyar25/mother-of-believers'],
    },
  ],
  ayat: [
    { surah: 66, ayah: 4, claims: ['hafsa-bint-umar-siyar25/ayah-at-tahrim'] },
    { surah: 66, ayah: 5, claims: legacyUnreviewed },
  ],
  relations: [
    {
      type: 'DAUGHTER',
      inverse: 'FATHER',
      to: 'umar-ibn-al-khattab',
      claims: ['hafsa-bint-umar-siyar25/father'],
    },
    {
      type: 'WIFE',
      inverse: 'HUSBAND',
      to: 'prophet-muhammad',
      claims: ['hafsa-bint-umar-siyar25/husband-prophet'],
    },
  ],
} satisfies CatalogPerson;

export default hafsaBintUmar;
