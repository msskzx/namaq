import type { CatalogPerson } from '@/lib/catalog/types';

/**
 * Read against data/history/batches/safiyyah-bint-abd-al-muttalib-siyar15,
 * entry 41 of the Siyar. Her sibling edge to Hamzah and her marriage edge to
 * al-Awwam ibn Khuwaylid stay declared on their own modules (the catalog's
 * one-declaration-per-edge convention -- catalog:project-graph writes both
 * directions), now cited from there instead of legacy-unreviewed. Mother of
 * az-Zubayr ibn al-Awwam. Distinct from safiyyah-bint-huyayy, one of the
 * Prophet's wives.
 */
const safiyyahBintAbdAlMuttalib = {
  kind: 'PERSON',
  slug: 'safiyyah-bint-abd-al-muttalib',
  name: 'صَفِيَّةُ بِنْتُ عَبْدِ المُطَّلِبِ',
  nameTransliterated: 'Safiyyah bint Abd al-Muttalib',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: ['safiyyah-siyar15/sex'] },
    fullName: {
      value: 'صَفِيَّةُ بِنْتُ عَبْدِ المُطَّلِبِ الهَاشِمِيَّةُ',
      claims: ['safiyyah-siyar15/full-name'],
    },
    deathYearHijri: { value: '20 AH', claims: ['safiyyah-siyar15/death-year'] },
    virtues: {
      value:
        'أَنَا أَوَّلُ امْرَأَةٍ قَتَلَتْ رَجُلاً يَا فَاطِمَةَ بِنْتَ مُحَمَّدٍ، يَا صَفِيَّةَ بِنْتَ عَبْدِ المُطَّلِبِ، يَا بَنِي عَبْدِ المُطَّلِبِ',
      claims: ['safiyyah-siyar15/virtues'],
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: ['safiyyah-siyar15/companion'] },
  ],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'abd-al-muttalib-ibn-hashim', claims: ['safiyyah-siyar15/full-name'] },
    // Also declared as BROTHER on hamzah-ibn-abd-al-muttalib's own module and
    // as HUSBAND on al-awwam-ibn-khuwaylid's; catalog:project-graph writes
    // both directions from either declaration, but catalog:checklist only
    // reads a subject's own module, so both edges are restated here too --
    // exactly the class of gap docs/extraction-checklist.md's Hamzah example
    // warns about, now closed from her own side as well.
    { type: 'SISTER', inverse: 'BROTHER', to: 'hamzah-ibn-abd-al-muttalib', claims: ['safiyyah-siyar15/sibling-hamzah'] },
    { type: 'WIFE', inverse: 'HUSBAND', to: 'al-awwam-ibn-khuwaylid', claims: ['safiyyah-siyar15/husband-al-awwam'] },
  ],
} satisfies CatalogPerson;

export default safiyyahBintAbdAlMuttalib;
