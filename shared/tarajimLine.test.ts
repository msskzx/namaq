import { describe, expect, it } from 'vitest';
import type { AppPerson } from './tarajim';
import { bareName, foldTop, lineOf, meetingOf, nasabTree } from './tarajimLine';
import peopleJson from './data/tarajim/people.json';

const people = peopleJson as AppPerson[];
const person = (slug: string) => people.find((p) => p.slug === slug)!;
const names = (slug: string) => lineOf(person(slug), people).map((n) => bareName(n.name));
const meet = (a: string, b: string) => {
  const la = lineOf(person(a), people);
  const lb = lineOf(person(b), people);
  const at = meetingOf(la, lb);
  return at && bareName(la[at.a].name);
};

describe('lineOf', () => {
  it('carries al-Zubayr on past «غالب» through the Prophet’s nasab', () => {
    const line = names('az-zubayr-ibn-al-awwam');
    expect(line.slice(0, 3)).toEqual(['الزبير', 'العوام', 'خويلد']);
    expect(line.at(-1)).toBe('عدنان');
    expect(line.filter((n) => n === 'غالب')).toHaveLength(1);
  });

  it('gives al-Abbas, whose heading names no father, his father from the entry and the fathers above him', () => {
    expect(names('al-abbas-ibn-abd-al-muttalib').slice(0, 4)).toEqual(['العباس', 'عبد المطلب', 'هاشم', 'عبد مناف']);
  });
});

describe('meetingOf', () => {
  it('finds where two lines meet', () => {
    expect(meet('al-abbas-ibn-abd-al-muttalib', 'prophet-muhammad')).toBe('عبد المطلب');
    expect(meet('jaafar-ibn-abi-talib', 'prophet-muhammad')).toBe('عبد المطلب');
    expect(meet('az-zubayr-ibn-al-awwam', 'prophet-muhammad')).toBe('قصي');
    expect(meet('talhah-ibn-ubaydullah', 'aisha-bint-abi-bakr')).toBe('عمرو');
    expect(meet('talhah-ibn-ubaydullah', 'az-zubayr-ibn-al-awwam')).toBe('مرة');
    expect(meet('hamzah-ibn-abd-al-muttalib', 'safiyyah-bint-abd-al-muttalib')).toBe('عبد المطلب');
  });
});

describe('nasabTree', () => {
  it('joins two lines down to where they part, and folds the shared line above', () => {
    const picked = ['al-abbas-ibn-abd-al-muttalib', 'prophet-muhammad'].map((slug) => ({ slug, line: lineOf(person(slug), people) }));
    const roots = nasabTree(picked);
    expect(roots).toHaveLength(1);
    const { above, start } = foldTop(roots[0]);
    expect(bareName(start.name)).toBe('عبد المطلب');
    expect(bareName(above[0])).toBe('هاشم');
    expect(start.children.map((c) => bareName(c.name)).sort()).toEqual(['العباس', 'عبد الله']);
    expect(start.children.find((c) => bareName(c.name) === 'عبد الله')!.children[0].people).toEqual(['prophet-muhammad']);
  });
});
