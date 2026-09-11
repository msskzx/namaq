import type { CatalogEvent } from '@/lib/catalog/types';

// No year: the entry states none, and the policy leaves an unknown value unset.
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
