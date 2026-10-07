import { describe, expect, it } from 'vitest';
import { legacyUnreviewed, type CatalogOrdering, type CatalogBattle, type CatalogEvent } from './types';
import { orderingProblems, orderingRevision } from './ordering'; // docs/adr/0028-a-stated-ordering-is-recorded-and-its-placement-is-derived.md

const event = (slug: string, hijriYear: number): CatalogEvent => ({
  kind: 'EVENT',
  slug,
  name: slug,
  type: 'OTHER',
  fields: { hijriYear: { value: hijriYear, claims: ['batch/claim'] } },
  people: [],
});

const battle = (slug: string, hijriYear: number): CatalogBattle => ({
  kind: 'BATTLE',
  slug,
  name: slug,
  fields: { hijriYear: { value: hijriYear, claims: ['batch/claim'] } },
  participants: [],
});

const ordering = (earlier: string, later: string, source: string, claims: CatalogOrdering['claims'] = ['order/one']): CatalogOrdering => ({
  kind: 'ORDERING',
  earlier,
  later,
  source,
  claims,
});

describe('orderingProblems', () => {
  describe('unknown event/battle references', () => {
    it('gives an error when earlier event slug is unknown', () => {
      const catalog = {
        events: [event('later-event', 5)],
        battles: [],
        orderings: [ordering('unknown-event', 'later-event', 'source-one')],
      };

      const { errors } = orderingProblems(catalog);
      expect(errors).toContainEqual(expect.objectContaining({
        path: 'orderings/unknown-event-before-later-event',
        message: 'unknown event or battle unknown-event',
      }));
    });

    it('gives an error when later event slug is unknown', () => {
      const catalog = {
        events: [event('earlier-event', 3)],
        battles: [],
        orderings: [ordering('earlier-event', 'unknown-event', 'source-one')],
      };

      const { errors } = orderingProblems(catalog);
      expect(errors).toContainEqual(expect.objectContaining({
        path: 'orderings/earlier-event-before-unknown-event',
        message: 'unknown event or battle unknown-event',
      }));
    });
  });

  describe('self-ordering', () => {
    it('gives an error when earlier and later are the same', () => {
      const catalog = {
        events: [event('some-event', 5)],
        battles: [],
        orderings: [ordering('some-event', 'some-event', 'source-one')],
      };

      const { errors } = orderingProblems(catalog);
      expect(errors).toContainEqual(expect.objectContaining({
        path: 'orderings/some-event-before-some-event',
        message: 'an event cannot come before itself',
      }));
    });
  });

  describe('chronological consistency within a source', () => {
    it('gives no error when years are consistent (earlier < later)', () => {
      const catalog = {
        events: [event('first', 3), event('second', 5)],
        battles: [],
        orderings: [ordering('first', 'second', 'source-one')],
      };

      const { errors } = orderingProblems(catalog);
      expect(errors).toEqual([]);
    });

    it('gives no error when years are equal', () => {
      const catalog = {
        events: [event('first', 5), event('second', 5)],
        battles: [],
        orderings: [ordering('first', 'second', 'source-one')],
      };

      const { errors } = orderingProblems(catalog);
      expect(errors).toEqual([]);
    });

    it('gives an error when years contradict (earlier > later) and both are from the same source', () => {
      const claimSources = new Map<string, string[]>([['batch/claim', ['source-one']]]);
      const catalog = {
        events: [event('first', 5), event('second', 3)],
        battles: [],
        orderings: [ordering('first', 'second', 'source-one')],
      };

      const { errors } = orderingProblems(catalog, claimSources);
      expect(errors).toContainEqual(expect.objectContaining({
        path: 'orderings/first-before-second',
        message: 'first (5) is dated after second (3) in the same source',
      }));
    });

    it('does not error when years contradict but claims are from a different source', () => {
      const claimSources = new Map<string, string[]>([['batch/claim', ['source-other']]]);
      const catalog = {
        events: [event('first', 5), event('second', 3)],
        battles: [],
        orderings: [ordering('first', 'second', 'source-one')],
      };

      const { errors, disputed } = orderingProblems(catalog, claimSources);
      expect(errors).toEqual([]);
      expect(disputed).toContain('first');
      expect(disputed).toContain('second');
    });
  });

  describe('cycles within a single source', () => {
    it('gives no error for a simple two-node chain', () => {
      const catalog = {
        events: [event('a', 1), event('b', 2)],
        battles: [],
        orderings: [ordering('a', 'b', 'source-one')],
      };

      const { errors, disputed } = orderingProblems(catalog);
      expect(errors).toEqual([]);
      expect(disputed.size).toBe(0);
    });

    it('gives an error for a two-node cycle in one source', () => {
      const catalog = {
        events: [event('a', 1), event('b', 2)],
        battles: [],
        orderings: [
          ordering('a', 'b', 'source-one'),
          ordering('b', 'a', 'source-one'),
        ],
      };

      const { errors } = orderingProblems(catalog);
      expect(errors).toContainEqual(expect.objectContaining({
        path: 'orderings (source-one)',
        message: 'the orderings of one source form a cycle',
      }));
    });

    it('gives an error for a three-node cycle within one source', () => {
      const catalog = {
        events: [event('a', 1), event('b', 2), event('c', 3)],
        battles: [],
        orderings: [
          ordering('a', 'b', 'source-one'),
          ordering('b', 'c', 'source-one'),
          ordering('c', 'a', 'source-one'),
        ],
      };

      const { errors } = orderingProblems(catalog);
      expect(errors).toContainEqual(expect.objectContaining({
        path: 'orderings (source-one)',
        message: 'the orderings of one source form a cycle',
      }));
    });
  });

  describe('cycles from multiple sources', () => {
    it('marks nodes as disputed when cycle is made of orderings from different sources', () => {
      const catalog = {
        events: [event('a', 1), event('b', 2)],
        battles: [],
        orderings: [
          ordering('a', 'b', 'source-one'),
          ordering('b', 'a', 'source-two'),
        ],
      };

      const { errors, disputed } = orderingProblems(catalog);
      expect(errors).toEqual([]);
      expect(disputed).toContain('a');
      expect(disputed).toContain('b');
    });
  });

  describe('battles and events mix', () => {
    it('counts battles as events for ordering purposes', () => {
      const catalog = {
        events: [event('event-slug', 2)],
        battles: [battle('battle-slug', 1)],
        orderings: [ordering('battle-slug', 'event-slug', 'source-one')],
      };

      const { errors } = orderingProblems(catalog);
      expect(errors).toEqual([]);
    });
  });

  describe('undefined and empty orderings', () => {
    it('gives no error when orderings is undefined', () => {
      const catalog = {
        events: [event('event-slug', 1)],
        battles: [],
      };

      const { errors } = orderingProblems(catalog);
      expect(errors).toEqual([]);
    });

    it('gives no error when orderings is empty array', () => {
      const catalog = {
        events: [event('event-slug', 1)],
        battles: [],
        orderings: [],
      };

      const { errors } = orderingProblems(catalog);
      expect(errors).toEqual([]);
    });
  });

  describe('edge cases with missing or legacyUnreviewed claims', () => {
    it('handles legacyUnreviewed date claims correctly', () => {
      const claimSources = new Map<string, string[]>();
      const eventWithLegacy: CatalogEvent = {
        kind: 'EVENT',
        slug: 'first',
        name: 'first',
        type: 'OTHER',
        fields: { hijriYear: { value: 5, claims: legacyUnreviewed } },
        people: [],
      };
      const catalog = {
        events: [eventWithLegacy, event('second', 3)],
        battles: [],
        orderings: [ordering('first', 'second', 'source-one')],
      };

      const { errors, disputed } = orderingProblems(catalog, claimSources);
      expect(errors).toEqual([]);
      expect(disputed).toContain('first');
      expect(disputed).toContain('second');
    });
  });
});

