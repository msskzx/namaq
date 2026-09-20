import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Undated, like Khadijah's. al-Dhahabi rejects the report that he said the
 * كلمة at the end: al-Abbas was still on his jahiliyyah when he claimed to have
 * heard it, the Prophet answered لم أسمع, and Ali called him الشيخ الضال after
 * he died. The description keeps what the sound reports say.
 */
const deathOfAbuTalib = {
  kind: 'EVENT',
  slug: 'death-of-abu-talib',
  name: 'وفاة أبي طالب',
  nameTransliterated: 'The Death of Abu Talib',
  type: 'DEATH',
  fields: {
    description: {
      value:
        'لما حضرته الوفاة دخل عليه النبي صلى الله عليه وسلم وعنده أبو جهل وعبد الله بن أبي أمية، فقال: يا عم قل لا إله إلا الله أحاج لك بها عند الله، فكان آخر كلمة أن قال: على ملة عبد المطلب. ومات هو وخديجة في عام واحد.',
      claims: ['sira/death-abu-talib'],
    },
  },
  people: [{ person: 'abu-talib', claims: ['sira/death-abu-talib'] }],
} satisfies CatalogEvent;

export default deathOfAbuTalib;
