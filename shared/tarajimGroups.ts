import { kunyaName, volumeLabel, type AppPerson } from './tarajim';
import { num } from './quran/arabicNumber';

/**
 * The groups the Tarajim hub opens with (owner, 2026-11-19; sketch tarajim-hub/sketch-dark.png): the scholars' own
 * groupings, each a title the books give several people. The key is the title's key in the catalog and in the converted
 * entries; the name is the group's, in the plural where the title is one person's («أم المؤمنين» → «أمهات المؤمنين»).
 * The app and the website both read this list, so the two hubs show the same groups in the same order.
 */
export const TARAJIM_GROUPS: { key: string; name: string }[] = [
  { key: 'mother-of-believers', name: 'أمهات المؤمنين' },
  { key: 'daughter-of-prophet', name: 'بنات النبي ﷺ' },
  { key: 'the-ten-promised-paradise', name: 'العشرة المبشرون بالجنة' },
  { key: 'the-six-of-the-shura', name: 'الستة أهل الشورى' },
  { key: 'al-sabiqoon', name: 'السابقون' },
  { key: 'naqib', name: 'النقباء' },
];

/** A group's name by its title key, for a list opened on that group. */
export const groupName = (key: string) => TARAJIM_GROUPS.find(group => group.key === key)?.name;

/** Text without its vowels, for short lines under a name (the book's vowels stay in quotes). */
export const unvowelled = (text: string) => text.replace(/[\u064B-\u0652\u0670\u0640]/g, '');

/** The hub's groups that at least one of these people holds: a group nobody holds yet is not shown. */
export const heldGroups = (people: AppPerson[]) =>
  TARAJIM_GROUPS.filter(group => people.some(person => person.titles.some(title => title.title === group.key)));

/**
 * The line under a name: the kunya, then a title, his own before one a group shares («الفاروق» before «العشرة المبشرون
 * بالجنة»), so the line says who he is rather than which group he is in.
 */
export function personLine(person: AppPerson) {
  const title = person.titles.find(t => !t.shared) ?? person.titles[0];
  return [person.kunya[0] && kunyaName(person.kunya[0].text), title?.name].filter(Boolean).map(text => unvowelled(text!)).join(' · ');
}

/** The kunya alone, for a row in a group whose title would repeat on every row. */
export const kunyaLine = (person: AppPerson) => (person.kunya[0] ? unvowelled(kunyaName(person.kunya[0].text)) : '');

/** People under the book they come from, in the book's order: the Sira, the Rightly Guided Caliphs, then each part of the Siyar. */
export function byVolume<P extends Pick<AppPerson, 'entry'>>(people: P[]) {
  const parts = new Map<string, P[]>();
  for (const person of people) {
    const { book, part } = volumeLabel(person.entry.volume);
    const heading = part === undefined || book !== 'سير أعلام النبلاء' ? book : `${book} ${num(part)}`;
    parts.set(heading, [...(parts.get(heading) ?? []), person]);
  }
  return [...parts].map(([heading, list]) => ({ heading, people: list }));
}
