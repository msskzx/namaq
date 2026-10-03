import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const maymunahBintAlHarith = {
  kind: 'PERSON',
  slug: 'maymunah-bint-al-harith',
  name: 'ميمونة بنت الحارث',
  nameTransliterated: 'Maymunah bint al-Harith',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: ['maymunah-siyar27/sex'] },
    fullName: {
      value:
        'ميمونة بنت الحارث بن حزن بن بجير بن الهزم بن رويبة بن عبد الله بن هلال بن عامر بن صعصعة الهلالية',
      claims: ['maymunah-siyar27/full-name'],
    },
    deathYearHijri: { value: '51', claims: ['maymunah-siyar27/death-year'] },
  },
  virtues: [
    {
      value:
        'وَكَانَتْ مِنْ سَادَاتِ النِّسَاء أَمَا إِنَّهَا كَانَتْ مِنْ أَتْقَانَا للهِ، وَأَوْصَلِنَا لِلرَّحِم',
      claims: ['maymunah-siyar27/virtues'],
    },
  ],

  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: legacyUnreviewed,
    },
    {
      title: 'mother-of-believers',
      name: 'أم المؤمنين',
      nameTransliterated: 'Mother of the Believers',
      claims: ['maymunah-siyar27/mother-of-believers'],
    },
  ],
  relations: [
    {
      type: 'DAUGHTER',
      inverse: 'FATHER',
      to: 'al-harith-ibn-hazn-al-hilali',
      claims: ['maymunah-siyar27/father'],
    },
    {
      type: 'SISTER',
      inverse: 'SISTER',
      to: 'umm-al-fadl-bint-al-harith',
      claims: ['maymunah-siyar27/sister-umm-al-fadl'],
    },
    {
      type: 'WIFE',
      inverse: 'HUSBAND',
      to: 'prophet-muhammad',
      claims: ['maymunah-siyar27/husband-prophet'],
    },
  ],
} satisfies CatalogPerson;

export default maymunahBintAlHarith;
