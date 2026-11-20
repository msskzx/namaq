// The phone app's people (owner, 2026-11-18): the app reads only the new model, so a person is in the app once the
// entry is converted under data/works. Each value keeps the book's words, its pages and who says it.
// scripts/model/buildAppPeople.ts writes shared/data/tarajim/people.json; shared/tarajim.ts has the shape.
import { OTHER_WORKS, TITLE_SPEAKER_AUTHOR, type AppPerson, type PageRef, type PersonFact, type PersonLink, type PersonTitle } from '@shared/tarajim';
import { bareName } from '@shared/tarajimLine';
import type { Catalog } from '../catalog/types';
import { loadModel } from './load';
import { agentOfMention, profilesFromModel, type ProfileEntry } from './profile';
import { renderSpanRecord } from './render';
import type { WorkFolder } from './types';

const IBN = /^(?:ابن|بن|بنت|ابنة)$/u;
// A nisba after the last name («الهاشمية», «القرشي») is not a father.
const KUNYA = /^(?:أبو|ابو|أم|ام)$/u;
/** The first word of a name of two words: «عبد الله», «أبي طالب». */
const COMPOUND = /^(?:عبد|أبي|ابي|أبو|ابو|أم|ام|ذي|ذو)$/u;
const NISBA = /^ال\S+(?:ي|ية)$/u;
const strip = (text: string) => text.replace(/[ً-ْٰـ]/g, '');
// Shamela types Latin commas inside Arabic text; the app shows the Arabic mark.
const arabicCommas = (text: string) => text.replace(/,/g, '،');
// A one-word sayer printed in the accusative after «سمعت» («سمعت أنسا») is named in the nominative: «أنس».
// Names that end in a long alif or a hamza («زكريا», «عطاء») are left as printed.
// The book's author, marked so he is named only beside another sayer: alone, an empty line already reads as his.
const AUTHOR = '\u0000author';
/**
 * A one-word name printed in the accusative with tanwin («سموه عَمْراً») in the nominative: «عَمْرو». Only «عمرو» takes
 * tanwin of the two, since «عُمَر» is diptote, so a tanwin «عمر» is always «عمرو».
 */
export const nominativeName = (text: string) => {
  const m = /^([^\s]+?)(?:ًا|اً)$/u.exec(text.trim());
  if (!m) return text;
  return strip(m[1]) === 'عمر' ? `${m[1]}و` : m[1];
};
const sayerName = (text: string) => (/^[^\s]{2,}[^\sيءى]ا$/u.test(text) ? text.slice(0, -1) : text);

/**
 * The fathers in a full name as printed, from the person up: «الزبير بن العوام بن خويلد» → الزبير، العوام، خويلد.
 * The book's asides are not fathers: «واسمه عمرو» after a name, «واسم عبد المطلب شيبة», and a nisba («القرشي»).
 */
/** A person with no catalog entry is named by the name and the father, as the book does: «عبد الله بن أبي طلحة». */
/**
 * A battle the book gives both ways (Sa'd ibn Ubadah at Badr: Urwah says he was there, Ibn Sa'd that he was not)
 * stays in both lists, each marked «على خلاف», with its own sayers.
 */
function attendance(battles: PersonLink[], absentFrom: PersonLink[]) {
  const both = new Set(battles.filter((b) => absentFrom.some((a) => a.slug === b.slug)).map((b) => b.slug));
  const mark = (link: PersonLink): PersonLink => (both.has(link.slug) ? { ...link, disputed: true } : link);
  return { battles: battles.map(mark), absentFrom: absentFrom.map(mark) };
}

/** The same page of the same book. */
const sameRef = (a: PageRef, b: PageRef) => a.volume === b.volume && a.page === b.page && a.work === b.work;

export function shortName(nasab: string[], sex?: string) {
  return nasab.slice(0, 2).join(sex === 'FEMALE' ? ' بنت ' : ' بن ');
}

