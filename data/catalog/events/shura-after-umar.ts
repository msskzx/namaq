import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * No year. The entry never dates the Shura, and Umar's death year would come
 * from somewhere else, so hijriYear stays unset rather than borrowed.
 *
 * Only Abd al-Rahman is linked here. The entry names the other five, but it
 * names them as the body he chose from, and this batch read his entry alone.
 */
const shuraAfterUmar = {
  kind: 'EVENT',
  slug: 'shura-after-umar',
  name: 'الشورى بعد عمر بن الخطاب',
  nameTransliterated: 'The Shura after Umar',
  type: 'OTHER',
  fields: {
    description: {
      value:
        'وَمِنْ أَفْضَلِ أَعْمَالِ عَبْدِ الرَّحْمَنِ عَزْلُهُ نَفْسَهُ مِنَ الأَمْرِ وَقْتَ الشُّورَى، وَاخْتِيَارُهُ لِلأُمَّةِ مَنْ أَشَارَ بِهِ أَهْلُ الحِلِّ وَالعَقْدِ، فَنَهَضَ فِي ذَلِكَ أَتَمَّ نُهُوضٍ عَلَى جَمْعِ الأُمَّةِ عَلَى عُثْمَانَ أَنَّ عَبْدَ الرَّحْمَنِ قَالَ لأَهْلِ الشُّورَى: هَلْ لَكُم أَنْ أَخْتَارَ لَكُمْ وَأَنْفَصِلَ مِنْهَا؟',
      claims: ['awf/shura'],
    },
  },
  people: [{ person: 'abdur-rahman-ibn-awf', claims: ['awf/shura'] }],
} satisfies CatalogEvent;

export default shuraAfterUmar;
