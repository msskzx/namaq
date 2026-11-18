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
    expect(people.map((person) => person.slug)).toEqual(['az-zubayr-ibn-al-awwam']);
    const [zubayr] = people;
    expect(zubayr.entry).toMatchObject({ volume: 4, from: '41' });
    for (const fact of [zubayr.fullName!, ...zubayr.kunya, ...zubayr.titles, ...zubayr.virtues, ...zubayr.parents, ...zubayr.battles]) {
      expect(fact.refs.length).toBeGreaterThan(0);
    }
  });

  it('names who says each value, as the person the narrator is', async () => {
    const [zubayr] = appPeople(await loadCatalog());
    expect(zubayr.islamAge.map((fact) => [fact.value, fact.by])).toEqual([[16, []], [8, ['عروة']]]);
    expect(zubayr.companionOf[0].by).toEqual(['الزبير بن العوام']);
  });

  it('reads the fathers from the full name as printed', () => {
    expect(nasabOf('الزُّبَيْرُ بنُ العَوَّامِ بنِ خُوَيْلِدِ بنِ عَبْدِ العُزَّى، القُرَشِيُّ')).toEqual(['الزُّبَيْرُ', 'العَوَّامِ', 'خُوَيْلِدِ', 'عَبْدِ العُزَّى']);
  });
});
