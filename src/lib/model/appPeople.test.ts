import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { loadCatalog } from '../catalog/loadCatalog';
import { appPeople, catalogAyat, nasabOf, nominativeName, shortName } from './appPeople';
import { batchClaims } from '../catalog/appBattles';
import { ayatOf } from '@shared/stories/story';

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

  // Data plan step 3 (owner, 2026-11-24): a person's tie to an ayah is in one place. Every tie the catalog holds with a
  // batch's quote is on his page, and each quote shown sits over the page that quote is on, not another quote's.
  it("gives a person every ayah the catalog ties him to, each quote with its own page", async () => {
    const catalog = await loadCatalog();
    const claims = batchClaims();
    const people = new Map(appPeople(catalog, undefined, undefined, claims).map((person) => [person.slug, person]));
    const cited = catalog.people.flatMap((person) => (person.ayat ?? []).filter((link) => link.claims !== 'legacy-unreviewed').map((link) => ({ person, link })));
    expect(cited.length).toBeGreaterThan(0);
    for (const { person, link } of cited) {
      const key = `${link.surah}:${link.ayah}`;
      expect(people.get(person.slug)?.ayat.some((fact) => fact.value === key && fact.refs.length), `${person.slug} ${key}`).toBe(true);
      const own = catalogAyat({ ...person, ayat: [link] }, claims);
      expect(own.length, `${person.slug} ${key}`).toBeGreaterThan(0);
      const cites = (link.claims as readonly string[]).flatMap((claim) => claims.get(claim)?.citations ?? []);
      for (const fact of own) {
        const pages = cites.filter((cite) => cite.excerptArabic && arabicCommas(cite.excerptArabic) === fact.text).map((cite) => cite.pageReference);
        expect(fact.refs.map((ref) => ref.page).every((page) => pages.includes(page)), `${person.slug} ${key}: ${fact.text}`).toBe(true);
      }
      // Each of the Siyar's quotes for the tie reaches the page, or the entry's own quote of the same words does,
      // and a tie the catalog says the ayah was revealed about is said so there.
      const shown = people.get(person.slug)!.ayat.filter((fact) => fact.value === key);
      for (const cite of cites.filter((each) => each.excerptArabic && each.sourceSlug === 'siyar-alam-al-nubala-risalah')) {
        expect(shown.some((fact) => arabicCommas(cite.excerptArabic!).includes(fact.text)), `${person.slug} ${key}: ${cite.excerptArabic}`).toBe(true);
      }
      if (link.kind === 'REVEALED_ABOUT') expect(shown.some((fact) => fact.kind === 'REVEALED_ABOUT'), `${person.slug} ${key}`).toBe(true);
    }
  }, 30_000);

  // The other way: a tie only the converted entry states, with no catalog claim yet. These wait for their batches
  // (/mnt/project-files/data-plan/step3/revealed-about-table.md, part أ); the list only shrinks.
  it('keeps no tie to an ayah outside the catalog but those waiting for their batch', async () => {
    const catalog = await loadCatalog();
    // A tie is in the catalog on the person's record, or on a story that names him as the one its ayat were revealed about.
    const inCatalog = new Set([
      ...catalog.people.flatMap((person) => (person.ayat ?? []).map((link) => `${person.slug} ${link.surah}:${link.ayah}`)),
      ...catalog.events.flatMap((event) => (event.ayat ?? []).flatMap((ayat) => (ayat.about ? ayatOf(ayat.from, ayat.to).map((key) => `${ayat.about} ${key}`) : []))),
    ]);
    const outside = appPeople(catalog).flatMap((person) => person.ayat.map((fact) => `${person.slug} ${fact.value}`)).filter((tie) => !inCatalog.has(tie));
    expect(outside.filter((tie) => !WAITING_FOR_BATCH.includes(tie))).toEqual([]);
    expect(WAITING_FOR_BATCH.filter((tie) => !outside.includes(tie)), 'in the catalog now: take it off the list').toEqual([]);
  }, 30_000);
});

const arabicCommas = (text: string) => text.replace(/,/g, '،');

const WAITING_FOR_BATCH = [
  'ibn-umm-maktum 4:95', 'al-irbad-ibn-sariyah 9:92', 'umm-kulthum-bint-uqbah 60:10',
  'tamim-al-dari 5:106', 'zaid-ibn-arqam 63:1', 'zaid-ibn-harithah 33:37', 'abdullah-ibn-salam 46:10',
  'kaab-ibn-ujrah 2:196',
];
