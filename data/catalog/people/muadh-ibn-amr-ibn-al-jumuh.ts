import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/muadh-ibn-amr-ibn-al-jumuh, entry 41. The
// entry never states his sex outright, so it stays on the legacy marker.
const muadhIbnAmrIbnAlJumuh = {
  kind: 'PERSON',
  slug: 'muadh-ibn-amr-ibn-al-jumuh',
  name: 'معاذ بن عمرو بن الجموح',
  nameTransliterated: 'Muadh ibn Amr ibn al-Jumuh',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'مُعَاذُ بنُ عَمْرِو بنِ الجَمُوْحِ بنُ زَيْدِ بنِ حَرَامِ بنِ كَعْبِ بنِ غَنْمِ بنِ كَعْبِ بنِ سَلِمَة',
      claims: ['muadh-ibn-amr-ibn-al-jumuh-siyar41/full-name'],
    },
    tribalAffiliation: {
      value: 'الخَزْرَجِيُّ، السَّلَمِيُّ، المَدَنِيُّ، البَدْرِيُّ، العَقَبِي',
      claims: ['muadh-ibn-amr-ibn-al-jumuh-siyar41/tribal-affiliation'],
    },
  },
  virtues: [
    {
      value:
        'وَضَرَبَنِي ابْنُهُ عِكْرِمَةُ بنُ أَبِي جَهْلٍ عَلَى عَاتِقِي، فَطَرَحَ يَدِي، وَبَقِيَتْ مُعَلَّقَةً بِجِلْدَةٍ بِجَنْبِي هَذِهِ -وَاللهِ- الشَّجَاعَةُ، لاَ كَآخَرُ مِنْ خُدْشٍ بِسَهْمٍ يَنْقَطِعُ قَلْبُهُ، وَتَخُوْرُ قِوَاه',
      claims: ['muadh-ibn-amr-ibn-al-jumuh-siyar41/virtues'],
    },
  ],

  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['muadh-ibn-amr-ibn-al-jumuh-siyar41/titles'],
    },
    {
      title: 'killer-of-abu-jahl',
      name: 'قاتل أبي جهل',
      nameTransliterated: 'Killer of Abu Jahl',
      claims: ['muadh-ibn-amr-ibn-al-jumuh-siyar41/killer-of-abu-jahl'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'amr-ibn-al-jumuh',
      claims: ['muadh-ibn-amr-ibn-al-jumuh-siyar41/father'],
    },
  ],
} satisfies CatalogPerson;

export default muadhIbnAmrIbnAlJumuh;
