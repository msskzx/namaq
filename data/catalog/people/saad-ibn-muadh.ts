import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// The seed entry is retired, so this module is the author; what it held and
// no batch cites is carried below with its evidence owed. His Islam is the
// chapter's turning point in Medina: بنو عبد الأشهل followed him in a single
// day.
const saadIbnMuadh = {
  kind: 'PERSON',
  slug: 'saad-ibn-muadh',
  name: 'سعد بن معاذ',
  nameTransliterated: 'Saad ibn Muadh',
  hasProfile: true,
  fields: {
    // Carried from the retired seed entry, which took it from the Siyar
    // without citing it.
    fullName: {
      value: 'سعد بن معاذ بن النعمان بن امرئ القيس بن زيد بن عبد الأشهل الأنصاري الأوسي',
      claims: legacyUnreviewed,
    },
    virtues: {
      value:
        'أسلم على يد مصعب بن عمير، ثم قال لقومه: كلام رجالكم ونسائكم علي حرام حتى تؤمنوا، فما أمسى في دار بني عبد الأشهل رجل ولا امرأة إلا مسلما ومسلمة.',
      claims: ['saad-muadh/islam'],
    },
  },
  titles: [
    // Carried from the retired seed entry. The seeds gave every صحابي this
    // title without citing it.
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    // Carried from neo4j/graphSeedData*.ts, which stated these ties without
    // citing them. The catalog owns this subject's edges now, so they live
    // here or not at all.
    { type: 'SON', inverse: 'FATHER', to: 'muadh-ibn-al-numan', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default saadIbnMuadh;
