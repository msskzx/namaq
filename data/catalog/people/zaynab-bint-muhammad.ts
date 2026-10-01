import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Read in full from data/history/batches/zaynab-bint-muhammad. The Siyar gives
 * her two entries: a three-paragraph one in vol. 4 p. 334 and the substantive
 * one in vol. 5 pp. 246-249. Both are read; the death year is stated only in
 * the shorter one. `sex` and `fullName` stay on the legacy marker -- the
 * entries name her the Prophet's daughter but never give the chain her profile
 * carries, and never state her sex as a fact.
 */
const zaynabBintMuhammad = {
  kind: 'PERSON',
  slug: 'zaynab-bint-muhammad',
  name: 'زينب بنت محمد',
  nameTransliterated: 'Zaynab bint Muhammad',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
    fullName: {
      value: 'زينب بنت محمد بن عبد الله بن عبد المطلب بن هاشم القرشية الهاشمية',
      claims: legacyUnreviewed,
    },
    virtues: {
      value:
        'أكبر أخواتها، من المهاجرات السيدات. أسلمت وهاجرت قبل إسلام زوجها بست سنين. فَدَت أبا العاص في فداء أسارى بدر بقلادة من جزع ظفار أدخلتها بها خديجة، فرأى النبي القلادة ورق لها وقال: إن رأيتم أن تطلقوا لها أسيرها فعلتم؟ ثم أخذ عليه العهد أن يخل سبيلها إليه ففعل. وأجرت أبا العاص فقالت: إني قد أجريت أبا العاص بن الربيع، فقال النبي: إنه يجير على الناس أدناهم. ثم أنزلت براءة نساء، فإذا أسلمت امرأة قبل زوجها فلا سبيل له عليها إلا بخطبة. ورد ابنته إلى أبي العاص بعد سنين بنكاحها الأول ولم يحدث صداقاً، ورد عليها زينب بذلك النكاح الأول. ولم تزل ضبنة من المرض حتى ماتت.',
      claims: ['zaynab-siyar28/virtues'],
    },
    deathYearHijri: { value: '8', claims: ['zaynab-siyar28/death-year'] },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['zaynab-siyar28/titles'],
    },
    {
      title: 'daughter-of-prophet',
      name: 'بنت النبي',
      nameTransliterated: 'Daughter of the Prophet',
      claims: ['zaynab-siyar28/titles'],
    },
  ],
  relations: [
    {
      type: 'DAUGHTER',
      inverse: 'FATHER',
      to: 'prophet-muhammad',
      claims: ['zaynab-siyar28/father'],
    },
    {
      type: 'HUSBAND',
      inverse: 'WIFE',
      to: 'abu-al-as-ibn-al-rabi',
      claims: ['zaynab-siyar28/husband'],
    },
  ],
} satisfies CatalogPerson;

export default zaynabBintMuhammad;
