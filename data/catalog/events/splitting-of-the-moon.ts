import type { CatalogEvent } from '@/lib/catalog/types';

// At Mecca, قبل مخرج النبي صلى الله عليه وسلم to Medina, which dates it before
// the hijra and to no year the model can hold.
const splittingOfTheMoon = {
  kind: 'EVENT',
  slug: 'splitting-of-the-moon',
  name: 'انشقاق القمر',
  nameTransliterated: 'The Splitting of the Moon',
  type: 'OTHER',
  fields: {
    description: {
      value:
        'سأل أهل مكة النبي صلى الله عليه وسلم أن يريهم آية، فانشق القمر فرقتين، شقة على أبي قبيس وشقة على السويداء، فقال: اشهدوا. وفيه نزل: {اقْتَرَبَتِ السَّاعَةُ وَانْشَقَّ الْقَمَرُ} .',
      claims: ['sira/splitting-moon'],
    },
  },
  people: [{ person: 'prophet-muhammad', claims: ['sira/splitting-moon'] }],
} satisfies CatalogEvent;

export default splittingOfTheMoon;
