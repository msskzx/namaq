import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Read from the Siyar in data/history/batches/al-abbas-ibn-abd-al-muttalib
 * (vol 5, pp. 78-102). The entry never states the بن هاشم chain or a tribal
 * affiliation, so fullName stays on the legacy marker with its evidence owed;
 * the entry does name him العباس بن عبد المطلب once and names his mother,
 * which is what the SON edge below cites. See the batch's summary.md for the
 * graded reports kept out of virtues and the removed Khaybar/Tabuk rows.
 */
const alAbbasIbnAbdAlMuttalib = {
  kind: 'PERSON',
  slug: 'al-abbas-ibn-abd-al-muttalib',
  name: 'العباس بن عبد المطلب',
  nameTransliterated: 'Al-Abbas ibn Abd al-Muttalib',
  hasProfile: true,
  fields: {
    sex: {
      value: 'MALE',
      claims: ['al-abbas-ibn-abd-al-muttalib-siyar11/sex'],
    },
    // Carried from the retired prisma/personSeedData.ts entry, uncited: the
    // batch's entry states only العباس بن عبد المطلب, never this full chain.
    fullName: { value: 'العباس بن عبد المطلب بن هاشم القرشي الهاشمي', claims: legacyUnreviewed },
    appearance: {
      value:
        'شريف مهيب عاقل جميل أبيض بض له ضفيرتان معتدل القامة؛ من أطول الرجال وأحسنهم صورة وأبهاهم وأجهرهم صوتا؛ تام الشكل جهوري الصوت جدا.',
      claims: ['al-abbas-ibn-abd-al-muttalib-siyar11/appearance'],
    },
    virtues: {
      value:
        'عم الرجل صنو أبيه، من آذاه فقد آذى النبي؛ العباس من النبي والنبي منه؛ أجود قريش كفا وأوصلها؛ دعا له النبي بالمغفرة له ولولده؛ توسل به عمر في الاستسقاء عام الرمادة؛ كان النبي يرى له ما يرى الولد لوالده؛ قدم قبل الفتح فأجار أبا سفيان وليس في عداد الطلقاء؛ ثبت يوم حنين آخذا بلجام بغلة النبي حتى نزل النصر وهو الذي هتف يا أصحاب الشجرة؛ فرض له عمر اثني عشر ألفا؛ كان له ثوب لعاري بني هاشم وجفنة لجائعهم وكان يمنع الجار ويبذل المال؛ قبل علي يده ورجله؛ لم يزل مشفقا على النبي محبا له صابرا على الأذى.',
      claims: ['al-abbas-ibn-abd-al-muttalib-siyar11/virtues'],
    },
    deathYearHijri: { value: '32', claims: ['al-abbas-ibn-abd-al-muttalib-siyar11/death-year'] },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['al-abbas-ibn-abd-al-muttalib-siyar11/titles'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'abd-al-muttalib-ibn-hashim',
      claims: ['al-abbas-ibn-abd-al-muttalib-siyar11/nasab-father'],
    },
    {
      type: 'HUSBAND',
      inverse: 'WIFE',
      to: 'umm-al-fadl-bint-al-harith',
      claims: ['al-abbas-ibn-abd-al-muttalib-siyar11/wife-umm-al-fadl'],
    },
    {
      type: 'PATERNAL_UNCLE',
      inverse: 'PATERNAL_NEPHEW',
      to: 'aqil-ibn-abi-talib',
      claims: ['al-abbas-ibn-abd-al-muttalib-siyar11/nephew-aqil'],
    },
  ],
  ayat: [{ surah: 8, ayah: 70, claims: ['al-abbas-ibn-abd-al-muttalib-siyar11/ayah-anfal'] }],
} satisfies CatalogPerson;

export default alAbbasIbnAbdAlMuttalib;