export function nasabOf(fullName: string) {
  // «،» stays a word: the book closes an aside with it. An aside between dashes («بن سالم - وسالم هو الذي يقال له
  // الحبلى - بن غنم») is no name.
  const words = fullName.replace(/\s[-–]\s[^-–]*\s[-–]\s/gu, ' ').replace(/[.]/gu, ' ').replace(/[،,]/gu, ' ، ').trim().split(/\s+/u).filter(Boolean);
  const names: string[][] = [[]];
  for (let i = 0; i < words.length; i += 1) {
    const bare = strip(words[i]);
    if (bare === '،') continue;
    // An aside runs to the next «،» or «بن», however many words the names in it have.
    if (bare === 'واسمه' || bare === 'واسمها' || bare === 'واسم') {
      while (i + 1 < words.length && words[i + 1] !== '،' && !IBN.test(strip(words[i + 1]))) i += 1;
      continue;
    }
    // A kunya after a father's name is not a father either: «سليمان بن صرد أبو مطرف الخزاعي».
    // Only the nominative «أبو» marks it; inside a nasab a father is «بن أبي …».
    if (/^[أا]بو$/u.test(bare) && names.length > 1 && names[names.length - 1].length > 0) {
      while (i + 1 < words.length && words[i + 1] !== '،' && !IBN.test(strip(words[i + 1]))) i += 1;
      continue;
    }
    if (IBN.test(bare)) names.push([]);
    else if (!(names[names.length - 1].length > 0 && NISBA.test(bare))) names[names.length - 1].push(words[i]);
  }
  // A heading that opens with a kunya and a forefather before the name («أبو عبيدة بن الجراح عامر بن عبد الله»): «بن
  // الجراح» there is the shorthand, not the father, so the line goes on from the name's own fathers.
  if (names.length > 2 && KUNYA.test(strip(names[0][0] ?? '')) && names[1].length > 1 && !COMPOUND.test(strip(names[1][0]))) names.splice(1, 1);
  // A name with no «بن» at all (al-Abbas's entry is headed «العباس عم رسول الله») names no fathers: the name alone.
  // A kunya stays whole («أبو ثعلبة الخشني» is «أبو ثعلبة»).
  if (names.length === 1) return words.length ? [KUNYA.test(strip(words[0])) && words[1] ? `${words[0]} ${words[1]}` : words[0]] : [];
  return names.map((name) => name.join(' ')).filter(Boolean);
}

