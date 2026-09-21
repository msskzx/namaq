import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Authored from chapter two of data/history/batches/prophet-muhammad-sira. He
 * stays declared in prisma/personSeedData.ts, so the catalog only adds to him:
 * his own Siyar entry has not been read yet, and taking the seed's authorship
 * away now would put the legacy marker on everything it holds.
 */
const abuBakrAsSiddiq = {
  kind: 'PERSON',
  slug: 'abu-bakr-as-siddiq',
  name: 'أبو بكر الصديق',
  nameTransliterated: 'Abu Bakr as-Siddiq',
  hasProfile: true,
  fields: {
    // Carried from the retired seed entry, which took it from the Siyar
    // without citing it.
    fullName: { value: 'عبد الله بن أبي قحافة عثمان بن عامر التيمي القرشي', claims: legacyUnreviewed },
    appearance: { value: 'كان أبيض نحيفًا خفيف العارضين معروق الوجه.', claims: legacyUnreviewed },
    sex: { value: 'MALE', claims: ['abu-bakr/sex'] },
    virtues: {
      value:
        'كان مألفا لقومه محببا سهلا، أنسب قريش لقريش، فجعل لما أسلم يدعو من وثق به، فأسلم بدعائه عثمان والزبير وعبد الرحمن بن عوف وطلحة وسعد بن أبي وقاص، فجاء بهم إلى رسول الله صلى الله عليه وسلم.',
      claims: ['abu-bakr/called-to-islam'],
    },
  },

  // The title is not new, only newly cited for him. The chapter gives the
  // naming outright: he affirmed the Isra' when others turned back, فلذلك سمي
  // أبو بكر الصديق.
  titles: [
    // Carried from the retired seed entry; no batch cites these yet.
    { title: 'the-ten-promised-paradise', claims: legacyUnreviewed },
    { title: 'caliph', claims: legacyUnreviewed },
    { title: 'companion', claims: legacyUnreviewed },
    { title: 'siddiq-al-ummah', claims: ['abu-bakr/siddiq'] },
    { title: 'al-sabiqoon', claims: ['abu-bakr/al-sabiqoon-eight'] },
    // Not a title he holds alone: Nawfal tied him and Talhah in one rope, and
    // the pair got one name out of it. Both modules carry it.
    { title: 'al-qarinayn', claims: ['abu-bakr/al-qarinayn'] },
  ],

  // Three verses for one occasion: the chapter quotes الروم ٢-٤ whole as what
  // came down over the wager he made, so the link is recorded verse by verse
  // rather than collapsed to the one that carries بضع سنين.
  ayat: [
    { surah: 30, ayah: 2, claims: ['abu-bakr/ayah-ar-rum'] },
    { surah: 30, ayah: 3, claims: ['abu-bakr/ayah-ar-rum'] },
    { surah: 30, ayah: 4, claims: ['abu-bakr/ayah-ar-rum'] },
  ],
  /**
   * The five Ibn Ishaq says answered him. The direction is his: فأسلم بدعائه,
   * so Abu Bakr calls and they answer, and the projector writes the inverse.
   */
  relations: [
    // Carried from neo4j/graphSeedData.ts, whose node declaration is retired
    // with the rest. The catalog owns this subject's edges now, so they live
    // here or not at all.
    { type: 'SON', inverse: 'FATHER', to: 'uthman-ibn-amir', claims: legacyUnreviewed },
    { type: 'FATHER', inverse: 'DAUGHTER', to: 'aisha-bint-abi-bakr', claims: legacyUnreviewed },
    { type: 'HUSBAND', inverse: 'WIFE', to: 'asma-bint-umays', claims: legacyUnreviewed },
    { type: 'FATHER', inverse: 'DAUGHTER', to: 'asma-bint-abi-bakr', claims: legacyUnreviewed },
    { type: 'FATHER', inverse: 'SON', to: 'abd-al-rahman-ibn-abi-bakr', claims: legacyUnreviewed },
    { type: 'FATHER_IN_LAW', inverse: 'SON_IN_LAW', to: 'prophet-muhammad', claims: legacyUnreviewed },
    { type: 'CALLED_TO_ISLAM', inverse: 'ANSWERED_CALL_OF', to: 'uthman-ibn-affan', claims: ['uthman/answered-abu-bakr'] },
    { type: 'CALLED_TO_ISLAM', inverse: 'ANSWERED_CALL_OF', to: 'az-zubayr-ibn-al-awwam', claims: ['zubayr/answered-abu-bakr'] },
    { type: 'CALLED_TO_ISLAM', inverse: 'ANSWERED_CALL_OF', to: 'abdur-rahman-ibn-awf', claims: ['awf/answered-abu-bakr'] },
    { type: 'CALLED_TO_ISLAM', inverse: 'ANSWERED_CALL_OF', to: 'talhah-ibn-ubaydullah', claims: ['talhah/answered-abu-bakr'] },
    { type: 'CALLED_TO_ISLAM', inverse: 'ANSWERED_CALL_OF', to: 'saad-ibn-abi-waqqas', claims: ['saad/answered-abu-bakr'] },
  ],
} satisfies CatalogPerson;

export default abuBakrAsSiddiq;
