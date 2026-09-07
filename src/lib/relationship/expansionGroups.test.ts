import { describe, expect, it } from 'vitest';
import { EXPANSION_GROUP_ORDER, LINEAGE_ACTIONS, expansionGroupForRelation } from './expansionGroups';

describe('expansionGroupForRelation', () => {
  it('groups parent/child/sibling/spouse relations as immediate family', () => {
    expect(expansionGroupForRelation('FATHER')).toBe('immediateFamily');
    expect(expansionGroupForRelation('MOTHER')).toBe('immediateFamily');
    expect(expansionGroupForRelation('SON')).toBe('immediateFamily');
    expect(expansionGroupForRelation('DAUGHTER')).toBe('immediateFamily');
    expect(expansionGroupForRelation('BROTHER')).toBe('immediateFamily');
    expect(expansionGroupForRelation('SISTER')).toBe('immediateFamily');
    expect(expansionGroupForRelation('WIFE')).toBe('immediateFamily');
    expect(expansionGroupForRelation('HUSBAND')).toBe('immediateFamily');
  });

  it('groups grandparent/grandchild/aunt-uncle/cousin/niece-nephew relations as extended family', () => {
    expect(expansionGroupForRelation('GRANDFATHER')).toBe('extendedFamily');
    expect(expansionGroupForRelation('GRANDSON')).toBe('extendedFamily');
    expect(expansionGroupForRelation('PATERNAL_UNCLE')).toBe('extendedFamily');
    expect(expansionGroupForRelation('MATERNAL_COUSIN')).toBe('extendedFamily');
    expect(expansionGroupForRelation('PATERNAL_NIECE')).toBe('extendedFamily');
  });

  it('groups in-law relations as marriage', () => {
    expect(expansionGroupForRelation('FATHER_IN_LAW')).toBe('marriage');
    expect(expansionGroupForRelation('MOTHER_IN_LAW')).toBe('marriage');
    expect(expansionGroupForRelation('SON_IN_LAW')).toBe('marriage');
  });

  it('falls back to other for companionship, lineage, and non-person relation types', () => {
    expect(expansionGroupForRelation('COMPANION_OF')).toBe('other');
    expect(expansionGroupForRelation('ANCESTOR')).toBe('other');
    expect(expansionGroupForRelation('MAWLA')).toBe('other');
    expect(expansionGroupForRelation('PARTICIPATED_IN')).toBe('other');
    expect(expansionGroupForRelation('HOLDS_TITLE')).toBe('other');
    expect(expansionGroupForRelation('INVOLVED_IN')).toBe('other');
  });
});

describe('EXPANSION_GROUP_ORDER', () => {
  it('lists every group exactly once', () => {
    expect(EXPANSION_GROUP_ORDER).toEqual(['immediateFamily', 'extendedFamily', 'marriage', 'other']);
  });
});

describe('LINEAGE_ACTIONS', () => {
  it('lists the three across-generation actions', () => {
    expect(LINEAGE_ACTIONS).toEqual(['ANCESTORS', 'PATERNAL_LINEAGE', 'DESCENDANTS']);
  });
});