export function appPeople(catalog: Catalog, folders: WorkFolder[] = loadModel('.'), root = '.'): AppPerson[] {
  const profiles = profilesFromModel(folders, root);
  const spans = new Map(folders.flatMap((folder) => folder.units.flatMap((file) => file.spans.map((span) => [span.id + '@' + file.unit.id, span] as const))));
  const units = new Map(folders.flatMap((folder) => folder.units.map((file) => [file.unit.id, file] as const)));
  const folderOf = new Map(folders.flatMap((folder) => folder.units.map((file) => [file.unit.id, folder] as const)));
  // The sentence a tie rests on, as printed («غاب عن وقعة بدر في تجارة له بالشام…»).
  const sentence = (entry: ProfileEntry) => {
    const from = units.get(entry.unit)!;
    // Each statement is its own quote, set apart as merged ties are («…» «…»): a claim and the word on it do not run together.
    const text = from.statements.filter((s) => entry.statementIds.includes(s.id))
      .map((s) => s.spans.map((id) => renderSpanRecord(folderOf.get(entry.unit)!, from.spans.find((span) => span.id === id)!, root)).join(' '))
      .join('» «');
    return arabicCommas(text);
  };
  const people = new Map(catalog.people.map((person) => [person.slug, person]));
  const battles = new Map(catalog.battles.map((battle) => [battle.slug, battle.name]));
  const events = new Map(catalog.events.map((event) => [event.slug, event.name]));
  const titleNames = new Map(catalog.people.flatMap((person) => person.titles.map((title) => [title.title, title.name] as const)));
  // How many people the catalog gives each title: «الفاروق» is one man's, «العشرة المبشرون بالجنة» a group's.
  const holders = new Map<string, number>();
  for (const person of catalog.people) for (const key of new Set(person.titles.map((title) => title.title))) holders.set(key, (holders.get(key) ?? 0) + 1);
  // A person is in the app once an entry of their own is converted: the unit whose full name they are.
  const ownUnit = new Map([...profiles.entries()].flatMap(([slug, entries]) => {
    const name = entries.find((entry) => entry.predicate === 'name.full');
    return name ? [[slug, name.unit] as const] : [];
  }));
  const inApp = new Set(ownUnit.keys());
  // A linked person's sex, for «أبوه» or «أمه»: the converted entry's own, else the catalog's.
  const sexOf = (other: string): { sex?: 'MALE' | 'FEMALE' } => {
    const stated = profiles.get(other)?.find((entry) => entry.predicate === 'sex')?.classified ?? people.get(other)?.fields.sex.value;
    if (stated === 'MALE' || stated === 'FEMALE') return { sex: stated };
    // Else the name says it: «نتيلة بنت جناب», «أم رومان».
    const name = strip(people.get(other)?.name ?? mentioned.get(other) ?? '');
    return /(^|\s)بنت\s|^أم\s/u.test(name) ? { sex: 'FEMALE' } : {};
  };
  // A name for someone the catalog does not hold yet: how an entry names them.
  const mentioned = new Map<string, string>();
  for (const file of units.values()) for (const identification of file.identifications) {
    const exact = file.mentions.find((m) => m.id === identification.mention)?.exact;
    if (identification.agent && exact && !mentioned.has(identification.agent)) mentioned.set(identification.agent, exact);
  }
  // Links others' entries state toward this person: their CHILD_OF is this person's child, and so on.
  const reverse = (slug: string, predicate: ProfileEntry['predicate']) => [...profiles.entries()]
    .flatMap(([other, entries]) => entries.filter((entry) => entry.predicate === predicate && entry.object === slug).map((entry) => ({ other, entry })));

  // The Prophet's ﷺ wives are those his own entry gives as his (the nine he left, Zaynab bint Khuzaymah, Khadijah; Zad
  // al-Ma'ad's eleven). Another woman a book names is not shown as his wife on either page: al-Dhahabi brings them «للتعجب
  // لا للتقرير» (sira 2/495), and Ibn al-Qayyim says the scholars of the sira do not know them (Zad 1/110). Owner
  // 2026-11-19: what the book doubts is not taught.
  const CLOSED_SPOUSES = ['prophet-muhammad'];
  const ownSpouses = new Map(CLOSED_SPOUSES.map((slug) => [slug, new Set((profiles.get(slug) ?? [])
    .filter((entry) => entry.predicate === 'MARRIED' && entry.status !== 'DISPUTED' && entry.object).map((entry) => entry.object!))]));
  const shownSpouse = (slug: string) => (link: PersonLink) => {
    const closed = ownSpouses.get(slug) ?? ownSpouses.get(link.slug);
    const other = ownSpouses.has(slug) ? link.slug : slug;
    return !closed || closed.has(other);
  };

  // A person the catalog does not hold is named by the name and the father; where that is another person's name too
  // («عبد الله بن الحارث»: Ibn Jaz' and the Hashimi), the grandfather is added («عبد الله بن الحارث بن جزء»).
  const nasabs = new Map([...ownUnit.keys()].map((slug) => {
    const text = profiles.get(slug)!.find((entry) => entry.predicate === 'name.full')?.text;
    return [slug, text ? nasabOf(text) : []] as const;
  }));
  const sexes = new Map([...ownUnit.keys()].map((slug) => [slug, profiles.get(slug)!.find((entry) => entry.predicate === 'sex')?.classified] as const));
  const short = (slug: string, length: number) => strip(nasabs.get(slug)!.slice(0, length).join(sexes.get(slug) === 'FEMALE' ? ' بنت ' : ' بن ') || slug);
  const firstNames = new Map([...ownUnit.keys()].map((slug) => [slug, people.has(slug) ? strip(people.get(slug)!.name) : short(slug, 2)]));
  const appName = (slug: string) => {
    if (people.has(slug)) return firstNames.get(slug)!;
    const taken = [...firstNames.entries()].some(([other, name]) => other !== slug && bareName(name) === bareName(firstNames.get(slug)!));
    return taken ? short(slug, 3) : firstNames.get(slug)!;
  };

  const all = [...ownUnit.entries()].map(([slug, unitId]) => {
    const entries = profiles.get(slug)!;
    const file = units.get(unitId)!;
    const refsOf = (entry: ProfileEntry): PageRef[] => {
      const from = units.get(entry.unit)!;
      const ids = entry.spanIds.length ? entry.spanIds : from.statements.filter((s) => entry.statementIds.includes(s.id)).flatMap((s) => s.spans);
      // A page of another book than the Siyar names its book (Zad al-Ma'ad 1/101), so the label does not read it as the Sira.
      const work = folderOf.get(entry.unit)!.work.slug;
      const named = work in OTHER_WORKS ? { work } : {};
      const pages = ids.map((id) => spans.get(`${id}@${entry.unit}`)).filter((span) => span !== undefined).map((span) => ({ volume: span.volume, page: span.page, ...named }));
      return pages.filter((ref, index) => pages.findIndex((other) => sameRef(other, ref)) === index);
    };
    const fact = (entry: ProfileEntry): PersonFact => ({
      id: `${entry.unit}#${entry.assertionId}`,
      text: arabicCommas(entry.text),
      refs: refsOf(entry),
      // Who says it: the person the narrating mention is identified as («أبي» in Urwa's words is al-Zubayr), else its text.
      by: ((sayers) => (sayers.some((one) => one !== AUTHOR) ? [...new Set(sayers.map((one) => (one === AUTHOR ? TITLE_SPEAKER_AUTHOR : one)))] : []))(entry.statementIds.flatMap((id): string[] => {
        const from = units.get(entry.unit)!;
        const report = from.reports.find((r) => r.id === from.statements.find((s) => s.id === id)?.report);
        // Another book's author says it himself: he is named («ابن القيم»), since an empty line reads as al-Dhahabi.
        const other = OTHER_WORKS[folderOf.get(entry.unit)!.work.slug];
        if (report && 'workAuthor' in report.origin && other) return [other.author];
        // An unnamed view («وقيل», «غيره») names no one: the fact says so itself (`anonymous`).
        if (!report || report.voice === 'REPORTED_ANONYMOUS') return [];
        // The Siyar's own word beside a narrator's («إنما أوردته للتعجب») is al-Dhahabi's, and is named once another sayer is.
        if (!('mention' in report.origin)) return report.voice === 'AUTHOR' ? [AUTHOR] : [];
        const mention = report.origin.mention;
        const agent = agentOfMention(from, mention);
        const text = from.mentions.find((m) => m.id === mention)?.exact ?? '';
        // A sayer with a converted entry but no catalog file («أبي أمامة», «أبيه» in Salim's words) reads by that entry's name.
        if (agent && !people.has(agent) && ownUnit.has(agent)) return [appName(agent)];
        return [agent && people.has(agent) ? people.get(agent)!.name : sayerName(strip(text))];
      })),
      ...(entry.status === 'LEGACY' && { legacy: true as const }),
      ...(entry.status === 'DISPUTED' && { disputed: true as const }),
      ...(entry.statementIds.length > 0 && entry.statementIds.every((id) => {
        const from = units.get(entry.unit)!;
        return from.reports.find((r) => r.id === from.statements.find((st) => st.id === id)?.report)?.voice === 'REPORTED_ANONYMOUS';
      }) && { anonymous: true as const }),
      ...(entry.parsed !== undefined && { value: entry.parsed }),
      ...(entry.classified !== undefined && { value: entry.classified }),
    });
    const of = (predicate: ProfileEntry['predicate']) => entries.filter((entry) => entry.predicate === predicate);
    const facts = (predicate: ProfileEntry['predicate']) => of(predicate).map(fact);
    // A name read from the text may be in the genitive or accusative («أبي العاص» after «بن»): it reads as a name.
    const nominative = (text: string) => text.replace(/^(?:أبي|أبا|ابي|ابا)(?=\s)/u, 'أبو').replace(/^(?:ذي|ذا)(?=\s)/u, 'ذو');
    const nameOf = (other: string, mention?: string) => strip(people.get(other)?.name ?? battles.get(other) ?? events.get(other) ?? nominative(strip(mention ?? mentioned.get(other) ?? other)));
    // A tie stated in more than one place (his entry and his mother's) is one tie with every page that states it.
    const merge = (list: PersonLink[]) => {
      const merged = new Map<string, PersonLink>();
      for (const link of list) {
        const seen = merged.get(link.slug);
        // A tie one book states and another doubts («على قولين») stays doubted, whichever book is read first.
        // Each book's own words and sayer stay: an empty `by` is the Siyar's author, so he is named once another sayer joins.
        const sayers = (one: PersonLink) => (one.by.length ? one.by : [TITLE_SPEAKER_AUTHOR]);
        const by = seen && (seen.by.length || link.by.length) ? [...new Set([...sayers(seen), ...sayers(link)])] : seen?.by ?? [];
        merged.set(link.slug, seen ? {
          ...seen,
          text: link.text && !seen.text.includes(link.text) ? `${seen.text}» «${link.text}` : seen.text,
          refs: [...seen.refs, ...link.refs.filter((ref) => !seen.refs.some((r) => sameRef(r, ref)))],
          by,
          ...((seen.disputed || link.disputed) && { disputed: true as const }),
        } : link);
      }
      return [...merged.values()];
    };
    const links = (predicate: ProfileEntry['predicate']): PersonLink[] => of(predicate).flatMap((entry) => {
      if (!entry.object) return [];
      return [{ ...fact(entry), text: sentence(entry), slug: entry.object, name: nameOf(entry.object, entry.objectMention), inApp: inApp.has(entry.object), ...sexOf(entry.object) }];
    });
    const back = (predicate: ProfileEntry['predicate']): PersonLink[] => reverse(slug, predicate)
      .map(({ other, entry }) => ({ ...fact(entry), text: sentence(entry), slug: other, name: nameOf(other), inApp: inApp.has(other), ...sexOf(other) }));
    // A title two passages give («الصادق» from Ibn Mas'ud, «الأمين» from al-Dhahabi) is one chip with both pages and sayers.
    const titles: PersonTitle[] = [];
    for (const entry of of('title')) {
      const title: PersonTitle = { ...fact(entry), title: entry.classified ?? '', name: titleNames.get(entry.classified ?? '') ?? entry.text };
      const seen = titles.findIndex((other) => other.title === title.title);
      if (seen < 0) { titles.push(title); continue; }
      const kept = titles[seen];
      titles[seen] = { ...kept, text: `${kept.text}؛ ${title.text}`, refs: [...kept.refs, ...title.refs.filter((ref) => !kept.refs.some((r) => sameRef(r, ref)))], by: [...new Set([...kept.by, ...title.by])] };
    }
    const fullName = facts('name.full')[0];
    const sex = of('sex')[0]?.classified;
    const pages = file.spans.filter((span) => span.layer === 'MAIN');
    const sorted = [...pages].sort((a, b) => a.volume - b.volume || Number(a.page) - Number(b.page));
    return {
      slug,
      name: appName(slug),
      ...(sex === 'MALE' || sex === 'FEMALE' ? { sex: sex as 'MALE' | 'FEMALE' } : {}),
      entry: {
        unit: unitId, number: file.unit.numbers.printed, volume: sorted[0]?.volume ?? 0, from: sorted[0]?.page ?? '', to: sorted.at(-1)?.page ?? '',
        ...(sorted.length && sorted.at(-1)!.volume !== sorted[0].volume && { toVolume: sorted.at(-1)!.volume }),
      },
      ...(fullName && { fullName }),
      // The book's other readings of the name («وقيل: …», each with its sayer), shown after the heading's.
      ...(facts('name.full').length > 1 && { otherNames: facts('name.full').slice(1).map((fact) => ({ ...fact, text: nominativeName(fact.text) })) }),
      nasab: fullName ? nasabOf(fullName.text) : [],
      kunya: facts('name.kunya'),
      laqab: facts('name.laqab'),
      nameVariants: facts('name.variant'),
      titles,
      appearance: facts('appearance'),
      virtues: facts('virtue'),
      islamAge: facts('islam.age'),
      died: { year: facts('died.year'), month: facts('died.month'), age: facts('died.age'), place: facts('died.place') },
      parents: merge(links('CHILD_OF')),
      children: merge(back('CHILD_OF')),
      siblings: merge([...links('SIBLING_OF'), ...back('SIBLING_OF')]),
      spouses: merge([...links('MARRIED'), ...back('MARRIED')]).filter(shownSpouse(slug)),
      cousins: merge([...links('PATERNAL_COUSIN'), ...back('PATERNAL_COUSIN')]),
      companionOf: merge(links('COMPANION_OF')),
      ...attendance(merge(links('PARTICIPATED_IN')),
        merge(of('ABSENT_FROM').flatMap((entry) => entry.object ? [{ ...fact(entry), text: sentence(entry), slug: entry.object, name: nameOf(entry.object, entry.objectMention), inApp: false }] : []))),
      ayat: [
        ...facts('REVEALED_ABOUT').map((fact) => ({ ...fact, kind: 'REVEALED_ABOUT' as const })),
        ...facts('ABOUT_AYAH').map((fact) => ({ ...fact, kind: 'ABOUT' as const })),
      ],
    };
  }).sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  // A title is shared when the catalog or the converted entries give it to more than one person.
  const converted = new Map<string, number>();
  for (const person of all) for (const key of new Set(person.titles.map((title) => title.title))) converted.set(key, (converted.get(key) ?? 0) + 1);
  return all.map((person) => ({
    ...person,
    titles: person.titles.map((title) => (Math.max(holders.get(title.title) ?? 0, converted.get(title.title) ?? 0) > 1 ? { ...title, shared: true as const } : title)),
  }));
}
