import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/abdullah-ibn-suhail, entry 24, right
// after his half-brother Abu Jandal (entry 23). The half-brother tie was
// already declared from Abu Jandal's side (data/catalog/people/abu-jandal.ts)
// and stays there, undeclared here, per the standing rule that a relation is
// declared once.
const abdullahIbnSuhail = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-suhail',
  name: 'عبد الله بن سهيل',
  nameTransliterated: 'Abdullah ibn Suhail',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'عَبْدُ اللهِ بنُ سُهَيْلِ بنِ عَمْرٍو العَامِرِيُّ',
      claims: ['abdullah-ibn-suhail-siyar24/full-name'],
    },
    deathYearHijri: { value: '12', claims: ['abdullah-ibn-suhail-siyar24/death'] },
    placeOfDeathArabic: { value: 'اسْتُشْهِدَ يَوْمَ اليَمَامَةِ', claims: ['abdullah-ibn-suhail-siyar24/death-place'] },
  },
  virtues: [
    {
      value: 'وَلَهُ غَزَوَاتٌ وَمَوَاقِفُ وَقِيْلَ: بَلْ هُوَ مِنَ السَّابِقِيْنَ الأَوَّلِيْنَ، وَإِنَّهُ هَاجَرَ إِلَى الحَبَشَةِ الهِجْرَةَ الأُوْلَى',
      claims: ['abdullah-ibn-suhail-siyar24/virtues'],
    },
  ],

  titles: [
    // Carried from the retired seed.
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'suhail-ibn-amr', claims: ['abdullah-ibn-suhail-siyar24/father'] },
  ],
} satisfies CatalogPerson;

export default abdullahIbnSuhail;
