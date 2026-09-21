import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * The seed entry is retired, so this module is the author; what it held and no
 * batch cites is carried below with its evidence owed. His Islam is chapter
 * four's turning point in Medina: بنو عبد الأشهل followed him in a single day.
 *
 * Chapter seven is his end. The Khandaq wound and the judgement on Banu
 * Qurayzah are one sequence and not two facts — حبان بن العرقة hit him in the
 * أكحل, the Prophet pitched him a tent in the mosque, and the vein reopened
 * once he had given the judgement they came down to. His participation in both
 * battles carries it, so his `virtues` take what the book says about him after
 * the death rather than repeating the death itself.
 */
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
        'أسلم على يد مصعب بن عمير، ثم قال لقومه: كلام رجالكم ونسائكم علي حرام حتى تؤمنوا، فما أمسى في دار بني عبد الأشهل رجل ولا امرأة إلا مسلما ومسلمة. وقال فيه النبي صلى الله عليه وسلم: (إن هذا الذي تحرك له العرش) ، وشيع جنازته سبعون ألف ملك.',
      claims: ['saad-muadh/islam', 'saad-muadh/arsh'],
    },
    deathYearHijri: { value: '5 AH', claims: ['saad-muadh/death-year'] },
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
