import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Name, type and year stay the seed's. The chapter dates the birth to عام الفيل
 * and to no year the model can hold, so hijriYear is not restated here.
 *
 * The day is disputed and the model has one description to hold it in, so the
 * description names both readings and carries all three claims. The twelfth is
 * al-Dhahabi's own wording; the tenth is Abu Ja'far al-Baqir's, which al-Dimyati
 * authenticated, and `prophet/birth-day-alt` is DISPUTED for it.
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
        'ولد رسول الله صلى الله عليه وسلم عام الفيل، وهو المجمع عليه، يوم الإثنين لاثنتي عشرة ليلة مضت من ربيع الأول. وقال أبو جعفر محمد بن علي: لعشر ليال خلون من ربيع الأول، وصححه الدمياطي. وقال صلى الله عليه وسلم في صوم يوم الإثنين: (ذاك يوم ولدت فيه وفيه أوحي إليّ) .',
      claims: ['prophet/birth-year', 'prophet/birth-day', 'prophet/birth-day-alt'],
    },
  },
  people: [{ person: 'prophet-muhammad', claims: ['prophet/birth-year'] }],
} satisfies CatalogEvent;

export default birthProphetMuhammad;
