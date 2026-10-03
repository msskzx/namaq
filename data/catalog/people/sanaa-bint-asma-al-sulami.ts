import type { CatalogPerson } from '@/lib/catalog/types';

/**
 * See data/history/batches/sanaa-bint-asma-al-sulami/summary.md for the
 * source's own alternate identification and its cross-reference to the
 * separate, later الكلابية batch.
 */
const sanaaBintAsmaAlSulami = {
  kind: 'PERSON',
  slug: 'sanaa-bint-asma-al-sulami',
  name: 'سَنَاءَ',
  nameTransliterated: 'Sanaa bint Asma al-Sulami',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: ['sanaa-bint-asma-al-sulami-siyar/sex'] },
    fullName: { value: 'سَنَاءَ بِنْتَ أَسْمَاءَ بنِ الصَّلْتِ السُّلَمِيَّةَ', claims: ['sanaa-bint-asma-al-sulami-siyar/full-name'] },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['sanaa-bint-asma-al-sulami-siyar/companion'],
    },
  ],
  relations: [
    {
      type: 'DAUGHTER',
      inverse: 'FATHER',
      to: 'asma-ibn-al-salt-al-sulami',
      claims: ['sanaa-bint-asma-al-sulami-siyar/father'],
    },
    {
      type: 'WIFE',
      inverse: 'HUSBAND',
      to: 'prophet-muhammad',
      claims: ['sanaa-bint-asma-al-sulami-siyar/wife-of-prophet'],
    },
  ],
} satisfies CatalogPerson;

export default sanaaBintAsmaAlSulami;