describe('orderingRevision', () => {
  it('produces the same hash for identical orderings', () => {
    const order = ordering('event-a', 'event-b', 'source-one', ['order/one']);
    const spanTexts = {};

    const hash1 = orderingRevision(order, spanTexts);
    const hash2 = orderingRevision(order, spanTexts);

    expect(hash1).toBe(hash2);
  });

  it('produces different hashes when claims differ', () => {
    const order1 = ordering('event-a', 'event-b', 'source-one', ['order/one']);
    const order2 = ordering('event-a', 'event-b', 'source-one', ['order/two']);
    const spanTexts = {};

    const hash1 = orderingRevision(order1, spanTexts);
    const hash2 = orderingRevision(order2, spanTexts);

    expect(hash1).not.toBe(hash2);
  });

  it('includes span text in the hash when a unit#span ref is cited', () => {
    const order = ordering('event-a', 'event-b', 'source-one', ['unit#span-one'] as unknown as CatalogOrdering['claims']);
    const spanTexts1 = { 'unit#span-one': 'text one' };
    const spanTexts2 = { 'unit#span-one': 'text two' };

    const hash1 = orderingRevision(order, spanTexts1);
    const hash2 = orderingRevision(order, spanTexts2);

    expect(hash1).not.toBe(hash2);
  });

  it('ignores span text for references not cited', () => {
    const order = ordering('event-a', 'event-b', 'source-one', ['order/one']);
    const spanTexts = { 'unit#span-one': 'text', 'unit#span-two': 'more' };

    const hash1 = orderingRevision(order, spanTexts);
    const hash2 = orderingRevision(order, {});

    expect(hash1).toBe(hash2);
  });

  it('handles legacyUnreviewed claims', () => {
    const order: CatalogOrdering = {
      kind: 'ORDERING',
      earlier: 'event-a',
      later: 'event-b',
      source: 'source-one',
      claims: legacyUnreviewed,
    };
    const spanTexts = {};

    const hash = orderingRevision(order, spanTexts);

    expect(typeof hash).toBe('string');
    expect(hash.length).toBe(16);
  });

  it('returns a 16-character hex string', () => {
    const order = ordering('event-a', 'event-b', 'source-one', ['order/one']);
    const spanTexts = {};

    const hash = orderingRevision(order, spanTexts);

    expect(/^[0-9a-f]{16}$/.test(hash)).toBe(true);
  });
});

