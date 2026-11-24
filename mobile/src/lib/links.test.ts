import { describe, expect, it } from 'vitest';
import { reportHadith } from '@shared/stories/story';
import { storiesOfHadith, storiesOfPerson, storyAyatOf } from './links';
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

  it('gives a person every set of ayat a story says was revealed about him, once, unless his entry already gives it', () => {
    const about = STORIES.flatMap(story => story.ayat.flatMap(ayat => (ayat.about && findPerson(ayat.about.slug) ? [{ story, slug: ayat.about.slug, ayat }] : [])));
    expect(about.length).toBeGreaterThan(0);
    for (const { story, slug, ayat } of about) {
      const own = findPerson(slug)!.ayat.map(fact => fact.value as string);
      const shown = storyAyatOf(slug, own);
      const once = shown.filter(each => each.story === story && each.ayat === ayat).length;
      expect(once === 1 || (own.includes(ayat.from) && own.includes(ayat.to)), `${slug} ${ayat.from} ${story.slug}`).toBe(true);
      expect(once, `${slug} ${ayat.from} ${story.slug} twice`).toBeLessThan(2);
    }
  });
});
