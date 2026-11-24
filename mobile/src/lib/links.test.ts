import { describe, expect, it } from 'vitest';
import { reportHadith } from '@shared/stories/story';
import { ayatOf, storiesOfHadith, storiesOfPerson, storyAyatOf } from './links';
import { STORIES } from './stories';
import { findPerson } from './tarajim';

// The owner's rule (2026-11-24): whatever a link joins, each end shows the other. These are the pages that read the one
// links file: a person's «قصصه» and «آيات نزلت فيه», a hadith's «في هذا الحديث».
describe('the pages that read the links file', () => {
  it("lists a story on the page of every person in it who has a page", () => {
    const named = STORIES.flatMap(story => story.people.filter(person => findPerson(person.slug)).map(person => ({ story: story.slug, person: person.slug })));
    expect(named.length).toBeGreaterThan(0);
    for (const { story, person } of named) expect(storiesOfPerson(person).map(each => each.slug), `${person} ${story}`).toContain(story);
  });

  it('lists a story under every hadith of the Sahihayn that tells it', () => {
    const told = STORIES.flatMap(story => story.reports.flatMap(report => {
      const hadith = reportHadith(report);
      return hadith ? [{ story: story.slug, ...hadith }] : [];
    }));
    expect(told.length).toBeGreaterThan(0);
    for (const { story, book, n } of told) expect(storiesOfHadith(book, n).map(each => each.slug), `${book}:${n} ${story}`).toContain(story);
  });

  // His page draws his entry's ayat, then these: every ayah of the set once, none of his entry's twice (Ka'b: entry
  // 9:118, story 9:117-119).
  it('gives a person every ayah a story says was revealed about him, and none his entry already gives', () => {
    const about = STORIES.flatMap(story => story.ayat.flatMap(ayat => (ayat.about && findPerson(ayat.about.slug) ? [{ story, slug: ayat.about.slug, ayat }] : [])));
    expect(about.length).toBeGreaterThan(0);
    for (const { story, slug, ayat } of about) {
      const own = findPerson(slug)!.ayat.map(fact => fact.value as string);
      const shown = storyAyatOf(slug, own);
      const drawn = shown.filter(each => each.story === story && each.ayat === ayat).flatMap(each => each.keys);
      expect([...own, ...drawn].filter(key => ayatOf(ayat.from, ayat.to).includes(key)).sort(), `${slug} ${story.slug}`)
        .toEqual(expect.arrayContaining(ayatOf(ayat.from, ayat.to)));
      for (const key of shown.flatMap(each => each.keys)) expect(own, `${slug} ${key} twice`).not.toContain(key);
      expect(new Set(drawn).size, `${slug} ${story.slug} repeats`).toBe(drawn.length);
    }
  });
});
