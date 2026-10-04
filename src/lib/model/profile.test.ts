import { describe, expect, it } from 'vitest';
import { loadModel } from './load';
import { profilesFromModel } from './profile';

describe('profilesFromModel on the al-Zubayr entry', () => {
  const entries = profilesFromModel(loadModel('.'), '.').get('az-zubayr-ibn-al-awwam') ?? [];
  const of = (predicate: string) => entries.filter((e) => e.predicate === predicate);

  it('renders the full name from its two spans, as the book prints them', () => {
    const [name] = of('name.full');
    expect(name.parts).toHaveLength(2);
    expect(name.parts[0]).toBe(
      'الزُّبَيْرُ بنُ العَوَّامِ بنِ خُوَيْلِدِ بنِ أَسَدِ بنِ عَبْدِ العُزَّى',
    );
    expect(name.origin).toEqual({ author: 'al-dhahabi' });
  });

  it('links the father by the agent his nasab identifies', () => {
    expect(of('CHILD_OF')[0].object).toBe('al-awwam-ibn-khuwaylid');
  });

  it('keeps both ages, each with its own speaker', () => {
    const ages = of('islam.age');
    expect(ages.map((a) => a.parsed).sort()).toEqual([16, 8]);
    expect(ages.find((a) => a.parsed === 16)?.origin).toEqual({ author: 'al-dhahabi' });
    expect(ages.find((a) => a.parsed === 8)?.origin).toEqual({ mention: 'عُرْوَةَ' });
  });
});
