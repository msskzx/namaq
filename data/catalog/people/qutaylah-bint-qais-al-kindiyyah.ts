import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. `fullName` and the `DAUGHTER` edge stay on the legacy
 * marker: data/history/batches/qutaylah-bint-qais-al-kindiyyah's account does
 * not state her nasab, only her brother.
 *
 * Her companion status is genuinely contested by her own source entry, kept
 * in per docs/data-pipelines.md's Companion scope section rather than
 * dropped: the Prophet is said to have married her, but died before she
 * reached him, and an alternate report has her apostatizing instead — see
 * the batch's summary.md.
 */
const qutaylahBintQaisAlKindiyyah = {
  kind: 'PERSON',
  slug: 'qutaylah-bint-qais-al-kindiyyah',
  name: 'قتيلة',
  nameTransliterated: 'Qutaylah bint Qais al-Kindiyyah',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
    fullName: { value: 'قتيلة بنت قيس بن معدي كرب الكندية', claims: legacyUnreviewed },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['qutaylah-siyar10/companion-of-prophet'],
    },
  ],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'qais-ibn-muadikarib-al-kindi', claims: legacyUnreviewed },
    { type: 'SISTER', inverse: 'BROTHER', to: 'al-ashath-ibn-qais', claims: ['qutaylah-siyar10/sister-ashath'] },
    {
      type: 'WIFE',
      inverse: 'HUSBAND',
      to: 'prophet-muhammad',
      claims: ['qutaylah-siyar10/companion-of-prophet'],
    },
    { type: 'COMPANION_OF', to: 'prophet-muhammad', claims: ['qutaylah-siyar10/companion-of-prophet'] },
  ],
} satisfies CatalogPerson;

export default qutaylahBintQaisAlKindiyyah;
