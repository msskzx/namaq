import type { CatalogPerson } from '@/lib/catalog/types';

/**
 * Seed-declared, so the catalog only adds. The chapter gives a great deal the
 * model has no shape for: الطاهرة as her name in the jahiliyyah, her two
 * husbands before him, her age at marriage and at death, and the house of
 * قصب she was promised. Only the virtues land, in the Prophet's own words.
 */
const khadijahBintKhuwaylid = {
  kind: 'PERSON',
  slug: 'khadijah-bint-khuwaylid',
  name: 'خديجة بنت خويلد',
  nameTransliterated: 'Khadijah bint Khuwaylid',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: ['khadijah/sex'] },
    virtues: {
      value:
        'قال صلى الله عليه وسلم: (والله لقد آمنت بي إذ كفر بي الناس، وآوتني إذ رفضني الناس، وصدقتني إذ كذبني الناس، ورزقت منها الولد) .',
      claims: ['khadijah/virtues'],
    },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default khadijahBintKhuwaylid;
