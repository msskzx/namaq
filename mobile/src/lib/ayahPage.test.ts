import { describe, expect, it, vi } from 'vitest';
import { STORIES as PROPHET_STORIES } from '@shared/quran/prophets/stories';
import { OATHS } from '@shared/quran/oaths';
import { OPENING_CARDS } from '@shared/quran/openingKinds';
import { surahTopicsOf } from '@shared/quran/surahTopics';
import { ayahSections, ORDER, sectionNames, type AyahSection } from './ayahPage';
import { STORIES as SIRA_STORIES } from './stories';
import { PEOPLE } from './tarajim';
import { inAyat } from './links';
import { revealedIn } from '@shared/stories/story';

// The books' on/off state lives on the phone; every book is on here.
vi.mock('./books', () => ({ bookState: () => 'on' }));

const has = (key: string, test: (section: AyahSection) => boolean) => ayahSections(key).some(test);

describe("an ayah's page (owner, 2026-11-22)", () => {
  it('keeps the agreed order of sections on every ayah of a surah', () => {
    // Al-Baqarah holds every kind of section but the opening, oath and stories; the stories are checked below.
    for (let ayah = 1; ayah <= 286; ayah++) {
      const at = ayahSections(`2:${ayah}`).map(section => ORDER.indexOf(section.id));
      expect(at.every(i => i >= 0), `2:${ayah}`).toBe(true);
      expect(at, `2:${ayah}`).toEqual([...at].sort((a, b) => a - b));
    }
  });

  it('lists every oath on each ayah it spans, with the id the oaths page opens at', () => {
    const oaths = [...OATHS.allah, ...OATHS.others];
    expect(oaths.length).toBeGreaterThan(0);
    for (const oath of oaths) {
      for (let ayah = oath.range[0]; ayah <= oath.range[1]; ayah++) {
        expect(has(`${oath.surah}:${ayah}`, section => section.id === 'oath' && section.oath === `${oath.surah}:${oath.range[0]}`), `${oath.surah}:${ayah}`).toBe(true);
      }
    }
  });

  it('lists an opening only on a surah\'s opening ayah, never on the next ayah of a long one', () => {
    const shared = OPENING_CARDS.filter(card => !card.alone && card.surahs.length > 1);
    expect(shared.length).toBeGreaterThan(0);
    for (const card of shared) {
      for (const surah of card.surahs.filter(each => each !== 1)) {
        expect(has(`${surah}:1`, section => section.id === 'opening' && section.card === card.id), `${surah}:1`).toBe(true);
      }
    }
    // Al-Fatihah opens with the basmala: its opening is «الحمد لله», the second ayah.
    expect(has('1:1', section => section.id === 'opening')).toBe(false);
  });

  it("lists every prophet's story event on each ayah it tells", () => {
    for (const [slug, story] of Object.entries(PROPHET_STORIES)) {
      story.events.forEach((event, at) => {
        for (const { surah, range: [first, last] } of event.segments) {
          for (let ayah = first; ayah <= last; ayah++) {
            expect(has(`${surah}:${ayah}`, section => section.id === 'prophet' && section.slug === slug && section.at === at), `${slug} ${surah}:${ayah}`).toBe(true);
          }
        }
      });
    }
  });

  // A story may give several sets of ayat, two of them «نزل فيه» (the-ifk: 24:11 about Aisha, 24:22 about Abu Bakr); each
  // ayah's card quotes the set that holds it, not the story's first.
  it('lists every sira story on the first and last ayah of each set it gives, with that set', () => {
    const told = SIRA_STORIES.flatMap(story => story.ayat.map(ayat => ({ slug: story.slug, ayat })));
    expect(told.length).toBeGreaterThan(0);
    for (const { slug, ayat } of told) {
      for (const key of [ayat.from, ayat.to]) {
        expect(has(key, section => section.id === 'sira' && section.story.slug === slug && section.ayat === ayat), `${slug} ${key}`).toBe(true);
        for (const section of ayahSections(key)) if (section.id === 'sira') expect(inAyat(key, section.ayat.from, section.ayat.to), `${section.story.slug} on ${key}`).toBe(true);
      }
    }
  });

  // Every link both ways (owner, 2026-11-24): an ayah a person's entry ties him to names him on its page.
  it("shows on an ayah's page every person whose entry ties him to it", () => {
    const tied = PEOPLE.flatMap(person => person.ayat.flatMap(fact => (typeof fact.value === 'string' ? [{ slug: person.slug, key: fact.value }] : [])));
    expect(tied.length).toBeGreaterThan(0);
    // On his own card, or on the card of the story that names him as the one it was revealed about (not on both).
    const named = (key: string, slug: string) => has(key, section => section.id === 'sira' && revealedIn(section.ayat) && section.ayat.about?.slug === slug);
    const own = (key: string, slug: string) => has(key, section => section.id === 'person' && section.slug === slug);
    for (const { slug, key } of tied) expect([named(key, slug), own(key, slug)], `${slug} ${key}`).toContainEqual(true);
    for (const { slug, key } of tied) expect(named(key, slug) && own(key, slug), `${slug} ${key} twice`).toBe(false);
  });

  it('names the part of a divided section, not the whole section', () => {
    for (let surah = 1; surah <= 114; surah++) {
      for (const [index, top] of (surahTopicsOf(surah)?.sections ?? []).entries()) {
        for (const part of top.parts ?? []) {
          if (part.from === undefined) continue;
          const topic = ayahSections(`${surah}:${part.from}`).find(section => section.id === 'topic');
          expect(topic, `${surah}:${part.from}`).toMatchObject({ section: index, title: part.title });
        }
      }
    }
  });

  it("names each kind of section once on a saved ayah's line, in page order", () => {
    const key = Object.values(PROPHET_STORIES).flatMap(story => story.events).flatMap(event => event.segments)
      .map(segment => `${segment.surah}:${segment.range[0]}`).find(each => ayahSections(each).filter(section => section.id === 'prophet').length > 1);
    expect(key).toBeDefined();
    const names = sectionNames(ayahSections(key!));
    expect(names).toEqual([...new Set(names)]);
    expect(names.filter(name => name === 'قصة')).toHaveLength(1);
  });
});
