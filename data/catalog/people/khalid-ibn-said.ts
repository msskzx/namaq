import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const khalidIbnSaid = {
  kind: 'PERSON',
  slug: 'khalid-ibn-said',
  name: 'خَالِدُ بنُ سَعِيْدِ',
  nameTransliterated: 'Khalid ibn Said',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'خَالِدُ بنُ سَعِيْدِ بنِ العَاصِ بنِ أُمَيَّةَ الأُمَوِيُّ بنِ عَبْدِ شَمْسٍ بنِ عَبْدِ مَنَافٍ بنِ قُصَيٍّ',
      claims: ['khalid-ibn-said-siyar48/fullName'],
    },
    kunya: {
      value: 'أَبُو سَعِيْدٍ',
      claims: ['khalid-ibn-said-siyar48/kunya'],
    },
    appearance: {
      value: 'وَسِيْماً، جَمِيْلاً',
      claims: ['khalid-ibn-said-siyar48/appearance'],
    },
    virtues: {
      value:
        'أَحَدُ السَّابِقِيْنَ الأَوَّلِيْنَ خَامِساً فِي الإِسْلاَمِ، وَهَاجَرَ إِلَى أَرْضِ الحَبَشَةِ أَوَّلُ مَنْ كَتَبَ: بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ اسْتَعْمَلَهُ عَلَى صَنْعَاءَ، وَأَنَّ أَبَا بَكْرٍ أَمَّرَهُ عَلَى بَعْضِ الجَيْشِ فِي غَزْوِ الشَّامِ قَتَلَ مُشْرِكاً اسْتُشْهِدَ قُتِلَ يَوْمَ أَجْنَادِيْنَ رَأَيْتُ نُوْراً لَهُ سَاطِعاً إِلَى السَّمَاءِ',
      claims: ['khalid-ibn-said-siyar48/virtues'],
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: ['khalid-ibn-said-siyar48/virtues'] },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'said-ibn-al-as', claims: ['khalid-ibn-said-siyar48/father'] },
    {
      type: 'HALF_BROTHER',
      inverse: 'HALF_BROTHER',
      to: 'amr-ibn-said-al-umawi',
      claims: ['amr-ibn-said-al-umawi-siyar50/brother-khalid'],
    },
  ],
} satisfies CatalogPerson;

export default khalidIbnSaid;
