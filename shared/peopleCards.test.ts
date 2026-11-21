import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import peopleJson from './data/tarajim/people.json';
import battlesJson from './data/battles/battles.json';
import storiesJson from './data/events/stories.json';
import type { AppBattle } from './battles/battle';
import type { SahihText } from './sahih';
import type { AppPerson } from './tarajim';
import { peopleGraph, type TieKind } from './tarajimGraph';
import { lineOf, meetingOf } from './tarajimLine';
import { CALIPHS_MEET, GROUP_MOST, HADITH_RINGS, groupItems, groupOf, groupSources, meetItems, ringList, spread, TITLE_COUNTS } from './peopleCards';

const people = peopleJson as AppPerson[];
const graph = peopleGraph(people);
const sources = groupSources(storiesJson as { slug: string; name: string; people: { slug: string }[] }[], battlesJson as AppBattle[]);
const FAMILY: readonly TieKind[] = ['parent', 'child', 'spouse', 'sibling', 'cousin'];

// Owner, 2026-11-21: a group card draws three to five people joined by their own family; a long chain through others says little.
describe('the «صلة بينهم» cards', () => {
  const items = groupItems(graph, sources, people);

  it('join each group by settled family ties alone, through at most one person who is not of it', () => {
    expect(items.some(id => !id.startsWith('inlaws:'))).toBe(true);
    for (const id of items) {
      const group = groupOf(graph, sources, id)!;
      expect(group.steps.every(step => FAMILY.includes(step.kind) && !step.link.disputed && !step.link.anonymous), id).toBe(true);
      if (id.startsWith('inlaws:')) continue;
      const own = new Set(group.slugs);
      expect(group.nodes.filter(slug => !own.has(slug)).length, id).toBeLessThanOrEqual(1);
      expect(group.nodes.filter(slug => own.has(slug)).length, id).toBeLessThanOrEqual(GROUP_MOST);
    }
  });

  it('give «أصهاره» only for a man, each wife followed by her father, two fathers or more (one father of two wives is a pair)', () => {
    const inLaws = items.filter(each => each.startsWith('inlaws:'));
    expect(inLaws.length).toBeGreaterThan(0);
    for (const id of inLaws) {
      const { steps, slugs } = groupOf(graph, sources, id)!;
      expect(graph.nodes.get(slugs[0])!.sex, id).not.toBe('FEMALE');
      for (let i = 0; i < steps.length; i += 2) {
        expect([steps[i].kind, steps[i + 1].kind], id).toEqual(['spouse', 'parent']);
        expect(steps[i + 1].from, id).toBe(steps[i].to);
      }
      expect(new Set(steps.filter(step => step.kind === 'parent').map(step => step.to)).size, id).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('the ring cards', () => {
  // Every kind folds and every drawing fits, so the rules on what a ring holds are what is tested.
  const rings = ringList(graph, people, () => ['parent', 'spouse', 'child', 'sibling', 'cousin'], () => true);

  it('leave a tie the book holds in doubt off the drawing and keep it to be said with both views', () => {
    const kin = rings.filter(each => each.by === 'kin');
    expect(kin.length).toBeGreaterThan(0);
    for (const ring of kin) {
      const ties = graph.ties.get(ring.slug)!;
      for (const slug of ring.people) expect(ties.some(tie => tie.to === slug && !tie.link.disputed), ring.id).toBe(true);
      expect(ring.doubted.every(tie => tie.link.disputed && !ring.people.includes(tie.to)), ring.id).toBe(true);
    }
    // The Prophet's ﷺ children: al-Tayyib and al-Tahir are named apart (Zad al-Ma'ad: two titles of Abdullah).
    const children = rings.find(ring => ring.id === 'kin:prophet-muhammad:child')!;
    expect(children.doubted.length).toBeGreaterThan(0);
  });

  it('draw a title that names how many hold it only when the data holds every one', () => {
    const counted = rings.filter(ring => ring.by === 'title' && TITLE_COUNTS[ring.title] !== undefined);
    expect(counted.length).toBeGreaterThan(0);
    for (const ring of counted) if (ring.by === 'title') expect(ring.people, ring.id).toHaveLength(TITLE_COUNTS[ring.title]);
  });

  it('quote each hadith in the words of the route it names, and draw only people the app has', () => {
    const hadith = (book: 'bukhari' | 'muslim', n: number) => (JSON.parse(readFileSync(join(__dirname, `../data/hadith/sahih/${book}.json`), 'utf8')) as SahihText)
      .kitabs.flatMap(kitab => kitab.hadith).find(each => each.n === n)!;
    for (const ring of HADITH_RINGS) {
      // The same letters, however the edition orders a letter's marks.
      expect(hadith(ring.book, ring.n).routes.some(route => route.text.normalize('NFC').includes(ring.quote.normalize('NFC'))), ring.id).toBe(true);
      for (const slug of [ring.middle, ...ring.people]) expect(graph.nodes.has(slug), `${ring.id} ${slug}`).toBe(true);
    }
  });
});

describe('the «أين يلتقي نسبهما؟» cards', () => {
  it('give the Prophet ﷺ and the four caliphs a card, and only people whose lines meet', () => {
    const items = meetItems(people, [['abu-bakr-as-siddiq', 'umar-ibn-al-khattab']]);
    expect(items[0]).toBe(CALIPHS_MEET.join(','));
    const line = (slug: string) => lineOf(people.find(person => person.slug === slug)!, people);
    for (const item of items) {
      const [first, ...rest] = item.split(',');
      for (const slug of rest) expect(meetingOf(line(first), line(slug)), item).toBeTruthy();
    }
  });
});

// The feed takes a kind's items in order: a list sorted by how much two lives share put one man in card after card.
describe('spread', () => {
  it('keeps every item and shows no person twice in one pass while others are left', () => {
    const ids = ['a,b', 'a,c', 'a,d', 'b,c', 'e,f'];
    const out = spread(ids);
    expect([...out].sort()).toEqual([...ids].sort());
    expect(out.slice(0, 3)).toEqual(['a,b', 'e,f', 'a,c']);
  });
});
