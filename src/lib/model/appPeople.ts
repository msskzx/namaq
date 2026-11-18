// The phone app's people (owner, 2026-11-18): the app reads only the new model, so a person is in the app once the
// entry is converted under data/works. Each value keeps the book's words, its pages and who says it.
// scripts/model/buildAppPeople.ts writes shared/data/tarajim/people.json; shared/tarajim.ts has the shape.
import type { AppPerson, PageRef, PersonFact, PersonLink, PersonTitle } from '@shared/tarajim';
import type { Catalog } from '../catalog/types';
import { loadModel } from './load';
import { agentOfMention, profilesFromModel, type ProfileEntry } from './profile';
import { renderSpanRecord } from './render';
import type { WorkFolder } from './types';

const IBN = /^(?:ابن|بن|بنت|ابنة)$/u;
// A nisba after the last name («الهاشمية», «القرشي») is not a father.
const NISBA = /^ال\S+(?:ي|ية)$/u;
const strip = (text: string) => text.replace(/[ً-ْٰـ]/g, '');
// Shamela types Latin commas inside Arabic text; the app shows the Arabic mark.
const arabicCommas = (text: string) => text.replace(/,/g, '،');

/**
 * The fathers in a full name as printed, from the person up: «الزبير بن العوام بن خويلد» → الزبير، العوام، خويلد.
 * The book's asides are not fathers: «واسمه عمرو» after a name, «واسم عبد المطلب شيبة», and a nisba («القرشي»).
 */
