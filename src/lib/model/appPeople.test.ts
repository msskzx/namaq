import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { loadCatalog } from '../catalog/loadCatalog';
import { appPeople, nasabOf, nominativeName, shortName } from './appPeople';

describe('the phone app people', () => {
  it('are the converted entries as they are now (npm run model:app-people writes them again)', async () => {
    const people = appPeople(await loadCatalog());
    expect(JSON.parse(readFileSync('shared/data/tarajim/people.json', 'utf8'))).toEqual(JSON.parse(JSON.stringify(people)));
  }, 30_000);

  it('holds only people whose entry is converted, each value with its page', async () => {
    const people = appPeople(await loadCatalog());
    const zubayr = people.find((person) => person.slug === 'az-zubayr-ibn-al-awwam')!;
    // Children of Safiyyah's entry (al-Sa'ib) are named there but have no entry of their own, so they are not in the app.
    expect(people.some((person) => person.slug === 'as-saib-ibn-al-awwam')).toBe(false);
    expect(zubayr.entry).toMatchObject({ volume: 4, from: '41' });
    for (const fact of [zubayr.fullName!, ...zubayr.kunya, ...zubayr.titles, ...zubayr.virtues, ...zubayr.parents, ...zubayr.battles]) {
      expect(fact.refs.length).toBeGreaterThan(0);
    }
  }, 30_000);

  it('names who says each value, as the person the narrator is', async () => {
    const zubayr = appPeople(await loadCatalog()).find((person) => person.slug === 'az-zubayr-ibn-al-awwam')!;
    expect(zubayr.islamAge.map((fact) => [fact.value, fact.by])).toEqual([[16, []], [8, ['عروة']]]);
    expect(zubayr.companionOf[0].by).toEqual(['الزبير بن العوام']);
    // A sayer with a converted entry and no catalog file is named by that entry, not by the narrator's word («عن أبيه»).
    const ibnUmar = appPeople(await loadCatalog()).find((person) => person.slug === 'abdullah-ibn-umar')!;
    expect(ibnUmar.virtues.find((fact) => fact.text.includes('نِعْمَ الرَّجُلُ'))?.by).toEqual([ibnUmar.name]);
  }, 30_000);

  it('joins a tie stated in two entries into one, with both entries\' pages', async () => {
    const people = appPeople(await loadCatalog());
    const zubayr = people.find((person) => person.slug === 'az-zubayr-ibn-al-awwam')!;
    const safiyyah = people.find((person) => person.slug === 'safiyyah-bint-abd-al-muttalib')!;
    expect(zubayr.parents.find((link) => link.slug === safiyyah.slug)?.refs.map((ref) => ref.volume)).toEqual([4, 5, 5]);
    expect(safiyyah.children.map((link) => link.slug)).toContain('az-zubayr-ibn-al-awwam');
    expect(zubayr.parents.find((link) => link.slug === safiyyah.slug)?.inApp).toBe(true);
  }, 30_000);

  it('reads the fathers from the full name as printed', () => {
    expect(nasabOf('الزُّبَيْرُ بنُ العَوَّامِ بنِ خُوَيْلِدِ بنِ عَبْدِ العُزَّى، القُرَشِيُّ')).toEqual(['الزُّبَيْرُ', 'العَوَّامِ', 'خُوَيْلِدِ', 'عَبْدِ العُزَّى']);
    expect(nasabOf('محمد بن عبد الله بن عبد المطلب واسم عبد المطلب شيبة, ابن هاشم واسمه عمرو, ابن عبد مناف واسمه المغيرة، ابن قصي'))
      .toEqual(['محمد', 'عبد الله', 'عبد المطلب', 'هاشم', 'عبد مناف', 'قصي']);
    // A person with no catalog entry is named by the name and the father.
    expect(shortName(nasabOf('عبد الله بن أبي طلحة زيد بن سهل'))).toBe('عبد الله بن أبي طلحة زيد');
    expect(shortName(nasabOf('عبد الرحمن بن الحارث بن هشام'))).toBe('عبد الرحمن بن الحارث');
    expect(shortName(nasabOf('صفية بنت شيبة بن عثمان'), 'FEMALE')).toBe('صفية بنت شيبة');
    expect(nasabOf('أبو ثعلبة الخشني')).toEqual(['أبو ثعلبة']);
    // An aside between dashes is no name.
    expect(nasabOf('عبد الله بن سالم - وسالم هو الذي يقال له الحبلى، لعظم بطنه - بن غنم')).toEqual(['عبد الله', 'سالم', 'غنم']);
    // A kunya with a forefather before the name: the line starts at the name's own father.
    expect(nasabOf('أبو عبيدة بن الجراح عامر بن عبد الله بن الجراح بن هلال')).toEqual(['أبو عبيدة', 'عبد الله', 'الجراح', 'هلال']);
    expect(nasabOf('أبو سفيان بن حرب بن أمية')).toEqual(['أبو سفيان', 'حرب', 'أمية']);
    expect(nasabOf('أبو حذيفة بن عبد الله بن عتبة')).toEqual(['أبو حذيفة', 'عبد الله', 'عتبة']);
    // An aside whose names have more than one word, closed by «،» or by «بن».
    expect(nasabOf('أبو هريرة واسمه عبد الرحمن بن صخر')).toEqual(['أبو هريرة', 'صخر']);
    // A kunya after the father's name is no father («سليمان بن صرد أبو مطرف»); «بن أبي بسر» is.
    expect(nasabOf('سُلَيْمَانُ بنُ صُرَدٍ أَبُو مُطَرِّفٍ الخُزَاعِيُّ الكُوْفِيُّ')).toEqual(['سُلَيْمَانُ', 'صُرَدٍ']);
    expect(nasabOf('عَبْدُ اللهِ بنُ بُسْرِ بنِ أَبِي بُسْرٍ أَبُو صَفْوَانَ المَازِنِيُّ')).toEqual(['عَبْدُ اللهِ', 'بُسْرِ', 'أَبِي بُسْرٍ']);
    expect(nasabOf('علي بن أبي طالب واسم أبي طالب عبد مناف، ابن عبد المطلب')).toEqual(['علي', 'أبي طالب', 'عبد المطلب']);
    expect(shortName(nasabOf('عَبْدُ اللهِ بنُ أَبِي أَوْفَى عَلْقَمَةَ بنِ خَالِدِ'))).toBe('عَبْدُ اللهِ بن أَبِي أَوْفَى عَلْقَمَةَ');
    expect(shortName(nasabOf('المِقْدَامُ بنُ مَعْدِ يْكَرِبَ بنِ عَمْرِو'))).toBe('المِقْدَامُ بن مَعْدِ يْكَرِبَ');
    expect(shortName(nasabOf('العِرْبَاضُ بنُ سَارِيَةَ السُّلَمِيُّ'))).toBe('العِرْبَاضُ بن سَارِيَةَ');
  });

  it('names another reading of a name in the nominative when the book prints it in the accusative', () => {
    // Ibn Umm Maktum: «وأما أهل العراق: فسموه عَمْراً» (Siyar 1/360) is «عمرو», never «عمر».
    expect(nominativeName('عَمْراً')).toBe('عَمْرو');
    expect(nominativeName('عَبْدُ اللهِ بنُ قَيْسٍ')).toBe('عَبْدُ اللهِ بنُ قَيْسٍ');
  });
});
