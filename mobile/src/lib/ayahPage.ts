import itqan from '@shared/data/quran/itqanBalagha';
import gharib from '@shared/data/quran/gharib';
import { itqanAt, type ItqanParagraph } from '@shared/quran/itqanBalagha';
import { kashshafAt, type KashshafData, type KashshafPassage } from '@shared/quran/kashshaf';
import { gharibAt, type GharibAt } from '@shared/quran/gharib';
import { tafsirSadiOf } from '@shared/quran/tafsirSadiData';
import { hasQiraat } from '@shared/quran/qiraatData';
import { irabWordsAt } from '@shared/quran/irabData';
import { OATHS, type OathKind } from '@shared/quran/oaths';
import { openingKeys, openingLike, OPENING_CARDS } from '@shared/quran/openingKinds';
import { sectionAt, surahTopicsOf, type TopicSection } from '@shared/quran/surahTopics';
import { STORIES as PROPHET_STORIES } from '@shared/quran/prophets/stories';
import type { StoryEvent } from '@shared/quran/prophets/story';
import { revealedIn, type AppStory, type AppStoryAyat } from '@shared/stories/story';
import { ayahOf } from './branches';
import { compareTargetsOfAyah } from './compare';
import { branchList, EMPTY_LIST } from './branchList';
import { storyOf } from './stories';
import { idKey, inAyat, linksOf } from './links';
import { PEOPLE } from './tarajim';
import { bookState } from './books';

export type AyahSection =
  | { id: 'tafsir'; passage: NonNullable<ReturnType<typeof tafsirSadiOf>> }
  | { id: 'gharib'; entries: GharibAt[] }
  | { id: 'irab' }
  | { id: 'balagha'; itqan: ItqanParagraph[]; kashshaf: KashshafPassage | null }
  | { id: 'qiraat' }
  | { id: 'trees'; count: number }
  | { id: 'compare'; count: number }
  | { id: 'opening'; card: string; title: string }
  | { id: 'oath'; oath: string; kind: OathKind; by: string[]; range: [number, number] }
  | { id: 'prophet'; slug: string; at: number; event: StoryEvent }
  | { id: 'sira'; story: AppStory; ayat: AppStoryAyat }
  | { id: 'person'; slug: string; kind: string }
  | { id: 'topic'; section: number; title: string; from?: number; to?: number };

export type AyahSectionId = AyahSection['id'];

const holds = (surah: number, ayah: number, at: { surah: number; range: [number, number] }) => at.surah === surah && ayah >= at.range[0] && ayah <= at.range[1];

function topicOf(surah: number, ayah: number): Extract<AyahSection, { id: 'topic' }> | null {
  const topics = surahTopicsOf(surah);
  const section = sectionAt(surah, ayah);
  if (!topics || section < 0) return null;
  const top = topics.sections[section];
  const part = top.parts?.find((each: TopicSection) => each.from !== undefined && each.to !== undefined && ayah >= each.from && ayah <= each.to);
  const shown = part ?? top;
  return { id: 'topic', section, title: shown.title, from: shown.from, to: shown.to };
}

let byAyah: Map<string, { slug: string; kind: string }[]> | undefined;
function personAyat() {
  if (byAyah) return byAyah;
  byAyah = new Map();
  for (const person of PEOPLE) {
    for (const fact of person.ayat) {
      if (typeof fact.value !== 'string') continue;
      const here = byAyah.get(fact.value) ?? [];
      const same = here.find(each => each.slug === person.slug);
      if (same) { if (fact.kind === 'REVEALED_ABOUT') same.kind = fact.kind; } else byAyah.set(fact.value, [...here, { slug: person.slug, kind: fact.kind }]);
    }
  }
  return byAyah;
}

