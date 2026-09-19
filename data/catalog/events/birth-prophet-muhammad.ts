import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Name, type and year stay the seed's. The entry dates the birth to عام الفيل
 * and never to a year the model can hold, so hijriYear is not restated here.
 * The description is this batch's, and it takes the reading two reports agree
 * on; the competing days are held as prophet/birth-day-alt.
 */
const birthProphetMuhammad = {
  kind: 'EVENT',
  slug: 'birth-prophet-muhammad',
  name: 'مولد النبي محمد ﷺ',
  nameTransliterated: 'Birth of the Prophet Muhammad (PBUH)',
  type: 'BIRTH',
  fields: {
    description: {
      value:
        'ولد رسول الله صلى الله عليه وسلم عام الفيل، وهو المجمع عليه، يوم الإثنين لاثنتي عشرة ليلة مضت من ربيع الأول. وقال صلى الله عليه وسلم في صوم يوم الإثنين: (ذاك يوم ولدت فيه وفيه أوحي إليّ) .',
      claims: ['prophet/birth-year', 'prophet/birth-day'],
    },
  },
  people: [{ person: 'prophet-muhammad', claims: ['prophet/birth-year'] }],
} satisfies CatalogEvent;

export default birthProphetMuhammad;
