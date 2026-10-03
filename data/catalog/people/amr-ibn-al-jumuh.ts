import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const amrIbnAlJumuh = {
  kind: 'PERSON',
  slug: 'amr-ibn-al-jumuh',
  name: 'عمرو بن الجموح',
  nameTransliterated: 'Amr ibn al-Jumuh',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value:
        'عَمْرُو بنُ الجَمُوْحِ بنِ زَيْدِ بنِ حَرَامٍ السَّلَمِيُّ بنِ كَعْبِ بنِ غَنْمِ بنِ كَعْبِ بنِ سَلِمَةَ بن سَعْدِ بنِ عَلِيِّ بنِ أَسَدِ بنِ سَارِدَةَ بنِ تَزِيْدَ بنِ جُشَمَ بنِ الخَزْرَجِ الأَنْصَارِيُّ، السَّلَمِيَ، الغَنْمِيُّ',
      claims: ['amr-ibn-al-jumuh-siyar44/full-name'],
    },
    appearance: {
      value: 'كَانَ أَعْرَجَ',
      claims: ['amr-ibn-al-jumuh-siyar44/appearance'],
    },
  },
  virtues: [
    {
      value:
        'وَكَانَ سَيِّدَ بَنِي سَلِمَةَ فَأُشْهِدُكُم أَنِّي قَدْ آمَنْتُ بِمَا أُنْزِلَ عَلَى مُحَمَّدٍ. بَلْ سَيِّدُكُم الجَعْدُ الأَبْيَضُ: عَمْرُو بنُ الجَمُوْحِ لاَ عَلَيْكُم أَنْ لاَ تَمْنَعُوْهُ، لَعَلَّ اللهُ يَرْزُقُهُ الشَّهَادَةَ فَقَاتَلَ حَتَّى قُتِلَ كُفِّنَ هُوَ وَعَبْدُ اللهِ بنُ عَمْرِو بنِ حَرَامٍ فِي كَفَنٍ وَاحِدٍ.',
      claims: ['amr-ibn-al-jumuh-siyar44/virtues'],
    },
  ],

  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-jumuh-ibn-zayd', claims: ['amr-ibn-al-jumuh-siyar44/father'] },
    {
      type: 'FATHER',
      inverse: 'SON',
      to: 'muadh-ibn-amr-ibn-al-jumuh',
      claims: ['amr-ibn-al-jumuh-siyar44/child-muadh'],
    },
    {
      type: 'FATHER',
      inverse: 'SON',
      to: 'muawwidh-ibn-amr-ibn-al-jumuh',
      claims: ['amr-ibn-al-jumuh-siyar44/child-muawwidh'],
    },
    {
      type: 'FATHER',
      inverse: 'SON',
      to: 'khallad-ibn-amr-ibn-al-jumuh',
      claims: ['amr-ibn-al-jumuh-siyar44/child-khallad'],
    },
  ],
} satisfies CatalogPerson;

export default amrIbnAlJumuh;
