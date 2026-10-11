import { describe, expect, it } from 'vitest';
import { givenName, layoutNasab } from './nasabLayout';

type Person = { slug: string; name: string; fathers: string[] };

function person(slug: string, fathers: string[] = [], name = slug): Person {
  return { slug, name, fathers };
}

function node(result: ReturnType<typeof layoutNasab>, slug: string) {
  const found = result.nodes.find((n) => n.slug === slug);
  if (!found) throw new Error(`missing node ${slug}`);
  return found;
}

describe('layoutNasab', () => {
  it('draws a single subject with three generations as a straight line', () => {
    const result = layoutNasab(
      [person('grandfather'), person('father', ['grandfather']), person('son', ['father'])],
      ['son'],
    );

    expect(result.nodes).toHaveLength(3);
    expect(node(result, 'grandfather').row).toBe(0);
    expect(node(result, 'father').row).toBe(1);
    expect(node(result, 'son').row).toBe(2);
    const cols = new Set(result.nodes.map((n) => n.col));
    expect(cols.size).toBe(1);
    expect(result.edges).toHaveLength(2);
    expect(result.edges).toContainEqual({ from: 'grandfather', to: 'father' });
    expect(result.edges).toContainEqual({ from: 'father', to: 'son' });
    expect(result.chains).toEqual([{ subject: 'son', slugs: ['son', 'father', 'grandfather'] }]);
    expect(result.nodes.every((n) => !n.isMeeting)).toBe(true);
    expect(node(result, 'son').isSubject).toBe(true);
    expect(node(result, 'father').isSubject).toBe(false);
  });

  it('marks the shared father of two brothers as the meeting point, centered between them', () => {
    const result = layoutNasab(
      [person('father'), person('a', ['father']), person('b', ['father'])],
      ['a', 'b'],
    );

    const a = node(result, 'a');
    const b = node(result, 'b');
    const father = node(result, 'father');
    expect(a.col).not.toBe(b.col);
    expect(a.row).toBe(1);
    expect(b.row).toBe(1);
    expect(father.row).toBe(0);
    expect(father.isMeeting).toBe(true);
    expect(father.col).toBeCloseTo((a.col + b.col) / 2);
    expect(a.isMeeting).toBe(false);
    expect(b.isMeeting).toBe(false);
    expect(result.edges).toContainEqual({ from: 'father', to: 'a' });
    expect(result.edges).toContainEqual({ from: 'father', to: 'b' });
  });

  it('places leaf columns in subject order', () => {
    const result = layoutNasab(
      [person('father'), person('a', ['father']), person('b', ['father'])],
      ['b', 'a'],
    );

    expect(node(result, 'b').col).toBeLessThan(node(result, 'a').col);
  });

  it('marks a subject that is also the father of another subject as the meeting point', () => {
    const result = layoutNasab(
      [person('root'), person('s1', ['root']), person('s2', ['s1'])],
      ['s1', 's2'],
    );

    expect(node(result, 's1').isMeeting).toBe(true);
    expect(node(result, 's1').isSubject).toBe(true);
    expect(node(result, 'root').isMeeting).toBe(false);
    expect(node(result, 's2').isMeeting).toBe(false);
  });

  it('marks both meeting points when two meetings are nested', () => {
    const result = layoutNasab(
      [
        person('root'),
        person('x', ['root']),
        person('a', ['x']),
        person('b', ['x']),
        person('c', ['root']),
      ],
      ['a', 'b', 'c'],
    );

    expect(node(result, 'x').isMeeting).toBe(true);
    expect(node(result, 'root').isMeeting).toBe(true);
    expect(node(result, 'a').isMeeting).toBe(false);
    expect(node(result, 'b').isMeeting).toBe(false);
    expect(node(result, 'c').isMeeting).toBe(false);
  });

  it('lays unrelated lineages side by side with no meeting point', () => {
    const result = layoutNasab(
      [
        person('r1'),
        person('m1', ['r1']),
        person('a', ['m1']),
        person('r2'),
        person('b', ['r2']),
      ],
      ['a', 'b'],
    );

    const first = ['r1', 'm1', 'a'].map((s) => node(result, s).col);
    const second = ['r2', 'b'].map((s) => node(result, s).col);
    expect(Math.max(...first)).toBeLessThan(Math.min(...second));
    expect(result.nodes.every((n) => !n.isMeeting)).toBe(true);
    expect(result.chains).toEqual([
      { subject: 'a', slugs: ['a', 'm1', 'r1'] },
      { subject: 'b', slugs: ['b', 'r2'] },
    ]);
  });

  it('flags a subject with no recorded father', () => {
    const result = layoutNasab([person('alone')], ['alone']);

    expect(result.nodes).toHaveLength(1);
    expect(result.nodes[0].fatherUnrecorded).toBe(true);
    expect(result.nodes[0].row).toBe(0);
    expect(result.edges).toEqual([]);
    expect(result.chains).toEqual([{ subject: 'alone', slugs: ['alone'] }]);
  });

  it('does not flag a person whose father is recorded', () => {
    const result = layoutNasab([person('father'), person('son', ['father'])], ['son']);

    expect(node(result, 'son').fatherUnrecorded).toBe(false);
    expect(node(result, 'father').fatherUnrecorded).toBe(true);
  });

  it('takes the smallest slug as primary father and lists the others', () => {
    const result = layoutNasab(
      [person('zayd'), person('amr'), person('son', ['zayd', 'amr'])],
      ['son'],
    );

    expect(result.edges).toEqual([{ from: 'amr', to: 'son' }]);
    expect(node(result, 'son').otherFathers).toEqual(['zayd']);
    expect(node(result, 'son').row).toBe(1);
    expect(node(result, 'amr').otherFathers).toEqual([]);
  });

  it('terminates on a cycle and still returns every node', () => {
    const result = layoutNasab([person('a', ['b']), person('b', ['a'])], ['a']);

    expect(result.nodes.map((n) => n.slug).sort()).toEqual(['a', 'b']);
    expect(result.chains).toHaveLength(1);
    expect(result.chains[0].subject).toBe('a');
    expect(result.chains[0].slugs[0]).toBe('a');
  });

  it('ignores unknown and repeated subject slugs', () => {
    const result = layoutNasab(
      [person('father'), person('son', ['father'])],
      ['ghost', 'son', 'son'],
    );

    expect(result.chains).toEqual([{ subject: 'son', slugs: ['son', 'father'] }]);
    expect(result.nodes).toHaveLength(2);
    expect(node(result, 'son').isSubject).toBe(true);
    expect(result.nodes.every((n) => !n.isMeeting)).toBe(true);
  });

  it('passes Arabic names through unchanged', () => {
    const name = 'عبد الله بن عبد المطلب';
    const result = layoutNasab(
      [person('abd-al-muttalib', [], 'عبد المطلب'), person('abdullah', ['abd-al-muttalib'], name)],
      ['abdullah'],
    );

    expect(node(result, 'abdullah').name).toBe(name);
    expect(node(result, 'abd-al-muttalib').name).toBe('عبد المطلب');
  });
});

describe('givenName', () => {
  it('keeps what comes before the first بن', () => {
    expect(givenName('علي بن أبي طالب')).toBe('علي');
    expect(givenName('عدنان')).toBe('عدنان');
  });
});
