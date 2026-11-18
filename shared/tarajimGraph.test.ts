import { describe, expect, it } from 'vitest';
import type { AppPerson } from './tarajim';
import peopleJson from './data/tarajim/people.json';
import { chainBetween, chainSentence, joining, linkedPairs, peopleGraph, tieGroups } from './tarajimGraph';

const people = peopleJson as AppPerson[];
const graph = peopleGraph(people);

describe('peopleGraph', () => {
  it('holds each stated tie both ways, read backwards from the other entry', () => {
    const zubayr = tieGroups(graph, 'az-zubayr-ibn-al-awwam');
    expect(zubayr.find((g) => g.kind === 'parent')!.ties.map((t) => t.to)).toContain('safiyyah-bint-abd-al-muttalib');
    expect(tieGroups(graph, 'safiyyah-bint-abd-al-muttalib').find((g) => g.kind === 'child')!.ties.map((t) => t.to)).toContain('az-zubayr-ibn-al-awwam');
  });
});

describe('chainBetween', () => {
  it('finds the nearest chain, through people who are not converted too, and says it in one sentence', () => {
    const chain = chainBetween(graph, 'az-zubayr-ibn-al-awwam', 'aisha-bint-abi-bakr')!;
    expect(chain[0].from).toBe('az-zubayr-ibn-al-awwam');
    expect(chain.at(-1)!.to).toBe('aisha-bint-abi-bakr');
    expect(chainSentence(graph, chain)).toMatch(/عائشة/u);
  });

  it('prefers family to companionship', () => {
    // al-Zubayr is the Prophet's ﷺ cousin and his companion: the chain is the one step of kinship.
    expect(chainBetween(graph, 'az-zubayr-ibn-al-awwam', 'prophet-muhammad')!.map((s) => s.kind)).toEqual(['cousin']);
  });

  it('says so when no chain is stated', () => {
    const lone = { ...people[0], slug: 'lone', parents: [], children: [], spouses: [], siblings: [], cousins: [], companionOf: [] } as AppPerson;
    expect(chainBetween(peopleGraph([...people, lone]), 'lone', 'prophet-muhammad')).toBeUndefined();
  });
});

describe('joining', () => {
  it('merges the chains from the first person to each other one, each person once', () => {
    const { nodes, steps } = joining(graph, ['az-zubayr-ibn-al-awwam', 'aisha-bint-abi-bakr', 'safiyyah-bint-abd-al-muttalib']);
    expect(new Set(nodes).size).toBe(nodes.length);
    expect(nodes).toEqual(expect.arrayContaining(['az-zubayr-ibn-al-awwam', 'aisha-bint-abi-bakr', 'safiyyah-bint-abd-al-muttalib']));
    expect(steps.length).toBeGreaterThan(0);
  });
});

describe('linkedPairs', () => {
  it('gives converted people joined through someone else, each pair once with its chain', () => {
    const graph = peopleGraph(peopleJson as AppPerson[]);
    const pairs = linkedPairs(graph);
    expect(pairs.length).toBeGreaterThan(0);
    for (const pair of pairs) {
      expect(graph.nodes.get(pair.a)!.inApp && graph.nodes.get(pair.b)!.inApp).toBe(true);
      expect(pair.a < pair.b).toBe(true);
      expect(pair.steps[0].from).toBe(pair.a);
      expect(pair.steps[pair.steps.length - 1].to).toBe(pair.b);
    }
    expect(pairs.every((pair) => pair.steps.length > 1)).toBe(true);
  });
});
