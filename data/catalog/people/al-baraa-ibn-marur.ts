import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Authored from data/history/batches/al-baraa-ibn-marur, entry 53. The seed
 * entry that carried this subject is retired, so this module is the author;
 * what it held and no batch cited is still carried below with its evidence
 * owed. He is the one who said ابسط يدك يا رسول الله نبايعك at the second
 * Aqaba, and his was the first hand.
 */
const alBaraaIbnMarur = {
  kind: 'PERSON',
  slug: 'al-baraa-ibn-marur',
  name: 'البراء بن معرور',
  nameTransliterated: 'Al-Baraa ibn Marur',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['al-baraa/sex'] },
    fullName: {
      value: 'البَرَاءُ بنُ مَعْرُوْرِ بنِ صَخْرِ بنِ خَنْسَاءَ بنِ سِنَانَ الخَزْرَجِيُّ',
      claims: ['al-baraa-ibn-marur-siyar53/full-name'],
    },
    kunya: {
      value: 'أَبُو بِشْرٍ',
      claims: ['al-baraa-ibn-marur-siyar53/kunya'],
    },
    tribalAffiliation: {
      value: 'الخزرجي، الأنصاري، السلمي، نقيب بني سلمة',
      claims: ['al-baraa-ibn-marur-siyar53/tribal-affiliation'],
    },
    virtues: {
      value:
        'أول من بايع ليلة العقبة الأولى، فاضل تقي فقيه النفس، وأجل السبعين يومها. ولما ذكر له صلاته إلى الكعبة قال له النبي صلى الله عليه وسلم: قد كنت على قبلة لو صبرت عليها. وقدم النبي المدينة وقد مات، فسأل عن قبره فصف عليه وكبر.',
      claims: ['al-baraa/first-to-pledge', 'al-baraa-ibn-marur-siyar53/virtues'],
    },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['al-baraa-ibn-marur-siyar53/titles'],
    },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'marur-ibn-sakhr', claims: ['al-baraa-ibn-marur-siyar53/father'] },
    // Carried from neo4j/graphSeedData*.ts. The entry closes by naming no son,
    // so the edge stays uncited: see the batch's summary.md.
    { type: 'FATHER', inverse: 'SON', to: 'bishr-ibn-al-baraa', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alBaraaIbnMarur;
