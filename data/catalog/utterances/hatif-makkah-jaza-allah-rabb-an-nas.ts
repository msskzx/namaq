import type { CatalogUtterance } from '@/lib/catalog/types';

// Sung through the upper part of Mecca by a voice nobody could see, with
// people following the sound. It is how the chapter has Mecca learn where he
// had gone.
const hatifMakkahJazaAllahRabbAnNas = {
  kind: 'UTTERANCE',
  slug: 'hatif-makkah-jaza-allah-rabb-an-nas',
  utteranceKind: 'POETRY',
  event: 'hijra-to-medina',
  textArabic: {
    value: [
      'جزى الله رب الناس خير جزائه ... رفيقين حلا خيمتي أم معبد',
      'هما نزلا بالبر ثم تروحا ... فأفلح من أمسى رفيق محمد',
      'ليهن بني كعب مكان فتاتهم ... ومقعدها للمؤمنين بمرصد',
    ].join('\n'),
    claims: ['sira/verses-hatif-umm-mabad'],
  },
  fields: {
    speakerName: { value: 'هاتف بمكة لا يرى شخصه', claims: ['sira/verses-hatif-umm-mabad'] },
    occasion: { value: 'سمع أهل مكة صوته يتغنى به وهم يتبعونه حتى خرج من أعلى مكة.', claims: ['sira/verses-hatif-umm-mabad'] },
  },
} satisfies CatalogUtterance;

export default hatifMakkahJazaAllahRabbAnNas;
