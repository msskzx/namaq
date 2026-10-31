import { describe, expect, it } from 'vitest';
import { TOPIC_GROUPS, TOPIC_LABELS } from './labels';

describe('public quiz settings', () => {
  it('offers only shared Quranic wording in solo and party settings', () => {
    expect(TOPIC_GROUPS.flatMap(group => group.topics)).toEqual(['BRANCHES']);
    expect(TOPIC_LABELS.BRANCHES).toEqual({ ar: 'متشابهات القرآن', en: 'Shared Quranic wording' });
  });
});
