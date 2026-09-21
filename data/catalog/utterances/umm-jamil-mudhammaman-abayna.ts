import type { CatalogUtterance } from '@/lib/catalog/types';

/**
 * Recorded because the chapter records it, and because the Prophet's answer to
 * it is in the same passage: they satirise مذمما and he is محمد, فما يصرف عني
 * شتمهم. What a hostile poem asserts is not what the app asserts; the occasion
 * says who said it and why.
 */
const ummJamilMudhammamanAbayna = {
  kind: 'UTTERANCE',
  slug: 'umm-jamil-mudhammaman-abayna',
  utteranceKind: 'POETRY',
  subject: 'prophet-muhammad',
  textArabic: {
    value: ['مذمما أبينا ... ودينه قلينا', 'وأمره عصينا'].join('\n'),
    claims: ['sira/verses-umm-jamil'],
  },
  fields: {
    speakerName: { value: 'أم جميل بنت حرب', claims: ['sira/verses-umm-jamil'] },
    occasion: {
      value: 'أقبلت ولها ولولة وفي يدها فهر لما نزلت {تبت يدا أبي لهب}، والنبي صلى الله عليه وسلم في المسجد فلم تره.',
      claims: ['sira/verses-umm-jamil'],
    },
  },
} satisfies CatalogUtterance;

export default ummJamilMudhammamanAbayna;
