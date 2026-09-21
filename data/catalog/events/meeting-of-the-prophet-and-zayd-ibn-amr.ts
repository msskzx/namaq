import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * MET, and dated only by قبل الوحي, which the chapter gives instead of a year.
 * Kept apart from the death because the model treats an encounter and a death
 * as two occasions, and the sira narrates them from two separate isnads.
 */
const meetingOfTheProphetAndZaydIbnAmr = {
  kind: 'EVENT',
  slug: 'meeting-of-the-prophet-and-zayd-ibn-amr',
  name: 'لقاء النبي صلى الله عليه وسلم زيد بن عمرو بأسفل بلدح',
  nameTransliterated: 'The Meeting at the Foot of Baldah',
  type: 'MET',
  fields: {
    location: { value: 'أسفل بلدح', claims: ['zayd-amr/ansab'] },
    description: {
      value:
        'لقي النبي صلى الله عليه وسلم زيد بن عمرو بن نفيل أسفل بلدح قبل الوحي، فقدم إليه سفرة فيها لحم، فأبى أن يأكل وقال: لا آكل مما يذبحون على أنصابهم.',
      claims: ['zayd-amr/ansab'],
    },
  },
  people: [
    { person: 'prophet-muhammad', claims: ['zayd-amr/ansab'] },
    { person: 'zayd-ibn-amr-ibn-nufayl', claims: ['zayd-amr/ansab'] },
  ],
} satisfies CatalogEvent;

export default meetingOfTheProphetAndZaydIbnAmr;
