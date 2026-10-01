import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Read in full from data/history/batches/ikrimah-ibn-abi-jahl (Siyar entry
 * 66, vol. 4 pp. 323-324). `sex` stays on the legacy marker: the entry uses
 * masculine grammar throughout and names him أبو عثمان, but never states his
 * sex as a fact. The two reports of where he was killed stay in one virtues
 * claim, since the entry names the battles rather than years.
 */
const ikrimahIbnAbiJahl = {
  kind: 'PERSON',
  slug: 'ikrimah-ibn-abi-jahl',
  name: 'عكرمة بن أبي جهل',
  nameTransliterated: 'Ikrimah ibn Abi Jahl',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'عكرمة بن أبي جهل عمرو بن هشام بن المغيرة بن عبد الله بن عمر بن مخزوم بن يقظة بن مرة بن كعب بن لؤي',
      claims: ['ikrimah-ibn-abi-jahl-siyar66/full-name'],
    },
    kunya: { value: 'أبو عثمان', claims: ['ikrimah-ibn-abi-jahl-siyar66/kunya'] },
    virtues: {
      value:
        'الشريف، الرئيس، الشهيد؛ أسلم وحسن إسلامه بالمرة؛ كان محمود البلاء في الإسلام؛ استشهد يوم اليرموك، وقيل: يوم أجنادين.',
      claims: ['ikrimah-ibn-abi-jahl-siyar66/virtues'],
    },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['ikrimah-ibn-abi-jahl-siyar66/companion'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'abu-jahl-ibn-hisham',
      claims: ['ikrimah-ibn-abi-jahl-siyar66/father'],
    },
  ],
} satisfies CatalogPerson;

export default ikrimahIbnAbiJahl;
