import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * New to the catalog: prisma/eventSeedData.ts has no record of the Saqifah.
 * The entry reaches it through Abu Ubaydah's nomination and states no date, so
 * the year stays unset rather than being taken from elsewhere.
 */
const saqifahBaniSaidah = {
  kind: 'EVENT',
  slug: 'saqifah-bani-saidah',
  name: 'سقيفة بني ساعدة',
  nameTransliterated: 'Saqifah Bani Saidah',
  type: 'OTHER',
  fields: {
    description: {
      value: 'رشّح أبو بكر الصديق عمر بن الخطاب وأبا عبيدة بن الجراح للأمر يوم سقيفة بني ساعدة.',
      claims: ['abu-ubaydah/saqifah-nomination'],
    },
  },
  people: [{ person: 'abu-ubaydah-ibn-al-jarrah', claims: ['abu-ubaydah/saqifah-nomination'] }],
} satisfies CatalogEvent;

export default saqifahBaniSaidah;