export function nasabOf(fullName: string) {
  const words = fullName.replace(/[.،,]/gu, ' ').trim().split(/\s+/u);
  const names: string[][] = [[]];
  for (let i = 0; i < words.length; i += 1) {
    const bare = strip(words[i]);
    if (bare === 'واسمه' || bare === 'واسمها') { i += 1; continue; }
    if (bare === 'واسم') { i += names[names.length - 1].length + 1; continue; }
    if (IBN.test(bare)) names.push([]);
    else if (!(names[names.length - 1].length > 0 && NISBA.test(bare))) names[names.length - 1].push(words[i]);
  }
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
    const text = from.statements.filter((s) => entry.statementIds.includes(s.id)).flatMap((s) => s.spans)
      .map((id) => renderSpanRecord(folderOf.get(entry.unit)!, from.spans.find((span) => span.id === id)!, root)).join(' ');
    return arabicCommas(text);
  };
  const people = new Map(catalog.people.map((person) => [person.slug, person]));
  const battles = new Map(catalog.battles.map((battle) => [battle.slug, battle.name]));
  const events = new Map(catalog.events.map((event) => [event.slug, event.name]));
  const titleNames = new Map(catalog.people.flatMap((person) => person.titles.map((title) => [title.title, title.name] as const)));
  // A person is in the app once an entry of their own is converted: the unit whose full name they are.
  const ownUnit = new Map([...profiles.entries()].flatMap(([slug, entries]) => {
    const name = entries.find((entry) => entry.predicate === 'name.full');
    return name ? [[slug, name.unit] as const] : [];
  }));
  const inApp = new Set(ownUnit.keys());
  // A name for someone the catalog does not hold yet: how an entry names them.
  const mentioned = new Map<string, string>();
  for (const file of units.values()) for (const identification of file.identifications) {
    const exact = file.mentions.find((m) => m.id === identification.mention)?.exact;
    if (identification.agent && exact && !mentioned.has(identification.agent)) mentioned.set(identification.agent, exact);
  }
  // Links others' entries state toward this person: their CHILD_OF is this person's child, and so on.
  const reverse = (slug: string, predicate: ProfileEntry['predicate']) => [...profiles.entries()]
    .flatMap(([other, entries]) => entries.filter((entry) => entry.predicate === predicate && entry.object === slug).map((entry) => ({ other, entry })));

  return [...ownUnit.entries()].map(([slug, unitId]) => {
    const entries = profiles.get(slug)!;
    const file = units.get(unitId)!;
    const refsOf = (entry: ProfileEntry): PageRef[] => {
      const from = units.get(entry.unit)!;
      const ids = entry.spanIds.length ? entry.spanIds : from.statements.filter((s) => entry.statementIds.includes(s.id)).flatMap((s) => s.spans);
      const pages = ids.map((id) => spans.get(`${id}@${entry.unit}`)).filter((span) => span !== undefined).map((span) => ({ volume: span.volume, page: span.page }));
      return pages.filter((ref, index) => pages.findIndex((other) => other.volume === ref.volume && other.page === ref.page) === index);
    };
    const fact = (entry: ProfileEntry): PersonFact => ({
      text: arabicCommas(entry.text),
      refs: refsOf(entry),
      // Who says it: the person the narrating mention is identified as («أبي» in Urwa's words is al-Zubayr), else its text.
      by: entry.statementIds.flatMap((id) => {
        const from = units.get(entry.unit)!;
        const report = from.reports.find((r) => r.id === from.statements.find((s) => s.id === id)?.report);
        if (!report || !('mention' in report.origin)) return [];
        const mention = report.origin.mention;
        const agent = agentOfMention(from, mention);
        const text = from.mentions.find((m) => m.id === mention)?.exact ?? '';
        return [agent && people.has(agent) ? people.get(agent)!.name : strip(text)];
      }),
      ...(entry.status === 'LEGACY' && { legacy: true as const }),
      ...(entry.parsed !== undefined && { value: entry.parsed }),
      ...(entry.classified !== undefined && { value: entry.classified }),
    });
    const of = (predicate: ProfileEntry['predicate']) => entries.filter((entry) => entry.predicate === predicate);
    const facts = (predicate: ProfileEntry['predicate']) => of(predicate).map(fact);
    const nameOf = (other: string, mention?: string) => strip(people.get(other)?.name ?? battles.get(other) ?? events.get(other) ?? mention ?? mentioned.get(other) ?? other);
    // A tie stated in more than one place (his entry and his mother's) is one tie with every page that states it.
    const merge = (list: PersonLink[]) => {
      const merged = new Map<string, PersonLink>();
      for (const link of list) {
        const seen = merged.get(link.slug);
        merged.set(link.slug, seen ? {
          ...seen,
          refs: [...seen.refs, ...link.refs.filter((ref) => !seen.refs.some((r) => r.volume === ref.volume && r.page === ref.page))],
          by: [...new Set([...seen.by, ...link.by])],
        } : link);
      }
      return [...merged.values()];
    };
    const links = (predicate: ProfileEntry['predicate']): PersonLink[] => of(predicate).flatMap((entry) => {
      if (!entry.object) return [];
      return [{ ...fact(entry), text: sentence(entry), slug: entry.object, name: nameOf(entry.object, entry.objectMention), inApp: inApp.has(entry.object) }];
    });
    const back = (predicate: ProfileEntry['predicate']): PersonLink[] => reverse(slug, predicate)
      .map(({ other, entry }) => ({ ...fact(entry), text: sentence(entry), slug: other, name: nameOf(other), inApp: inApp.has(other) }));
    const titles: PersonTitle[] = of('title').map((entry) => ({ ...fact(entry), title: entry.classified ?? '', name: titleNames.get(entry.classified ?? '') ?? entry.text }));
    const fullName = facts('name.full')[0];
    const sex = of('sex')[0]?.classified;
    const pages = file.spans.filter((span) => span.layer === 'MAIN');
    const sorted = [...pages].sort((a, b) => a.volume - b.volume || Number(a.page) - Number(b.page));
    return {
      slug,
      name: strip(people.get(slug)?.name ?? fullName?.text.split(/\s+/u).slice(0, 3).join(' ') ?? slug),
      ...(sex === 'MALE' || sex === 'FEMALE' ? { sex: sex as 'MALE' | 'FEMALE' } : {}),
      entry: { unit: unitId, number: file.unit.numbers.printed, volume: sorted[0]?.volume ?? 0, from: sorted[0]?.page ?? '', to: sorted.at(-1)?.page ?? '' },
      ...(fullName && { fullName }),
      nasab: fullName ? nasabOf(fullName.text) : [],
      kunya: facts('name.kunya'),
      laqab: facts('name.laqab'),
      titles,
      appearance: facts('appearance'),
      virtues: facts('virtue'),
      islamAge: facts('islam.age'),
      died: { year: facts('died.year'), month: facts('died.month'), age: facts('died.age'), place: facts('died.place') },
      parents: merge(links('CHILD_OF')),
      children: merge(back('CHILD_OF')),
      siblings: merge([...links('SIBLING_OF'), ...back('SIBLING_OF')]),
      spouses: merge([...links('MARRIED'), ...back('MARRIED')]),
      cousins: merge([...links('PATERNAL_COUSIN'), ...back('PATERNAL_COUSIN')]),
      companionOf: merge(links('COMPANION_OF')),
      battles: links('PARTICIPATED_IN'),
      absentFrom: of('ABSENT_FROM').flatMap((entry) => entry.object ? [{ ...fact(entry), text: sentence(entry), slug: entry.object, name: nameOf(entry.object, entry.objectMention), inApp: false }] : []),
      ayat: [
        ...facts('REVEALED_ABOUT').map((fact) => ({ ...fact, kind: 'REVEALED_ABOUT' as const })),
        ...facts('ABOUT_AYAH').map((fact) => ({ ...fact, kind: 'ABOUT' as const })),
      ],
    };
  }).sort((a, b) => a.name.localeCompare(b.name, 'ar'));
}
