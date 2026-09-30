import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const ummAyman = {
  kind: 'PERSON',
  slug: 'umm-ayman',
  name: 'أم أيمن',
  nameTransliterated: 'Umm Ayman',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
    fullName: { value: 'بركة', claims: ['umm-ayman-siyar24/full-name'] },
    virtues: {
      value:
        'من المهاجرات الأول، وحاضنة رسول الله صلى الله عليه وسلم. وصفها بأنها بقية أهل بيته، وقال: من سره أن يتزوج امرأة من أهل الجنة فليتزوج أم أيمن. دلي عليها دلو من السماء حين عطشت في هجرتها، فما عطشت بعد ذلك. وبكت بعد وفاة النبي لانقطاع الوحي من السماء.',
      claims: ['umm-ayman-siyar24/virtues'],
    },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['umm-ayman-siyar24/virtues'],
    },
  ],
  relations: [
    {
      type: 'WIFE',
      inverse: 'HUSBAND',
      to: 'zaid-ibn-harithah',
      claims: ['umm-ayman-siyar24/husband-zaid'],
    },
    {
      type: 'MOTHER',
      inverse: 'SON',
      to: 'usamah-ibn-zaid',
      claims: ['umm-ayman-siyar24/son-usamah'],
    },
  ],
} satisfies CatalogPerson;

export default ummAyman;
