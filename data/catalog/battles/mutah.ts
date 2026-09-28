import type { CatalogBattle } from '@/lib/catalog/types';

/**
 * The module was created carrying a contradiction and this chapter settles it.
 *
 * The retired seed named the battle غزوة مؤتة and recorded the Prophet as a
 * participant, which the vocabulary in src/lib/catalog/types.ts cannot hold at
 * once: a غزوة is one he went out for. Chapter ten says what he did — بعث إلى
 * مؤتة ... وأمر على الناس زيد بن حارثة — so he sent and did not go, the
 * engagement is a سرية, and the seed's participation was wrong rather than
 * merely uncited.
 *
 * It is therefore dropped, not moved to the legacy marker. The marker is for a
 * value in use whose evidence is owed; this one has evidence against it.
 *
 * Zayd's command comes with the succession the Prophet set at the same moment,
 * Ja'far then Ibn Rawahah. Neither of those two is recorded here: the model
 * holds who was at a battle, not the order in which command would pass.
 */
const mutah = {
  kind: 'BATTLE',
  slug: 'mutah',
  name: 'غزوة مؤتة',
  nameTransliterated: "Battle of Mu'tah",
  fields: {
    engagement: { value: 'SARIYYAH', claims: ['mutah/engagement'] },
    hijriYear: { value: 8, claims: ['mutah/year'] },
    location: { value: 'مؤتة', claims: ['mutah/engagement'] },
  },
  participants: [
    {
      person: 'zaid-ibn-harithah',
      isMuslim: true,
      status: ['MARTYRED'],
      summary: {
        value:
          'عقد له رسول الله على الناس في غزوة مؤتة وقدمه على الأمراء، فأخذ اللواء فقاتل حتى قتل طعناً بالرماح.',
        claims: ['zaid-ibn-harithah-siyar36/mutah'],
      },
      claims: ['mutah/zayd-command', 'zaid-ibn-harithah-siyar36/mutah'],
    },
    {
      person: 'jaafar-ibn-abi-talib',
      isMuslim: true,
      status: ['MARTYRED'],
      summary: {
        value:
          'أمره رسول الله صلى الله عليه وسلم على جيش مؤتة، فأخذ اللواء بعد زيد وشد على الناس حتى قتل.',
        claims: ['jaafar-ibn-abi-talib-siyar34/mutah'],
      },
      claims: ['jaafar-ibn-abi-talib-siyar34/mutah'],
    },
    {
      person: 'abdullah-ibn-rawahah',
      isMuslim: true,
      status: ['MARTYRED'],
      summary: {
        value: 'أخذ الراية بعد قتل صاحبيه فقاتل حتى قتل.',
        claims: ['abdullah-ibn-rawahah-siyar37/mutah'],
      },
      claims: ['abdullah-ibn-rawahah-siyar37/mutah'],
    },
    {
      person: 'aqil-ibn-abi-talib',
      isMuslim: true,
      summary: {
        value: 'خَرَجَ عَقِيْلٌ مُهَاجِراً فِي أَوَّلِ سَنَةِ ثَمَانٍ، وَشَهِدَ مُؤْتَةَ.',
        claims: ['aqil-ibn-abi-talib-siyar35/mutah'],
      },
      claims: ['aqil-ibn-abi-talib-siyar35/mutah'],
    },
  ],
} satisfies CatalogBattle;

export default mutah;
