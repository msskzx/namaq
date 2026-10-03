import type { CatalogPerson } from '@/lib/catalog/types';

const rabiahIbnAlHarith = {
  kind: 'PERSON',
  slug: 'rabiah-ibn-al-harith',
  name: 'ربيعة بن الحارث',
  nameTransliterated: 'Rabiah ibn al-Harith',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['rabiah-ibn-al-harith-siyar46/sex'] },
    fullName: {
      value:
        'رَبِيْعَةُ بنُ الحَارِثِ بنِ عَبْدِ المُطَّلِبِ بنِ هَاشِمٍ الهَاشِمِي',
      claims: ['rabiah-ibn-al-harith-siyar46/full-name'],
    },
    kunya: { value: 'أَبُو أَرْوَى', claims: ['rabiah-ibn-al-harith-siyar46/kunya'] },
  },
  virtues: [
    {
      value:
        'وَأَطْعَمَ رَسُوْلُ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- رَبِيْعَةَ بِخَيْبَرَ مَائَةَ وَسقٍ كُلَّ سَنَةٍ، وَشَهِدَ مَعَهُ الفَتْحَ، وَحُنَيْنا وَيُرْوَى أَنَّ النَّبِيَّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- قَالَ: (نِعْمَ العَبْدُ رَبِيْعَةُ بنُ الحَارِثِ، لَوْ قَصَّرَ مِنَ شَعْرِهِ، وَشَمَّرَ مِنْ ثَوْبِه وَكَانَ رَبِيْعَةُ شَرِيْكاً لِعُثْمَانَ فِي التِّجَارَة',
      claims: ['rabiah-ibn-al-harith-siyar46/virtues'],
    },
  ],

  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: ['rabiah-ibn-al-harith-siyar46/companion'] },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-harith-ibn-abd-al-muttalib', claims: ['rabiah-ibn-al-harith-siyar46/father'] },
    {
      type: 'HALF_BROTHER',
      inverse: 'HALF_BROTHER',
      to: 'abu-sufyan-ibn-al-harith',
      claims: ['abu-sufyan-ibn-al-harith-siyar32/half-brother-rabiah'],
    },
  ],
} satisfies CatalogPerson;

export default rabiahIbnAlHarith;