const scanned = new Map<string, AyahSection[]>();
function scan(key: string): AyahSection[] {
  const known = scanned.get(key);
  if (known) return known;
  const [surah, ayah] = key.split(':').map(Number);
  const sections: AyahSection[] = [];
  const passage = tafsirSadiOf(key);
  if (passage) sections.push({ id: 'tafsir', passage });
  const entries = gharibAt(gharib, key);
  if (entries.length) sections.push({ id: 'gharib', entries });
  if (irabWordsAt(key).some(word => word?.role)) sections.push({ id: 'irab' });
  const paragraphs = itqanAt(itqan, key);
  if (paragraphs.length) sections.push({ id: 'balagha', itqan: paragraphs, kashshaf: null });
  if (hasQiraat(key)) sections.push({ id: 'qiraat' });
  const trees = branchList({ ...EMPTY_LIST, ayah: key }).length;
  if (trees) sections.push({ id: 'trees', count: trees });
  const pairs = compareTargetsOfAyah(key).length;
  if (pairs) sections.push({ id: 'compare', count: pairs });
  const opening = openingLike(surah);
  if (opening && openingKeys(surah, k => ayahOf(k)?.words ?? []).includes(key)) {
    sections.push({ id: 'opening', card: opening.card, title: OPENING_CARDS.find(card => card.id === opening.card)?.title ?? '' });
  }
  for (const kind of ['allah', 'others'] as const) {
    for (const oath of OATHS[kind]) {
      if (holds(surah, ayah, oath)) sections.push({ id: 'oath', oath: `${oath.surah}:${oath.range[0]}`, kind, by: oath.by, range: oath.range });
    }
  }
  for (const [slug, story] of Object.entries(PROPHET_STORIES)) {
    story.events.forEach((event, at) => {
      if (event.segments.some(segment => holds(surah, ayah, segment))) sections.push({ id: 'prophet', slug, at, event });
    });
  }
  const links = linksOf(`ayah:${key}`);
  for (const slug of new Set(links.filter(link => link.to.startsWith('event:')).map(link => idKey(link.to)))) {
    const story = storyOf(slug);
    for (const ayat of story?.ayat.filter(each => inAyat(key, each.from, each.to)) ?? []) sections.push({ id: 'sira', story: story!, ayat });
  }
  const named = new Set(sections.flatMap(section => (section.id === 'sira' && revealedIn(section.ayat) && section.ayat.about ? [section.ayat.about.slug] : [])));
  for (const { slug, kind } of personAyat().get(key) ?? []) if (!named.has(slug)) sections.push({ id: 'person', slug, kind });
  const topic = topicOf(surah, ayah);
  if (topic) sections.push(topic);
  scanned.set(key, sections);
  return sections;
}

export function ayahSections(key: string, kashshaf?: KashshafData | null): AyahSection[] {
  const sections = scan(key);
  const passage = kashshaf ? kashshafAt(kashshaf, key) : null;
  if (!passage) return sections;
  const at = sections.findIndex(section => section.id === 'balagha');
  if (at >= 0) return sections.map((section, i) => (i === at ? { ...section, kashshaf: passage } as AyahSection : section));
  const before = sections.findIndex(section => ORDER.indexOf(section.id) > ORDER.indexOf('balagha'));
  const balagha: AyahSection = { id: 'balagha', itqan: [], kashshaf: passage };
  return before < 0 ? [...sections, balagha] : [...sections.slice(0, before), balagha, ...sections.slice(before)];
}

export const ORDER: AyahSectionId[] = ['tafsir', 'gharib', 'irab', 'balagha', 'qiraat', 'trees', 'compare', 'opening', 'oath', 'prophet', 'sira', 'person', 'topic'];

export const sectionOn = (section: AyahSection) =>
  section.id === 'tafsir' ? bookState('sadi') === 'on'
    : section.id === 'gharib' ? bookState('gharib') === 'on'
    : section.id === 'irab' ? bookState('irab-words') === 'on'
    : section.id === 'balagha' ? (section.itqan.length > 0 && bookState('itqan') === 'on') || (!!section.kashshaf && bookState('kashshaf') === 'on')
    : true;

const SHORT: Record<AyahSectionId, string> = {
  tafsir: 'تفسير', gharib: 'معاني', irab: 'إعراب', balagha: 'بلاغة', qiraat: 'قراءات', trees: 'متشابهات', compare: 'مقارنة',
  opening: 'افتتاح', oath: 'قسم', prophet: 'قصة', sira: 'سيرة', person: 'تراجم', topic: 'موضوع',
};
export const sectionNames = (sections: AyahSection[]) => [...new Set(sections.map(section => SHORT[section.id]))];
