import { kunyaName, volumeLabel, type AppPerson } from './tarajim';
import { num } from './quran/arabicNumber';

export const TARAJIM_GROUPS: { key: string; name: string }[] = [
  { key: 'mother-of-believers', name: 'أمهات المؤمنين' },
  { key: 'daughter-of-prophet', name: 'بنات النبي ﷺ' },
  { key: 'the-ten-promised-paradise', name: 'العشرة المبشرون بالجنة' },
  { key: 'the-six-of-the-shura', name: 'الستة أهل الشورى' },
  { key: 'al-sabiqoon', name: 'السابقون' },
  { key: 'naqib', name: 'النقباء' },
];

export const groupName = (key: string) => TARAJIM_GROUPS.find(group => group.key === key)?.name;

export const unvowelled = (text: string) => text.replace(/[\u064B-\u0652\u0670\u0640]/g, '');

export const heldGroups = (people: AppPerson[]) =>
  TARAJIM_GROUPS.filter(group => people.some(person => person.titles.some(title => title.title === group.key)));

export function personLine(person: AppPerson) {
  const title = person.titles.find(t => !t.shared) ?? person.titles[0];
  return [person.kunya[0] && kunyaName(person.kunya[0].text), title?.name].filter(Boolean).map(text => unvowelled(text!)).join(' · ');
}

export const kunyaLine = (person: AppPerson) => (person.kunya[0] ? unvowelled(kunyaName(person.kunya[0].text)) : '');

export function byVolume<P extends Pick<AppPerson, 'entry'>>(people: P[]) {
  const parts = new Map<string, P[]>();
  for (const person of people) {
    const { book, part } = volumeLabel(person.entry.volume);
    const heading = part === undefined || book !== 'سير أعلام النبلاء' ? book : `${book} ${num(part)}`;
    parts.set(heading, [...(parts.get(heading) ?? []), person]);
  }
  return [...parts].map(([heading, list]) => ({ heading, people: list }));
}
