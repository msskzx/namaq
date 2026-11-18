import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { loadCatalog } from '../catalog/loadCatalog';
import { appPeople, nasabOf } from './appPeople';

describe('the phone app people', () => {
  it('are the converted entries as they are now (npm run model:app-people writes them again)', async () => {
    const people = appPeople(await loadCatalog());
    expect(JSON.parse(readFileSync('shared/data/tarajim/people.json', 'utf8'))).toEqual(JSON.parse(JSON.stringify(people)));
  });

  it('holds only people whose entry is converted, each value with its page', async () => {
    const people = appPeople(await loadCatalog());
    const zubayr = people.find((person) => person.slug === 'az-zubayr-ibn-al-awwam')!;
    // Children of Safiyyah's entry (al-Sa'ib) are named there but have no entry of their own, so they are not in the app.
    expect(people.some((person) => person.slug === 'as-saib-ibn-al-awwam')).toBe(false);
    expect(zubayr.entry).toMatchObject({ volume: 4, from: '41' });
    for (const fact of [zubayr.fullName!, ...zubayr.kunya, ...zubayr.titles, ...zubayr.virtues, ...zubayr.parents, ...zubayr.battles]) {
      expect(fact.refs.length).toBeGreaterThan(0);
    }
  });

  it('names who says each value, as the person the narrator is', async () => {
    const zubayr = appPeople(await loadCatalog()).find((person) => person.slug === 'az-zubayr-ibn-al-awwam')!;
    expect(zubayr.islamAge.map((fact) => [fact.value, fact.by])).toEqual([[16, []], [8, ['عروة']]]);
    expect(zubayr.companionOf[0].by).toEqual(['الزبير بن العوام']);
  });

  it('joins a tie stated in two entries into one, with both entries\' pages', async () => {
    const people = appPeople(await loadCatalog());
    const zubayr = people.find((person) => person.slug === 'az-zubayr-ibn-al-awwam')!;
    const safiyyah = people.find((person) => person.slug === 'safiyyah-bint-abd-al-muttalib')!;
    expect(zubayr.parents.find((link) => link.slug === safiyyah.slug)?.refs.map((ref) => ref.volume)).toEqual([4, 5, 5]);
    expect(safiyyah.children.map((link) => link.slug)).toContain('az-zubayr-ibn-al-awwam');
    expect(zubayr.parents.find((link) => link.slug === safiyyah.slug)?.inApp).toBe(true);
  });

  it('reads the fathers from the full name as printed', () => {
    expect(nasabOf('الزُّبَيْرُ بنُ العَوَّامِ بنِ خُوَيْلِدِ بنِ عَبْدِ العُزَّى، القُرَشِيُّ')).toEqual(['الزُّبَيْرُ', 'العَوَّامِ', 'خُوَيْلِدِ', 'عَبْدِ العُزَّى']);
    expect(nasabOf('محمد بن عبد الله بن عبد المطلب واسم عبد المطلب شيبة, ابن هاشم واسمه عمرو, ابن عبد مناف واسمه المغيرة، ابن قصي'))
      .toEqual(['محمد', 'عبد الله', 'عبد المطلب', 'هاشم', 'عبد مناف', 'قصي']);
  });
});
