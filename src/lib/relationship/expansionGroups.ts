import { RelationType } from './types';

export type ExpansionGroup = 'immediateFamily' | 'extendedFamily' | 'marriage' | 'other';

export const EXPANSION_GROUP_ORDER: readonly ExpansionGroup[] = ['immediateFamily', 'extendedFamily', 'marriage', 'other'];

const IMMEDIATE_FAMILY_TYPES: ReadonlySet<RelationType> = new Set([
  'FATHER', 'MOTHER', 'STEP_FATHER', 'STEP_MOTHER',
  'SON', 'DAUGHTER', 'STEP_SON', 'STEP_DAUGHTER',
  'BROTHER', 'SISTER', 'HALF_BROTHER', 'HALF_SISTER', 'STEP_BROTHER', 'STEP_SISTER',
  'HUSBAND', 'WIFE',
]);

const EXTENDED_FAMILY_TYPES: ReadonlySet<RelationType> = new Set([
  'GRANDFATHER', 'GRANDMOTHER', 'GRANDSON', 'GRANDDAUGHTER',
  'MATERNAL_UNCLE', 'PATERNAL_UNCLE', 'MATERNAL_AUNT', 'PATERNAL_AUNT',
  'MATERNAL_COUSIN', 'PATERNAL_COUSIN',
  'MATERNAL_NEPHEW', 'MATERNAL_NIECE', 'PATERNAL_NEPHEW', 'PATERNAL_NIECE',
]);

const MARRIAGE_TYPES: ReadonlySet<RelationType> = new Set([
  'MOTHER_IN_LAW', 'FATHER_IN_LAW', 'SON_IN_LAW', 'DAUGHTER_IN_LAW', 'BROTHER_IN_LAW', 'SISTER_IN_LAW',
]);

export function expansionGroupForRelation(type: RelationType): ExpansionGroup {
  if (IMMEDIATE_FAMILY_TYPES.has(type)) return 'immediateFamily';
  if (EXTENDED_FAMILY_TYPES.has(type)) return 'extendedFamily';
  if (MARRIAGE_TYPES.has(type)) return 'marriage';
  return 'other';
}

export type LineageActionId = 'ANCESTORS' | 'PATERNAL_LINEAGE' | 'DESCENDANTS';

export const LINEAGE_ACTIONS: readonly LineageActionId[] = ['ANCESTORS', 'PATERNAL_LINEAGE', 'DESCENDANTS'];
