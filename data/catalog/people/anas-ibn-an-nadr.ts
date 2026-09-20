import type { CatalogPerson } from '@/lib/catalog/types';

/**
 * Named among the dead of Uhud, with no subject in the app until this batch
 * reached him. Nothing under prisma/ declares him, so this module is his only
 * author and catalog:project creates the row.
 */
// Anas ibn Malik's uncle. He had missed Badr and said so, and the verse
// {مِنَ الْمُؤْمِنِينَ رِجَالٌ صَدَقُوا مَا عَاهَدُوا اللَّهَ عَلَيْهِ} was held to be about him.
const anasIbnAnNadr = {
  kind: 'PERSON',
  slug: 'anas-ibn-an-nadr',
  name: 'أنس بن النضر',
  nameTransliterated: 'Anas ibn an-Nadr',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['anas-nadr/sex'] },
    virtues: {
      value:
        'قال يوم أحد: إني لأجد ريح الجنة دون أحد، فقاتل حتى قتل، ووجد به بضع وثمانون جراحة، فما عرفوه حتى عرفته أخته ببنانه.',
      claims: ['anas-nadr/uhud'],
    },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default anasIbnAnNadr;
