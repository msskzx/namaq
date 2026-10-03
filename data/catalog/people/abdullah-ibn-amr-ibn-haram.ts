import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const abdullahIbnAmrIbnHaram = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-amr-ibn-haram',
  name: 'عبد الله بن عمرو بن حرام',
  nameTransliterated: 'Abdullah ibn Amr ibn Haram',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'عَبْدُ اللهِ بنُ عَمْرِو بنِ حَرَامِ بنِ ثَعْلَبَةَ بنِ حَرَامِ بنُ كَعْبِ بنِ غَنْمِ بنُ كَعْبِ بنِ سَلَمَةِ بنِ سَعْدِ بنِ عَلِيِّ بنِ أَسَدِ بنِ سَارِدَةَ بنِ تَزِيْدَ بنِ جُشَمَ بنِ الخَزْرَجِ الأَنْصَارِيُّ، السُّلَمِيُّ',
      claims: ['abdullah-ibn-amr-ibn-haram-siyar67/full-name'],
    },
    kunya: { value: 'أَبُو جَابِرٍ', claims: ['abdullah-ibn-amr-ibn-haram-siyar67/kunya'] },
    appearance: {
      value: 'وَكَانَ أَحْمَرَ، أَصْلَعَ، لَيْسَ بِالطَّوِيْلِ',
      claims: ['abdullah-ibn-amr-ibn-haram-siyar67/appearance'],
    },
  },
  virtues: [
    {
      value:
        'أَحَدُ النُّقَبَاءِ لَيْلَةَ العَقَبَةِ مَا زَالَتِ المَلاَئِكَةُ تُظَلِّلُهُ بِأَجْنِحَتِهَا حَتَّى رَفَعْتُمُوْهُ زَمِّلُوْهُم بِجِرَاحِهِم، فَأَنَا شَهِيْدٌ عَلَيْهِم أَلاَ أُخْبِرُكَ أَنَّ اللهَ كَلَّمَ أَبَاكَ كِفَاحاً أَسْأَلُكَ أَنْ تَرُدَّنِي إِلَى الدُّنْيَا، فَأُقْتَلَ فِيْكَ ثَانِياً',
      claims: ['abdullah-ibn-amr-ibn-haram-siyar67/virtues'],
    },
  ],

  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'amr-ibn-haram', claims: ['abdullah-ibn-amr-ibn-haram-siyar67/father'] },
    { type: 'FATHER', inverse: 'SON', to: 'jabir-ibn-abdullah', claims: ['abdullah-ibn-amr-ibn-haram-siyar67/child-jabir'] },
  ],
} satisfies CatalogPerson;

export default abdullahIbnAmrIbnHaram;
