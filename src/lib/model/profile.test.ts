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
    expect(name.text).toContain('عَبْدِ العُزَّى بنِ قُصَيِّ');
    expect(name.parts[1].startsWith('ابْنِ')).toBe(true);
    expect(name.origins).toEqual([{ author: 'al-dhahabi' }]);
    expect(name.spanIds).toEqual(['sp_zb1', 'sp_zb2']);
    expect(name.statementIds).toEqual(['st_name']);
  });

  it('links the father by the agent his nasab identifies', () => {
    expect(of('CHILD_OF')[0].object).toBe('al-awwam-ibn-khuwaylid');
  });

  it('keeps both ages, each with its own speaker', () => {
    const ages = of('islam.age');
    expect(ages.map((a) => a.parsed).sort()).toEqual([16, 8]);
    expect(ages.find((a) => a.parsed === 16)?.origins).toEqual([{ author: 'al-dhahabi' }]);
    expect(ages.find((a) => a.parsed === 8)?.origins).toEqual([{ mention: 'عُرْوَةَ' }]);
  });

  it('keeps the exact mention text when the related person is not identified', () => {
    const folders = loadModel('.');
    const file = folders[0].units[0];
    file.identifications = file.identifications.filter((i) => i.id !== 'i_awwam');
    const child = profilesFromModel(folders, '.')
      .get('az-zubayr-ibn-al-awwam')
      ?.find((e) => e.predicate === 'CHILD_OF');
    expect(child?.object).toBeUndefined();
    expect(child?.objectMention).toBe('العَوَّامِ');
  });

  it('shows every competing identification of one mention, and drops a rejected one', () => {
    const folders = loadModel('.');
    const file = folders[0].units[0];
    const original = file.identifications.find((i) => i.id === 'i_zb')!;
    file.identifications.push(
      { ...original, id: 'i_other', agent: 'another-zubayr', status: 'DISPUTED' },
      { ...original, id: 'i_bad', agent: 'rejected-zubayr', status: 'REJECTED' },
    );
    const profiles = profilesFromModel(folders, '.');
    expect(profiles.get('another-zubayr')?.[0].identification).toBe('DISPUTED');
    expect(profiles.has('rejected-zubayr')).toBe(false);
  });

  it('skips a rejected assertion, shows a LEGACY one, and keeps every origin of a multi-statement one', () => {
    const folders = loadModel('.');
    const file = folders[0].units[0];
    file.assertions.find((a) => a.id === 'a_age8')!.status = 'REJECTED';
    file.assertions.find((a) => a.id === 'a_age16')!.restsOn = ['st_age16', 'st_age8'];
    file.assertions.push({
      id: 'a_legacy',
      subject: 'm_zb',
      predicate: 'died.year',
      value: { spans: ['sp_zb1'] },
      restsOn: [],
      status: 'LEGACY',
    });
    const entries = profilesFromModel(folders, '.').get('az-zubayr-ibn-al-awwam')!;
    expect(entries.find((e) => e.assertionId === 'a_age8')).toBeUndefined();
    expect(entries.find((e) => e.assertionId === 'a_age16')?.origins).toHaveLength(2);
    expect(entries.find((e) => e.assertionId === 'a_legacy')?.origins).toEqual([]);
  });

  it('fails loudly on an unknown span instead of showing an empty value', () => {
    const folders = loadModel('.');
    folders[0].units[0].assertions[0].value = { spans: ['nope'] };
    expect(() => profilesFromModel(folders, '.')).toThrow(/unknown span nope/);
  });

  it('reads the sex from the lineage word in the heading, shown with that span', () => {
    const [sex] = of('sex');
    expect(sex.classified).toBe('MALE');
    expect(sex.parts[0]).toContain('بنُ');
  });

  it("keeps the author's and Urwa's descriptions as two entries with their own speakers", () => {
    const appearance = of('appearance');
    expect(appearance).toHaveLength(2);
    expect(appearance.map((a) => a.origins[0])).toContainEqual({ author: 'al-dhahabi' });
    expect(appearance.map((a) => a.origins[0])).toContainEqual({ mention: 'عُرْوَةَ' });
  });

  it('gives the death year as a number with Bukhari as the one it is quoted from', () => {
    const [death] = of('died.year');
    expect(death.parsed).toBe(36);
    expect(death.origins).toEqual([{ mention: 'البُخَارِيُّ' }]);
  });
});
