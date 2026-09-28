import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const nawfalIbnAlHarith = {
  kind: 'PERSON',
  slug: 'nawfal-ibn-al-harith',
  name: 'نوفل بن الحارث',
  nameTransliterated: 'Nawfal ibn al-Harith',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'نوفل بن الحارث بن عبد المطلب الهاشمي',
      claims: ['nawfal-ibn-al-harith-siyar27/full-name'],
    },
    kunya: {
      value: 'أبو الحارث',
      claims: ['nawfal-ibn-al-harith-siyar27/kunya'],
    },
    virtues: {
      value:
        'كان أسن من عمه العباس، وكان أسن بني هاشم في زمانه؛ وأعان رسول الله يوم حنين بثلاثة آلاف رمح، وثبت معه يومئذ.',
      claims: ['nawfal-ibn-al-harith-siyar27/virtues'],
    },
    deathYearHijri: {
      value: '20',
      claims: ['nawfal-ibn-al-harith-siyar27/death-year'],
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'al-harith-ibn-abd-al-muttalib',
      claims: ['nawfal-ibn-al-harith-siyar27/father'],
    },
    {
      type: 'HALF_BROTHER',
      inverse: 'HALF_BROTHER',
      to: 'abu-sufyan-ibn-al-harith',
      claims: ['nawfal-ibn-al-harith-siyar27/half-brother'],
    },
    {
      type: 'PACT_BROTHER',
      inverse: 'PACT_BROTHER',
      to: 'al-abbas-ibn-abd-al-muttalib',
      claims: ['nawfal-ibn-al-harith-siyar27/muakhah'],
    },
  ],
} satisfies CatalogPerson;

export default nawfalIbnAlHarith;
