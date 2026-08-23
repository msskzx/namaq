import translations from '@/components/language/translations';

// Canonical ordering for relation types, e.g. immediate family before
// extended family/in-laws. Derived from the order relation keys are defined
// in translations.ts rather than duplicated here.
export const RELATION_ORDER = Object.keys(translations.en.relationTypes);

// Relation types are grouped into a family "category" for both color and
// filtering, so e.g. FATHER and MOTHER are one "parent" toggle/color, all
// sibling variants are one "sibling" toggle/color, etc. Direction (parent vs
// child, aunt/uncle vs niece/nephew) still gets its own category since
// that's visually/semantically meaningful in the graph.
const CATEGORY_BY_TYPE: Record<string, string> = {
  FATHER: 'parent', MOTHER: 'parent', STEP_FATHER: 'parent', STEP_MOTHER: 'parent',
  SON: 'child', DAUGHTER: 'child', STEP_SON: 'child', STEP_DAUGHTER: 'child',
  BROTHER: 'sibling', SISTER: 'sibling', HALF_BROTHER: 'sibling', HALF_SISTER: 'sibling', STEP_BROTHER: 'sibling', STEP_SISTER: 'sibling',
  HUSBAND: 'spouse', WIFE: 'spouse',
  GRANDFATHER: 'grandparent', GRANDMOTHER: 'grandparent',
  GRANDSON: 'grandchild', GRANDDAUGHTER: 'grandchild',
  MATERNAL_UNCLE: 'auntUncle', PATERNAL_UNCLE: 'auntUncle', MATERNAL_AUNT: 'auntUncle', PATERNAL_AUNT: 'auntUncle',
  MATERNAL_COUSIN: 'cousin', PATERNAL_COUSIN: 'cousin',
  MATERNAL_NEPHEW: 'nieceNephew', MATERNAL_NIECE: 'nieceNephew', PATERNAL_NEPHEW: 'nieceNephew', PATERNAL_NIECE: 'nieceNephew',
  MOTHER_IN_LAW: 'inLaw', FATHER_IN_LAW: 'inLaw', SON_IN_LAW: 'inLaw', DAUGHTER_IN_LAW: 'inLaw', BROTHER_IN_LAW: 'inLaw', SISTER_IN_LAW: 'inLaw',
  ANCESTOR: 'lineage', DESCENDANT: 'lineage',
  MAWLA: 'household', CONCUBINE: 'household',
};

const CATEGORY_COLORS: Record<string, string> = {
  parent: '#f59e0b',
  child: '#3b82f6',
  sibling: '#10b981',
  spouse: '#ec4899',
  grandparent: '#8b5cf6',
  grandchild: '#6366f1',
  auntUncle: '#f97316',
  cousin: '#14b8a6',
  nieceNephew: '#84cc16',
  inLaw: '#06b6d4',
  lineage: '#d946ef',
  household: '#ef4444',
};

const FALLBACK_PALETTE = Object.values(CATEGORY_COLORS);

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  return hash;
}

export function relationColor(type: string): string {
  const category = CATEGORY_BY_TYPE[type];
  if (category) return CATEGORY_COLORS[category];
  return FALLBACK_PALETTE[hashString(type) % FALLBACK_PALETTE.length];
}

// Sorts by RELATION_ORDER (father before cousin, etc.); types not found
// there (unseeded translation keys aside, any future/unknown type) sort
// alphabetically after all known ones.
export function sortRelationTypes(types: string[]): string[] {
  return [...types].sort((a, b) => {
    const ai = RELATION_ORDER.indexOf(a);
    const bi = RELATION_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}
