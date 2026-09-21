import type { CatalogUtterance } from '@/lib/catalog/types';

// Abu Talib's answer when Quraysh pressed him to give his nephew up. The last
// line is why the chapter's later section on his death reads the way it does:
// he says plainly what kept him from the دين he calls the best of them.
const abuTalibLanYasiluIlayk = {
  kind: 'UTTERANCE',
  slug: 'abu-talib-lan-yasilu-ilayk',
  utteranceKind: 'POETRY',
  speaker: 'abu-talib',
  subject: 'prophet-muhammad',
  textArabic: {
    value: [
      'والله لن يصلوا إليك بجمعهم ... حتى أوسد في التراب دفينا',
      'فامض لأمرك ما عليك غضاضة ... أبشر وقر بذاك منك عيونا',
      'ودعوتني وزعمت أنك ناصحي ... فلقد صدقت وكنت قدما أمينا',
      'وعرضت دينا قد عرفت بأنه ... من خير أديان البرية دينا',
      'لولا الملامة أو حذاري سبة ... لوجدتني سمحا بذاك مبينا',
    ].join('\n'),
    claims: ['abu-talib/verses-lan-yasilu'],
  },
  fields: {},
} satisfies CatalogUtterance;

export default abuTalibLanYasiluIlayk;
