import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all.
 *
 * fullName and the FATHER edge stay on the legacy marker: her own account in
 * data/history/batches/arwa-bint-abd-al-muttalib-siyar175 names her only
 * "عمة رسول الله" without literally stating "بنت عبد المطلب" -- unlike her
 * sister Safiyyah's own entry, which does. The same batch also read Hamzah's,
 * Safiyyah's and Atikah's accounts for a stated full-sibling tie to Arwa and
 * found none, so no BROTHER/SISTER edge is added here despite the widely
 * repeated claim that she is their full sister; see that batch's summary.md.
 */
const arwaBintAbdAlMuttalib = {
  kind: 'PERSON',
  slug: 'arwa-bint-abd-al-muttalib',
  name: 'أروى بنت عبد المطلب',
  nameTransliterated: 'Arwa bint Abd al-Muttalib',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
    fullName: { value: 'أروى بنت عبد المطلب بن هاشم القرشية الهاشمية', claims: legacyUnreviewed },
    virtues: {
      value: 'ثُمَّ أَسْلَمَتْ أَرْوَى، وَهَاجَرَتْ.',
      claims: ['arwa-siyar175/islam-hijrah'],
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'abd-al-muttalib-ibn-hashim', claims: legacyUnreviewed },
    { type: 'WIFE', inverse: 'HUSBAND', to: 'umayr-ibn-wahb', claims: ['arwa-siyar175/husband-umayr'] },
    { type: 'WIFE', inverse: 'HUSBAND', to: 'artah', claims: ['arwa-siyar175/husband-artah'] },
  ],
} satisfies CatalogPerson;

export default arwaBintAbdAlMuttalib;
