import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Read in full from data/history/batches/abu-sufyan-ibn-harb (Siyar entry
 * 13, vol. 5 pp. 105-107). Every value the entry states is promoted below;
 * the competing death years stay in the batch as disputed claims, and Hind
 * bint Utbah stays legacy-unreviewed: the entry never names a wife.
 */
const abuSufyanIbnHarb = {
  kind: 'PERSON',
  slug: 'abu-sufyan-ibn-harb',
  name: 'أبو سفيان بن حرب',
  nameTransliterated: 'Abu Sufyan ibn Harb',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['abu-sufyan-ibn-harb-siyar13/sex'] },
    fullName: {
      value: 'صخر بن حرب بن أمية بن عبد شمس بن عبد مناف بن قصي بن كلاب القرشي الأموي',
      claims: ['abu-sufyan-ibn-harb-siyar13/full-name'],
    },
    kunya: { value: 'أبو سفيان', claims: ['abu-sufyan-ibn-harb-siyar13/kunya'] },
    virtues: {
      value:
        'من دهاة العرب ومن أهل الرأي والشرف فيهم؛ حسن إسلامه وحسن إيمانه؛ كان يوم اليرموك يحرّض على الجهاد ويقف على الكراديس يذكّر؛ وحديثه عن هرقل يدل على إيمانه.',
      claims: ['abu-sufyan-ibn-harb-siyar13/virtues'],
    },
    deathYearHijri: { value: '31', claims: ['abu-sufyan-ibn-harb-siyar13/death-year'] },
    placeOfDeathArabic: { value: 'المدينة', claims: ['abu-sufyan-ibn-harb-siyar13/death-place'] },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['abu-sufyan-ibn-harb-siyar13/companion'],
    },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'harb-ibn-umayyah', claims: ['abu-sufyan-ibn-harb-siyar13/father'] },
    { type: 'HUSBAND', inverse: 'WIFE', to: 'hind-bint-utbah', claims: legacyUnreviewed },
    {
      type: 'FATHER',
      inverse: 'SON',
      to: 'yazid-ibn-abi-sufyan',
      claims: ['abu-sufyan-ibn-harb-siyar13/father-of-yazid'],
    },
    {
      type: 'FATHER',
      inverse: 'SON',
      to: 'muawiyah-ibn-abi-sufyan',
      claims: ['abu-sufyan-ibn-harb-siyar13/father-of-muawiyah'],
    },
    {
      type: 'FATHER_IN_LAW',
      inverse: 'SON_IN_LAW',
      to: 'prophet-muhammad',
      claims: ['abu-sufyan-ibn-harb-siyar13/father-in-law'],
    },
  ],
} satisfies CatalogPerson;

export default abuSufyanIbnHarb;
