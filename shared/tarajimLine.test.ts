import { describe, expect, it } from 'vitest';
import type { AppPerson } from './tarajim';
import { bareName, foldTop, lineOf, meetingOf, nasabTree, type NasabNode } from './tarajimLine';
import peopleJson from './data/tarajim/people.json';

const people = peopleJson as AppPerson[];
const person = (slug: string) => people.find((p) => p.slug === slug)!;
const names = (slug: string) => lineOf(person(slug), people).map((n) => bareName(n.name));
const meet = (a: string, b: string) => {
  const la = lineOf(person(a), people);
  const lb = lineOf(person(b), people);
  const at = meetingOf(la, lb);
  return at && la[at.a].name.replace(/[ً-ْٰـ]/g, '');
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

describe('safeguards', () => {
  const man = (slug: string, nasab: string[], father?: string): AppPerson => ({
    ...person('talhah-ibn-ubaydullah'), slug, name: nasab[0], nasab,
    parents: father ? [{ slug: father, name: nasab[1], inApp: false, sex: 'MALE', text: '', refs: [], by: [] }] : [],
  } as AppPerson);

  it('never carries a line of two names on by a common name alone', () => {
    // «جابر بن عبد الله» must not become the Prophet's ﷺ brother through «عبد الله».
    const jabir = man('jabir', ['جابر', 'عبد الله'], 'abdullah-ibn-amr');
    const all = [...people, jabir];
    expect(lineOf(jabir, all).map((n) => n.bare)).toEqual(['جابر', 'عبد الله']);
  });

  it('carries a son through his father’s own entry even when the son’s heading shortens the nasab', () => {
    const amr = man('amr-ibn-al-jumuh', ['عمرو', 'الجموح', 'زيد', 'حرام', 'كعب'], 'al-jumuh');
    const muadh = man('muadh', ['معاذ', 'عمرو', 'الجموح', 'كعب'], 'amr-ibn-al-jumuh');
    const all = [amr, muadh];
    expect(lineOf(muadh, all).map((n) => n.bare)).toEqual(['معاذ', 'عمرو', 'الجموح', 'زيد', 'حرام', 'كعب']);
    const roots = nasabTree([muadh, amr].map((p) => ({ slug: p.slug, line: lineOf(p, all) })));
    expect(roots).toHaveLength(1);
  });

  it('carries a short line through a brother the entries name as the same father', () => {
    expect(names('safiyyah-bint-abd-al-muttalib').slice(0, 3)).toEqual(['صفيه', 'عبد المطلب', 'هاشم']);
  });

  it('draws two lines whose top fathers only share a name as two trees', () => {
    const a = man('a', ['زيد', 'خالد', 'عمرو'], 'x');
    const b = man('b', ['بكر', 'سعد', 'عمرو'], 'y');
    const all = [a, b];
    const roots = nasabTree([a, b].map((p) => ({ slug: p.slug, line: lineOf(p, all) })));
    expect(roots).toHaveLength(2);
  });

  it('keeps every tree when a line reaches above a top another line has already drawn higher', () => {
    const line = (slug: string, ns: string[]) => ({ slug, line: ns.map((n) => ({ name: n, bare: n, from: slug })) });
    const roots = nasabTree([
      line('a', ['a', 'x', 'y', 'z']),
      line('b', ['b', 'y', 'z', 'w', 'v']),
      line('d', ['d', 'm', 'n']),
      line('c', ['c', 'x', 'y', 'z', 'w', 'v', 'u']),
    ]);
    expect(roots.map((r) => r.key).sort()).toEqual(['n', 'u']);
    const count = (n: NasabNode): number => 1 + n.children.reduce((sum, c) => sum + count(c), 0);
    // u v w z y x a b c, each once.
    expect(count(roots.find((r) => r.key === 'u')!)).toBe(9);
  });
});

describe('kunyaName', () => {
  it('reads a kunya in the nominative whatever case the book gives it in', async () => {
    const { kunyaName } = await import('./tarajim');
    expect(kunyaName('أَبَا تُرَابٍ')).toBe('أبو تراب');
    expect(kunyaName('أَبِي عَبْدِ اللهِ')).toBe('أبو عبد الله');
    expect(kunyaName('أَبُو مُحَمَّدٍ')).toBe('أبو محمد');
    expect(kunyaName('ذَا الجَنَاحَيْنِ')).toBe('ذو الجناحين');
  });
});

describe('nasab slips', () => {
  it('names only people that exist and a name their nasab prints, each with a note', async () => {
    const { slips } = (await import('./data/tarajim/nasabSlips.json')).default as { slips: Record<string, { at: string; note: string }> };
    for (const [slug, slip] of Object.entries(slips)) {
      const p = people.find((x) => x.slug === slug);
      expect(p).toBeDefined();
      expect(p!.nasab.map(bareName)).toContain(bareName(slip.at));
      expect(slip.note.length).toBeGreaterThan(0);
    }
  });
});

describe('names in a line', () => {
  const man = (slug: string, nasab: string[], parents: { name: string; sex: 'MALE' | 'FEMALE' }[] = []): AppPerson => ({
    ...person('talhah-ibn-ubaydullah'), slug, name: nasab[0], nasab,
    parents: parents.map((p) => ({ slug: `${slug}-${p.sex}`, name: p.name, inApp: false, sex: p.sex, text: '', refs: [], by: [] })),
  } as AppPerson);

  it('reads a man named by his mother through the father his entry names', () => {
    const safwan = man('safwan', ['صفوان', 'بيضاء'], [{ name: 'دعد بنت جحدم', sex: 'FEMALE' }, { name: 'وهب بن ربيعة بن هلال', sex: 'MALE' }]);
    expect(lineOf(safwan, [safwan]).map((n) => n.bare)).toEqual(['صفوان', 'وهب', 'ربيعه', 'هلال']);
  });

  it('meets two lines at a father one of them gives with his laqab («مالك الأغر» is «مالك»)', () => {
    const thabit = man('thabit', ['ثابت', 'قيس', 'زهير', 'مالك', 'امرئ القيس', 'مالك الأغر', 'ثعلبة']);
    const saad = man('saad', ['سعد', 'الربيع', 'أبي زهير', 'مالك', 'امرئ القيس', 'مالك', 'ثعلبة']);
    const all = [thabit, saad];
    const at = meetingOf(lineOf(thabit, all), lineOf(saad, all))!;
    expect(bareName(lineOf(thabit, all)[at.a].name)).toBe('مالك');
    expect(at.a).toBe(3);
  });
});
