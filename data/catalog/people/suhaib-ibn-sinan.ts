import type { CatalogPerson } from '@/lib/catalog/types';

// The seed entry is retired, so this module is the author; what it held and
// no batch cites is carried below with its evidence owed. The roster gives
// him both a nisba and a حلف in one breath, النمري حليف بني تميم, which is
// how the value reads here.
//
// data/history/batches/suhaib-ibn-sinan, entry 4.
const suhaibIbnSinan = {
  kind: 'PERSON',
  slug: 'suhaib-ibn-sinan',
  name: 'صهيب بن سنان',
  nameTransliterated: 'Suhayb ibn Sinan',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['suhaib-ibn-sinan-siyar4/sex'] },
    fullName: {
      value: 'صهيب بن سنان بن مالك بن عبد عمرو بن عقيل بن عامر النمري',
      claims: ['suhaib-ibn-sinan-siyar4/full-name'],
    },
    kunya: {
      value: 'أبو يحيى',
      claims: ['suhaib-ibn-sinan-siyar4/kunya'],
    },
    appearance: {
      value: 'رجل أحمر شديد الحمرة ليس بالطويل.',
      claims: ['suhaib-ibn-sinan-siyar4/appearance'],
    },
    virtues: {
      value:
        'من كبار السابقين البدريين؛ صهيب سابق الروم؛ أول من أظهر الإسلام في السبعة؛ عذب في الله حتى نزلت فيه آيات؛ صحب النبي قبل أن يوحى إليه؛ خلع ماله لأهل مكة يوم هجرته فقال النبي ربح صهيب، ونزلت ومن الناس من يشري نفسه ابتغاء مرضاة الله؛ قال فيه من كان يؤمن بالله واليوم الآخر فليحب صهيبا حب الوالدة لولدها؛ استنابه عمر على الصلاة بالمسلمين؛ موصوف بالكرم والسماحة؛ ممن اعتزل الفتنة؛ له نحو ثلاثين حديثا روى له مسلم منها ثلاثة.',
      claims: ['suhaib-ibn-sinan-siyar4/virtues'],
    },
    deathYearHijri: { value: '38', claims: ['suhaib-ibn-sinan-siyar4/death-year'] },
    placeOfDeathArabic: { value: 'المدينة', claims: ['suhaib-ibn-sinan-siyar4/death-place'] },
    tribalAffiliation: { value: 'النمري حليف بني تميم', claims: ['suhayb/hilf'] },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['suhaib-ibn-sinan-siyar4/titles'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'sinan-ibn-malik-al-namri',
      claims: ['suhaib-ibn-sinan-siyar4/father'],
    },
  ],
} satisfies CatalogPerson;

export default suhaibIbnSinan;
