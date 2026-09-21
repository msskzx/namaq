import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Undated. He came to Mecca to treat what he had heard called madness and left
 * having given his hand on Islam -- and on his people's, which the Prophet
 * asked for and he gave.
 */
const islamOfDimad = {
  kind: 'EVENT',
  slug: 'islam-of-dimad',
  name: 'إسلام ضماد الأزدي',
  nameTransliterated: 'The Islam of Dimad al-Azdi',
  type: 'OTHER',
  fields: {
    location: { value: 'مكة', claims: ['dimad/islam'] },
    description: {
      value:
        'قدم ضماد مكة وهو من أزد شنوءة يرقي من الريح، فسمع سفهاء الناس يقولون: إن محمدا مجنون، فأتاه ليرقيه، فسمع منه خطبة الحاجة، فقال: والله لقد سمعت قول الكهنة والسحرة والشعراء، فما سمعت مثل هؤلاء الكلمات، فهلم يدك أبايعك على الإسلام. فبايعه وقال له: (وعلى قومك) . قال: وعلى قومي.',
      claims: ['dimad/islam'],
    },
  },
  people: [
    { person: 'dimad-al-azdi', claims: ['dimad/islam'] },
    { person: 'prophet-muhammad', claims: ['dimad/islam'] },
  ],
} satisfies CatalogEvent;

export default islamOfDimad;
