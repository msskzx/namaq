import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * data/history/batches/al-kilabiyyah cites سير أعلام النبلاء (الرسالة، السيرة
 * النبوية ج٢، ص٤٩٢-٤٩٤) for three of the retired prisma/personSeedData10.ts
 * entry's four candidate identities -- Fatimah bint al-Dahhak ibn Sufyan,
 * Sanaa bint Sufyan al-Kilabiyyah, and al-Aliyah bint Zabyan -- each reported
 * there as a woman the Prophet married then separated from, and each kept as
 * its own disputed claim rather than settled on one. The fourth candidate,
 * Amrah bint Zayd al-Kilabiyyah (Ibn Ishaq, via secondary sources), is not in
 * this edition's account and stays unclaimed. No single nasab is settled, so
 * no fullName and no ancestor chain.
 */
const alKilabiyyah = {
  kind: 'PERSON',
  slug: 'al-kilabiyyah',
  name: 'الكلابية',
  nameTransliterated: 'Al-Kilabiyyah',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    {
      type: 'WIFE',
      inverse: 'HUSBAND',
      to: 'prophet-muhammad',
      claims: [
        'kilabiyyah/candidate-fatimah-bint-al-dahhak',
        'kilabiyyah/candidate-sanaa-bint-sufyan',
        'kilabiyyah/candidate-aliyah-bint-zabyan',
      ],
    },
  ],
} satisfies CatalogPerson;

export default alKilabiyyah;