describe('orderingProblems, second review', () => {
  const event = (slug: string) => ({ kind: 'EVENT', slug, name: slug, type: 'OTHER', fields: {}, people: [] });
  const ordering = (earlier: string, later: string, source = 's1') => ({ kind: 'ORDERING', earlier, later, source, claims: ['c'] });
  const catalog = (orderings: unknown[]) => ({ events: ['a', 'b'].map(event), battles: [], orderings }) as unknown as Parameters<typeof orderingProblems>[0];

  it('gives one error for an event ordered before itself, not two', () => {
    const { errors } = orderingProblems(catalog([ordering('a', 'a')]));
    expect(errors.map((e) => e.message)).toEqual(['an event cannot come before itself']);
    expect([...orderingProblems(catalog([ordering('a', 'a')])).disputed]).toEqual([]);
  });

  it('counts a year claim that cites two works as the ordering work when one of them matches', () => {
    const events = [
      { ...event('a'), fields: { hijriYear: { value: 5, claims: ['y'] } } },
      { ...event('b'), fields: { hijriYear: { value: 3, claims: ['y'] } } },
    ];
    const both = { events, battles: [], orderings: [ordering('a', 'b', 's2')] } as unknown as Parameters<typeof orderingProblems>[0];
    const { errors, disputed } = orderingProblems(both, new Map([['y', ['s1', 's2']]]));
    expect(errors).toHaveLength(1);
    expect([...disputed]).toEqual([]);
  });
});
